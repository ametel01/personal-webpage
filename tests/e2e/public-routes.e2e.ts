import { expect, type Page, test } from "@playwright/test";
import { profile } from "../../src/content/profile";
import { projects } from "../../src/content/projects";
import {
  getAdjacentProjects,
  getRelatedArticlesForProject,
  getRelatedProjectsForArticle
} from "../../src/content/relationships";
import { writingArticles } from "../../src/content/writing";

const projectRoutes = projects.map((project) => `/work/${project.slug}`);
const writingRoutes = writingArticles.map((article) => `/writing/${article.slug}`);
const publicRoutes = [
  "/",
  "/work",
  ...projectRoutes,
  "/writing",
  ...writingRoutes,
  "/about",
  "/resume"
] as const;
const homepageFeaturedSlugs = new Set([
  "agentreceipt",
  "scopepilot",
  "aggsandbox",
  "voyager-verifier"
]);
const homepageFeaturedProjects = projects.filter((project) =>
  homepageFeaturedSlugs.has(project.slug)
);

type StructuredDataGraph = {
  "@graph": Record<string, unknown>[];
};

async function readStructuredData(page: Page): Promise<StructuredDataGraph> {
  return page.locator('script[type="application/ld+json"]').evaluate((script) => {
    return JSON.parse(script.textContent ?? "") as StructuredDataGraph;
  });
}

