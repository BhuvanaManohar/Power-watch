const { chromium } = require('playwright');

(async () => {
  console.log('--- STARTING FOUNDATION & NAVIGATION VERIFICATION TEST ---');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();

  page.on('console', msg => console.log('[BROWSER LOG]', msg.text()));
  page.on('pageerror', err => console.log('[BROWSER UNCAUGHT ERROR]', err.message));

  await page.goto('http://localhost:4174');
  console.log('1. Loaded http://localhost:4174 (Landing Page)');

  // TEST FLOW 1: Landing -> Sign In -> Citizen Demo -> Exit -> Sign In
  console.log('\n--- TESTING CITIZEN DEMO FLOW ---');
  await page.locator('header button', { hasText: 'Sign In' }).click();
  await page.waitForTimeout(300);

  await page.locator('button', { hasText: 'Try Citizen Demo' }).click();
  await page.waitForTimeout(300);

  const isCitizenHeaderVisible = await page.locator('span', { hasText: 'Citizen Portal' }).isVisible();
  console.log('Citizen Portal header visible:', isCitizenHeaderVisible);

  await page.locator('button', { hasText: 'Exit Demo Mode' }).click();
  await page.waitForTimeout(300);

  const isSignInAfterCitizenExit = await page.locator('h1', { hasText: 'Sign in to PowerWatch' }).isVisible();
  console.log('Returned to Sign In after Citizen exit:', isSignInAfterCitizenExit);

  // TEST 1: Landing -> View Live Outages -> Live Outages Map
  console.log('\n--- TEST 1: LANDING -> LIVE OUTAGES ---');
  await page.goto('http://localhost:4174');
  await page.waitForTimeout(300);

  await page.locator('header a[href="#map-monitor"]').first().click();
  await page.waitForTimeout(300);
  const isMapOnLanding = await page.locator('h2', { hasText: 'Live Outages' }).isVisible();
  console.log('Live Outages section visible on Landing:', isMapOnLanding);

  // TEST 2: Citizen Demo -> View Live Outages -> Live Outages Map (NOT Sign In!)
  console.log('\n--- TEST 2: CITIZEN DEMO -> VIEW OUTAGE MAP ---');
  await page.locator('header button', { hasText: 'Sign In' }).click();
  await page.waitForTimeout(200);
  await page.locator('button', { hasText: 'Try Citizen Demo' }).click();
  await page.waitForTimeout(300);

  await page.locator('button', { hasText: 'View Outage Map' }).click();
  await page.waitForTimeout(400);

  const isMapFromCitizen = await page.locator('h2', { hasText: 'Live Outages' }).isVisible();
  const isNotSignInFromCitizen = !(await page.locator('h1', { hasText: 'Sign in to PowerWatch' }).isVisible());
  console.log('Opened Live Outages from Citizen Demo:', isMapFromCitizen);
  console.log('Did NOT redirect to Sign In:', isNotSignInFromCitizen);

  // TEST 3: Department Demo -> View Live Outages -> Live Outages Map
  console.log('\n--- TEST 3: DEPARTMENT DEMO -> VIEW OUTAGE MAP ---');
  await page.locator('header button', { hasText: 'Sign In' }).click();
  await page.waitForTimeout(200);
  await page.locator('button', { hasText: 'Utility / Department' }).click();
  await page.locator('button', { hasText: 'Try Department Demo' }).click();
  await page.waitForTimeout(300);

  await page.locator('button', { hasText: 'View Outage Map' }).first().click();
  await page.waitForTimeout(400);

  const isMapFromDept = await page.locator('h2', { hasText: 'Live Outages' }).isVisible();
  console.log('Opened Live Outages from Department Demo:', isMapFromDept);

  // TEST 4: Report Grouping & Incident Linking -> View Incident -> Incident Detail
  console.log('\n--- TEST 4: REPORT GROUPING & INCIDENT LINKING FLOW ---');
  await page.locator('header button', { hasText: 'Sign In' }).click();
  await page.waitForTimeout(200);
  await page.locator('button', { hasText: 'Utility / Department' }).click();
  await page.locator('button', { hasText: 'Try Department Demo' }).click();
  await page.waitForTimeout(300);

  await page.locator('button', { hasText: 'Group Notices' }).first().click();
  await page.waitForTimeout(300);

  const isGroupingHeaderVisible = await page.locator('h1', { hasText: 'Citizen Notice Triage' }).isVisible();
  const isPossibleMatchVisible = await page.locator('h2', { hasText: 'Possible Incident Match' }).isVisible();
  console.log('Report Grouping Screen opened:', isGroupingHeaderVisible);
  console.log('Possible Incident Match card visible:', isPossibleMatchVisible);

  // Click Confirm & Link Reports
  await page.locator('button', { hasText: 'Confirm & Link Reports' }).click();
  await page.waitForTimeout(300);

  const isReportsLinkedBannerVisible = await page.locator('div', { hasText: 'Reports Successfully Linked' }).first().isVisible();
  console.log('Reports successfully linked:', isReportsLinkedBannerVisible);

  // Click View Incident
  await page.locator('button', { hasText: 'View Incident' }).click();
  await page.waitForTimeout(300);

  const isDetailScreenFromGrouping = await page.locator('h1', { hasText: 'Oak & 8th Avenue Corridor' }).isVisible();
  console.log('View Incident opened Phase 3 Incident Detail Screen:', isDetailScreenFromGrouping);

  // TEST 6: Phase 6 Department Operations & Incident Management Flow
  console.log('\n--- TEST 6: PHASE 6 DEPARTMENT OPERATIONS FLOW ---');
  await page.goto('http://localhost:4174');
  await page.waitForTimeout(300);

  // Navigate: Landing -> Sign In -> Department Demo -> Operations Center
  await page.locator('header button', { hasText: 'Sign In' }).click();
  await page.waitForTimeout(200);
  await page.locator('button', { hasText: 'Utility / Department' }).click();
  await page.locator('button', { hasText: 'Try Department Demo' }).click();
  await page.waitForTimeout(300);

  const isOpsBannerVisible = await page.locator('div', { hasText: 'Department Officer Operations Center' }).first().isVisible();
  console.log('1. Department Operations Center loaded:', isOpsBannerVisible);

  // Click Manage on INC-8921-W
  const manageBtn = page.locator('button', { hasText: 'Manage' }).first();
  console.log('Manage button visible:', await manageBtn.isVisible());
  await manageBtn.click();
  await page.waitForTimeout(300);

  const isModalTitleVisible = await page.locator('span', { hasText: 'INC-8921-W' }).first().isVisible();
  console.log('2. Incident Management Modal opened for INC-8921-W:', isModalTitleVisible);

  // Tab 1: Advance status to Restoration in Progress
  await page.locator('button', { hasText: '4. Restoration in Progress' }).click();
  await page.waitForTimeout(200);

  // Tab 2: Assign Crew
  await page.locator('button', { hasText: 'Assign Crew' }).click();
  await page.waitForTimeout(100);
  await page.locator('input[value="crew-8"]').click();
  await page.locator('button', { hasText: 'Confirm Crew Dispatch' }).click();
  await page.waitForTimeout(200);

  // Tab 3: Update ETR
  await page.locator('button', { hasText: 'Update ETR' }).click();
  await page.waitForTimeout(100);
  await page.locator('input[placeholder="e.g. Est. 3:00 PM Today (120 households affected)"]').fill('Est. 3:30 PM Today');
  await page.locator('button', { hasText: 'Save & Publish Updated ETR' }).click();
  await page.waitForTimeout(200);

  // Tab 4: Publish Log
  await page.locator('button', { hasText: 'Publish Log' }).click();
  await page.waitForTimeout(100);
  await page.locator('input[placeholder="e.g. Field crew dispatched and restoration work in progress"]').fill('Field crew dispatched and restoration work is in progress.');
  await page.locator('textarea').fill('Feeder line isolated; switchgear replacement active.');
  await page.locator('button', { hasText: 'Publish Log to Incident Record' }).click();
  await page.waitForTimeout(200);

  // Mark Power Restored
  await page.locator('button', { hasText: 'Lifecycle Flow' }).click();
  await page.waitForTimeout(100);
  await page.locator('button', { hasText: 'Power Restored' }).click();
  await page.waitForTimeout(200);

  // Close Modal
  await page.locator('button', { hasText: 'Done' }).click();
  await page.waitForTimeout(300);

  // TEST 7: Live Outages -> View Incident -> Incident Detail -> Back to Live Outages
  console.log('\n--- TEST 7: INCIDENT DETAIL BACK TO LIVE OUTAGES NAVIGATION ---');
  await page.goto('http://localhost:4174');
  await page.waitForTimeout(300);

  // Click View Incident on Live Outages
  await page.locator('button', { hasText: 'View incident' }).first().click();
  await page.waitForTimeout(300);

  const isDetailOpen = await page.locator('h1', { hasText: 'Oak & 8th Avenue Corridor' }).isVisible();
  console.log('Incident Detail screen opened:', isDetailOpen);

  await page.locator('button', { hasText: 'Back to Live Outages' }).click();
  await page.waitForTimeout(400);

  const isBackToMapVisible = await page.locator('h2', { hasText: 'Live Outages' }).isVisible();
  console.log('Returned to Live Outages section (NOT top of Landing page):', isBackToMapVisible);

  // TEST 8: Department Operations -> Review Incident -> Back to Department Portal
  console.log('\n--- TEST 8: BACK TO DEPARTMENT PORTAL NAVIGATION ---');
  await page.locator('header button', { hasText: 'Sign In' }).click();
  await page.waitForTimeout(200);
  await page.locator('button', { hasText: 'Utility / Department' }).click();
  await page.locator('button', { hasText: 'Try Department Demo' }).click();
  await page.waitForTimeout(300);

  await page.locator('button', { hasText: 'Review' }).first().click();
  await page.waitForTimeout(300);

  const isDetailOpenFromDept = await page.locator('h1', { hasText: 'Oak & 8th Avenue Corridor' }).isVisible();
  const isBackToDeptBtnVisible = await page.locator('button', { hasText: 'Back to Department Portal' }).isVisible();
  console.log('Incident Detail opened from Dept Portal:', isDetailOpenFromDept);
  console.log('Back to Department Portal button visible:', isBackToDeptBtnVisible);

  await page.locator('button', { hasText: 'Back to Department Portal' }).click();
  await page.waitForTimeout(300);

  const isReturnedToDeptPortal = await page.locator('div', { hasText: 'Department Officer Operations Center' }).first().isVisible();
  console.log('Returned to Department Officer Operations Center:', isReturnedToDeptPortal);

  await browser.close();
  console.log('\n--- ALL NAVIGATION & FOUNDATION TESTS COMPLETE ---');
})();
