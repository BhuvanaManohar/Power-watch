const { chromium } = require('playwright');

async function runTests() {
  console.log('--- Starting PowerWatch Phase 6 Locations + Incidents Tests ---');
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => console.log('  [CONSOLE]', msg.text()));
  page.on('pageerror', err => console.log('  [PAGE ERROR]', err.message));

  const baseUrl = 'http://localhost:5173';
  let passedCount = 0;
  let totalCount = 0;

  function assert(condition, testName) {
    totalCount++;
    if (condition) {
      console.log(`  ✔ [PASS] ${testName}`);
      passedCount++;
    } else {
      console.error(`  ✖ [FAIL] ${testName}`);
    }
  }

  try {
    // -------------------------------------------------------------
    // Test 1: Real Backend Live Empty State (Current database has 0 incidents)
    // -------------------------------------------------------------
    console.log('\n[Test 1] Real backend connection (empty DB state)');
    await page.goto(`${baseUrl}/#map-monitor`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const emptyTitle = await page.locator('text=No active outages reported').first();
    const emptyMsg = await page.locator('text=All monitored municipal grid sectors are currently operating normally.').first();
    assert((await emptyTitle.count()) > 0, 'Displays "No active outages reported" empty state');
    assert((await emptyMsg.count()) > 0, 'Displays empty state description');

    const activeAreas = await page.locator('text=0 Active Areas').first();
    const underInvest = await page.locator('text=0 Under Investigation').first();
    const inProgress = await page.locator('text=0 Restoration in Progress').first();
    assert((await activeAreas.count()) > 0, 'Metric shows 0 Active Areas');
    assert((await underInvest.count()) > 0, 'Metric shows 0 Under Investigation');
    assert((await inProgress.count()) > 0, 'Metric shows 0 Restoration in Progress');

    // -------------------------------------------------------------
    // Test 2: Live Backend Incidents Integration & Adaptation
    // -------------------------------------------------------------
    console.log('\n[Test 2] Live incidents list and detail adaptation with UUIDs');
    const mockLocationId1 = '87a11111-2222-3333-4444-555555555555';
    const mockLocationId2 = '87a22222-3333-4444-5555-666666666666';
    const mockIncidentId1 = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    const mockIncidentId2 = 'a12bc34d-56ef-78ab-90cd-ef1234567890';

    const mockLocations = [
      {
        id: mockLocationId1,
        name: 'Sector 4 East Substation Feeder',
        address: '400 Main Street',
        latitude: 17.385044,
        longitude: 78.486671,
        created_at: new Date(Date.now() - 3600000).toISOString(),
        updated_at: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: mockLocationId2,
        name: 'Metro Industrial Corridor B',
        address: 'Industrial Ave Block 9',
        latitude: 17.395044,
        longitude: 78.496671,
        created_at: new Date(Date.now() - 7200000).toISOString(),
        updated_at: new Date(Date.now() - 7200000).toISOString(),
      },
    ];

    const mockIncidents = [
      {
        id: mockIncidentId1,
        location_id: mockLocationId1,
        title: 'Transformer Core Oil Overheating',
        status: 'investigating',
        severity: 'High',
        outage_type: 'Transformer Tripped',
        estimated_restoration: new Date(Date.now() + 7200000).toISOString(),
        actual_restoration: null,
        affected_households: 320,
        assigned_crew: 'Emergency Squad #3',
        created_at: new Date(Date.now() - 1800000).toISOString(),
        updated_at: new Date(Date.now() - 600000).toISOString(),
      },
      {
        id: mockIncidentId2,
        location_id: mockLocationId2,
        title: 'High Voltage Feeder Cable Disruption',
        status: 'progress',
        severity: 'Critical',
        outage_type: 'Feeder Cable Fault',
        estimated_restoration: new Date(Date.now() + 3600000).toISOString(),
        actual_restoration: null,
        affected_households: 850,
        assigned_crew: 'Heavy Line Crew #7',
        created_at: new Date(Date.now() - 3600000).toISOString(),
        updated_at: new Date(Date.now() - 900000).toISOString(),
      },
    ];

    // Intercept backend endpoints to test live adapter rendering
    await page.route(/\/api\/locations(\?.*)?$/, (route) => {
      console.log('  [MOCK ROUTE] Intercepted /api/locations');
      route.fulfill({
        status: 200,
        headers: {
          'access-control-allow-origin': '*',
          'access-control-allow-methods': '*',
          'access-control-allow-headers': '*',
        },
        contentType: 'application/json',
        body: JSON.stringify(mockLocations),
      });
    });

    await page.route(/\/api\/incidents(\?.*)?$/, (route) => {
      console.log('  [MOCK ROUTE] Intercepted /api/incidents');
      route.fulfill({
        status: 200,
        headers: {
          'access-control-allow-origin': '*',
          'access-control-allow-methods': '*',
          'access-control-allow-headers': '*',
        },
        contentType: 'application/json',
        body: JSON.stringify(mockIncidents),
      });
    });

    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    // Verify dynamic metrics bar with 2 active incidents
    const liveActiveMetric = await page.locator('text=2 Active Areas').first();
    const liveInvestMetric = await page.locator('text=1 Under Investigation').first();
    const liveProgressMetric = await page.locator('text=1 Restoration in Progress').first();
    assert((await liveActiveMetric.count()) > 0, 'Dynamic metric: 2 Active Areas');
    assert((await liveInvestMetric.count()) > 0, 'Dynamic metric: 1 Under Investigation');
    assert((await liveProgressMetric.count()) > 0, 'Dynamic metric: 1 Restoration in Progress');

    // Verify rendered live incident cards
    const expectedShortCode1 = `INC-${mockIncidentId1.slice(0, 8).toUpperCase()}`;
    const expectedShortCode2 = `INC-${mockIncidentId2.slice(0, 8).toUpperCase()}`;

    const card1 = await page.locator(`text=${expectedShortCode1}`).first();
    const card2 = await page.locator(`text=${expectedShortCode2}`).first();
    assert((await card1.count()) > 0, `Card 1 rendered with formatted ID: ${expectedShortCode1}`);
    assert((await card2.count()) > 0, `Card 2 rendered with formatted ID: ${expectedShortCode2}`);

    const loc1Text = await page.locator('text=Sector 4 East Substation Feeder').first();
    assert((await loc1Text.count()) > 0, 'Card 1 shows mapped location name');

    // -------------------------------------------------------------
    // Test 3: Select Live Incident -> Detail Screen & URL Navigation
    // -------------------------------------------------------------
    console.log('\n[Test 3] Selecting live incident opens #incident/:uuid detail screen');
    const card1Element = page.locator(`div[id="incident-card-${mockIncidentId1}"]`);
    const viewBtn = card1Element.locator('button:has-text("View incident")');
    await viewBtn.click();
    await page.waitForTimeout(500);

    const currentUrl = page.url();
    assert(currentUrl.includes(`#incident/${mockIncidentId1}`), `URL updated to #incident/${mockIncidentId1}`);

    // Verify Incident Detail screen content
    const liveBadge = await page.locator('text=Live Grid Incident').first();
    assert((await liveBadge.count()) > 0, 'Detail screen displays "Live Grid Incident" badge');

    const detailArea = await page.locator('h1:has-text("Sector 4 East Substation Feeder")').first();
    assert((await detailArea.count()) > 0, 'Detail screen shows mapped location title in H1');

    const crewText = await page.locator('text=Emergency Squad #3').first();
    assert((await crewText.count()) > 0, 'Detail screen shows live assigned crew');

    const householdsText = await page.locator('text=320 Households').first();
    assert((await householdsText.count()) > 0, 'Detail screen shows live affected households count');

    const emptyDeptUpdates = await page.locator('text=No official department updates published for this incident yet.').first();
    assert((await emptyDeptUpdates.count()) > 0, 'Handles empty department updates gracefully');

    const emptyReports = await page.locator('text=No citizen reports currently linked to this incident.').first();
    assert((await emptyReports.count()) > 0, 'Handles empty community reports gracefully without fake data');

    // -------------------------------------------------------------
    // Test 4: Back / Forward Navigation with Live Incident
    // -------------------------------------------------------------
    console.log('\n[Test 4] Navigation and browser history with live incident');
    const backBtn = page.locator('button:has-text("Back to Live Outages")').first();
    await backBtn.click();
    await page.waitForTimeout(500);
    assert(page.url().includes('#map-monitor'), 'Clicking "Back to Live Outages" navigates to #map-monitor');

    await page.goBack();
    await page.waitForTimeout(500);
    assert(page.url().includes(`#incident/${mockIncidentId1}`), 'Browser Back restores live incident URL');
    assert((await page.locator('text=Live Grid Incident').count()) > 0, 'Browser Back restores live incident screen');

    await page.goForward();
    await page.waitForTimeout(500);
    assert(page.url().includes('#map-monitor'), 'Browser Forward returns to #map-monitor');

    // -------------------------------------------------------------
    // Test 5: Not-Found Handling for Unknown Incident UUID
    // -------------------------------------------------------------
    console.log('\n[Test 5] Direct access to non-existent incident displays Not-Found state');
    await page.unroute(/\/api\/incidents/);
    await page.unroute(/\/api\/locations/);
    await page.goto(`${baseUrl}/#incident/00000000-0000-0000-0000-000000000000`, { waitUntil: 'networkidle' });
    await page.locator('text=Incident Record Not Found').first().waitFor({ timeout: 5000 });

    const notFoundTitle = await page.locator('text=Incident Record Not Found').first();
    assert((await notFoundTitle.count()) > 0, 'Displays "Incident Record Not Found"');

    // -------------------------------------------------------------
    // Test 6: API Error State Handling
    // -------------------------------------------------------------
    console.log('\n[Test 6] API error handling with retry');
    await page.unroute(/\/api\/incidents/);
    await page.route(/\/api\/incidents/, (route) => {
      route.fulfill({
        status: 500,
        headers: {
          'access-control-allow-origin': '*',
          'access-control-allow-methods': '*',
          'access-control-allow-headers': '*',
        },
        contentType: 'application/json',
        body: JSON.stringify({ detail: 'Database connection failed' }),
      });
    });

    await page.goto(`${baseUrl}/#map-monitor`);
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const errorTitle = await page.locator('text=Unable to load live outages').first();
    assert((await errorTitle.count()) > 0, 'Displays ErrorState on 500 backend failure');
    const retryBtn = await page.locator('button:has-text("Retry")').first();
    assert((await retryBtn.count()) > 0, 'Displays Retry button in ErrorState');

    // -------------------------------------------------------------
    // Test 7: Demo Mode Fallback Clearly Identified
    // -------------------------------------------------------------
    console.log('\n[Test 7] Demo mode fallback clearly identified as demo data');
    await page.unroute(/\/api\/incidents/);
    await page.unroute(/\/api\/locations/);

    await page.goto(`${baseUrl}/#incident/west-district`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const demoBadge = await page.locator('text=Demo Data').first();
    const simulatedNotice = await page.locator('text=Simulated Demo Outage').first();
    assert((await demoBadge.count()) > 0, 'Demo incident shows "Demo Data" badge');
    assert((await simulatedNotice.count()) > 0, 'Demo incident shows "Simulated Demo Outage" badge');

    // -------------------------------------------------------------
    // Test 8: Outage History Data Accuracy (Dynamic Derivation & Active Count)
    // -------------------------------------------------------------
    console.log('\n[Test 8] Outage History dynamic derivation (durations, most impacted, community notices, active count)');
    const histLoc1 = '11111111-aaaa-bbbb-cccc-000000000001';
    const histLoc2 = '11111111-aaaa-bbbb-cccc-000000000002';
    const histLoc3 = '11111111-aaaa-bbbb-cccc-000000000003';

    const historyLocations = [
      { id: histLoc1, name: 'North Power Zone A', address: '100 North Rd' },
      { id: histLoc2, name: 'South High-Load Sector B', address: '200 South Blvd' },
      { id: histLoc3, name: 'East Commercial District C', address: '300 East Way' },
    ];

    const now = Date.now();
    const historyIncidents = [
      {
        id: '22222222-0000-0000-0000-000000000001',
        location_id: histLoc1,
        title: 'Overhead Line Downed',
        status: 'investigating', // Active
        severity: 'High',
        outage_type: 'Downed Wire',
        affected_households: 120,
        assigned_crew: 'Crew A',
        created_at: new Date(now - 3600000).toISOString(),
        updated_at: new Date(now - 1800000).toISOString(),
      },
      {
        id: '22222222-0000-0000-0000-000000000002',
        location_id: histLoc2,
        title: 'Transformer Substation Surge',
        status: 'resolved', // Resolved with 90 min duration
        severity: 'Critical',
        outage_type: 'Transformer',
        affected_households: 650,
        assigned_crew: 'Crew B',
        created_at: new Date(now - 7200000).toISOString(), // 2 hours ago
        updated_at: new Date(now - 1800000).toISOString(),
        actual_restoration: new Date(now - 1800000).toISOString(), // 90 mins after created_at
      },
      {
        id: '22222222-0000-0000-0000-000000000003',
        location_id: histLoc3,
        title: 'False Alarm Inverter Trip',
        status: 'cancelled', // Cancelled
        severity: 'Low',
        outage_type: 'False Alarm',
        affected_households: 10,
        assigned_crew: null,
        created_at: new Date(now - 5400000).toISOString(),
        updated_at: new Date(now - 3600000).toISOString(),
      },
    ];

    await page.route(/\/api\/locations/, (route) => {
      route.fulfill({
        status: 200,
        headers: { 'access-control-allow-origin': '*' },
        contentType: 'application/json',
        body: JSON.stringify(historyLocations),
      });
    });

    await page.route(/\/api\/incidents(\?.*)?$/, (route) => {
      route.fulfill({
        status: 200,
        headers: { 'access-control-allow-origin': '*' },
        contentType: 'application/json',
        body: JSON.stringify(historyIncidents),
      });
    });

    await page.goto(`${baseUrl}/#outage-history`, { waitUntil: 'networkidle' });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    // 1. Verify active count excludes both resolved and cancelled
    const activeText = await page.locator('text=1 active, 1 resolved, 1 cancelled.').first();
    assert((await activeText.count()) > 0, 'Active count excludes both resolved and cancelled (1 active, 1 resolved, 1 cancelled)');

    // 2. Verify derived restoration duration from actual timestamps (90m -> 1h 30m)
    const durationValue = await page.locator('text=1h 30m').first();
    const durationMins = await page.locator('text=(90 mins avg)').first();
    assert((await durationValue.count()) > 0, 'Derived avg restoration time: 1h 30m');
    assert((await durationMins.count()) > 0, 'Derived avg restoration minutes: (90 mins avg)');

    // 3. Verify dynamically derived Most Impacted Zone (South High-Load Sector B with 650 households)
    const mostImpacted = await page.locator('span:has-text("South High-Load Sector B")').first();
    const mostImpactedHH = await page.locator('text=650 households affected').first();
    assert((await mostImpacted.count()) > 0, 'Most Impacted Zone derived dynamically from highest household impact');
    assert((await mostImpactedHH.count()) > 0, 'Displays real cumulative household impact (650 households)');

    // 4. Verify Community Notices when report data is unlinked
    const noticesNotLinked = await page.locator('text=Not yet linked').first();
    assert((await noticesNotLinked.count()) > 0, 'Community Notices shows "Not yet linked" instead of 0');

    // 5. Verify table Reports column shows "Not yet linked"
    const tableReportCells = await page.locator('td:has-text("Not yet linked")');
    assert((await tableReportCells.count()) >= 3, 'Table displays "Not yet linked" for all 3 unlinked rows');

    // -------------------------------------------------------------
    // Test 9: Direct Incident URL Outside 50-Record First Page Response
    // -------------------------------------------------------------
    console.log('\n[Test 9] Direct navigation to incident outside list (getIncidentById fallback)');
    const outsideIncidentId = '99999999-8888-7777-6666-555555555555';
    const outsideLocationId = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';

    const outsideLocation = {
      id: outsideLocationId,
      name: 'Outer Suburb Grid Node 99',
      address: 'Highway 99 Mile Marker 14',
    };

    const outsideIncident = {
      id: outsideIncidentId,
      location_id: outsideLocationId,
      title: 'Isolated Substation Breaker Failure',
      status: 'progress',
      severity: 'Medium',
      outage_type: 'Breaker Trip',
      affected_households: 275,
      assigned_crew: 'Rural Line Unit #19',
      created_at: new Date(now - 1800000).toISOString(),
      updated_at: new Date(now - 600000).toISOString(),
      estimated_restoration: new Date(now + 3600000).toISOString(),
    };

    // Unroute old handlers
    await page.unroute(/\/api\/incidents/);
    await page.unroute(/\/api\/locations/);

    // Setup routes:
    // List response DOES NOT contain outsideIncidentId (only returns historyIncidents)
    await page.route(/\/api\/incidents$/, (route) => {
      console.log('  [MOCK ROUTE] Intercepted list /api/incidents (without outside incident)');
      route.fulfill({
        status: 200,
        headers: { 'access-control-allow-origin': '*' },
        contentType: 'application/json',
        body: JSON.stringify(historyIncidents),
      });
    });

    // Single incident response handles outsideIncidentId
    await page.route(new RegExp(`/api/incidents/${outsideIncidentId}`), (route) => {
      console.log('  [MOCK ROUTE] Intercepted single getIncidentById for outside incident');
      route.fulfill({
        status: 200,
        headers: { 'access-control-allow-origin': '*' },
        contentType: 'application/json',
        body: JSON.stringify(outsideIncident),
      });
    });

    // Location endpoints
    await page.route(new RegExp(`/api/locations/${outsideLocationId}`), (route) => {
      console.log('  [MOCK ROUTE] Intercepted single getLocationById for outside location');
      route.fulfill({
        status: 200,
        headers: { 'access-control-allow-origin': '*' },
        contentType: 'application/json',
        body: JSON.stringify(outsideLocation),
      });
    });

    await page.route(/\/api\/locations$/, (route) => {
      route.fulfill({
        status: 200,
        headers: { 'access-control-allow-origin': '*' },
        contentType: 'application/json',
        body: JSON.stringify(historyLocations),
      });
    });

    // Navigate directly to the outside incident URL
    await page.goto(`${baseUrl}/#incident/${outsideIncidentId}`, { waitUntil: 'networkidle' });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    // Verify it loads properly and is NOT marked Not Found
    const outsideLiveBadge = await page.locator('text=Live Grid Incident').first();
    assert((await outsideLiveBadge.count()) > 0, 'Outside incident loads with "Live Grid Incident" badge');

    const outsideLocationTitle = await page.locator('h1:has-text("Outer Suburb Grid Node 99")').first();
    assert((await outsideLocationTitle.count()) > 0, 'Outside incident resolves location name: Outer Suburb Grid Node 99');

    const outsideCrew = await page.locator('text=Rural Line Unit #19').first();
    assert((await outsideCrew.count()) > 0, 'Outside incident shows dispatched crew: Rural Line Unit #19');

    const notFoundEl = await page.locator('text=Incident Record Not Found');
    assert((await notFoundEl.count()) === 0, 'Direct outside incident URL is NOT marked "Incident Record Not Found"');

    // -------------------------------------------------------------
    // Test 10: Retry Behavior for Direct Incident-by-UUID Loading
    // -------------------------------------------------------------
    console.log('\n[Test 10] Retry behavior for direct incident-by-UUID loading');
    const retryIncidentId = '88888888-7777-6666-5555-444444444444';
    const retryLocationId = 'cccccccc-dddd-eeee-ffff-000000000000';

    const retryLocation = {
      id: retryLocationId,
      name: 'Resilient Microgrid Sector 88',
      address: '88 Tech Park Drive',
    };

    const retryIncident = {
      id: retryIncidentId,
      location_id: retryLocationId,
      title: 'Busbar Overheating Alarm',
      status: 'investigating',
      severity: 'High',
      outage_type: 'Thermal Anomaly',
      affected_households: 310,
      assigned_crew: 'Rapid Response Unit 8',
      created_at: new Date(now - 1200000).toISOString(),
      updated_at: new Date(now - 300000).toISOString(),
    };

    // Unroute previous handlers
    await page.unroute(/\/api\/incidents/);
    await page.unroute(/\/api\/locations/);

    // List handler: returns normal history incidents (not containing retryIncidentId)
    await page.route(/\/api\/incidents$/, (route) => {
      route.fulfill({
        status: 200,
        headers: { 'access-control-allow-origin': '*' },
        contentType: 'application/json',
        body: JSON.stringify(historyIncidents),
      });
    });

    // Single incident handler: fails on first request, succeeds on retry
    let directIncidentAttempts = 0;
    await page.route(new RegExp(`/api/incidents/${retryIncidentId}`), (route) => {
      directIncidentAttempts += 1;
      console.log(`  [MOCK ROUTE] getIncidentById attempt #${directIncidentAttempts}`);
      if (directIncidentAttempts === 1) {
        route.fulfill({
          status: 500,
          headers: {
            'access-control-allow-origin': '*',
            'access-control-allow-methods': '*',
            'access-control-allow-headers': '*',
          },
          contentType: 'application/json',
          body: JSON.stringify({ detail: 'Transient grid database error' }),
        });
      } else {
        route.fulfill({
          status: 200,
          headers: { 'access-control-allow-origin': '*' },
          contentType: 'application/json',
          body: JSON.stringify(retryIncident),
        });
      }
    });

    // Location handler for retry location
    await page.route(new RegExp(`/api/locations/${retryLocationId}`), (route) => {
      console.log('  [MOCK ROUTE] getLocationById for retry location');
      route.fulfill({
        status: 200,
        headers: { 'access-control-allow-origin': '*' },
        contentType: 'application/json',
        body: JSON.stringify(retryLocation),
      });
    });

    // Default locations handler
    await page.route(/\/api\/locations$/, (route) => {
      route.fulfill({
        status: 200,
        headers: { 'access-control-allow-origin': '*' },
        contentType: 'application/json',
        body: JSON.stringify(historyLocations),
      });
    });

    // 1. Navigate to direct incident URL
    await page.goto(`${baseUrl}/#incident/${retryIncidentId}`, { waitUntil: 'networkidle' });

    // 2. Wait for error state to appear
    const errorStateTitle = await page.locator('text=Unable to load incident details').first();
    await errorStateTitle.waitFor({ timeout: 5000 });
    assert((await errorStateTitle.count()) > 0, 'Displays ErrorState on initial 500 failure');

    const detailRetryBtn = await page.locator('button:has-text("Retry")').first();
    assert((await detailRetryBtn.count()) > 0, 'Displays Retry button in ErrorState');

    // 3. Click Retry
    console.log('  Clicking Retry button...');
    await detailRetryBtn.click();

    // 4. Confirm detail screen loads with valid incident and location instead of staying on spinner
    const retryLoadedTitle = await page.locator('h1:has-text("Resilient Microgrid Sector 88")').first();
    await retryLoadedTitle.waitFor({ timeout: 5000 });
    assert((await retryLoadedTitle.count()) > 0, 'Detail screen loads location title: Resilient Microgrid Sector 88');

    const retryLoadedBadge = await page.locator('text=Live Grid Incident').first();
    assert((await retryLoadedBadge.count()) > 0, 'Detail screen loads with "Live Grid Incident" badge');

    const retryLoadedCrew = await page.locator('text=Rapid Response Unit 8').first();
    assert((await retryLoadedCrew.count()) > 0, 'Detail screen loads assigned crew: Rapid Response Unit 8');

    const loadingSpinner = await page.locator('text=Connecting to municipal grid incident record...');
    assert((await loadingSpinner.count()) === 0, 'Detail screen left loading state and is NOT stuck on the spinner');
    assert(directIncidentAttempts >= 2, 'Direct incident endpoint was called at least twice (failed once, retried)');

    console.log(`\n========================================`);
    console.log(`Total tests: ${totalCount} | Passed: ${passedCount} | Failed: ${totalCount - passedCount}`);
    console.log(`========================================`);

    if (passedCount === totalCount) {
      console.log('✔ All Phase 6 Locations + Incidents tests PASSED!');
    } else {
      process.exitCode = 1;
    }
  } catch (err) {
    console.error('Test execution failed with error:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

runTests();