test.describe("public routes", () => {
  for (const route of publicRoutes) {
    test(`${route} renders with accessible page structure`, async ({ page }) => {
      const response = await page.goto(route);

      expect(response?.ok()).toBe(true);
      await expect(page.locator("h1:visible")).toHaveCount(1);
      await expect(page.locator("main#main-content")).toHaveCount(1);
      await expect(page.locator('a[href=""]')).toHaveCount(0);

      const overflowsHorizontally = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1
      );

      expect(overflowsHorizontally).toBe(false);
    });
  }

  test("skip navigation bypasses the repeated site header", async ({ page }) => {
    await page.goto("/");

    const skipLink = page.getByRole("link", { name: "Skip to main content" });
    const mainContent = page.locator("main#main-content");

    await expect(skipLink).not.toBeInViewport();

    await page.keyboard.press("Tab");

    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeInViewport();

    await page.keyboard.press("Enter");

    await expect(mainContent).toBeFocused();
  });

  test("homepage renders the curated project set with current evidence", async ({ page }) => {
    await page.goto("/");

    const selectedWork = page.locator("#selected-work");

    await expect(selectedWork.locator(".home-featured-link")).toHaveCount(1);
    await expect(page.locator(".home-project-card")).toHaveCount(3);

    for (const project of homepageFeaturedProjects) {
      await expect(page.getByText(project.title, { exact: true }).first()).toBeVisible();
      await expect(
        page.getByText(project.metadata.currentState, { exact: true }).first()
      ).toBeVisible();
    }
  });

  test("homepage exposes every technical article directly", async ({ page }) => {
    await page.goto("/");

    const writingSection = page.locator(".home-writing-bridge");
    await expect(
      writingSection.getByRole("heading", { name: "Technical writing", exact: true })
    ).toBeVisible();

    for (const article of writingArticles) {
      await expect(
        writingSection.getByRole("link", { name: new RegExp(article.title) })
      ).toHaveAttribute("href", `/writing/${article.slug}`);
    }
  });

  test("case studies close with related articles and adjacent projects", async ({ page }) => {
    for (const project of projects) {
      await page.goto(`/work/${project.slug}`);

      const relatedWork = page.locator(".case-related-work");
      await expect(relatedWork.getByRole("heading", { name: "Related work" })).toBeVisible();
      await expect(relatedWork.locator('a[href^="/writing/"]')).toHaveCount(
        getRelatedArticlesForProject(project.slug).length
      );
      await expect(relatedWork.locator('a[href^="/work/"]')).toHaveCount(
        getAdjacentProjects(project.slug).length
      );
    }
  });

  test("technical articles expose multiple related project case studies", async ({ page }) => {
    for (const article of writingArticles) {
      await page.goto(`/writing/${article.slug}`);

      const relatedProjects = page.locator(".writing-project-callout");
      await expect(
        relatedProjects.getByRole("heading", { name: "Related projects" })
      ).toBeVisible();
      await expect(relatedProjects.locator('a[href^="/work/"]')).toHaveCount(
        getRelatedProjectsForArticle(article).length
      );
    }
  });

  test("structured data connects the homepage, work index, and every project", async ({ page }) => {
    await page.goto("/");
    const homepageGraph = await readStructuredData(page);

    expect(homepageGraph["@graph"].map((node) => node["@type"])).toEqual([
      "Person",
      "WebSite",
      "ProfilePage"
    ]);
    expect(homepageGraph["@graph"][0]?.["@id"]).toBe("https://www.ametel.dev/#alex-metelli");

    await page.goto("/work");
    const workGraph = await readStructuredData(page);

    expect(workGraph["@graph"].some((node) => node["@type"] === "BreadcrumbList")).toBe(true);
    expect(workGraph["@graph"][0]?.author).toEqual({
      "@id": "https://www.ametel.dev/#alex-metelli"
    });

    for (const project of projects) {
      await page.goto(`/work/${project.slug}`);
      const projectGraph = await readStructuredData(page);
      const projectNode = projectGraph["@graph"].find(
        (node) => node["@type"] === project.schemaType
      );

      expect(projectNode?.creator).toEqual({
        "@id": "https://www.ametel.dev/#alex-metelli"
      });
      expect(projectGraph["@graph"].some((node) => node["@type"] === "BreadcrumbList")).toBe(true);
    }
  });

  test("deferred homepage project links navigate on demand", async ({ page }) => {
    await page.goto("/");
    await page.locator(".home-featured-link").click();

    await expect(page).toHaveURL("/work/agentreceipt");
    await expect(page.getByRole("heading", { level: 1, name: "AgentReceipt" })).toBeVisible();
  });

  test("desktop case-study navigation exposes generous hit areas", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/work/agentreceipt");

    const sectionLinks = page.locator(".case-study-nav-list a");

    for (let index = 0; index < (await sectionLinks.count()); index += 1) {
      const box = await sectionLinks.nth(index).boundingBox();

      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }

    await page.getByRole("link", { name: "Architecture or implementation", exact: true }).click();

    const anchorLanding = await page.evaluate(() => ({
      hash: window.location.hash,
      headerBottom: document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 0,
      targetTop: document.querySelector("#architecture")?.getBoundingClientRect().top ?? 0
    }));

    expect(anchorLanding.hash).toBe("#architecture");
    expect(anchorLanding.targetTop).toBeGreaterThan(anchorLanding.headerBottom);
  });

  test("work evidence register preserves directory navigation and mobile action targets", async ({
    page
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/work");

    const desktopHeadingLines = await page.locator(".work-index-intro h1").evaluate((heading) => {
      const styles = getComputedStyle(heading);

      return Math.round(
        heading.getBoundingClientRect().height / Number.parseFloat(styles.lineHeight)
      );
    });

    expect(desktopHeadingLines).toBeLessThanOrEqual(3);

    await page.setViewportSize({ width: 900, height: 900 });

    const intermediateColumns = await page
      .locator(".work-project-index ol")
      .evaluate((index) => getComputedStyle(index).gridTemplateColumns.split(" ").length);

    expect(intermediateColumns).toBe(2);
    await expect(page.locator(".work-project-index a")).toHaveCount(projects.length);

    await page.setViewportSize({ width: 390, height: 900 });

    const mobileLayout = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth
    }));

    expect(mobileLayout.documentWidth).toBeLessThanOrEqual(mobileLayout.viewportWidth + 1);

    const recordLinks = page.locator(".work-record-link");

    for (let index = 0; index < (await recordLinks.count()); index += 1) {
      const box = await recordLinks.nth(index).boundingBox();

      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }

    await page.locator('.work-project-index a[href="#skills-doctor"]').click();
    await expect(page).toHaveURL(/#skills-doctor$/);
  });

  test("homepage project and contribution ledgers stay aligned", async ({ page }) => {
    await page.setViewportSize({ width: 1220, height: 900 });
    await page.goto("/");

    const cards = page.locator(".home-project-card");
    const cardBoxes = await Promise.all(
      Array.from({ length: await cards.count() }, (_, index) => cards.nth(index).boundingBox())
    );

    expect(cardBoxes).toHaveLength(3);
    expect(cardBoxes.every(Boolean)).toBe(true);
    expect(cardBoxes.every((box) => box?.x === cardBoxes[0]?.x)).toBe(true);
    expect(cardBoxes.every((box) => box?.width === cardBoxes[0]?.width)).toBe(true);
    expect(cardBoxes[1]?.y).toBeGreaterThan(cardBoxes[0]?.y ?? 0);
    expect(cardBoxes[2]?.y).toBeGreaterThan(cardBoxes[1]?.y ?? 0);

    const contributionRows = page.locator(".open-source-row");
    const firstRow = await contributionRows.first().boundingBox();
    const lastRow = await contributionRows.last().boundingBox();

    expect(firstRow).not.toBeNull();
    expect(lastRow).not.toBeNull();
    expect(lastRow?.x).toBe(firstRow?.x);
  });

  test("homepage adapts across compact, touch, and wide viewports", async ({ page }) => {
    for (const viewport of [
      { width: 320, height: 900 },
      { width: 667, height: 375 },
      { width: 768, height: 1024 },
      { width: 2560, height: 1440 }
    ]) {
      await page.setViewportSize(viewport);
      await page.goto("/");

      const layout = await page.evaluate(() => ({
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
        selectedWorkWidth:
          document.querySelector("#selected-work")?.closest(".container")?.clientWidth ?? 0
      }));

      expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth + 1);

      if (viewport.width === 320 || viewport.width === 667) {
        const brandBox = await page.locator(".site-brand-link").boundingBox();

        expect(brandBox?.width).toBeGreaterThanOrEqual(44);
        expect(brandBox?.height).toBeGreaterThanOrEqual(44);
      }

      if (viewport.width === 320) {
        const navLinks = page.locator(".site-primary-nav .nav-link");

        for (let index = 0; index < (await navLinks.count()); index += 1) {
          const box = await navLinks.nth(index).boundingBox();

          expect(box?.width).toBeGreaterThanOrEqual(44);
          expect(box?.height).toBeGreaterThanOrEqual(44);
        }

        const primaryAction = await page.locator(".home-primary-action").boundingBox();
        const featuredCaseFile = await page.locator(".home-featured-link").boundingBox();

        expect(primaryAction?.height).toBeGreaterThanOrEqual(44);
        expect(featuredCaseFile?.width).toBeLessThanOrEqual(viewport.width - 32);
      }

      if (viewport.width === 2560) {
        expect(layout.selectedWorkWidth).toBeLessThanOrEqual(1180);
      }
    }
  });

  test("homepage uses one bounded editorial entrance", async ({ page }) => {
    await page.goto("/");

    const motion = await page.evaluate(() => {
      const title = getComputedStyle(document.querySelector(".home-hero-title") as HTMLElement);
      const trace = getComputedStyle(
        document.querySelector(".home-featured-traces path") as SVGPathElement
      );

      return {
        titleName: title.animationName,
        traceName: trace.animationName,
        traceDuration: trace.animationDuration
      };
    });

    expect(motion.titleName).toBe("none");
    expect(motion.traceName).toBe("home-traces-resolve");
    expect(motion.traceDuration).toBe("0.9s");
  });

  test("reduced motion removes decorative movement without suppressing state feedback", async ({
    page
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const motion = await page.evaluate(() => {
      const trace = getComputedStyle(
        document.querySelector(".home-featured-traces path") as SVGPathElement
      );
      const link = getComputedStyle(document.querySelector(".home-resume-link") as HTMLElement);
      const skipLink = getComputedStyle(document.querySelector(".skip-link") as HTMLElement);

      return {
        animationName: trace.animationName,
        linkTransitionDuration: link.transitionDuration,
        linkTransitionProperty: link.transitionProperty,
        scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
        skipTransitionDuration: skipLink.transitionDuration
      };
    });

    expect(motion.animationName).toBe("none");
    expect(motion.scrollBehavior).toBe("auto");
    expect(motion.linkTransitionProperty).toContain("color");
    expect(Number.parseFloat(motion.linkTransitionDuration)).toBeGreaterThan(0);
    expect(motion.skipTransitionDuration).toBe("0s");
  });

  test("about page renders the portrait with alt text", async ({ page }) => {
    await page.goto("/about");

    await expect(
      page.getByRole("img", { name: "Professional portrait of Alex Metelli" })
    ).toBeVisible();
  });

  test("about page renders redesigned content sections", async ({ page }) => {
    await page.goto("/about");

    for (const label of profile.about.capabilityChips.map((chip) => chip.label)) {
      await expect(
        page.locator(".about-capability-index").getByText(label, { exact: true })
      ).toBeVisible();
    }

    const interview = page.locator(".about-interview");
    for (const focusCard of profile.about.focusCards) {
      await expect(interview.getByRole("heading", { name: focusCard.title })).toBeVisible();
    }
    await expect(interview.locator(".about-waypoint")).toHaveCount(profile.about.focusCards.length);

    await expect(page.getByRole("heading", { name: "Working principles" })).toBeVisible();

    for (const value of ["Correctness", "Clarity", "Delivery"]) {
      await expect(
        page.locator(".about-principles").getByRole("heading", { name: value })
      ).toBeVisible();
    }

    await expect(page.locator(".about-supporting-work a")).toHaveCount(4);

    await expect(page.locator(".about-contact-register a")).toHaveCount(4);
  });

  test("resume links every selected project with descriptive case-study text", async ({ page }) => {
    await page.goto("/resume");

    const projectLinks = page.locator(".resume-project-link");
    await expect(projectLinks).toHaveCount(projects.length);

    for (const project of projects) {
      await expect(
        page.getByRole("link", { name: `Open the ${project.title} case study` })
      ).toHaveAttribute("href", `/work/${project.slug}`);
    }
  });

  for (const viewport of [
    { width: 1440, height: 1000 },
    { width: 390, height: 900 }
  ]) {
    test(`about page avoids horizontal overflow at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/about");

      const overflowsHorizontally = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1
      );

      expect(overflowsHorizontally).toBe(false);
    });
  }

  test("new-tab links include noreferrer", async ({ page }) => {
    await page.goto("/");

    const newTabLinks = page.locator('a[target="_blank"]');
    const count = await newTabLinks.count();

    expect(count).toBeGreaterThan(0);

    for (let index = 0; index < count; index += 1) {
      await expect(newTabLinks.nth(index)).toHaveAttribute("rel", /(^|\s)noreferrer(\s|$)/);
    }
  });

  for (const project of projects) {
    test(`${project.title} evidence links are HTTPS`, async ({ page }) => {
      await page.goto(`/work/${project.slug}`);

      for (const evidence of project.caseStudy.evidence) {
        expect(evidence.href.startsWith("https://")).toBe(true);
        await expect(page.locator(`a[href="${evidence.href}"]`)).toBeVisible();
      }
    });
  }
});
