import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  const testPhone = '1111111111';
  const testOTP = '111111';

  test('should login with test credentials, verify dashboard, and logout', async ({ page }) => {
    // 1. Navigate to Signin
    await page.goto('/signin');
    await expect(page).toHaveURL(/.*signin/);

    // 2. Enter Phone Number
    await page.fill('input[name="phone"]', testPhone);
    await page.click('button:has-text("Send OTP")');

    // 3. Enter OTP (Wait for OTP input to appear)
    await page.waitForSelector('input[name="otp"]');
    await page.fill('input[name="otp"]', testOTP);
    await page.click('button:has-text("Login")');

    // 4. Verify Dashboard Redirection
    await page.waitForURL(/.*dashboard/);
    await expect(page).toHaveURL(/.*dashboard/);
    
    // 5. Verify Dashboard Content
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
    // Assuming some user data loads, like "Welcome" or the profile icon
    await expect(page.locator('.custom-dropdown-toggle')).toBeVisible();

    // 6. Logout
    await page.click('.custom-dropdown-toggle');
    await page.click('text=Logout');

    // 7. Verify Redirect to Signin
    await page.waitForURL(/.*signin/);
    await expect(page).toHaveURL(/.*signin/);

    // 8. Verify Protected Route (Try going back to dashboard)
    await page.goto('/dashboard');
    await page.waitForURL(/.*signin/);
    await expect(page).toHaveURL(/.*signin/);
  });

  test('should not access dashboard when unauthenticated', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForURL(/.*signin/);
    await expect(page).toHaveURL(/.*signin/);
  });
});
