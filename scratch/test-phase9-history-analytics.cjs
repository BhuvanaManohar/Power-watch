const { chromium } = require('playwright');

(async () => {
  console.log('Launching msedge browser for E2E Phase 9 Outage History & Analytics test...');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. Load preview server
    await page.goto('http://localhost:4174/', { waitUntil: 'domcontentloaded' });
    console.log('✔ Landing page loaded');

    // 2. Click "Outage History" nav link in Header
    await page.click('text=Outage History');
    await page.waitForTimeout(500);

    const titleText = await page.innerText('h1');
    console.log('✔ Navigated to Outage History Screen. Header text:', titleText);

    // 2b. Verify header nav items (e.g. Home) switch screen back to landing without refresh
    await page.click('header nav a:has-text("Home")');
    await page.waitForTimeout(500);
    const heroTitle = await page.innerText('main h1');
    console.log('✔ Navigated back to Home from Outage History via Header. Hero title:', heroTitle);

    // Re-enter Outage History for remaining tests
    await page.click('text=Outage History');
    await page.waitForTimeout(500);

    // 3. Verify Citizen Analytics cards render numbers
    const totalIncidentsText = await page.innerText('text=Total Logged Incidents');
    console.log('✔ Citizen Analytics present:', totalIncidentsText);

    // 4. Test Filters
    // Change area select to "South Industrial Grid"
    const areaSelect = page.locator('select').nth(1);
    await areaSelect.selectOption('south');
    await page.waitForTimeout(300);

    const tableRowsCount = await page.locator('tbody tr').count();
    console.log('✔ Area filter applied. Matching records count:', tableRowsCount);

    // Click "Reset Filters"
    await page.click('text=Reset Filters');
    await page.waitForTimeout(300);
    const resetRowsCount = await page.locator('tbody tr').count();
    console.log('✔ Reset filters clicked. Records reset to:', resetRowsCount);

    // 5. Test "View Details" action from Outage History
    const viewDetailsBtn = page.locator('tbody tr button:has-text("View Details")').first();
    await viewDetailsBtn.click();
    await page.waitForTimeout(500);

    const incidentHeader = await page.innerText('h1');
    console.log('✔ Incident Detail opened from Outage History:', incidentHeader);

    // Test Back button returns to Outage History
    await page.click('button:has-text("Back to Live Outages")');
    await page.waitForTimeout(500);
    const backTitleText = await page.innerText('h1');
    console.log('✔ Back button returned to:', backTitleText);

    // 6. Verify Department Portal integration
    await page.click('header button:has-text("Sign In")');
    await page.waitForTimeout(300);
    await page.click('button:has-text("Utility / Department")');
    await page.waitForTimeout(300);
    await page.click('button:has-text("Try Department Demo")');
    await page.waitForTimeout(500);

    const analyticsSummary = await page.innerText('text=Historical System Performance Summary');
    console.log('✔ Department Portal opened with Historical Performance Summary present.');


    console.log('\n--- ALL PHASE 9 VERIFICATION TESTS PASSED SUCCESSFULLY! ---');

  } catch (err) {
    console.error('❌ E2E Test Failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
