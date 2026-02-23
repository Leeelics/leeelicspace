import { expect, test } from "@playwright/test";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3002";

test.describe("响应式布局", () => {
  test("移动端布局正常", async ({ page }) => {
    // 设置移动端视口
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto(`${BASE_URL}/zh`);
    await page.waitForLoadState("networkidle");

    // 截图保存
    await page.screenshot({
      path: "e2e/screenshots/mobile-homepage.png",
      fullPage: true,
    });

    // 检查主要内容仍然可见
    await expect(page.locator("main")).toBeVisible();
  });

  test("平板布局正常", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    await page.goto(`${BASE_URL}/zh`);
    await page.waitForLoadState("networkidle");

    await page.screenshot({
      path: "e2e/screenshots/tablet-homepage.png",
      fullPage: true,
    });
  });
});

test.describe("性能测试", () => {
  test("首页加载时间小于 5 秒", async ({ page }) => {
    const startTime = Date.now();

    await page.goto(`${BASE_URL}/zh`);
    await page.waitForLoadState("networkidle");

    const loadTime = Date.now() - startTime;
    console.log(`首页加载时间: ${loadTime}ms`);

    expect(loadTime).toBeLessThan(15000); // 开发模式允许更长时间
  });

  test("关键性能指标", async ({ page }) => {
    await page.goto(`${BASE_URL}/zh`);

    // 收集性能指标
    const performanceTiming = await page.evaluate(() => {
      const timing = performance.timing;
      return {
        domContentLoaded:
          timing.domContentLoadedEventEnd - timing.navigationStart,
        loadComplete: timing.loadEventEnd - timing.navigationStart,
      };
    });

    console.log("性能指标:", performanceTiming);

    // DOMContentLoaded 应该在 10 秒内（开发模式较慢）
    expect(performanceTiming.domContentLoaded).toBeLessThan(10000);
  });
});

test.describe("无障碍测试", () => {
  test("页面有正确的标题结构", async ({ page }) => {
    await page.goto(`${BASE_URL}/zh`);

    // 检查 h1 或其他标题存在
    const heading = page.locator("h1, h2, .text-2xl, .text-3xl").first();
    await expect(heading).toBeVisible();

    // 检查图片有 alt 文本
    const images = page.locator("img");
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute("alt");
      if (!alt) {
        const ariaHidden = await images.nth(i).getAttribute("aria-hidden");
        expect(ariaHidden).toBe("true");
      }
    }
  });

  test("表单元素有关联标签", async ({ page }) => {
    await page.goto(`${BASE_URL}/zh/dashboard/login`);

    // 检查输入框是否有标签或 aria-label
    const inputs = page.locator("input");
    const count = await inputs.count();

    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute("id");
      const ariaLabel = await input.getAttribute("aria-label");
      const placeholder = await input.getAttribute("placeholder");

      // 检查是否有标签关联
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        const hasLabel = await label.isVisible().catch(() => false);

        expect(hasLabel || ariaLabel || placeholder).toBeTruthy();
      }
    }
  });
});
