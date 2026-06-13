import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { profile, technicalFocusGroups } from "@/content/profile";
import { getProject, isProjectSlug, projectSlugs, projects } from "@/content/projects";
import { resume } from "@/content/resume";
import type * as MetadataModule from "@/lib/metadata";
import { createPageMetadata, getAbsoluteUrl, homeTitle } from "@/lib/metadata";
import { primaryNavItems } from "@/lib/navigation";
import { site } from "@/lib/site";

const expectedSlugs = ["voyager-verifier", "aggsandbox", "scopepilot", "horizon-starknet"] as const;
const forbiddenPattern = new RegExp(
  [
    ["Open", "Maintainer"].join(" "),
    String.raw`\b${["G", "o"].join("")}\b`,
    ["alexmetelli", "poker"].join("\\."),
    ["GMT", String.raw`\+8`].join(""),
    ["GMT", "Compatible"].join("-"),
    ["No", "Game"].join(""),
    ["no", "game"].join(""),
    ["no", "game", "starknet"].join("-")
  ].join("|")
);

async function importMetadataWithEnv(env: Record<string, string | undefined>) {
  const processEnv = process.env as Record<string, string | undefined>;
  const previousNodeEnv = process.env.NODE_ENV;
  const previousSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  try {
    for (const [key, value] of Object.entries(env)) {
      if (value === undefined) {
        delete processEnv[key];
      } else {
        processEnv[key] = value;
      }
    }

    return (await import(
      `../lib/metadata.ts?case=${crypto.randomUUID()}`
    )) as typeof MetadataModule;
  } finally {
    if (previousNodeEnv === undefined) {
      delete processEnv.NODE_ENV;
    } else {
      processEnv.NODE_ENV = previousNodeEnv;
    }

    if (previousSiteUrl === undefined) {
      delete processEnv.NEXT_PUBLIC_SITE_URL;
    } else {
      processEnv.NEXT_PUBLIC_SITE_URL = previousSiteUrl;
    }
  }
}

function collectText(node: unknown): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(collectText).join(" ");
  }

  if (node && typeof node === "object" && "props" in node) {
    const props = (node as { props?: Record<string, unknown> }).props;

    if (!props) {
      return "";
    }

    return Object.entries(props)
      .filter(([key]) => !["alt", "className", "href", "src", "style"].includes(key))
      .map(([, value]) => collectText(value))
      .join(" ");
  }

  return "";
}

