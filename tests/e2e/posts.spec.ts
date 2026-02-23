import { expect, test } from "@playwright/test";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3002";

test.describe("文章详情页", () => {
  test("文章详情页正常显示", async ({ page, request }) => {
    // 先获取一篇文章的 ID
    const response = await request.get(`${BASE_URL}/api/posts`);
    const data = await response.json();
    const firstPost = data.data.posts[0];

    expect(firstPost).toBeDefined();
    expect(firstPost.id).toBeDefined();

    // 访问文章详情页
    await page.goto(`${BASE_URL}/zh/posts/${firstPost.id}`);

    // 检查标题存在
    await expect(page.locator("h1").first()).toBeVisible();

    // 检查文章内容（使用更通用的选择器）
    await expect(page.locator("article, main, .prose").first()).toBeVisible();

    // 截图保存
    await page.screenshot({
      path: "e2e/screenshots/post-detail.png",
      fullPage: true,
    });
  });
});
