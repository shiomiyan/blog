import { expect, test } from "@playwright/test";

const pages = [
  { path: "/", heading: "Latest posts" },
  { path: "/about", heading: "About me" },
  { path: "/categories", heading: "Categories" },
  { path: "/tags", heading: "Tags" },
  { path: "/search", heading: "Search" },
  { path: "/404", heading: "404: Page not found" },
] as const;

test.describe("site structure", () => {
  for (const { path, heading } of pages) {
    test(`${path} exposes the expected document structure`, async ({
      page,
    }) => {
      const response = await page.goto(path);

      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", "ja");
      await expect(page.locator("main#content")).toHaveCount(1);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
      await expect(
        page.getByRole("link", { name: "本文へ移動" }),
      ).toHaveAttribute("href", "#content");
    });
  }

  test("header links are reachable with the keyboard", async ({ page }) => {
    await page.goto("/");

    const links = ["About", "Tags", "Search"];

    for (const name of links) {
      const link = page.getByRole("link", { name });
      await expect(link).toBeVisible();
      let reached = false;

      for (let attempt = 0; attempt < 20; attempt += 1) {
        await page.keyboard.press("Tab");
        reached = await link.evaluate(
          (element) => element === document.activeElement,
        );
        if (reached) break;
      }

      expect(reached).toBe(true);
      await expect(link).toBeFocused();
    }
  });
});
