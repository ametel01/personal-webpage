import { expect, test } from "@playwright/test";
import { projects } from "../../src/content/projects";

const projectRoutes = projects.map((project) => `/work/${project.slug}`);
const publicRoutes = ["/", "/work", ...projectRoutes, "/about", "/resume"] as const;

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

  test("homepage renders every selected project proof signal", async ({ page }) => {
    await page.goto("/");

    const selectedWork = page.locator("#selected-work");

    for (const project of projects) {
      await expect(selectedWork.getByText(project.title, { exact: true })).toBeVisible();
      await expect(
        selectedWork.getByText(`Proof: ${project.proof}`, { exact: true })
      ).toBeVisible();
    }
  });

  test("homepage incomplete card rows stay in normal grid flow", async ({ page }) => {
    await page.setViewportSize({ width: 1220, height: 900 });
    await page.goto("/");

    for (const selector of [".home-project-card", ".open-source-card"]) {
      const cards = page.locator(selector);
      const firstCard = await cards.first().boundingBox();
      const lastCard = await cards.last().boundingBox();

      expect(firstCard).not.toBeNull();
      expect(lastCard).not.toBeNull();
      expect(lastCard?.x).toBe(firstCard?.x);
    }
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
