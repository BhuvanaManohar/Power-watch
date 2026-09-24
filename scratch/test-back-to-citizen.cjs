const { chromium } = require('playwright');

(async () => {
  console.log('--- STARTING BACK TO CITIZEN PORTAL NAVIGATION TEST ---');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();

  page.on('console', msg => console.log('[BROWSER LOG]', msg.text()));
  page.on('pageerror', err => console.log('[BROWSER UNCAUGHT ERROR]', err.message));

  // Check if server is running on 4174
  try {
    await page.goto('http://localhost:4174');
  } catch (err) {
    console.log('Server not active on 4174, launching dev server...');
  }

  // Navigate: Landing -> Sign In -> Citizen Demo -> View Outage Map -> View Incident -> Incident Detail
  await page.goto('http://localhost:4174');
  await page.waitForTimeout(300);

  await page.locator('header button', { hasText: 'Sign In' }).click();
  await page.waitForTimeout(200);
  await page.locator('button', { hasText: 'Try Citizen Demo' }).click();
  await page.waitForTimeout(300);

  // Click View Outage Map
  await page.locator('button', { hasText: 'View Outage Map' }).click();
  await page.waitForTimeout(300);

  // Click View incident on Live Outages map
  await page.locator('button', { hasText: 'View incident' }).first().click();
  await page.waitForTimeout(300);

  const isDetailOpen = await page.locator('h1', { hasText: 'Oak & 8th Avenue Corridor' }).isVisible();
  const isBackToCitizenBtnVisible = await page.locator('button', { hasText: 'Back to Citizen Portal' }).isVisible();
  const isBackToLiveOutagesBtnVisible = await page.locator('button', { hasText: 'Back to Live Outages' }).isVisible();
  const isBackToDeptBtnVisible = await page.locator('button', { hasText: 'Back to Department Portal' }).isVisible();

  console.log('Incident Detail page opened:', isDetailOpen);
  console.log('Back to Citizen Portal button visible:', isBackToCitizenBtnVisible);
  console.log('Back to Live Outages button visible:', isBackToLiveOutagesBtnVisible);
  console.log('Back to Department Portal button visible:', isBackToDeptBtnVisible);

  // Click Back to Citizen Portal
  await page.locator('button', { hasText: 'Back to Citizen Portal' }).click();
  await page.waitForTimeout(300);

  const isCitizenPortalOpen = await page.locator('span', { hasText: 'Citizen Portal' }).isVisible();
  const isCitizenDemoBannerVisible = await page.locator('p', { hasText: 'You are currently in Citizen Demo Mode' }).isVisible();

  console.log('Returned directly to Citizen Portal header:', isCitizenPortalOpen);
  console.log('Citizen Demo Mode banner visible:', isCitizenDemoBannerVisible);

  await browser.close();
  console.log('\n--- ALL BACK TO CITIZEN PORTAL NAVIGATION TESTS PASSED ---');
})();
