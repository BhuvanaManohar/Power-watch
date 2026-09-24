const { chromium } = require('playwright');

(async () => {
  console.log('--- TESTING CITIZEN UPDATE NOTIFICATION PROPAGATION ---');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();

  page.on('console', msg => console.log('[BROWSER LOG]', msg.text()));
  page.on('pageerror', err => console.log('[BROWSER UNCAUGHT ERROR]', err.message));

  await page.goto('http://localhost:4174');
  console.log('1. Loaded http://localhost:4174');

  // STEP 1: Department Demo -> Manage Incident -> Publish Citizen Update "safety was good"
  console.log('\n--- STEP 1: PUBLISH CITIZEN UPDATE "safety was good" ---');
  await page.locator('header button', { hasText: 'Sign In' }).click();
  await page.waitForTimeout(200);
  await page.locator('button', { hasText: 'Utility / Department' }).click();
  await page.locator('button', { hasText: 'Try Department Demo' }).click();
  await page.waitForTimeout(300);

  // Manage INC-8921-W
  await page.locator('button', { hasText: 'Manage' }).first().click();
  await page.waitForTimeout(300);

  // Switch to Publish Citizen Update tab
  await page.locator('button', { hasText: 'Publish Citizen Update' }).click();
  await page.waitForTimeout(200);

  // Fill in "safety was good"
  await page.locator('select').selectOption('Status Update');
  await page.locator('input[placeholder="e.g. Feeder line isolated & replacement transformer en route"]').fill('safety was good');
  await page.locator('textarea').fill('safety was good');
  
  await page.locator('button', { hasText: 'Publish Citizen-Facing Update' }).click();
  await page.waitForTimeout(300);

  // Close modal via close button in header
  await page.locator('div.fixed.inset-0 button').filter({ hasText: 'close' }).first().click();
  await page.waitForTimeout(400);

  // STEP 2: Verify update appears in Incident Detail Screen
  console.log('\n--- STEP 2: VERIFY "safety was good" IN INCIDENT DETAIL SCREEN ---');
  await page.locator('button', { hasText: 'Review' }).first().click();
  await page.waitForTimeout(300);

  const isPublishedUpdateInDetail = await page.locator('div', { hasText: 'safety was good' }).first().isVisible();
  console.log('"safety was good" visible in Incident Detail Screen:', isPublishedUpdateInDetail);

  // Navigate Back to Department Portal
  await page.locator('button', { hasText: 'Back to Department Portal' }).click();
  await page.waitForTimeout(300);

  // STEP 3: Switch to Citizen Demo & Verify Notification Center
  console.log('\n--- STEP 3: VERIFY "safety was good" IN CITIZEN NOTIFICATION CENTER ---');
  await page.locator('button', { hasText: 'Exit Demo Mode' }).click();
  await page.waitForTimeout(200);
  await page.locator('button', { hasText: 'Try Citizen Demo' }).click();
  await page.waitForTimeout(300);

  const isNotificationCenterVisible = await page.locator('h3', { hasText: 'Citizen Notification Center' }).isVisible();
  const isSafetyWasGoodNotifVisible = await page.locator('div', { hasText: 'safety was good' }).first().isVisible();
  
  console.log('Citizen Notification Center visible:', isNotificationCenterVisible);
  console.log('"safety was good" notification visible in Notification Center:', isSafetyWasGoodNotifVisible);

  // Check unread count
  const unreadButtonText = await page.locator('button', { hasText: 'Unread' }).textContent();
  console.log('Unread button text in Notification Center:', unreadButtonText);

  await browser.close();
  console.log('\n--- NOTIFICATION PROPAGATION VERIFICATION COMPLETE ---');
})();
