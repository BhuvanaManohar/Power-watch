const { chromium } = require('playwright');

(async () => {
  console.log('--- STARTING DEV SERVER BROWSER TEST (http://localhost:5173) ---');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();

  page.on('console', msg => console.log('[BROWSER LOG]', msg.text()));
  page.on('pageerror', err => console.log('[BROWSER UNCAUGHT ERROR]', err.message));

  await page.goto('http://localhost:5173');
  console.log('1. Loaded http://localhost:5173');

  // Step A: Click Sign In from Header
  const signInHeaderBtn = page.locator('header button', { hasText: 'Sign In' });
  console.log('   Header Sign In button visible:', await signInHeaderBtn.isVisible());
  await signInHeaderBtn.click();
  await page.waitForTimeout(300);

  const isSignInVisible = await page.locator('h1', { hasText: 'Sign in to PowerWatch' }).isVisible();
  console.log('2. Navigated to Sign In screen:', isSignInVisible);

  // Step B: Click Create an account
  const createAccountBtn = page.locator('button', { hasText: 'Create an account' });
  console.log('   Create an account button visible:', await createAccountBtn.isVisible());

  await createAccountBtn.click();
  await page.waitForTimeout(500);

  const isSignUpVisible = await page.locator('h1', { hasText: 'Create a PowerWatch Account' }).isVisible();
  console.log('3. Navigated to Sign Up screen:', isSignUpVisible);

  await browser.close();
  console.log('--- TEST COMPLETE ---');
})();
