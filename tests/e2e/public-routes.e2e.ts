import { expect, test } from "@playwright/test";
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

  test("homepage project hierarchy and contribution list stay aligned", async ({ page }) => {
    await page.setViewportSize({ width: 1220, height: 900 });
    await page.goto("/");

    const cards = page.locator(".home-project-card");
    const cardBoxes = await Promise.all(
      Array.from({ length: await cards.count() }, (_, index) => cards.nth(index).boundingBox())
    );

    expect(cardBoxes).toHaveLength(4);
    expect(cardBoxes.every(Boolean)).toBe(true);
    expect(cardBoxes[0]?.width).toBeGreaterThan(cardBoxes[1]?.width ?? 0);
    expect(cardBoxes[0]?.height).toBeGreaterThan(cardBoxes[1]?.height ?? 0);
    expect(cardBoxes[1]?.x).toBe(cardBoxes[2]?.x);
    expect(cardBoxes[2]?.x).toBe(cardBoxes[3]?.x);
    expect(cardBoxes[1]?.y).toBeLessThan(cardBoxes[2]?.y ?? 0);

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

      if (viewport.width === 320) {
        const navLinks = page.locator(".site-primary-nav .nav-link");

        for (let index = 0; index < (await navLinks.count()); index += 1) {
          const box = await navLinks.nth(index).boundingBox();

          expect(box?.width).toBeGreaterThanOrEqual(44);
          expect(box?.height).toBeGreaterThanOrEqual(44);
        }

        const cardHeader = page.locator(".home-project-card-header").first();
        const iconBox = await cardHeader.locator(".project-logo").boundingBox();
        const roleBox = await cardHeader.locator(".home-project-role").boundingBox();

        expect((iconBox?.y ?? 0) + (iconBox?.height ?? 0) / 2).toBeCloseTo(
          (roleBox?.y ?? 0) + (roleBox?.height ?? 0) / 2
        );
      }

      if (viewport.width === 2560) {
        expect(layout.selectedWorkWidth).toBeLessThanOrEqual(1180);
      }
    }
  });

  test("keyboard users can bypass the repeated site navigation", async ({ page }) => {
    await page.goto("/");

    const skipLink = page.getByRole("link", { name: "Skip to main content" });

    await page.keyboard.press("Tab");
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();
    await skipLink.press("Enter");

    await expect(page).toHaveURL(/#main-content$/);
    await expect(page.locator("main#main-content")).toBeFocused();
  });

  test("unknown routes provide a useful recovery state", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });

    const response = await page.goto("/work/not-a-project");

    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { name: "This page is not part of the portfolio." })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Review selected work" })).toHaveAttribute(
      "href",
      "/work"
    );
    await expect(page.getByRole("link", { name: "Email Alex" })).toHaveAttribute(
      "href",
      /^mailto:/
    );

    const overflowsHorizontally = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1
    );

    expect(overflowsHorizontally).toBe(false);
  });

  test("homepage tolerates expanded and right-to-left text without horizontal overflow", async ({
    page
  }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto("/");

    await page.evaluate(() => {
      document.documentElement.dir = "rtl";

      for (const element of document.querySelectorAll(
        ".home-project-role, .open-source-title, .home-proof-fact dd, .site-footer-email"
      )) {
        element.textContent =
          "مهندسة-البنية-التحتية-والمنصات-لأنظمة-موزعة-شديدة-الحساسية-للصحة-والتوثيق";
      }
    });

    const overflowsHorizontally = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1
    );

    expect(overflowsHorizontally).toBe(false);
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
