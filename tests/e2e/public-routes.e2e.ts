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
