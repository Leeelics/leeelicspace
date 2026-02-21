import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Helper function to take screenshots in both modes
async function takeScreenshots(page, name: string) {
  // Light mode (default)
  await page.evaluate(() => {
    localStorage.setItem('theme', 'light');
    document.documentElement.classList.remove('dark');
  });
  await page.reload();
  await page.waitForLoadState('networkidle');
  await page.screenshot({ 
    path: `e2e/ui-review/${name}-light.png`, 
    fullPage: true 
  });

  // Dark mode
  await page.evaluate(() => {
    localStorage.setItem('theme', 'dark');
    document.documentElement.classList.add('dark');
  });
  await page.reload();
  await page.waitForLoadState('networkidle');
  await page.screenshot({ 
    path: `e2e/ui-review/${name}-dark.png`, 
    fullPage: true 
  });
}

test.describe('UI Screenshots Review', () => {
  test('首页 - 亮/暗模式截图', async ({ page }) => {
    await page.goto(`${BASE_URL}/zh`);
    await page.waitForLoadState('networkidle');
    await takeScreenshots(page, 'homepage');
  });

  test('文章详情页 - 亮/暗模式截图', async ({ page }) => {
    // 先获取一篇文章
    const response = await page.request.get(`${BASE_URL}/api/posts`);
    const data = await response.json();
    const postId = data.data?.posts?.[0]?.id;
    
    if (postId) {
      await page.goto(`${BASE_URL}/zh/posts/${postId}`);
      await page.waitForLoadState('networkidle');
      await takeScreenshots(page, 'post-detail');
    }
  });

  test('项目页 - 亮/暗模式截图', async ({ page }) => {
    await page.goto(`${BASE_URL}/zh/projects`);
    await page.waitForLoadState('networkidle');
    await takeScreenshots(page, 'projects');
  });

  test('管理后台 - 亮/暗模式截图', async ({ page }) => {
    await page.goto(`${BASE_URL}/zh/dashboard?secret=${process.env.API_SECRET}`);
    await page.waitForLoadState('networkidle');
    await takeScreenshots(page, 'dashboard');
  });

  test('创建文章页 - 亮/暗模式截图', async ({ page }) => {
    await page.goto(`${BASE_URL}/zh/dashboard/create?secret=${process.env.API_SECRET}`);
    await page.waitForLoadState('networkidle');
    await takeScreenshots(page, 'create-post');
  });

  test('登录页 - 亮/暗模式截图', async ({ page }) => {
    await page.goto(`${BASE_URL}/zh/dashboard/login`);
    await page.waitForLoadState('networkidle');
    await takeScreenshots(page, 'login');
  });

  test('移动端首页 - 亮/暗模式截图', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/zh`);
    await page.waitForLoadState('networkidle');
    await takeScreenshots(page, 'homepage-mobile');
  });

  test('平板端首页 - 亮/暗模式截图', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(`${BASE_URL}/zh`);
    await page.waitForLoadState('networkidle');
    await takeScreenshots(page, 'homepage-tablet');
  });
});