describe("website content invariants", () => {
  test("selected projects expose the expected slugs and routes", () => {
    assert.deepStrictEqual([...projectSlugs], [...expectedSlugs]);

    for (const slug of expectedSlugs) {
      assert.equal(isProjectSlug(slug), true);
      assert.equal(getProject(slug)?.slug, slug);
    }
  });

  test("projects have required case study fields and real evidence links", () => {
    assert.equal(projects.length, 4);

    for (const project of projects) {
      assert.ok(project.title.length > 0);
      assert.ok(project.shortDescription.length > 0);
      assert.ok(project.proof.length > 0);
      assert.ok(project.metadata.role.length > 0);
      assert.ok(project.metadata.stack.length > 0);
      assert.ok(project.metadata.currentState.length > 0);
      assert.ok(project.caseStudy.overview.length > 0);
      assert.ok(project.caseStudy.problem.length > 0);
      assert.ok(project.caseStudy.role.length > 0);
      assert.ok(project.caseStudy.technicalDetails.length > 0);
      assert.ok(project.caseStudy.tradeoffs.length > 0);
      assert.ok(project.caseStudy.currentState.length > 0);
      assert.ok(project.caseStudy.evidence.length > 0);

      for (const link of project.caseStudy.evidence) {
        assert.match(link.href, /^https:\/\//);
        assert.equal(link.href.includes("example.com"), false);
      }
    }
  });

  test("public content excludes v1 forbidden material", () => {
    const publicContent = JSON.stringify({
      profile,
      projects,
      resume,
      technicalFocusGroups
    });

    assert.doesNotMatch(publicContent, forbiddenPattern);
  });

  test("public email is consistent across profile and resume links", () => {
    assert.equal(site.email, "alex-metelli@gmx.com");
    assert.equal(profile.email, site.email);
    assert.ok(
      resume.links.some((link) => link.label === "Email" && link.href === `mailto:${site.email}`)
    );
  });

  test("homepage technical focus keeps the exact PRD groups", () => {
    assert.deepStrictEqual(
      technicalFocusGroups.map((group) => group.title),
      ["Backend & infrastructure", "Developer tooling", "Blockchain systems", "Product engineering"]
    );

    assert.equal(JSON.stringify(technicalFocusGroups).includes("AWS"), false);
  });

  test("primary header navigation matches the v1 route contract", () => {
    assert.deepStrictEqual(
      primaryNavItems.map((item) => [item.label, item.href]),
      [
        ["Work", "/work"],
        ["About", "/about"]
      ]
    );
  });

  test("metadata helper builds canonical and Open Graph URLs from the site URL", () => {
    assert.equal(getAbsoluteUrl("/work"), "http://localhost:3000/work");

    const metadata = createPageMetadata({
      title: "Selected Work",
      description: "Selected work description.",
      path: "/work"
    });

    assert.equal(metadata.title, "Selected Work");
    assert.deepStrictEqual(metadata.alternates, { canonical: "/work" });

    const openGraph = metadata.openGraph as { title?: unknown; url?: unknown } | undefined;
    assert.equal(openGraph?.title, "Selected Work | Alex Metelli");
    assert.equal(openGraph?.url, "http://localhost:3000/work");
  });

  test("metadata helper uses localhost outside production when no site URL is configured", async () => {
    const metadata = await importMetadataWithEnv({
      NODE_ENV: "test",
      NEXT_PUBLIC_SITE_URL: undefined
    });

    assert.equal(metadata.getAbsoluteUrl("/work"), "http://localhost:3000/work");
  });

  test("metadata helper uses the configured site URL", async () => {
    const metadata = await importMetadataWithEnv({
      NODE_ENV: "production",
      NEXT_PUBLIC_SITE_URL: "https://personal-webpage-three-woad.vercel.app"
    });

    assert.equal(
      metadata.getAbsoluteUrl("/work"),
      "https://personal-webpage-three-woad.vercel.app/work"
    );
  });

  test("metadata helper requires a site URL for production", async () => {
    await assert.rejects(
      () =>
        importMetadataWithEnv({
          NODE_ENV: "production",
          NEXT_PUBLIC_SITE_URL: undefined
        }),
      /NEXT_PUBLIC_SITE_URL/
    );
  });

  test("metadata helper rejects invalid configured site URLs", async () => {
    await assert.rejects(
      () =>
        importMetadataWithEnv({
          NODE_ENV: "test",
          NEXT_PUBLIC_SITE_URL: "not a url"
        }),
      /NEXT_PUBLIC_SITE_URL/
    );
  });

  test("homepage title matches the required SEO title", () => {
    assert.equal(
      homeTitle,
      "Alex Metelli - Software Engineer | Backend, Developer Tooling, Blockchain Infrastructure"
    );
  });

  test("static page routes render route-critical content", async () => {
    const [
      { default: HomePage },
      { default: WorkPage },
      { default: AboutPage },
      { default: ResumePage }
    ] = await Promise.all([
      import("../../app/page"),
      import("../../app/work/page"),
      import("../../app/about/page"),
      import("../../app/resume/page")
    ]);

    assert.match(
      collectText(HomePage()),
      /Backend systems\. Developer tooling\. Blockchain infrastructure\./
    );
    assert.match(
      collectText(WorkPage()),
      /Focused case studies with concrete engineering evidence\./
    );
    assert.match(
      collectText(AboutPage()),
      /Engineering work built around correctness, clarity, and delivery\./
    );
    assert.match(collectText(ResumePage()), /Alex Metelli/);
  });

  test("dynamic project route generation and metadata cover every selected project", async () => {
    const {
      default: ProjectPage,
      generateMetadata,
      generateStaticParams
    } = await import("../../app/work/[slug]/page");

    assert.deepStrictEqual(
      generateStaticParams(),
      expectedSlugs.map((slug) => ({ slug }))
    );

    const voyager = getProject("voyager-verifier");
    assert.ok(voyager);

    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "voyager-verifier" })
    });
    assert.equal(metadata.title, voyager.title);
    assert.equal(metadata.description, voyager.shortDescription);

    for (const slug of expectedSlugs) {
      const project = getProject(slug);
      assert.ok(project);

      const element = await ProjectPage({ params: Promise.resolve({ slug }) });
      const pageText = collectText(element);

      assert.match(pageText, new RegExp(project.title));
      assert.match(pageText, /Case Study/);
    }
  });

  test("metadata routes include public pages and project routes", async () => {
    const [{ default: sitemap }, { default: robots }] = await Promise.all([
      import("../../app/sitemap"),
      import("../../app/robots")
    ]);

    const sitemapPaths = sitemap().map((entry) => new URL(String(entry.url)).pathname);

    assert.deepStrictEqual(
      [...sitemapPaths].sort(),
      [
        "/",
        "/about",
        "/resume",
        "/resume.pdf",
        "/work",
        ...expectedSlugs.map((slug) => `/work/${slug}`)
      ].sort()
    );

    const robotsConfig = robots();
    assert.deepStrictEqual(robotsConfig.rules, {
      userAgent: "*",
      allow: "/"
    });
    assert.equal(String(robotsConfig.sitemap).endsWith("/sitemap.xml"), true);
  });
});
