import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { describe, test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { getTechVisual, TechIcon } from "@/components/tech-icons";
import { profile, technicalFocusGroups } from "@/content/profile";
import {
  getProject,
  isProjectSlug,
  openSourceContributions,
  projectSlugs,
  projects
} from "@/content/projects";
import {
  getAdjacentProjects,
  getPrimaryProjectForArticle,
  getRelatedArticlesForProject,
  getRelatedProjectsForArticle
} from "@/content/relationships";
import { resume } from "@/content/resume";
import {
  getRelatedWriting,
  getWritingArticle,
  isWritingSlug,
  type WritingArticle,
  writingArticles,
  writingSlugs
} from "@/content/writing";
import { createLlmsText, getCrawlPages } from "@/lib/crawl";
import { createPageMetadata, getAbsoluteUrl, homeMetadata, homeTitle } from "@/lib/metadata";
import { primaryNavItems } from "@/lib/navigation";
import { seoEntity } from "@/lib/seo";
import { defaultDescription, professionalDescription, site } from "@/lib/site";
import {
  createHomepageStructuredData,
  createProfilePageStructuredData,
  createProjectStructuredData,
  createWorkStructuredData,
  createWritingArticleStructuredData,
  createWritingIndexStructuredData,
  type StructuredDataGraph,
  serializeStructuredData
} from "@/lib/structured-data";

const expectedSlugs = [
  "agentreceipt",
  "skills-doctor",
  "ritualai",
  "scopepilot",
  "aggsandbox",
  "voyager-verifier",
  "horizon-starknet"
] as const;
const homepageFeaturedSlugs: readonly (typeof expectedSlugs)[number][] = [
  "agentreceipt",
  "scopepilot",
  "aggsandbox",
  "voyager-verifier"
];
const globalCss = readFileSync(new URL("../../app/globals.css", import.meta.url), "utf8");
const homePageSource = readFileSync(new URL("../../app/page.tsx", import.meta.url), "utf8");
const aboutPageSource = readFileSync(new URL("../../app/about/page.tsx", import.meta.url), "utf8");
const workPageSource = readFileSync(new URL("../../app/work/page.tsx", import.meta.url), "utf8");
const projectPageSource = readFileSync(
  new URL("../../app/work/[slug]/page.tsx", import.meta.url),
  "utf8"
);
const resumePageSource = readFileSync(
  new URL("../../app/resume/page.tsx", import.meta.url),
  "utf8"
);
const siteShellSource = readFileSync(
  new URL("../../src/components/site-shell.tsx", import.meta.url),
  "utf8"
);
const writingIndexSource = readFileSync(
  new URL("../../app/writing/page.tsx", import.meta.url),
  "utf8"
);
const writingArticleSource = readFileSync(
  new URL("../../app/writing/[slug]/page.tsx", import.meta.url),
  "utf8"
);
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

function getGraphNode(graph: StructuredDataGraph, type: string) {
  return graph["@graph"].find((node) => node["@type"] === type);
}

describe("website content invariants", () => {
  test("technical writing exposes complete static article routes", () => {
    assert.equal(writingArticles.length, 7);
    assert.equal(writingSlugs.length, 7);

    for (const article of writingArticles) {
      assert.equal(isWritingSlug(article.slug), true);
      assert.equal(getWritingArticle(article.slug)?.title, article.title);
      assert.match(article.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      assert.ok(article.title.length > 20);
      assert.ok(article.description.length > 80);
      assert.ok(article.searchQuestions.length >= 3);
      assert.ok(article.keyPoints.length >= 4);
      assert.ok(article.sections.length >= 4);
      assert.match(article.publishedAt, /^2026-\d{2}-\d{2}$/);
      assert.match(article.updatedAt, /^2026-\d{2}-\d{2}$/);
      assert.ok(article.readingMinutes >= 5);
      assert.match(article.relatedProject.href, /^\/work\/[a-z0-9-]+$/);
      assert.ok(article.diagram.steps.length >= 4);
      assert.ok(article.artifacts.length >= 1);
      assert.ok(article.codeExamples.length >= 1);
      assert.ok(article.decisions.length >= 3);
      assert.ok(article.failureCases.length >= 3);
      assert.ok(article.repositoryLinks.length >= 3);

      for (const example of article.codeExamples) {
        assert.ok(example.label.length > 10);
        assert.ok(example.language.length > 1);
        assert.ok(example.code.includes("\n"));
      }

      for (const artifact of article.artifacts) {
        assert.match(artifact.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
        assert.ok(artifact.title.length > 20);
        assert.ok(artifact.description.length > 80);
        assert.match(artifact.source.href, /^https:\/\//);

        if (artifact.kind === "comparison") {
          assert.ok(artifact.columns.length >= 2);
          assert.ok(artifact.rows.every((row) => row.values.length === artifact.columns.length));
        }

        if (artifact.kind === "download") {
          assert.match(artifact.href, /^\/fixtures\/[a-z0-9.-]+$/);
          assert.equal(
            existsSync(new URL(`../../public${artifact.href}`, import.meta.url)),
            true,
            `${artifact.filename} should exist in public fixtures`
          );
        }
      }

      for (const link of article.repositoryLinks) {
        assert.match(link.href, /^https:\/\//);
        assert.ok(link.description.length > 30);
      }

      const relatedProjects = getRelatedProjectsForArticle(article);

      assert.ok(relatedProjects.length >= 2);
      assert.equal(
        article.relatedProject.href,
        `/work/${getPrimaryProjectForArticle(article.slug)?.slug}`
      );

      for (const section of article.sections) {
        assert.match(section.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
        assert.ok(section.paragraphs.length >= 2);
        assert.ok(section.items && section.items.length >= 4);
      }

      assert.equal(getRelatedWriting(article).length, 3);
    }

    assert.deepStrictEqual(
      new Set(writingArticles.flatMap((article) => article.artifacts.map(({ kind }) => kind))),
      new Set([
        "schema",
        "architecture",
        "state-machine",
        "failure-taxonomy",
        "pipeline",
        "download",
        "implementation",
        "comparison"
      ])
    );
  });

  test("writing routes include the approved reading and wayfinding structure", () => {
    assert.match(writingIndexSource, /writing-atlas-layout/);
    assert.match(writingIndexSource, /FeaturedWritingCard/);
    assert.match(writingIndexSource, /TopicAtlas/);
    assert.match(writingArticleSource, /ArticleTableOfContents/);
    assert.match(writingArticleSource, /writing-key-points/);
    assert.match(writingArticleSource, /ArticleDiagram/);
    assert.match(writingArticleSource, /ArticleArtifacts/);
    assert.match(writingArticleSource, /ArticleCodeExamples/);
    assert.match(writingArticleSource, /ArticleFailureCases/);
    assert.match(writingArticleSource, /ArticleRepositoryLinks/);
    assert.match(writingArticleSource, /generateStaticParams/);
    assert.ok(primaryNavItems.some((item) => item.href === "/writing"));
  });

  test("writing structured data describes the index and each technical article", () => {
    const indexGraph = createWritingIndexStructuredData(writingArticles);
    const collectionPage = getGraphNode(indexGraph, "CollectionPage");
    const itemList = getGraphNode(indexGraph, "ItemList");

    assert.equal(collectionPage?.url, getAbsoluteUrl("/writing"));
    assert.equal(itemList?.numberOfItems, writingArticles.length);

    for (const article of writingArticles) {
      const typedArticle: WritingArticle = article;
      const graph = createWritingArticleStructuredData(article);
      const techArticle = getGraphNode(graph, "TechArticle");

      assert.equal(techArticle?.headline, article.title);
      assert.equal(techArticle?.datePublished, article.publishedAt);
      assert.equal(techArticle?.dateModified, article.updatedAt);
      assert.equal(techArticle?.articleSection, article.topic);

      const bodyCitations = typedArticle.sections.flatMap((section) =>
        section.paragraphs.flatMap((paragraph) =>
          typeof paragraph === "string" ? [] : paragraph.citations
        )
      );

      assert.ok(bodyCitations.length >= 4, `${article.slug} should include substantive citations`);
      assert.ok(
        new Set(bodyCitations.map(({ href }) => new URL(href).hostname)).size >= 2,
        `${article.slug} should cite multiple primary-source domains`
      );
      for (const citation of bodyCitations) {
        assert.match(citation.href, /^https:\/\//);
        assert.ok(citation.label.length > 0);
      }
      assert.deepStrictEqual(
        techArticle?.citation,
        [
          ...bodyCitations.map(({ href }) => href),
          ...typedArticle.artifacts.map(({ source }) => source.href),
          ...typedArticle.repositoryLinks.map(({ href }) => href)
        ].filter((href, index, references) => references.indexOf(href) === index)
      );
    }
  });

  test("selected projects expose the expected slugs and routes", () => {
    assert.deepStrictEqual([...projectSlugs], [...expectedSlugs]);

    for (const slug of expectedSlugs) {
      assert.equal(isProjectSlug(slug), true);
      assert.equal(getProject(slug)?.slug, slug);
    }
  });

  test("article and project relationships cover every important work route", () => {
    for (const article of writingArticles) {
      const relatedProjects = getRelatedProjectsForArticle(article);

      assert.ok(relatedProjects.length >= 2, `${article.slug} should link to multiple projects`);
      assert.equal(
        new Set(relatedProjects.map((project) => project.slug)).size,
        relatedProjects.length
      );
    }

    for (const project of projects) {
      const relatedArticles = getRelatedArticlesForProject(project.slug);
      const adjacentProjects = getAdjacentProjects(project.slug);

      assert.ok(relatedArticles.length >= 1, `${project.slug} should link to a relevant article`);
      assert.equal(adjacentProjects.length, 2);
      assert.equal(
        adjacentProjects.some((candidate) => candidate.slug === project.slug),
        false
      );
    }
  });

  test("projects expose the complete technical case-study structure and real links", () => {
    assert.equal(projects.length, 7);

    for (const project of projects) {
      assert.ok(project.title.length > 0);
      assert.ok(
        ["SoftwareSourceCode", "SoftwareApplication", "CreativeWork"].includes(project.schemaType)
      );
      assert.ok(project.shortDescription.length > 0);
      assert.ok(project.proof.length > 0);
      assert.ok(project.metadata.role.length > 0);
      assert.ok(project.metadata.stack.length > 0);
      assert.ok(project.metadata.currentState.length > 0);
      assert.ok(project.caseStudy.definition.length > 0);
      assert.ok(project.caseStudy.problem.length > 0);
      assert.ok(project.caseStudy.role.length > 0);
      assert.ok(project.caseStudy.architecture.length > 0);
      assert.ok(project.caseStudy.decisions.length > 0);
      assert.ok(project.caseStudy.hardProblems.length > 0);
      assert.ok(project.caseStudy.tradeoffs.length > 0);
      assert.ok(project.caseStudy.currentState.length > 0);
      assert.ok(project.caseStudy.evidence.length > 0);
      assert.ok(project.caseStudy.relatedWriting.length > 0);
      assert.match(project.caseStudy.lastUpdated, /^\d{4}-\d{2}-\d{2}$/);

      const sectionTitles = Object.values(project.caseStudy.sectionTitles);
      assert.equal(sectionTitles.length, 14);
      assert.equal(new Set(sectionTitles).size, sectionTitles.length);
      for (const title of sectionTitles) {
        assert.ok(title.length > 0);
      }

      for (const link of [...project.caseStudy.evidence, ...project.caseStudy.relatedWriting]) {
        assert.match(link.href, /^https:\/\//);
        assert.equal(link.href.includes("example.com"), false);
      }

      if (project.caseStudy.implementationExample) {
        assert.ok(project.caseStudy.implementationExample.label.length > 0);
        assert.ok(project.caseStudy.implementationExample.code.length > 0);
      }

      const caseStudyCopy = [
        project.caseStudy.definition,
        project.caseStudy.problem,
        project.caseStudy.role,
        ...project.caseStudy.architecture,
        project.caseStudy.implementationExample?.label ?? "",
        ...project.caseStudy.decisions,
        ...project.caseStudy.hardProblems,
        ...project.caseStudy.tradeoffs,
        project.caseStudy.currentState,
        ...project.caseStudy.evidence.map((link) => link.label),
        ...project.caseStudy.relatedWriting.map((link) => link.label)
      ].join(" ");

      assert.doesNotMatch(caseStudyCopy, /\b(?:advanced|powerful|production-grade)\b/i);
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

  test("canonical identity uses the public website and shared short biography", () => {
    assert.equal(site.professionalDescription, professionalDescription);
    assert.equal(
      professionalDescription,
      "I’m a backend and blockchain infrastructure engineer with around five years of experience building protocol tooling, data systems, integrations"
    );
    assert.equal(seoEntity.canonicalUrl, "https://www.ametel.dev/");
    assert.equal(seoEntity.description, professionalDescription);
  });

  test("about page exposes structured redesigned content", () => {
    assert.deepStrictEqual(
      profile.about.capabilityChips.map((chip) => chip.label),
      [
        "5 years' experience",
        "Backend engineering",
        "Developer infrastructure",
        "AI-assisted tools",
        "Blockchain infrastructure"
      ]
    );

    assert.deepStrictEqual(
      profile.about.focusCards.map((card) => card.title),
      [
        "Who is Alex Metelli?",
        "What does he specialize in?",
        "What has he built?",
        "What evidence supports those claims?",
        "What kind of engineering work does he take on?"
      ]
    );

    assert.equal(profile.hero.body, professionalDescription);
    assert.equal(profile.about.narrative, professionalDescription);
    assert.equal(defaultDescription, professionalDescription);
    assert.equal(site.professionalDescription, professionalDescription);

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

  test("about page uses a waypoint interview and flat evidence registers", () => {
    assert.match(aboutPageSource, /className="about-identity-rail"/);
    assert.match(aboutPageSource, /className="about-interview"/);
    assert.match(aboutPageSource, /className="about-waypoint"/);
    assert.match(aboutPageSource, /className="about-principles"/);
    assert.match(aboutPageSource, /className="about-supporting-work"/);
    assert.match(aboutPageSource, /className="about-contact-register"/);
    assert.doesNotMatch(aboutPageSource, /about-card/);
    assert.match(globalCss, /\.about-interview ol::before\s*{/);
    assert.match(globalCss, /@keyframes about-path-arrive\s*{/);
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

  test("homepage keeps one direct path into a curated work set", () => {
    assert.match(homePageSource, /Review selected work/);
    assert.match(homePageSource, /Browse all 7 engineering case studies/);
    assert.match(homePageSource, /id="technical-writing-title"/);
    assert.match(homePageSource, /writingArticles\.map/);
    assert.doesNotMatch(homePageSource, /page-eyebrow|section-eyebrow/);
    assert.doesNotMatch(homePageSource, /technicalFocusGroups|proofBarItems/);

    for (const slug of ["agentreceipt", "scopepilot", "aggsandbox", "voyager-verifier"] as const) {
      assert.match(homePageSource, new RegExp(`"${slug}"`));
    }
  });

  test("internal evidence links use descriptive anchor text", () => {
    const internalLinkSources = [
      homePageSource,
      workPageSource,
      projectPageSource,
      writingArticleSource,
      aboutPageSource,
      resumePageSource
    ].join("\n");

    assert.doesNotMatch(internalLinkSources, />\s*(?:read more|view project)\s*</i);
    assert.match(projectPageSource, /sectionTitles\.relatedArticles/);
    assert.match(projectPageSource, /sectionTitles\.adjacentProjects/);
    assert.match(writingArticleSource, /Related projects/);
    assert.match(resumePageSource, /\{project\.title\} case study/);
  });

  test("below-fold navigation defers route prefetch", () => {
    const projectCardLink = homePageSource.match(
      /<Link(?<props>[^>]*className="home-project-card"[^>]*)>/
    )?.groups?.props;
    const footerLink = siteShellSource.match(/<Link(?<props>[^>]*className="footer-link"[^>]*)>/)
      ?.groups?.props;

    assert.ok(projectCardLink);
    assert.match(projectCardLink, /prefetch={false}/);
    assert.ok(footerLink);
    assert.match(footerLink, /prefetch={false}/);
    assert.match(
      homePageSource,
      /<Link className="section-text-link" href="\/resume" prefetch={false}>/
    );
    assert.match(homePageSource, /<Link className="home-resume-link" href="\/resume">/);
    assert.doesNotMatch(siteShellSource, /className="nav-link"[^>]*prefetch={false}/);
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

  test("raster technology assets use image optimization while SVG assets stay direct", () => {
    const rasterMarkup = renderToStaticMarkup(createElement(TechIcon, { name: "CloudWatch" }));
    const vectorMarkup = renderToStaticMarkup(createElement(TechIcon, { name: "AggLayer" }));

    assert.match(rasterMarkup, /\/_next\/image\?url=%2Ficons%2Fcloudwatch\.png/);
    assert.doesNotMatch(vectorMarkup, /\/_next\/image\?/);
    assert.match(vectorMarkup, /src="\/icons\/agglayer\.svg"/);
  });

  test("global CSS keeps documented layout and distilled homepage invariants", () => {
    assert.match(globalCss, /--container:\s*1180px;/);
    assert.doesNotMatch(globalCss, /\.proof-band\s*{/);

    const projectGrid = cssRuleBody(".home-project-grid");
    const openSourceRow = cssRuleBody(".open-source-row");

    assert.ok(projectGrid);
    assert.match(projectGrid, /border-block:\s*1px solid var\(--color-border\);/);
    assert.ok(openSourceRow);
    assert.match(openSourceRow, /min-height:\s*72px;/);
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

    for (const selector of [".page-title", ".resume-hero-copy h1"]) {
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
    assert.match(root, /--color-header-surface:\s*oklch\(/);
    assert.match(root, /--shadow-project-mark:\s*0 10px 22px oklch\(/);
    assert.match(root, /--shadow-project-mark-hover:\s*0 14px 28px oklch\(/);

    const siteHeader = cssRuleBody(".site-header");

    assert.ok(siteHeader);
    assert.match(siteHeader, /background:\s*var\(--color-header-surface\);/);
    assert.match(globalCss, /\n\.project-logo\s*{[^}]*box-shadow:\s*var\(--shadow-project-mark\);/);

    assert.ok(html);
    assert.match(html, /overflow-x:\s*clip;/);
    assert.ok(body);
    assert.match(body, /overflow-x:\s*clip;/);

    assert.ok(anchor);
    assert.match(anchor, /var\(--duration-fast\)\s+var\(--ease-standard\)/);
    assert.ok(focusVisible);
    assert.match(focusVisible, /outline:\s*3px solid var\(--focus-ring\);/);
  });

  test("work page exposes a flat evidence register with a featured proof specimen", () => {
    assert.match(workPageSource, /work-project-index/);
    assert.match(workPageSource, /work-featured-specimen/);
    assert.match(workPageSource, /work-proof-rail/);
    assert.match(workPageSource, /work-record-evidence/);
    assert.match(workPageSource, /work-specimen-traces/);
    assert.doesNotMatch(workPageSource, /fill="#/);
    assert.doesNotMatch(globalCss, /\.work-featured-card\s*{/);
    assert.match(globalCss, /\.work-featured-specimen\s*{/);
    assert.match(globalCss, /\.work-project-record\s*{/);
    assert.match(globalCss, /\.work-index-intro h1\s*{/);
  });

  test("motion stays authored, bounded, and reduced-motion safe", () => {
    assert.match(globalCss, /@keyframes\s+home-traces-resolve/);
    assert.match(globalCss, /@keyframes\s+work-traces-resolve/);
    assert.doesNotMatch(globalCss, /@keyframes\s+work-blueprint-develop/);
    assert.doesNotMatch(globalCss, /@keyframes\s+work-cube-lock/);
    assert.doesNotMatch(globalCss, /@keyframes\s+work-rise/);
    assert.match(
      globalCss,
      /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*animation:\s*none !important;/
    );
    assert.doesNotMatch(globalCss, /transition-duration:\s*0\.001ms !important/);
    assert.match(
      globalCss,
      /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\.work-specimen-traces path\s*{[^}]*animation:\s*none;/
    );
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

  test("primary header navigation matches the public route contract", () => {
    assert.deepStrictEqual(
      primaryNavItems.map((item) => [item.label, item.href]),
      [
        ["Work", "/work"],
        ["Writing", "/writing"],
        ["About", "/about"],
        ["Resume", "/resume"]
      ]
    );
    assert.doesNotMatch(siteShellSource, /button-compact/);
  });

  test("metadata helper builds complete metadata with absolute public URLs", () => {
    assert.equal(getAbsoluteUrl("/work"), "https://www.ametel.dev/work");

    const metadata = createPageMetadata({
      title: "Selected Work",
      description: "Selected work description.",
      path: "/work"
    });

    assert.equal(metadata.title, "Selected Work");
    assert.equal(metadata.description, "Selected work description.");
    assert.deepStrictEqual(metadata.alternates, {
      canonical: "https://www.ametel.dev/work"
    });

    const openGraph = metadata.openGraph as
      | {
          title?: unknown;
          description?: unknown;
          url?: unknown;
          images?: { url?: unknown; alt?: unknown }[];
        }
      | undefined;
    assert.equal(openGraph?.title, "Selected Work | Alex Metelli");
    assert.equal(openGraph?.description, "Selected work description.");
    assert.equal(openGraph?.url, "https://www.ametel.dev/work");
    assert.equal(openGraph?.images?.[0]?.url, "https://www.ametel.dev/og.png");
    assert.equal(openGraph?.images?.[0]?.alt, "Selected Work | Alex Metelli");

    const twitter = metadata.twitter as
      | { title?: unknown; description?: unknown; images?: unknown }
      | undefined;
    assert.equal(twitter?.title, "Selected Work | Alex Metelli");
    assert.equal(twitter?.description, "Selected work description.");
    assert.deepStrictEqual(twitter?.images, ["https://www.ametel.dev/og.png"]);
  });

  test("article metadata includes publication and modification dates", () => {
    const article = writingArticles[0];
    const metadata = createPageMetadata({
      title: article.title,
      description: article.description,
      path: `/writing/${article.slug}`,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt
    });
    const openGraph = metadata.openGraph as
      | { type?: unknown; publishedTime?: unknown; modifiedTime?: unknown; authors?: unknown }
      | undefined;

    assert.equal(openGraph?.type, "article");
    assert.equal(openGraph?.publishedTime, article.publishedAt);
    assert.equal(openGraph?.modifiedTime, article.updatedAt);
    assert.deepStrictEqual(openGraph?.authors, [site.name]);
  });

  test("route metadata uses distinct titles and page-specific descriptions", () => {
    assert.deepStrictEqual(homeMetadata.title, { absolute: homeTitle });
    assert.match(homeTitle, / \| Alex Metelli$/);
    assert.equal(homeMetadata.description, professionalDescription);
    assert.match(workPageSource, /title: "Selected Software Engineering Work"/);
    assert.match(projectPageSource, /`\$\{project\.title\} — Technical Case Study`/);
    assert.match(writingIndexSource, /title: "Software Engineering Articles"/);
  });

  test("every static page exposes unique metadata with absolute social URLs", async () => {
    const [{ metadata: about }, { metadata: resume }, { metadata: work }, { metadata: writing }] =
      await Promise.all([
        import("../../app/about/page"),
        import("../../app/resume/page"),
        import("../../app/work/page"),
        import("../../app/writing/page")
      ]);
    const routeMetadata = [homeMetadata, about, resume, work, writing];
    const titles = routeMetadata.map((metadata) =>
      typeof metadata.openGraph?.title === "string" ? metadata.openGraph.title : ""
    );
    const descriptions = routeMetadata.map((metadata) => metadata.description);

    assert.equal(new Set(titles).size, routeMetadata.length);
    assert.equal(new Set(descriptions).size, routeMetadata.length);

    for (const metadata of routeMetadata) {
      const canonical = metadata.alternates?.canonical;
      const openGraph = metadata.openGraph as
        | { url?: unknown; images?: { url?: unknown }[] }
        | undefined;
      const twitter = metadata.twitter as { images?: unknown } | undefined;

      assert.match(String(canonical), /^https:\/\/www\.ametel\.dev\//);
      assert.match(String(openGraph?.url), /^https:\/\/www\.ametel\.dev\//);
      assert.equal(openGraph?.images?.[0]?.url, "https://www.ametel.dev/og.png");
      assert.deepStrictEqual(twitter?.images, ["https://www.ametel.dev/og.png"]);
    }
  });

  test("SEO entity configuration owns the stable public identity", () => {
    assert.equal(seoEntity.personId, "https://www.ametel.dev/#alex-metelli");
    assert.equal(seoEntity.profilePageId, "https://www.ametel.dev/about#profile-page");
    assert.equal(seoEntity.canonicalUrl, "https://www.ametel.dev/");
    assert.equal(seoEntity.name, site.name);
    assert.equal(seoEntity.occupation, site.role);
    assert.equal(seoEntity.description, professionalDescription);
    assert.equal(seoEntity.image, "https://www.ametel.dev/images/professional-photo.png");
    assert.deepStrictEqual(seoEntity.sameAs, [site.githubUrl, site.linkedinUrl]);
    assert.ok(seoEntity.skills.includes("Developer infrastructure"));
  });

  test("structured data connects the homepage identity to the about profile page", () => {
    const graph = createHomepageStructuredData();
    const person = getGraphNode(graph, "Person");
    const website = getGraphNode(graph, "WebSite");
    const profileGraph = createProfilePageStructuredData();
    const profilePage = getGraphNode(profileGraph, "ProfilePage");
    const profilePerson = getGraphNode(profileGraph, "Person");
    const breadcrumbs = getGraphNode(profileGraph, "BreadcrumbList");

    assert.ok(person);
    assert.equal(person["@id"], seoEntity.personId);
    assert.equal(person.description, seoEntity.description);
    assert.equal(person.image, seoEntity.image);
    assert.deepStrictEqual(person.mainEntityOfPage, { "@id": seoEntity.profilePageId });
    assert.deepStrictEqual(person.knowsAbout, seoEntity.skills);
    assert.deepStrictEqual(person.sameAs, seoEntity.sameAs);
    assert.deepStrictEqual(person.alumniOf, {
      "@type": "CollegeOrUniversity",
      name: seoEntity.alumniOf
    });

    assert.ok(website);
    assert.equal(website["@id"], seoEntity.websiteId);
    assert.deepStrictEqual(website.author, { "@id": seoEntity.personId });

    assert.ok(profilePage);
    assert.equal(profilePage["@id"], seoEntity.profilePageId);
    assert.equal(profilePage.url, getAbsoluteUrl("/about"));
    assert.deepStrictEqual(profilePage.mainEntity, { "@id": seoEntity.personId });
    assert.deepStrictEqual(profilePage.isPartOf, { "@id": seoEntity.websiteId });
    assert.equal(profilePerson?.["@id"], seoEntity.personId);
    assert.equal((breadcrumbs?.itemListElement as unknown[]).length, 2);
  });

  test("work structured data connects the project index and breadcrumbs", () => {
    const graph = createWorkStructuredData(projects);
    const collectionPage = getGraphNode(graph, "CollectionPage");
    const itemList = getGraphNode(graph, "ItemList");
    const breadcrumbs = getGraphNode(graph, "BreadcrumbList");

    assert.ok(collectionPage);
    assert.deepStrictEqual(collectionPage.author, { "@id": seoEntity.personId });
    assert.deepStrictEqual(collectionPage.isPartOf, { "@id": seoEntity.websiteId });
    assert.ok(itemList);
    assert.equal(itemList.numberOfItems, projects.length);
    assert.ok(breadcrumbs);
    assert.equal((breadcrumbs.itemListElement as unknown[]).length, 2);
  });

  test("every case study describes its project, creator, website, and breadcrumbs", () => {
    for (const project of projects) {
      const graph = createProjectStructuredData(project);
      const projectNode = getGraphNode(graph, project.schemaType);
      const webPage = getGraphNode(graph, "WebPage");
      const breadcrumbs = getGraphNode(graph, "BreadcrumbList");

      assert.ok(projectNode, `${project.title} should expose ${project.schemaType}`);
      assert.equal(projectNode["@id"], `https://www.ametel.dev/work/${project.slug}#project`);
      assert.deepStrictEqual(projectNode.creator, { "@id": seoEntity.personId });
      assert.deepStrictEqual(projectNode.author, { "@id": seoEntity.personId });
      assert.equal(projectNode.dateModified, project.caseStudy.lastUpdated);
      assert.deepStrictEqual(
        projectNode.citation,
        project.caseStudy.relatedWriting.map(({ href }) => href)
      );
      assert.ok(webPage);
      assert.deepStrictEqual(webPage.isPartOf, { "@id": seoEntity.websiteId });
      assert.deepStrictEqual(webPage.mainEntity, { "@id": projectNode["@id"] });
      assert.equal(webPage.dateModified, project.caseStudy.lastUpdated);
      assert.ok(breadcrumbs);
      assert.equal((breadcrumbs.itemListElement as unknown[]).length, 3);

      if (project.schemaType === "SoftwareSourceCode") {
        assert.match(String(projectNode.codeRepository), /^https:\/\/github\.com\//);
        assert.ok((projectNode.programmingLanguage as string[]).length > 0);
      }

      if (project.schemaType === "SoftwareApplication") {
        assert.equal(projectNode.applicationCategory, project.applicationCategory);
        assert.equal(projectNode.operatingSystem, "Web");
      }
    }
  });

  test("structured data serialization escapes script-breaking characters", () => {
    const graph: StructuredDataGraph = {
      "@context": "https://schema.org",
      "@graph": [{ "@type": "Thing", name: "</script>\u2028\u2029" }]
    };
    const serialized = serializeStructuredData(graph);

    assert.doesNotMatch(serialized, /<\/script>/);
    assert.match(serialized, /\\u003c\/script>/);
    assert.match(serialized, /\\u2028/);
    assert.match(serialized, /\\u2029/);
  });

  test("homepage title matches the required SEO title", () => {
    assert.equal(
      homeTitle,
      "Software Engineer — Backend, Developer Infrastructure, and AI Tooling | Alex Metelli"
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
      /Backend and developer-infrastructure engineering, backed by inspectable work\./
    );
    assert.match(homeText, new RegExp(escapeRegExp(professionalDescription)));
    assert.match(homeText, /Open-source contributions/);
    assert.match(homeText, /Apache DataFusion/);

    for (const slug of homepageFeaturedSlugs) {
      const project = getProject(slug);

      assert.ok(project);
      assert.match(homeText, new RegExp(escapeRegExp(project.valueStatement)));
      assert.match(homeText, new RegExp(escapeRegExp(project.metadata.currentState)));
    }

    for (const contribution of openSourceContributions) {
      assert.match(homeText, new RegExp(escapeRegExp(contribution.project)));
    }

    const workText = collectText(WorkPage());

    assert.match(workText, /Work that leaves an evidence trail\./);
    assert.match(workText, /Evidence register/);
    assert.match(workText, /Seven case-study plates/);
    assert.match(workText, /Evidence on record/);
    assert.match(workText, /Explore the\s+AgentReceipt\s+case study/);
    assert.match(workText, /Browse Alex's GitHub repositories/);
    assert.match(workText, /Review Alex's engineering resume/);

    for (const project of projects) {
      assert.match(workText, new RegExp(project.title));
      assert.match(workText, new RegExp(escapeRegExp(project.metadata.currentState)));
    }

    for (const project of projects.slice(1)) {
      assert.match(workText, new RegExp(escapeRegExp(project.proof)));
    }

    assert.match(workText, /Git, filesystem, instruction, and provider evidence/);
    assert.match(workText, /Signed receipts emit deterministic replay and focus JSON/);
    assert.match(workText, /Quality gates, policy checks, and ranked agent-review tasks/);
    const aboutText = collectText(AboutPage());

    assert.match(aboutText, /Engineering systems that make complex work easier to verify\./);
    assert.match(aboutText, new RegExp(escapeRegExp(professionalDescription)));
    for (const question of profile.about.focusCards.map((card) => card.title)) {
      assert.match(aboutText, new RegExp(escapeRegExp(question)));
    }
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
    assert.equal(metadata.title, `${voyager.title} — Technical Case Study`);
    assert.equal(metadata.description, voyager.shortDescription);
    assert.deepStrictEqual(metadata.alternates, {
      canonical: "https://www.ametel.dev/work/voyager-verifier"
    });

    for (const slug of expectedSlugs) {
      const project = getProject(slug);
      assert.ok(project);

      const projectMetadata = await generateMetadata({ params: Promise.resolve({ slug }) });
      const openGraph = projectMetadata.openGraph as { url?: unknown } | undefined;

      assert.equal(projectMetadata.title, `${project.title} — Technical Case Study`);
      assert.equal(projectMetadata.description, project.shortDescription);
      assert.deepStrictEqual(projectMetadata.alternates, {
        canonical: `https://www.ametel.dev/work/${project.slug}`
      });
      assert.equal(openGraph?.url, `https://www.ametel.dev/work/${project.slug}`);

      const element = await ProjectPage({ params: Promise.resolve({ slug }) });
      const pageText = collectText(element);

      assert.match(pageText, new RegExp(project.title));
      for (const sectionTitle of Object.values(project.caseStudy.sectionTitles)) {
        assert.ok(pageText.includes(sectionTitle));
      }

      for (const templateHeading of [
        "One-sentence definition",
        "Architecture or implementation",
        "Important design decisions",
        "Hard technical problems",
        "Last-updated date"
      ]) {
        assert.equal(pageText.includes(templateHeading), false);
      }
    }
  });

  test("dynamic writing metadata covers every article and its dates", async () => {
    const { generateMetadata, generateStaticParams } = await import(
      "../../app/writing/[slug]/page"
    );

    assert.deepStrictEqual(
      generateStaticParams(),
      writingSlugs.map((slug) => ({ slug }))
    );

    for (const article of writingArticles) {
      const metadata = await generateMetadata({
        params: Promise.resolve({ slug: article.slug })
      });
      const openGraph = metadata.openGraph as
        | { type?: unknown; publishedTime?: unknown; modifiedTime?: unknown; url?: unknown }
        | undefined;

      assert.equal(metadata.title, article.title);
      assert.equal(metadata.description, article.description);
      assert.deepStrictEqual(metadata.alternates, {
        canonical: `https://www.ametel.dev/writing/${article.slug}`
      });
      assert.equal(openGraph?.type, "article");
      assert.equal(openGraph?.publishedTime, article.publishedAt);
      assert.equal(openGraph?.modifiedTime, article.updatedAt);
      assert.equal(openGraph?.url, `https://www.ametel.dev/writing/${article.slug}`);
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
        ...expectedSlugs.map((slug) => `/work/${slug}`),
        "/writing",
        ...writingSlugs.map((slug) => `/writing/${slug}`)
      ].sort()
    );

    const sitemapLastModified = new Map(
      sitemap().map((entry) => [new URL(String(entry.url)).pathname, String(entry.lastModified)])
    );
    const latestProjectDate = projects
      .map((project) => project.caseStudy.lastUpdated)
      .sort()
      .at(-1);
    const latestWritingDate = writingArticles
      .map((article) => article.updatedAt)
      .sort()
      .at(-1);
    const latestHomepageDate = [profile.updatedAt, latestProjectDate, latestWritingDate]
      .filter((date): date is string => date !== undefined)
      .sort()
      .at(-1);

    assert.equal(sitemapLastModified.get("/about"), profile.updatedAt);
    assert.equal(sitemapLastModified.get("/resume"), resume.updatedAt);
    assert.equal(sitemapLastModified.get("/resume.pdf"), resume.pdfUpdatedAt);
    assert.equal(sitemapLastModified.get("/work"), latestProjectDate);
    assert.equal(sitemapLastModified.get("/writing"), latestWritingDate);
    assert.equal(sitemapLastModified.get("/"), latestHomepageDate);

    for (const project of projects) {
      assert.equal(sitemapLastModified.get(`/work/${project.slug}`), project.caseStudy.lastUpdated);
    }

    for (const article of writingArticles) {
      assert.equal(sitemapLastModified.get(`/writing/${article.slug}`), article.updatedAt);
    }

    assert.equal(sitemap().length, getCrawlPages().length);

    const robotsConfig = robots();
    assert.deepStrictEqual(robotsConfig.rules, {
      userAgent: "*",
      allow: "/"
    });
    assert.equal(String(robotsConfig.sitemap).endsWith("/sitemap.xml"), true);
  });

  test("llms.txt is generated from canonical project and writing content", async () => {
    const { GET } = await import("../../app/llms.txt/route");
    const response = GET();
    const llmsText = await response.text();

    assert.equal(response.headers.get("content-type"), "text/plain; charset=utf-8");
    assert.equal(llmsText, createLlmsText());

    for (const [label, path] of [
      ["About", "/about"],
      ["Resume", "/resume"],
      ["Work", "/work"],
      ["Writing", "/writing"]
    ] as const) {
      assert.match(llmsText, new RegExp(`\\[${label}\\]\\(${getAbsoluteUrl(path)}\\)`));
    }

    for (const project of projects.slice(0, 5)) {
      assert.match(llmsText, new RegExp(`/work/${project.slug}`));
    }

    for (const article of writingArticles) {
      assert.match(llmsText, new RegExp(`/writing/${article.slug}`));
    }
  });
});
