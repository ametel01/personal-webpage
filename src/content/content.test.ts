import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { describe, test } from "node:test";
import { getTechVisual } from "@/components/tech-icons";
import { profile, technicalFocusGroups } from "@/content/profile";
import {
  getProject,
  isProjectSlug,
  openSourceContributions,
  projectSlugs,
  projects
} from "@/content/projects";
import { resume } from "@/content/resume";
import type * as MetadataModule from "@/lib/metadata";
import { createPageMetadata, getAbsoluteUrl, homeTitle } from "@/lib/metadata";
import { primaryNavItems } from "@/lib/navigation";
import { site } from "@/lib/site";

const expectedSlugs = [
  "agentreceipt",
  "skills-doctor",
  "ritualai",
  "scopepilot",
  "aggsandbox",
  "voyager-verifier",
  "horizon-starknet"
] as const;
const globalCss = readFileSync(new URL("../../app/globals.css", import.meta.url), "utf8");
const forbiddenPattern = new RegExp(
  [
    ["Open", "Maintainer"].join(" "),
    ["alexmetelli", "poker"].join("\\."),
    ["GMT", String.raw`\+8`].join(""),
    ["GMT", "Compatible"].join("-"),
    ["No", "Game"].join(""),
    ["no", "game"].join(""),
    ["no", "game", "starknet"].join("-")
  ].join("|")
);

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function cssRuleBody(selector: string) {
  return globalCss.match(new RegExp(`${escapeRegExp(selector)}\\s*{(?<body>[^}]*)}`))?.groups?.body;
}

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

  if (node && typeof node === "object" && "type" in node && "props" in node) {
    const element = node as {
      type?: unknown;
      props?: Record<string, unknown>;
    };

    if (typeof element.type === "function") {
      return collectText(element.type(element.props ?? {}));
    }
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
    assert.equal(projects.length, 7);

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

  test("selected projects use local brand icon assets", () => {
    const expectedIcons = {
      agentreceipt: "/icons/agentreceipt.svg",
      "skills-doctor": "/icons/skills-doctor.svg",
      ritualai: "/icons/ritualai.svg",
      scopepilot: "/icons/scopepilot.svg",
      aggsandbox: "/icons/agglayer.svg",
      "voyager-verifier": "/icons/nethermind.svg",
      "horizon-starknet": "/icons/horizon-protocol.png"
    } satisfies Record<(typeof expectedSlugs)[number], string>;

    for (const project of projects) {
      assert.equal(project.icon.src, expectedIcons[project.slug]);
      assert.ok(project.icon.alt.length > 0);
      assert.ok(
        existsSync(new URL(`../../public${project.icon.src}`, import.meta.url)),
        `${project.icon.src} should exist in public assets`
      );
    }
  });

  test("public content excludes v1 forbidden material", () => {
    const publicContent = JSON.stringify({
      profile,
      openSourceContributions,
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

  test("about page exposes structured redesigned content", () => {
    assert.deepStrictEqual(
      profile.about.capabilityChips.map((chip) => chip.label),
      ["5+ years", "Backend systems", "Developer tooling", "Blockchain infra", "Remote-friendly"]
    );

    assert.deepStrictEqual(
      profile.about.focusCards.map((card) => card.title),
      ["What I work on", "How I work", "What I am looking for"]
    );

    assert.deepStrictEqual(
      profile.about.values.map((value) => value.title),
      ["Correctness", "Clarity", "Delivery"]
    );

    for (const collection of [
      profile.about.capabilityChips,
      profile.about.focusCards,
      profile.about.values
    ]) {
      for (const item of collection) {
        assert.ok(item.icon.length > 0);
      }
    }

    for (const card of [...profile.about.focusCards, ...profile.about.values]) {
      assert.ok(card.body.length > 24);
    }
  });

  test("resume exposes redesigned summary facts without dropping route-critical content", () => {
    assert.deepStrictEqual(
      resume.heroFacts.map((fact) => fact.label),
      ["5 Years of Experience", "Core Stack", "Domains", "Location"]
    );

    assert.ok(resume.heroFacts.some((fact) => fact.detail.includes("AI tooling")));
    assert.ok(resume.heroFacts.some((fact) => fact.detail.includes("Remote-friendly")));
    assert.ok(resume.links.some((link) => link.label === "Download PDF"));
    assert.ok(
      resume.links.some(
        (link) => "resumeLabel" in link && link.resumeLabel === "Download Resume (PDF)"
      )
    );
    assert.equal(resume.selectedProjects.length, 7);
  });

  test("homepage technical focus keeps the exact PRD groups", () => {
    assert.deepStrictEqual(
      technicalFocusGroups.map((group) => group.title),
      ["Backend & infrastructure", "Developer tooling", "Blockchain systems", "Product engineering"]
    );

    assert.equal(JSON.stringify(technicalFocusGroups).includes("AWS"), false);
  });

  test("technology icon registry covers public stack terms", () => {
    const expectedIconizedTerms = [
      "TypeScript",
      "Rust",
      "Python",
      "Solidity",
      "Cairo",
      "Starknet",
      "Docker",
      "PostgreSQL",
      "Redis",
      "Linux",
      "Node.js",
      "React",
      "Next.js",
      "Bun",
      "Astro",
      "Cloudflare Workers",
      "AWS Console",
      "CloudWatch",
      "Go",
      "CLI",
      "AI Tooling",
      "Developer Infrastructure",
      "Ed25519",
      "Static Analysis",
      "Agent Skills",
      "Validation",
      "AI Workflows",
      "Local-first",
      "Developer Productivity",
      "Replay",
      "Provenance",
      "LayerZero",
      "AggLayer",
      "Apibara",
      "EVM",
      "DeFi"
    ];

    for (const term of expectedIconizedTerms) {
      assert.ok(getTechVisual(term), `${term} should have a technology visual`);
    }
  });

  test("Go uses the local wide logo asset", () => {
    const visual = getTechVisual("Go");

    assert.equal(visual?.kind, "asset");

    if (visual?.kind !== "asset") {
      assert.fail("Go should resolve to a local asset visual");
    }

    assert.equal(visual.src, "/icons/go.png");
    assert.equal(visual.width, 96);
    assert.equal(visual.height, 40);
    assert.equal(visual.displayWidth, "28px");
    assert.equal(visual.displayHeight, "12px");
    assert.ok(existsSync(new URL("../../public/icons/go.png", import.meta.url)));
  });

  test("global CSS keeps documented layout and proof bar invariants", () => {
    assert.match(globalCss, /--container:\s*1180px;/);

    const proofBand = globalCss.match(/\.proof-band\s*{(?<body>[^}]*)}/);

    assert.ok(proofBand?.groups?.body);
    assert.match(proofBand.groups.body, /background:\s*var\(--color-dark\);/);
    assert.doesNotMatch(proofBand.groups.body, /gradient\(/);
  });

  test("global CSS centralizes public hero title typography", () => {
    const heroTitle = cssRuleBody(".hero-title");

    assert.ok(heroTitle);
    assert.match(heroTitle, /font-family:\s*var\(--font-display\);/);
    assert.match(heroTitle, /font-size:\s*var\(--hero-title-size\);/);
    assert.match(heroTitle, /font-weight:\s*var\(--hero-title-weight\);/);
    assert.match(heroTitle, /letter-spacing:\s*-0\.055em;/);
    assert.match(heroTitle, /line-height:\s*0\.96;/);

    const headingTitle = cssRuleBody(".section-title,\n.card-title");
    assert.ok(headingTitle);
    assert.match(headingTitle, /font-family:\s*var\(--font-display\);/);

    for (const selector of [".page-title", ".resume-hero-copy h1", ".work-hero h1"]) {
      const rule = cssRuleBody(selector);

      assert.ok(rule, `${selector} CSS rule should exist`);
      assert.doesNotMatch(rule, /font-size:|font-weight:|letter-spacing:|line-height:/);
    }
  });

  test("global CSS exposes Hallmark foundation tokens", () => {
    const root = cssRuleBody(":root");
    const html = cssRuleBody("html");
    const body = cssRuleBody("body");
    const anchor = cssRuleBody("a");
    const focusVisible = cssRuleBody(":focus-visible");

    assert.ok(root);
    assert.match(root, /--font-display:/);
    assert.match(root, /--color-paper:\s*oklch\(/);
    assert.match(root, /--color-surface:\s*oklch\(/);
    assert.match(root, /--color-ink:\s*oklch\(/);
    assert.doesNotMatch(root, /--color-bg:\s*#ffffff;/i);
    assert.doesNotMatch(root, /--color-surface:\s*#ffffff;/i);
    assert.match(root, /--duration-fast:\s*160ms;/);
    assert.match(root, /--ease-standard:\s*cubic-bezier\(/);
    assert.match(root, /--focus-ring:\s*oklch\(/);

    assert.ok(html);
    assert.match(html, /overflow-x:\s*clip;/);
    assert.ok(body);
    assert.match(body, /overflow-x:\s*clip;/);

    assert.ok(anchor);
    assert.match(anchor, /var\(--duration-fast\)\s+var\(--ease-standard\)/);
    assert.ok(focusVisible);
    assert.match(focusVisible, /outline:\s*3px solid var\(--focus-ring\);/);
  });

  test("Next config applies conservative global security headers", async () => {
    const { default: nextConfig } = await import("../../next.config");
    const getHeaderRoutes = nextConfig.headers;

    if (typeof getHeaderRoutes !== "function") {
      assert.fail("nextConfig.headers must be defined");
    }

    const headerRoutes = await getHeaderRoutes();
    const [globalRoute] = headerRoutes;

    assert.equal(headerRoutes.length, 1);
    assert.equal(globalRoute?.source, "/(.*)");

    const headersByKey = new Map(
      globalRoute?.headers.map((header) => [header.key, header.value]) ?? []
    );

    assert.equal(headersByKey.get("X-Content-Type-Options"), "nosniff");
    assert.equal(headersByKey.get("Referrer-Policy"), "strict-origin-when-cross-origin");
    assert.equal(headersByKey.get("X-Frame-Options"), "DENY");
    assert.equal(
      headersByKey.get("Permissions-Policy"),
      "camera=(), microphone=(), geolocation=()"
    );
    assert.equal(headersByKey.has("Content-Security-Policy"), false);
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
      "Alex Metelli - Software Engineer | Backend, Developer Infrastructure, AI Tooling"
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

    const homeText = collectText(HomePage());

    assert.match(
      homeText,
      /I build backend systems and developer tools for AI-assisted, correctness-sensitive engineering workflows\./
    );
    assert.match(homeText, /Open Source Contributions/);
    assert.match(homeText, /Apache DataFusion/);

    for (const project of projects) {
      assert.match(homeText, new RegExp(`Proof:\\s+${escapeRegExp(project.proof)}`));
    }

    for (const contribution of openSourceContributions) {
      assert.match(homeText, new RegExp(escapeRegExp(contribution.project)));
    }

    const workText = collectText(WorkPage());

    assert.match(workText, /Engineering case studies with real technical depth\./);
    assert.match(workText, /7 Case studies/);
    assert.match(workText, /5\+ Years experience/);
    assert.match(workText, /Backend \+ infra Core focus/);
    assert.match(workText, /Blockchain \+ AI tooling Domain expertise/);
    assert.equal(workText.match(/Featured/g)?.length, 1);
    assert.match(workText, /Read full case study/);
    assert.match(workText, /View GitHub/);
    assert.match(workText, /View resume/);

    for (const project of projects) {
      assert.match(workText, new RegExp(project.title));
    }
    assert.match(
      collectText(AboutPage()),
      /Engineering work built around correctness, clarity, and delivery\./
    );
    const resumeText = collectText(ResumePage());

    assert.match(resumeText, /Alex Metelli/);
    assert.match(resumeText, /5 Years of Experience/);
    assert.match(resumeText, /Download Resume \(PDF\)/);
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
