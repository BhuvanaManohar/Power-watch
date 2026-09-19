const { chromium } = require('playwright');

(async () => {
  console.log('--- STARTING OFFICER VERIFICATION BROWSER TEST (http://localhost:4174) ---');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();

  page.on('console', msg => console.log('[BROWSER LOG]', msg.text()));
  page.on('pageerror', err => console.log('[BROWSER UNCAUGHT ERROR]', err.message));

  await page.goto('http://localhost:4174');
  console.log('1. Loaded http://localhost:4174');

  // Navigate to Sign In -> Utility Tab
  await page.locator('header button', { hasText: 'Sign In' }).click();
  await page.waitForTimeout(300);

  await page.locator('button', { hasText: 'Utility / Department' }).click();
  await page.waitForTimeout(200);

  const isVerificationHeaderVisible = await page.locator('span', { hasText: 'Officer Identity Verification' }).isVisible();
  console.log('2. Officer Verification Section visible:', isVerificationHeaderVisible);

  // Click Verify Officer
  const verifyBtn = page.locator('button', { hasText: 'Verify Officer' });
  console.log('   Verify Officer button visible:', await verifyBtn.isVisible());
  await verifyBtn.click();
  await page.waitForTimeout(300);

  const isOfficerVerifiedCardVisible = await page.locator('span', { hasText: 'Officer Verified' }).isVisible();
  const isEmployeeIdVisible = await page.locator('strong', { hasText: 'EMP-84920' }).isVisible();
  const isOfficerNameVisible = await page.locator('strong', { hasText: 'Officer Rajesh Kumar' }).isVisible();

  console.log('3. Verification Result Card displayed:', isOfficerVerifiedCardVisible);
  console.log('   Officer Name visible:', isOfficerNameVisible);
  console.log('   Employee ID visible:', isEmployeeIdVisible);

  // Test Department Demo button still works
  const deptDemoBtn = page.locator('button', { hasText: 'Try Department Demo' });
  await deptDemoBtn.click();
  await page.waitForTimeout(300);

  const isDeptDashboardVisible = await page.locator('p', { hasText: 'You are currently in Department Officer Demo Mode' }).isVisible();
  console.log('4. Navigated to Department Officer Dashboard:', isDeptDashboardVisible);

  await browser.close();
  console.log('--- TEST COMPLETE ---');
})();
