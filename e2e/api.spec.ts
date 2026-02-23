import { expect, test } from "@playwright/test";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3002";
const API_SECRET =
  process.env.API_SECRET ||
  "25132863da582815f76526b05c9e03f6480a9fd30e77099a0f04bc8f283c03f5";

test.describe("API 接口测试", () => {
  test("GET /api/posts 返回文章列表", async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/posts`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.posts).toBeInstanceOf(Array);
    expect(data.data.posts.length).toBeGreaterThan(0);

    // 验证文章数据结构
    const firstPost = data.data.posts[0];
    expect(firstPost.id).toBeDefined();
    expect(firstPost.title).toBeDefined();
    expect(firstPost.content).toBeDefined();
    expect(firstPost.tags).toBeInstanceOf(Array);
  });

  test("GET /api/tags 返回标签列表", async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/tags`);

    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data).toBeInstanceOf(Array);
  });

  test("GET /api/health 返回健康状态", async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/health`);

    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.status).toBeDefined();
    expect(data.timestamp).toBeDefined();
  });

  test("POST /api/posts 创建文章（需要认证）", async ({ request }) => {
    const newPost = {
      title: "Playwright 测试文章 " + Date.now(),
      content: "这是一篇由 Playwright 自动测试创建的文章。",
      tags: ["测试", "Playwright", "E2E"],
    };

    // 不带认证应该失败
    const unauthResponse = await request.post(`${BASE_URL}/api/posts`, {
      data: newPost,
    });
    expect(unauthResponse.status()).toBe(401);

    // 带认证应该成功
    const authResponse = await request.post(`${BASE_URL}/api/posts`, {
      data: newPost,
      headers: {
        "X-API-Secret": API_SECRET,
      },
    });

    expect(authResponse.ok()).toBeTruthy();

    const data = await authResponse.json();
    expect(data.success).toBe(true);
    expect(data.data.id).toBeDefined();
    expect(data.data.title).toBe(newPost.title);

    // 清理：删除测试文章
    const postId = data.data.id;
    await request.delete(`${BASE_URL}/api/posts/${postId}`, {
      headers: { "X-API-Secret": API_SECRET },
    });
  });

  test("GET /api/posts/[id] 获取单篇文章", async ({ request }) => {
    // 先获取文章列表
    const listResponse = await request.get(`${BASE_URL}/api/posts`);
    const listData = await listResponse.json();
    const firstPostId = listData.data.posts[0].id;

    // 获取单篇文章
    const response = await request.get(`${BASE_URL}/api/posts/${firstPostId}`);

    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.id).toBe(firstPostId);
  });

  test("GET /api/rss 返回 RSS feed", async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/rss`);

    expect(response.ok()).toBeTruthy();
    expect(response.headers()["content-type"]).toContain("xml");

    const body = await response.text();
    expect(body).toContain("<?xml");
    expect(body).toContain("<rss");
    expect(body).toContain("<channel>");
  });
});
