const { chromium } = require('playwright');

(async () => {
  console.log('--- STARTING EXIT DEMO MODE NAVIGATION TEST ---');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();

  page.on('console', msg => console.log('[BROWSER LOG]', msg.text()));
  page.on('pageerror', err => console.log('[BROWSER UNCAUGHT ERROR]', err.message));

  await page.goto('http://localhost:4174');
  console.log('1. Loaded http://localhost:4174 (Landing Page)');

  // Navigate: Landing -> Sign In -> Citizen Account Tab -> Try Citizen Demo
  await page.locator('header button', { hasText: 'Sign In' }).click();
  await page.waitForTimeout(300);

  await page.locator('button', { hasText: 'Try Citizen Demo' }).click();
  await page.waitForTimeout(300);

  const isCitizenDashboardVisible = await page.locator('span', { hasText: 'Citizen Demo Mode' }).first().isVisible();
  console.log('2. Navigated to Citizen Dashboard:', isCitizenDashboardVisible);

  // Click "Exit Demo Mode" on Citizen Dashboard
  const exitDemoBtn = page.locator('button', { hasText: 'Exit Demo Mode' });
  console.log('   Exit Demo Mode button visible:', await exitDemoBtn.isVisible());
  await exitDemoBtn.click();
  await page.waitForTimeout(300);

  // Verify destination is Sign In Page
  const isSignInHeaderVisible = await page.locator('h1', { hasText: 'Sign in to PowerWatch' }).isVisible();
  const isCitizenTabVisible = await page.locator('button', { hasText: 'Citizen Account' }).isVisible();
  const isUtilityTabVisible = await page.locator('button', { hasText: 'Utility / Department' }).isVisible();

  console.log('3. Navigated directly to Sign In Page:');
  console.log('   - "Sign in to PowerWatch" header visible:', isSignInHeaderVisible);
  console.log('   - "Citizen Account" tab visible:', isCitizenTabVisible);
  console.log('   - "Utility / Department" tab visible:', isUtilityTabVisible);

  await browser.close();
  console.log('--- EXIT DEMO MODE NAVIGATION TEST COMPLETE ---');
})();
