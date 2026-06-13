import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "**/*.e2e.ts",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure"
  },
  webServer: {
    command: "NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SITE_URL=http://localhost:3000 bun run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  },
  projects: [
    {
      name: "chromium-desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: {
          width: 1440,
          height: 1000
        }
      }
    },
    {
      name: "chromium-mobile",
      use: {
        ...devices["Pixel 5"],
        viewport: {
          width: 390,
          height: 900
        }
      }
    }
  ]
});
