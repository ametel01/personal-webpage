import { expect, type Page, test } from "@playwright/test";
import { projects } from "../../src/content/projects";

const projectRoutes = projects.map((project) => `/work/${project.slug}`);
const publicRoutes = ["/", "/work", ...projectRoutes, "/about", "/resume"] as const;
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

    await expect(selectedWork.locator(".home-project-card")).toHaveCount(4);

    for (const project of homepageFeaturedProjects) {
      await expect(selectedWork.getByText(project.title, { exact: true })).toBeVisible();
      await expect(
        selectedWork.getByText(project.metadata.currentState, { exact: true })
      ).toBeVisible();
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
    await page.locator(".home-project-card").first().click();

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

    await page.getByRole("link", { name: "Technical details", exact: true }).click();

    const anchorLanding = await page.evaluate(() => ({
      hash: window.location.hash,
      headerBottom: document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 0,
      targetTop: document.querySelector("#technical-details")?.getBoundingClientRect().top ?? 0
    }));

    expect(anchorLanding.hash).toBe("#technical-details");
    expect(anchorLanding.targetTop).toBeGreaterThan(anchorLanding.headerBottom);
  });

  test("homepage project grid and contribution list stay aligned", async ({ page }) => {
    await page.setViewportSize({ width: 1220, height: 900 });
    await page.goto("/");

    const cards = page.locator(".home-project-card");
    const cardBoxes = await Promise.all(
      Array.from({ length: await cards.count() }, (_, index) => cards.nth(index).boundingBox())
    );

    expect(cardBoxes).toHaveLength(4);
    expect(cardBoxes.every(Boolean)).toBe(true);
    expect(cardBoxes[0]?.y).toBe(cardBoxes[1]?.y);
    expect(cardBoxes[2]?.y).toBe(cardBoxes[3]?.y);
    expect(cardBoxes[0]?.x).toBe(cardBoxes[2]?.x);
    expect(cardBoxes[1]?.x).toBe(cardBoxes[3]?.x);

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
        selectedWorkWidth: document.querySelector("#selected-work .container")?.clientWidth ?? 0
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

        const cardHeader = page.locator(".home-project-card-header").first();
        const iconBox = await cardHeader.locator(".project-logo").boundingBox();
        const titleBox = await cardHeader.locator(".home-project-title").boundingBox();

        expect((iconBox?.y ?? 0) + (iconBox?.height ?? 0) / 2).toBeCloseTo(
          (titleBox?.y ?? 0) + (titleBox?.height ?? 0) / 2
        );
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

      return {
        titleName: title.animationName,
        titleDuration: title.animationDuration
      };
    });

    expect(motion.titleName).toBe("home-headline-unmask");
    expect(motion.titleDuration).toBe("0.72s");
  });

  test("homepage releases the headline mask after its entrance", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(800);

    const clipPath = await page
      .locator(".home-hero-title")
      .evaluate((title) => getComputedStyle(title).clipPath);

    expect(clipPath).toBe("none");
  });

  test("reduced motion removes decorative movement without suppressing state feedback", async ({
    page
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const motion = await page.evaluate(() => {
      const title = getComputedStyle(document.querySelector(".home-hero-title") as HTMLElement);
      const link = getComputedStyle(document.querySelector(".home-resume-link") as HTMLElement);
      const skipLink = getComputedStyle(document.querySelector(".skip-link") as HTMLElement);

      return {
        animationName: title.animationName,
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

    for (const label of [
      "5+ years",
      "Backend systems",
      "Developer tooling",
      "Blockchain infra",
      "Remote-friendly"
    ]) {
      await expect(page.locator(".about-chip").filter({ hasText: label })).toBeVisible();
    }

    await expect(page.locator(".about-focus-grid").getByText("What I work on")).toBeVisible();
    await expect(page.locator(".about-focus-grid").getByText("How I work")).toBeVisible();
    await expect(
      page.locator(".about-focus-grid").getByText("What I am looking for")
    ).toBeVisible();

    await expect(page.getByRole("heading", { name: "What matters to me" })).toBeVisible();

    for (const value of ["Correctness", "Clarity", "Delivery"]) {
      await expect(page.locator(".about-values-grid").getByText(value)).toBeVisible();
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
