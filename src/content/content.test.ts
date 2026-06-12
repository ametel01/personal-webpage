import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { profile, technicalFocusGroups } from "@/content/profile";
import { getProject, isProjectSlug, projectSlugs, projects } from "@/content/projects";
import { resume } from "@/content/resume";
import { createPageMetadata, getAbsoluteUrl, homeTitle } from "@/lib/metadata";
import { site } from "@/lib/site";

const expectedSlugs = ["voyager-verifier", "aggsandbox", "nogame"] as const;
const forbiddenPattern = new RegExp(
  [
    ["Open", "Maintainer"].join(" "),
    String.raw`\b${["G", "o"].join("")}\b`,
    ["alexmetelli", "poker"].join("\\."),
    ["GMT", String.raw`\+8`].join(""),
    ["GMT", "Compatible"].join("-")
  ].join("|")
);

describe("website content invariants", () => {
  test("selected projects expose the expected slugs and routes", () => {
    assert.deepStrictEqual([...projectSlugs], [...expectedSlugs]);

    for (const slug of expectedSlugs) {
      assert.equal(isProjectSlug(slug), true);
      assert.equal(getProject(slug)?.slug, slug);
    }
  });

  test("projects have required case study fields and real evidence links", () => {
    assert.equal(projects.length, 3);

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

  test("homepage title matches the required SEO title", () => {
    assert.equal(
      homeTitle,
      "Alex Metelli - Software Engineer | Backend, Developer Tooling, Blockchain Infrastructure"
    );
  });
});
