import { test, expect, type Page } from "@playwright/test";

const BASE_URL = "http://localhost:3000/";

test.describe("React Vite", () => {
  test("has document title", async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle("Spotify");

    await page.screenshot({ path: `screenshots/example-has-title.png` });
  });
});
