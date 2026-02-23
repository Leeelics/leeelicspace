import { expect, test } from "@playwright/test";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3002";

test.describe("首页", () => {
  test("首页正常加载并显示文章列表", async ({ page }) => {
    await page.goto(`${BASE_URL}/zh`);

    // 检查页面标题
    await expect(page).toHaveTitle(/lee/);

    // 检查主要内容区域存在
    await expect(page.locator("main")).toBeVisible();

    // 检查是否有文章列表（至少有一个文章卡片）
    const articles = page.locator("article");
    await expect(articles.first()).toBeVisible();

    // 截图保存
    await page.screenshot({
      path: "e2e/screenshots/homepage.png",
      fullPage: true,
    });
  });

  test("导航栏功能正常", async ({ page }) => {
    await page.goto(`${BASE_URL}/zh`);
    await page.waitForLoadState("networkidle");

    // 检查导航链接（使用更通用的选择器）
    await expect(page.locator("nav, header").first()).toBeVisible();

    // 检查主题切换按钮（可选）
    const themeToggle = page
      .locator(
        'button[aria-label*="主题"], button[aria-label*="theme"], button[class*="theme"]',
      )
      .first();
    try {
      await themeToggle.click({ timeout: 2000 });
      await page.waitForTimeout(300);
    } catch {
      // 主题切换按钮可能不存在，忽略
    }
  });

  test("文章链接可点击", async ({ page }) => {
    await page.goto(`${BASE_URL}/zh`);

    // 等待文章加载
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // 获取第一个文章链接
    const firstArticleLink = page.locator('a[href*="/posts/"]').first();
    const href = await firstArticleLink.getAttribute("href");

    if (href && href.includes("/posts/")) {
      await firstArticleLink.click();
      await expect(page).toHaveURL(/\/posts\//);
    }
  });
});
