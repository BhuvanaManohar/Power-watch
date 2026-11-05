const { chromium } = require('playwright');

let passedCount = 0;
let totalCount = 0;

function assert(condition, message) {
  totalCount++;
  if (!condition) {
    console.error(`  ✖ [FAIL] ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  } else {
    passedCount++;
    console.log(`  ✔ [PASS] ${message}`);
  }
}

async function runPhase7Tests() {
  console.log('--- Starting PowerWatch Phase 7 Real Live Outage Map Tests ---');
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
  });

  const baseUrl = 'http://localhost:5173';
  const page = await browser.newPage();

  page.on('console', (msg) => {
    const text = msg.text();
    if (text.includes('[PowerWatch') || text.includes('[MOCK ROUTE]')) {
      console.log(`  [CONSOLE] ${text}`);
    }
  });

  try {
    const locWithCoords1 = '11111111-0000-0000-0000-000000000001';
    const locWithCoords2 = '11111111-0000-0000-0000-000000000002';
    const locWithoutCoords = '11111111-0000-0000-0000-000000000003';

    const testLocations = [
      {
        id: locWithCoords1,
        name: 'Downtown Substation Sector',
        address: '100 Market St',
        latitude: 37.7749,
        longitude: -122.4194,
      },
      {
        id: locWithCoords2,
        name: 'Mission Transmission Corridor',
        address: '500 Mission St',
        latitude: 37.7891,
        longitude: -122.4014,
      },
      {
        id: locWithoutCoords,
        name: 'Remote Mountain Feeder (Unsurveyed)',
        address: 'Rural Ridge Route 9',
        latitude: null, // No coordinates
        longitude: null,
      },
    ];

    const incInvestigatingId = '22222222-0000-0000-0000-000000000001';
    const incProgressId = '22222222-0000-0000-0000-000000000002';
    const incNoCoordsId = '22222222-0000-0000-0000-000000000003';

    const now = Date.now();
    const testIncidents = [
      {
        id: incInvestigatingId,
        location_id: locWithCoords1,
        title: 'Transformer Primary Core Tripped',
        status: 'investigating',
        severity: 'Critical',
        outage_type: 'Transformer Failure',
        affected_households: 420,
        assigned_crew: 'Rapid Emergency Unit 1',
        created_at: new Date(now - 3600000).toISOString(),
        updated_at: new Date(now - 1800000).toISOString(),
      },
      {
        id: incProgressId,
        location_id: locWithCoords2,
        title: 'Downed Feeder Cable Repair',
        status: 'progress',
        severity: 'High',
        outage_type: 'Downed Wire',
        affected_households: 180,
        assigned_crew: 'Field Line Crew 4',
        created_at: new Date(now - 5400000).toISOString(),
        updated_at: new Date(now - 900000).toISOString(),
      },
      {
        id: incNoCoordsId,
        location_id: locWithoutCoords,
        title: 'Unsurveyed Feeder Junction Alert',
        status: 'investigating',
        severity: 'Medium',
        outage_type: 'Unknown Disruption',
        affected_households: 65,
        assigned_crew: null,
        created_at: new Date(now - 2400000).toISOString(),
        updated_at: new Date(now - 1200000).toISOString(),
      },
    ];

    await page.route(/\/api\/locations$/, (route) => {
      route.fulfill({
        status: 200,
        headers: { 'access-control-allow-origin': '*' },
        contentType: 'application/json',
        body: JSON.stringify(testLocations),
      });
    });

    await page.route(/\/api\/incidents(\?.*)?$/, (route) => {
      route.fulfill({
        status: 200,
        headers: { 'access-control-allow-origin': '*' },
        contentType: 'application/json',
        body: JSON.stringify(testIncidents),
      });
    });

    // -------------------------------------------------------------
    // Test 1: Real Leaflet Map Rendering & OpenStreetMap Attribution
    // -------------------------------------------------------------
    console.log('\n[Test 1] Leaflet interactive map rendering & OpenStreetMap attribution');
    await page.goto(`${baseUrl}/#map-monitor`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const leafletContainer = page.locator('.leaflet-container');
    assert((await leafletContainer.count()) > 0, 'Leaflet map container initialized in DOM');

    const osmAttribution = page.locator('.leaflet-control-attribution a[href*="openstreetmap.org/copyright"]');
    assert((await osmAttribution.count()) > 0, 'Visible OpenStreetMap attribution link rendered');
    assert((await osmAttribution.innerText()).includes('OpenStreetMap'), 'Attribution text includes OpenStreetMap');

    // -------------------------------------------------------------
    // Test 2: Plotting Incidents With Valid Coordinates
    // -------------------------------------------------------------
    console.log('\n[Test 2] Plotting markers only for incidents with valid coordinates');
    const markers = page.locator('.leaflet-marker-icon');
    const markerCount = await markers.count();
    assert(markerCount === 2, `Exactly 2 markers plotted on map (found: ${markerCount}, 2 had coordinates, 1 had null)`);

    const plottableStatusText = page.locator('text=2 plotted on live map').first();
    assert((await plottableStatusText.count()) > 0, 'Floating banner shows "2 plotted on live map"');

    // -------------------------------------------------------------
    // Test 3: Unplotted Incident Remains Visible in Feed With Explanation
    // -------------------------------------------------------------
    console.log('\n[Test 3] Incidents without coordinates remain visible in feed with clear notice');
    const feedCards = page.locator('div[id^="incident-card-"]');
    assert((await feedCards.count()) === 3, 'All 3 incidents are visible in feed cards');

    const unplottedExplanation = page.locator('text=Coordinates pending — cannot be plotted on live map').first();
    assert((await unplottedExplanation.count()) > 0, 'Feed card explains unplotted status: "Coordinates pending — cannot be plotted on live map"');

    const mappedCoordsBadge = page.locator('text=Mapped coordinates: 37.7749, -122.4194').first();
    assert((await mappedCoordsBadge.count()) > 0, 'Plotted feed card displays mapped coordinates (37.7749, -122.4194)');

    // -------------------------------------------------------------
    // Test 4: Status-Distinguished Markers (Investigating vs Progress)
    // -------------------------------------------------------------
    console.log('\n[Test 4] Status-distinguished markers');
    // Investigating marker has amber bg #b54000 and bolt icon
    const investigatingMarker = page.locator('.leaflet-marker-icon:has(span:text("bolt"))');
    assert((await investigatingMarker.count()) > 0, 'Investigating status marker rendered with "bolt" icon');

    // Progress marker has blue bg #0048af and car/transit icon
    const progressMarker = page.locator('.leaflet-marker-icon:has(span:text("directions_car"))');
    assert((await progressMarker.count()) > 0, 'Progress status marker rendered with "directions_car" icon');

    // -------------------------------------------------------------
    // Test 5: Selecting a Marker Opens Detail Route with Backend UUID
    // -------------------------------------------------------------
    console.log('\n[Test 5] Selecting a marker opens incident detail route using backend UUID');
    await investigatingMarker.first().click();
    await page.waitForTimeout(600);

    assert(page.url().includes(`#incident/${incInvestigatingId}`), `URL updated to #incident/${incInvestigatingId}`);
    assert((await page.locator('text=Live Grid Incident').count()) > 0, 'Incident detail screen opened with "Live Grid Incident" badge');
    assert((await page.locator('h1:has-text("Downtown Substation Sector")').count()) > 0, 'Incident detail shows Downtown Substation Sector');

    // Return to live outages
    await page.locator('button:has-text("Back to Live Outages")').first().click();
    await page.waitForTimeout(600);
    assert(page.url().includes('#map-monitor'), 'Returned to #map-monitor');

    // -------------------------------------------------------------
    // Test 6: Selecting Feed Card Opens Detail Route with Backend UUID
    // -------------------------------------------------------------
    console.log('\n[Test 6] Selecting feed card opens incident detail route');
    const card2 = page.locator(`div[id="incident-card-${incProgressId}"]`);
    await card2.locator('button:has-text("View incident")').first().click();
    await page.waitForTimeout(600);

    assert(page.url().includes(`#incident/${incProgressId}`), `URL updated to #incident/${incProgressId}`);
    assert((await page.locator('h1:has-text("Mission Transmission Corridor")').count()) > 0, 'Detail shows Mission Transmission Corridor');

    // Return to live outages
    await page.locator('button:has-text("Back to Live Outages")').first().click();
    await page.waitForTimeout(600);

    // -------------------------------------------------------------
    // Test 7: Status Filters & Search Update Plotted Map Markers
    // -------------------------------------------------------------
    console.log('\n[Test 7] Filter buttons dynamically update plotted markers');
    // Click "Under Investigation" filter button
    await page.locator('button:has-text("Under Investigation")').first().click();
    await page.waitForTimeout(400);

    const filteredMarkers = page.locator('.leaflet-marker-icon');
    assert((await filteredMarkers.count()) === 1, 'Only 1 marker visible under "Under Investigation" filter');

    // Click "Restoration in Progress" filter button
    await page.locator('button:has-text("Restoration in Progress")').first().click();
    await page.waitForTimeout(400);
    assert((await page.locator('.leaflet-marker-icon').count()) === 1, 'Only 1 marker visible under "Restoration in Progress" filter');

    // Click "All Outages" filter button
    await page.locator('button:has-text("All Outages")').first().click();
    await page.waitForTimeout(400);
    assert((await page.locator('.leaflet-marker-icon').count()) === 2, '2 markers visible under "All Outages" filter');

    // -------------------------------------------------------------
    // Test 8: Responsive Mobile Usability & Map Lifecycle Cleanup
    // -------------------------------------------------------------
    console.log('\n[Test 8] Responsive mobile viewport test & unmount cleanup');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    const mobileMap = page.locator('.leaflet-container');
    assert((await mobileMap.count()) > 0, 'Leaflet map is present and styled in mobile viewport (375x667)');

    // Restore desktop viewport and test clean unmount
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(300);

    // Navigate to Outage History to unmount the map
    await page.locator('header a[href="#outage-history"]').first().click();
    await page.waitForTimeout(500);
    assert(page.url().includes('#outage-history'), 'Navigated to #outage-history (map unmounted)');
    assert((await page.locator('.leaflet-container').count()) === 0, 'Map unmounted cleanly without orphaned containers');

    // Return to live outages
    await page.locator('header a[href="#map-monitor"]').first().click();
    await page.waitForTimeout(500);
    assert(page.url().includes('#map-monitor'), 'Returned to #map-monitor');
    assert((await page.locator('.leaflet-container').count()) > 0, 'Map re-mounted cleanly without Leaflet error');

    console.log(`\n========================================`);
    console.log(`Total tests: ${totalCount} | Passed: ${passedCount} | Failed: ${totalCount - passedCount}`);
    console.log(`========================================`);

    if (passedCount === totalCount) {
      console.log('✔ All Phase 7 Real Live Outage Map tests PASSED!');
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

runPhase7Tests();
