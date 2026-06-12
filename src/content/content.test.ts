import { describe, expect, test } from "bun:test";
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
    expect([...projectSlugs]).toEqual([...expectedSlugs]);

    for (const slug of expectedSlugs) {
      expect(isProjectSlug(slug)).toBe(true);
      expect(getProject(slug)?.slug).toBe(slug);
    }
  });

  test("projects have required case study fields and real evidence links", () => {
    expect(projects).toHaveLength(3);

    for (const project of projects) {
      expect(project.title.length).toBeGreaterThan(0);
      expect(project.shortDescription.length).toBeGreaterThan(0);
      expect(project.proof.length).toBeGreaterThan(0);
      expect(project.metadata.role.length).toBeGreaterThan(0);
      expect(project.metadata.stack.length).toBeGreaterThan(0);
      expect(project.metadata.currentState.length).toBeGreaterThan(0);
      expect(project.caseStudy.overview.length).toBeGreaterThan(0);
      expect(project.caseStudy.problem.length).toBeGreaterThan(0);
      expect(project.caseStudy.role.length).toBeGreaterThan(0);
      expect(project.caseStudy.technicalDetails.length).toBeGreaterThan(0);
      expect(project.caseStudy.tradeoffs.length).toBeGreaterThan(0);
      expect(project.caseStudy.currentState.length).toBeGreaterThan(0);
      expect(project.caseStudy.evidence.length).toBeGreaterThan(0);

      for (const link of project.caseStudy.evidence) {
        expect(link.href).toMatch(/^https:\/\//);
        expect(link.href).not.toContain("example.com");
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

    expect(publicContent).not.toMatch(forbiddenPattern);
  });

  test("public email is consistent across profile and resume links", () => {
    expect(site.email).toBe("alex-metelli@gmx.com");
    expect(profile.email).toBe(site.email);
    expect(resume.links).toContainEqual({
      label: "Email",
      href: `mailto:${site.email}`
    });
  });

  test("homepage technical focus keeps the exact PRD groups", () => {
    expect(technicalFocusGroups.map((group) => group.title)).toEqual([
      "Backend & infrastructure",
      "Developer tooling",
      "Blockchain systems",
      "Product engineering"
    ]);

    expect(JSON.stringify(technicalFocusGroups)).not.toContain("AWS");
  });

  test("metadata helper builds canonical and Open Graph URLs from the site URL", () => {
    expect(getAbsoluteUrl("/work")).toBe("http://localhost:3000/work");

    const metadata = createPageMetadata({
      title: "Selected Work",
      description: "Selected work description.",
      path: "/work"
    });

    expect(metadata.title).toBe("Selected Work");
    expect(metadata.alternates).toEqual({ canonical: "/work" });
    expect(metadata.openGraph).toMatchObject({
      title: "Selected Work | Alex Metelli",
      url: "http://localhost:3000/work"
    });
  });

  test("homepage title matches the required SEO title", () => {
    expect(homeTitle).toBe(
      "Alex Metelli - Software Engineer | Backend, Developer Tooling, Blockchain Infrastructure"
    );
  });
});
