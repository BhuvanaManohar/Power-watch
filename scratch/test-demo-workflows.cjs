const { chromium } = require('playwright');

(async () => {
  console.log('--- STARTING DEMO WORKFLOW BROWSER TEST (http://localhost:4173) ---');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();

  page.on('console', msg => console.log('[BROWSER LOG]', msg.text()));
  page.on('pageerror', err => console.log('[BROWSER UNCAUGHT ERROR]', err.message));

  await page.goto('http://localhost:4173');
  console.log('1. Loaded http://localhost:4173');

  // Navigate to Sign In
  await page.locator('header button', { hasText: 'Sign In' }).click();
  await page.waitForTimeout(300);

  // Test Citizen Demo Navigation
  const citizenDemoBtn = page.locator('button', { hasText: 'Try Citizen Demo' });
  console.log('   Try Citizen Demo button visible:', await citizenDemoBtn.isVisible());
  await citizenDemoBtn.click();
  await page.waitForTimeout(300);

  const isCitizenDashboardVisible = await page.locator('p', { hasText: 'You are currently in Citizen Demo Mode' }).isVisible();
  console.log('2. Navigated to Citizen Dashboard:', isCitizenDashboardVisible);

  // Exit Citizen Demo
  await page.locator('button', { hasText: 'Exit Demo Mode' }).click();
  await page.waitForTimeout(300);

  // Re-enter Sign In -> Utility Tab -> Department Demo
  await page.locator('header button', { hasText: 'Sign In' }).click();
  await page.waitForTimeout(300);

  await page.locator('button', { hasText: 'Utility / Department' }).click();
  await page.waitForTimeout(200);

  const isCredentialsBannerVisible = await page.locator('span', { hasText: 'officer.demo@powerwatch.app' }).isVisible();
  console.log('   Department Demo Credentials Banner visible:', isCredentialsBannerVisible);

  const deptDemoBtn = page.locator('button', { hasText: 'Try Department Demo' });
  console.log('   Try Department Demo button visible:', await deptDemoBtn.isVisible());
  await deptDemoBtn.click();
  await page.waitForTimeout(300);

  const isDeptDashboardVisible = await page.locator('p', { hasText: 'You are currently in Department Officer Demo Mode' }).isVisible();
  console.log('3. Navigated to Department Officer Dashboard:', isDeptDashboardVisible);

  await browser.close();
  console.log('--- TEST COMPLETE ---');
})();
