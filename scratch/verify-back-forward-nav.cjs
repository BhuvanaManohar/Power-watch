const { chromium } = require('playwright');

(async () => {
  console.log('=== STARTING POWERWATCH BROWSER BACK/FORWARD VERIFICATION SUITE ===');
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => console.log('  [BROWSER CONSOLE]', msg.text()));
  page.on('pageerror', err => console.log('  [BROWSER ERROR]', err.message));

  try {
    // -------------------------------------------------------------
    // TEST 1: Fresh Tab - Clean History
    // -------------------------------------------------------------
    console.log('\n--- TEST 1: Clean Session & Initial State ---');
    await page.goto('http://localhost:4174/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(400);

    const initialTitle = await page.innerText('main h1');
    console.log('  Initial page title:', initialTitle);
    if (!initialTitle.includes('Power Outage')) {
      throw new Error(`Expected Landing title but got: ${initialTitle}`);
    }
    console.log('✔ Test 1 Passed: Loaded cleanly with no phantom history.');

    // -------------------------------------------------------------
    // TEST 2: Home -> Live Outages -> Browser Back -> Browser Forward
    // -------------------------------------------------------------
    console.log('\n--- TEST 2: Home -> Live Outages -> Back -> Forward ---');
    // Click Live Outages link in header
    await page.locator('header a[href="#map-monitor"]').first().click();
    await page.waitForTimeout(400);
    console.log('  URL after clicking Live Outages:', page.url());
    if (!page.url().includes('#map-monitor')) {
      throw new Error(`Expected URL to include #map-monitor, got ${page.url()}`);
    }

    // Click browser Back arrow
    await page.goBack();
    await page.waitForTimeout(400);
    console.log('  URL after browser Back:', page.url());
    // Verify scroll position is near top (Home)
    const scrollYAfterBack = await page.evaluate(() => window.scrollY);
    console.log('  Scroll position after Back to Home:', scrollYAfterBack);
    if (scrollYAfterBack > 200) {
      throw new Error(`Expected scroll position to be near top, got ${scrollYAfterBack}`);
    }

    // Click browser Forward arrow
    await page.goForward();
    await page.waitForTimeout(400);
    console.log('  URL after browser Forward:', page.url());
    if (!page.url().includes('#map-monitor')) {
      throw new Error(`Expected Forward URL to include #map-monitor, got ${page.url()}`);
    }
    console.log('✔ Test 2 Passed: Home <-> Live Outages browser Back and Forward work seamlessly.');

    // -------------------------------------------------------------
    // TEST 3: Live Outages -> Incident Detail -> Back -> Forward
    // -------------------------------------------------------------
    console.log('\n--- TEST 3: Live Outages -> Incident Detail -> Back -> Forward ---');
    // Click "View incident" for first incident (West District)
    await page.locator('button:has-text("View incident")').first().click();
    await page.waitForTimeout(500);
    console.log('  URL after clicking View Incident:', page.url());
    if (!page.url().includes('#incident/west-district')) {
      throw new Error(`Expected URL to include #incident/west-district, got ${page.url()}`);
    }

    const incidentTitle = await page.innerText('h1');
    console.log('  Incident Detail title:', incidentTitle);
    if (!incidentTitle.includes('Oak & 8th Avenue Corridor')) {
      throw new Error(`Expected West District incident, got ${incidentTitle}`);
    }

    // Click browser Back arrow
    await page.goBack();
    await page.waitForTimeout(500);
    console.log('  URL after browser Back from Incident:', page.url());
    if (!page.url().includes('#map-monitor')) {
      throw new Error(`Expected Back to return to #map-monitor, got ${page.url()}`);
    }
    const isLiveOutagesHeaderVisible = await page.locator('h2:has-text("Live Outages")').isVisible();
    console.log('  Live Outages section visible:', isLiveOutagesHeaderVisible);
    if (!isLiveOutagesHeaderVisible) {
      throw new Error('Expected Live Outages section to be visible after browser Back');
    }

    // Click browser Forward arrow
    await page.goForward();
    await page.waitForTimeout(500);
    console.log('  URL after browser Forward to Incident:', page.url());
    if (!page.url().includes('#incident/west-district')) {
      throw new Error(`Expected Forward to return to #incident/west-district, got ${page.url()}`);
    }
    console.log('✔ Test 3 Passed: Live Outages <-> Incident Detail Back/Forward work properly.');

    // -------------------------------------------------------------
    // TEST 4: Full Multi-Step Navigation Stack
    // Home -> Live Outages -> Incident Detail -> Back -> Back -> Forward -> Forward
    // -------------------------------------------------------------
    console.log('\n--- TEST 4: Home -> Live Outages -> Incident -> Back -> Back -> Forward -> Forward ---');
    // Start at Home
    await page.goto('http://localhost:4174/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);

    // Step 1: Click Live Outages
    await page.locator('header a[href="#map-monitor"]').first().click();
    await page.waitForTimeout(300);

    // Step 2: Click Incident Detail
    await page.locator('button:has-text("View incident")').first().click();
    await page.waitForTimeout(400);
    console.log('  Step 2 (Incident Detail) URL:', page.url());

    // Back 1: Should return to Live Outages
    await page.goBack();
    await page.waitForTimeout(400);
    console.log('  Back 1 URL (Expected #map-monitor):', page.url());
    if (!page.url().includes('#map-monitor')) {
      throw new Error(`Back 1 failed: Expected #map-monitor, got ${page.url()}`);
    }

    // Back 2: Should return to Home
    await page.goBack();
    await page.waitForTimeout(400);
    console.log('  Back 2 URL (Expected Home):', page.url());
    const isHomeHeroVisible = await page.locator('h1:has-text("Community Power Outage Reporting")').isVisible();
    if (!isHomeHeroVisible) {
      throw new Error('Back 2 failed: Home hero was not visible');
    }

    // Forward 1: Should advance to Live Outages
    await page.goForward();
    await page.waitForTimeout(400);
    console.log('  Forward 1 URL (Expected #map-monitor):', page.url());
    if (!page.url().includes('#map-monitor')) {
      throw new Error(`Forward 1 failed: Expected #map-monitor, got ${page.url()}`);
    }

    // Forward 2: Should advance to Incident Detail
    await page.goForward();
    await page.waitForTimeout(400);
    console.log('  Forward 2 URL (Expected #incident/west-district):', page.url());
    if (!page.url().includes('#incident/west-district')) {
      throw new Error(`Forward 2 failed: Expected #incident/west-district, got ${page.url()}`);
    }
    console.log('✔ Test 4 Passed: Full multi-step back/back/forward/forward sequence verified!');

    // -------------------------------------------------------------
    // TEST 5: Direct URL Opening & Refresh Edge Cases
    // -------------------------------------------------------------
    console.log('\n--- TEST 5: Direct URL Loading & Page Refresh ---');
    // Direct load North Crestview incident
    await page.goto('http://localhost:4174/#incident/north-crestview', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(400);
    const ncTitle = await page.innerText('h1');
    console.log('  Direct load incident title:', ncTitle);
    if (!ncTitle.includes('North Crestview')) {
      throw new Error(`Expected North Crestview incident, got: ${ncTitle}`);
    }

    // Refresh page while on incident
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(400);
    const ncTitleAfterRefresh = await page.innerText('h1');
    console.log('  Incident title after refresh:', ncTitleAfterRefresh);
    if (!ncTitleAfterRefresh.includes('North Crestview')) {
      throw new Error(`Expected North Crestview after refresh, got: ${ncTitleAfterRefresh}`);
    }

    // Direct load Outage History
    await page.goto('http://localhost:4174/#outage-history', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(400);
    const historyTitle = await page.innerText('main h1');
    console.log('  Direct load Outage History title:', historyTitle);
    if (!historyTitle.includes('Outage History')) {
      throw new Error(`Expected Outage History screen, got: ${historyTitle}`);
    }

    // Direct load Sign In
    await page.goto('http://localhost:4174/#signin', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(400);
    const signInTitle = await page.innerText('main h1');
    console.log('  Direct load Sign In title:', signInTitle);
    if (!signInTitle.includes('Sign in')) {
      throw new Error(`Expected Sign In screen, got: ${signInTitle}`);
    }
    console.log('✔ Test 5 Passed: Direct loads and page refreshes work reliably across routes.');

    // -------------------------------------------------------------
    // TEST 6: Sign In -> Sign Up -> Back -> Forward
    // -------------------------------------------------------------
    console.log('\n--- TEST 6: Sign In -> Sign Up -> Back -> Forward ---');
    await page.goto('http://localhost:4174/#signin', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);

    // Click "Create an account"
    await page.locator('button:has-text("Create an account")').click();
    await page.waitForTimeout(400);
    console.log('  URL on Sign Up:', page.url());
    if (!page.url().includes('#signup')) {
      throw new Error(`Expected #signup, got ${page.url()}`);
    }

    // Browser Back
    await page.goBack();
    await page.waitForTimeout(400);
    console.log('  URL after Back from Sign Up:', page.url());
    if (!page.url().includes('#signin')) {
      throw new Error(`Expected #signin, got ${page.url()}`);
    }

    // Browser Forward
    await page.goForward();
    await page.waitForTimeout(400);
    console.log('  URL after Forward to Sign Up:', page.url());
    if (!page.url().includes('#signup')) {
      throw new Error(`Expected #signup, got ${page.url()}`);
    }
    console.log('✔ Test 6 Passed: Auth screens respect native Back/Forward.');

    // -------------------------------------------------------------
    // TEST 7: On-Screen Back Button vs Native Back Interop
    // -------------------------------------------------------------
    console.log('\n--- TEST 7: On-screen "Back to Live Outages" Button Interop ---');
    await page.goto('http://localhost:4174/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);

    // Navigate to Live Outages then Incident
    await page.locator('header a[href="#map-monitor"]').first().click();
    await page.waitForTimeout(300);
    await page.locator('button:has-text("View incident")').first().click();
    await page.waitForTimeout(400);
    console.log('  URL on Incident Detail:', page.url());

    // 1. Click on-screen "Back to Live Outages" and confirm URL is #map-monitor
    await page.locator('button:has-text("Back to Live Outages")').click();
    await page.waitForTimeout(400);
    console.log('  URL after clicking on-screen Back to Live Outages:', page.url());
    if (!page.url().includes('#map-monitor')) {
      throw new Error(`Expected #map-monitor after on-screen button click, got ${page.url()}`);
    }

    // 2. Use browser Back and confirm the incident route is restored
    await page.goBack();
    await page.waitForTimeout(400);
    console.log('  URL after native browser Back:', page.url());
    if (!page.url().includes('#incident/west-district')) {
      throw new Error(`Expected #incident/west-district after browser Back, got ${page.url()}`);
    }

    // 3. Use browser Forward and confirm the URL returns to #map-monitor
    await page.goForward();
    await page.waitForTimeout(400);
    console.log('  URL after native browser Forward:', page.url());
    if (!page.url().includes('#map-monitor')) {
      throw new Error(`Expected #map-monitor after browser Forward, got ${page.url()}`);
    }
    console.log('✔ Test 7 Passed: On-screen "Back to Live Outages" button navigates to #map-monitor, and browser Back/Forward traversals restore incident and live-outages routes correctly.');

    console.log('\n======================================================');
    console.log('🎉 ALL BROWSER BACK/FORWARD NAVIGATION TESTS PASSED! 🎉');
    console.log('======================================================\n');
  } catch (err) {
    console.error('\n❌ TEST FAILED:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
