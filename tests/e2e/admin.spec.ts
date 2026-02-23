import { expect, test } from "@playwright/test";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3002";

test.describe("管理后台", () => {
  test("登录页面正常加载", async ({ page }) => {
    await page.goto(`${BASE_URL}/zh/dashboard/login`);

    // 检查登录表单（使用更精确的选择器）
    await expect(page.locator("form.mt-8")).toBeVisible();
    await expect(page.locator("#username")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();

    // 截图保存
    await page.screenshot({ path: "e2e/screenshots/login.png" });
  });

  test("登录流程（使用 localStorage）", async ({ page }) => {
    // 直接通过 localStorage 设置登录状态
    await page.goto(`${BASE_URL}/zh/dashboard/login`);
    await page.evaluate(() => {
      localStorage.setItem("adminLoggedIn", "true");
    });

    // 跳转到 dashboard
    await page.goto(`${BASE_URL}/zh/dashboard`);
    await page.waitForTimeout(2000);

    // 截图保存
    await page.screenshot({
      path: "e2e/screenshots/dashboard.png",
      fullPage: true,
    });
  });
});
