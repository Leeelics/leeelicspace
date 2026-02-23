import { expect, test } from "@playwright/test";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3002";

test.describe("静态页面", () => {
  test("关于页面正常加载", async ({ page }) => {
    await page.goto(`${BASE_URL}/zh/about`);

    // 检查页面内容
    await expect(page.locator("h1")).toContainText(/关于|About/);

    // 截图保存
    await page.screenshot({
      path: "e2e/screenshots/about.png",
      fullPage: true,
    });
  });

  test("项目页面正常加载", async ({ page }) => {
    await page.goto(`${BASE_URL}/zh/projects`);

    // 检查页面包含项目相关内容（关于页面包含精选项目部分）
    await expect(page.locator("text=精选项目")).toBeVisible();

    // 截图保存
    await page.screenshot({
      path: "e2e/screenshots/projects.png",
      fullPage: true,
    });
  });
});
