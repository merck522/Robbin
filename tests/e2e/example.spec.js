import { test, expect } from '@playwright/test';

test.describe('End-to-End Tests', () => {
  
  test('should load splash screen and redirect to login page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/.*splash\/code.html/);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should show active trial badge on dashboard after mock login', async ({ page }) => {
    // Go to login page
    await page.goto('/login/code.html');
    
    // Fill in mock details
    await page.fill('#email', 'trainer@stitch.com');
    await page.fill('#password', 'password123');
    
    // Click Login (redirects to role selector)
    await page.click('#loginBtn');
    await expect(page).toHaveURL(/.*selector.html/);
    
    // Navigate to Trainer Dashboard
    await page.goto('/dashboard_del_entrenador_updated_style/code.html');
    
    // Check that trial badge is visible
    const badge = page.locator('#subscription-badge');
    await expect(badge).toBeVisible();
    await expect(badge).toContainText('Trial Mode');
  });

  test('should display paywall overlay when trial is expired and unlock upon successful payment', async ({ page }) => {
    // Seed expired mock user in localStorage
    await page.goto('/login/code.html');
    await page.evaluate(() => {
      const now = new Date();
      const trialEnds = new Date();
      trialEnds.setDate(now.getDate() - 1); // Expired yesterday
      
      localStorage.setItem('stitch_mock_user', JSON.stringify({
        email: "expired@stitch.com",
        fullName: "Expired Tester",
        subscription_status: "trial",
        created_at: new Date(Date.now() - 8*24*60*60*1000).toISOString(),
        trial_ends_at: trialEnds.toISOString()
      }));
    });

    // Go directly to Trainer Dashboard
    await page.goto('/dashboard_del_entrenador_updated_style/code.html');

    // Paywall overlay should be blocking the screen
    const overlay = page.locator('#paywall-overlay');
    await expect(overlay).toBeVisible();
    await expect(overlay).toContainText('Your 7-Day Free Trial Has Ended');

    // Click on simulate successful payment link
    await page.click('text=Simulate Successful Payment Redirect');

    // Verify paywall is dismissed and subscription status changes to Premium Account
    await expect(overlay).not.toBeVisible();
    const badge = page.locator('#subscription-badge');
    await expect(badge).toBeVisible();
    await expect(badge).toContainText('Premium Account');
  });
  
});
