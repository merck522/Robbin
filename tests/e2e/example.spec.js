import { test, expect } from '@playwright/test';

test.describe('End-to-End Tests', () => {
  test('should load splash screen and redirect to login page', async ({ page }) => {
    // Access base URL (http://localhost:8000)
    await page.goto('/');

    // Wait for the redirect to complete (splash screen is loaded)
    await expect(page).toHaveURL(/.*splash\/code.html/);

    // Verify title or some container exists on the page
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
