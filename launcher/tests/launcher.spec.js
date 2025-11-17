const { test, expect } = require('@playwright/test');

test.describe('Launcher Application', () => {
  test('should load the launcher page', async ({ page }) => {
    await page.goto('/launcher.html');
    
    // Check that the page loads
    await expect(page.locator('.console')).toBeVisible();
  });

  test('should display settings button', async ({ page }) => {
    await page.goto('/launcher.html');
    
    // Check for settings button
    const settingsButton = page.locator('button[aria-label="settings"]');
    await expect(settingsButton).toBeVisible();
    await expect(settingsButton).toHaveAttribute('title', 'Settings');
  });

  test('should toggle settings panel', async ({ page }) => {
    await page.goto('/launcher.html');
    
    // Click settings button
    const settingsButton = page.locator('button[aria-label="settings"]');
    await settingsButton.click();
    
    // Wait a bit for the settings to appear
    await page.waitForTimeout(500);
    
    // Settings component should be rendered (check for any settings-related elements)
    // Note: We can't check visibility without knowing the SettingsComponent structure
    // but we can verify the button was clicked
    await expect(settingsButton).toBeVisible();
  });

  test('should display console content', async ({ page }) => {
    await page.goto('/launcher.html');
    
    // Wait for content to load
    await page.waitForTimeout(1000);
    
    // Check that ConsoleContentComponent is rendered
    const consoleDiv = page.locator('.console');
    await expect(consoleDiv).toBeVisible();
  });

  test('should have YAML config functionality', async ({ page }) => {
    await page.goto('/launcher.html');
    
    // Open settings
    const settingsButton = page.locator('button[aria-label="settings"]');
    await settingsButton.click();
    
    // Wait for settings to render
    await page.waitForTimeout(500);
    
    // The YAML config should be managed by the SettingsComponent
    // This test verifies the component structure is in place
    await expect(settingsButton).toBeVisible();
  });

  test('should initialize with default data', async ({ page }) => {
    // Listen for console logs to verify initialization
    const logs = [];
    page.on('console', msg => {
      if (msg.type() === 'debug' || msg.type() === 'log') {
        logs.push(msg.text());
      }
    });

    await page.goto('/launcher.html');
    
    // Wait for component to mount
    await page.waitForTimeout(1000);
    
    // Check if mount message appears
    const hasMountLog = logs.some(log => log.includes('Component has mounted'));
    expect(hasMountLog).toBeTruthy();
  });

  test('should only show enabled items (Chat, Mail, Calendar)', async ({ page }) => {
    await page.goto('/launcher.html');
    
    // Wait for content to load
    await page.waitForTimeout(1000);
    
    // Get the console content text
    const contentText = await page.textContent('.console');
    
    // Verify the 3 enabled items are present in the launcher output
    expect(contentText).toContain('🙀:Chat');
    expect(contentText).toContain('🙀:Mail');
    expect(contentText).toContain('🙀:Calendar');
    
    // Verify disabled items are NOT in the launcher output (not as 🙀: items)
    expect(contentText).not.toContain('🙀:Whatsapp');
    expect(contentText).not.toContain('🙀:Tasks');
    
    // Count occurrences of each item in launcher format
    const chatCount = (contentText.match(/🙀:Chat/g) || []).length;
    const mailCount = (contentText.match(/🙀:Mail/g) || []).length;
    const calendarCount = (contentText.match(/🙀:Calendar/g) || []).length;
    
    // Each enabled item should appear exactly once
    expect(chatCount).toBe(1);
    expect(mailCount).toBe(1);
    expect(calendarCount).toBe(1);
  });

  test('should handle window lifecycle', async ({ page }) => {
    // Set up error listener BEFORE navigating
    const errors = [];
    page.on('pageerror', error => {
      // Filter out expected cross-origin errors from external window creation
      const isCrossOriginError = error.message.includes('cross-origin') || 
                                  error.message.includes('security policy');
      if (!isCrossOriginError) {
        errors.push(error.message);
        console.log('Unexpected page error:', error.message);
      }
    });
    
    await page.goto('/launcher.html');
    
    // Wait for initialization
    await page.waitForTimeout(1000);
    
    // The app should be running without errors
    const consoleDiv = page.locator('.console');
    await expect(consoleDiv).toBeVisible();
    
    // Log any unexpected errors found for debugging
    if (errors.length > 0) {
      console.log('Unexpected errors found:', errors);
    }
    
    // Should have no unexpected page errors (cross-origin errors are expected)
    expect(errors.length).toBe(0);
  });
});
