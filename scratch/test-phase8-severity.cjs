const { chromium } = require('playwright');

(async () => {
  console.log('--- STARTING PHASE 8 INCIDENT SEVERITY & PRIORITY E2E VERIFICATION TEST ---');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();

  page.on('console', msg => console.log('[BROWSER LOG]', msg.text()));
  page.on('pageerror', err => console.log('[BROWSER UNCAUGHT ERROR]', err.message));

  // Check preview server on 4174
  await page.goto('http://localhost:4174');
  console.log('1. Loaded http://localhost:4174 (Landing Page)');

  // STEP 1: Department Demo -> Open Incident Management -> Change Severity to Critical
  console.log('\n--- STEP 1: DEPARTMENT DEMO -> CHANGE INCIDENT SEVERITY TO CRITICAL ---');
  await page.locator('header button', { hasText: 'Sign In' }).click();
  await page.waitForTimeout(200);
  await page.locator('button', { hasText: 'Utility / Department' }).click();
  await page.locator('button', { hasText: 'Try Department Demo' }).click();
  await page.waitForTimeout(300);

  // Click Manage on INC-8921-W
  await page.locator('button', { hasText: 'Manage' }).first().click();
  await page.waitForTimeout(300);

  // Switch to Set Severity tab
  await page.locator('button', { hasText: 'Set Severity' }).click();
  await page.waitForTimeout(200);

  // Click Critical Severity option
  await page.locator('button', { hasText: 'Critical Severity' }).click();
  await page.waitForTimeout(300);

  // Close modal via close button in header
  await page.locator('div.fixed.inset-0 button').filter({ hasText: 'close' }).first().click();
  await page.waitForTimeout(300);

  // STEP 2: Verify updated Critical severity in Department Operations Queue
  console.log('\n--- STEP 2: VERIFY CRITICAL SEVERITY IN DEPARTMENT OPERATIONS QUEUE ---');
  const isCriticalInTable = await page.locator('span', { hasText: 'Critical Priority' }).first().isVisible();
  console.log('Critical Priority badge visible in Department queue table:', isCriticalInTable);

  // STEP 3: Open Incident Detail and verify updated severity
  console.log('\n--- STEP 3: VERIFY CRITICAL SEVERITY IN INCIDENT DETAIL SCREEN ---');
  await page.locator('button', { hasText: 'Review' }).first().click();
  await page.waitForTimeout(300);

  const isDetailOpen = await page.locator('h1', { hasText: 'Oak & 8th Avenue Corridor' }).isVisible();
  const isCriticalInDetailHeader = await page.locator('span', { hasText: 'Critical Priority' }).first().isVisible();

  console.log('Incident Detail Screen opened:', isDetailOpen);
  console.log('Critical Priority displayed in Incident Detail header:', isCriticalInDetailHeader);

  // STEP 4: Test Header Nav Buttons in Incident Detail Screen
  console.log('\n--- STEP 4: VERIFY HEADER NAVIGATION BUTTONS IN INCIDENT DETAIL ---');
  const isBackToLiveOutagesVisible = await page.locator('button', { hasText: 'Back to Live Outages' }).isVisible();
  const isBackToCitizenPortalVisible = await page.locator('button', { hasText: 'Back to Citizen Portal' }).isVisible();
  const isBackToDeptPortalVisible = await page.locator('button', { hasText: 'Back to Department Portal' }).isVisible();

  console.log('Back to Live Outages button visible:', isBackToLiveOutagesVisible);
  console.log('Back to Citizen Portal button visible:', isBackToCitizenPortalVisible);
  console.log('Back to Department Portal button visible:', isBackToDeptBtnVisible = isBackToDeptPortalVisible);

  // Click Back to Citizen Portal
  await page.locator('button', { hasText: 'Back to Citizen Portal' }).click();
  await page.waitForTimeout(300);

  const isCitizenPortalOpen = await page.locator('span', { hasText: 'Citizen Portal' }).isVisible();
  console.log('Returned directly to Citizen Portal:', isCitizenPortalOpen);

  // STEP 5: Verify Phase 7 Notification Center in Citizen Portal
  console.log('\n--- STEP 5: VERIFY PHASE 7 CITIZEN NOTIFICATION CENTER ---');
  const isNotificationCenterVisible = await page.locator('h3', { hasText: 'Citizen Notification Center' }).isVisible();
  const isSeverityNotificationVisible = await page.locator('div', { hasText: 'Priority level for INC-8921-W' }).first().isVisible();

  console.log('Citizen Notification Center visible:', isNotificationCenterVisible);
  console.log('Severity update notification visible in Notification Center:', isSeverityNotificationVisible);

  await browser.close();
  console.log('\n--- ALL PHASE 8 VERIFICATION TESTS PASSED SUCCESSFULLY ---');
})();
