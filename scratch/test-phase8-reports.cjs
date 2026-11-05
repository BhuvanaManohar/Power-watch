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

async function runPhase8Tests() {
  console.log('===========================================================');
  console.log('--- Starting PowerWatch Phase 8 Real Citizen Reports Tests ---');
  console.log('===========================================================');

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
  });

  const baseUrl = 'http://localhost:5173';
  const mockUserId = '88888888-8888-8888-8888-888888888888';
  const mockUserId2 = '77777777-7777-7777-7777-777777777777';
  const mockLocationId = '11111111-2222-3333-4444-555555555555';
  const mockReportId = '99999999-aaaa-bbbb-cccc-dddddddddddd';
  const mockReportId2 = '88888888-bbbb-cccc-dddd-eeeeeeeeeeee';

  const mockSessionUser1 = {
    access_token: 'mock-access-token-user1',
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    refresh_token: 'mock-refresh-token-user1',
    user: {
      id: mockUserId,
      aud: 'authenticated',
      role: 'authenticated',
      email: 'citizen1.phase8@powerwatch.test',
      user_metadata: { role: 'citizen' },
    },
  };

  const mockSessionUser2 = {
    access_token: 'mock-access-token-user2',
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    refresh_token: 'mock-refresh-token-user2',
    user: {
      id: mockUserId2,
      aud: 'authenticated',
      role: 'authenticated',
      email: 'citizen2.phase8@powerwatch.test',
      user_metadata: { role: 'citizen' },
    },
  };

  const mockLocations = [
    {
      id: mockLocationId,
      name: 'Sector 4 Substation Hub',
      address: '742 Evergreen Terrace, West District',
      city: 'Metro City',
      latitude: 37.7749,
      longitude: -122.4194,
    },
  ];

  const mockReportSubmitted = {
    id: mockReportId,
    user_id: mockUserId,
    location_id: mockLocationId,
    incident_id: null,
    outage_type: 'Complete Power Outage',
    description: 'Loud noise heard near residential transformer unit',
    status: 'Submitted',
    photo_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockReportRejected = {
    id: '33333333-3333-3333-3333-333333333333',
    user_id: mockUserId,
    location_id: mockLocationId,
    incident_id: null,
    outage_type: 'Sparks / Line Down Hazard',
    description: 'Notice for sector 4',
    status: 'Rejected',
    photo_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockReportResolved = {
    id: '44444444-4444-4444-4444-444444444444',
    user_id: mockUserId,
    location_id: mockLocationId,
    incident_id: null,
    outage_type: 'Partial / Low Voltage Outage',
    description: 'Voltage normal after repair',
    status: 'Resolved',
    photo_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockReportUser2 = {
    id: mockReportId2,
    user_id: mockUserId2,
    location_id: mockLocationId,
    incident_id: null,
    outage_type: 'Complete Power Outage',
    description: 'User 2 isolated outage report',
    status: 'Submitted',
    photo_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  let postPayloadReceived = null;
  let getMyReportsCalled = false;
  let publicGetReportsCalled = false;

  try {
    // -------------------------------------------------------------
    // Test 1: Signed-Out User on Report Outage Screen
    // -------------------------------------------------------------
    console.log('\n[Test 1] Signed-Out User on Report Outage Screen');
    const contextSignedOut = await browser.newContext();
    const pageSignedOut = await contextSignedOut.newPage();

    await pageSignedOut.route(/\/api\/locations$/, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await pageSignedOut.goto(`${baseUrl}/#report-outage`, { waitUntil: 'networkidle' });
    await pageSignedOut.waitForTimeout(500);

    const authBanner = pageSignedOut.locator('text=Sign-in required: You must be signed in with a citizen account');
    assert((await authBanner.count()) > 0, 'Sign-in required banner displayed to unauthenticated user');

    const submitBtn = pageSignedOut.locator('button[type="submit"]');
    assert(await submitBtn.isDisabled(), 'Report submission button is disabled when signed out');
    const btnText = await submitBtn.innerText();
    assert(btnText.includes('Sign In Required'), `Button indicates sign-in required: "${btnText}"`);

    const signInBtn = pageSignedOut.locator('button:has-text("Sign In to Report")');
    assert((await signInBtn.count()) > 0, 'Sign In to Report button present in auth banner');
    await signInBtn.click();
    await pageSignedOut.waitForTimeout(300);
    assert(pageSignedOut.url().includes('#signin'), 'Clicking sign-in navigates to #signin');
    await contextSignedOut.close();

    // -------------------------------------------------------------
    // Test 2: Authenticated User with Empty Locations Table
    // -------------------------------------------------------------
    console.log('\n[Test 2] Authenticated User with Empty Locations Table');
    const contextSignedIn = await browser.newContext();
    await contextSignedIn.addInitScript(({ session }) => {
      localStorage.setItem('sb-akryryfzxkyeqpvmkxoc-auth-token', JSON.stringify(session));
    }, { session: mockSessionUser1 });

    const pageSignedIn = await contextSignedIn.newPage();

    let returnEmptyLocations = true;
    let postReturnsRejected = false;

    await pageSignedIn.route(/\/api\/locations$/, (route) => {
      route.fulfill({
        status: 200,
        headers: { 'access-control-allow-origin': '*' },
        contentType: 'application/json',
        body: JSON.stringify(returnEmptyLocations ? [] : mockLocations),
      });
    });

    await pageSignedIn.route(/\/api\/reports$/, (route) => {
      if (route.request().method() === 'POST') {
        postPayloadReceived = JSON.parse(route.request().postData());
        route.fulfill({
          status: 201,
          headers: { 'access-control-allow-origin': '*' },
          contentType: 'application/json',
          body: JSON.stringify(postReturnsRejected ? mockReportRejected : mockReportSubmitted),
        });
      } else {
        publicGetReportsCalled = true;
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        });
      }
    });

    let currentMyReports = [mockReportSubmitted];
    let myReportsDelayMs = 0;

    await pageSignedIn.route(/\/api\/reports\/me$/, async (route) => {
      getMyReportsCalled = true;
      if (myReportsDelayMs > 0) {
        await new Promise((r) => setTimeout(r, myReportsDelayMs));
      }
      route.fulfill({
        status: 200,
        headers: { 'access-control-allow-origin': '*' },
        contentType: 'application/json',
        body: JSON.stringify(currentMyReports),
      });
    });

    await pageSignedIn.goto(`${baseUrl}/#report-outage`, { waitUntil: 'networkidle' });
    await pageSignedIn.waitForTimeout(600);

    const emptyLocationBanner = pageSignedIn.locator('text=No Registered Locations Available');
    assert((await emptyLocationBanner.count()) > 0, 'Empty locations alert banner displayed');

    const emptyDesc = pageSignedIn.locator('text=No registered municipal grid sectors are currently active');
    assert((await emptyDesc.count()) > 0, 'Clear explanation that sectors must be configured is shown');

    const disabledSubmit = pageSignedIn.locator('button[type="submit"]');
    assert(await disabledSubmit.isDisabled(), 'Submit button disabled when no locations are available');

    // -------------------------------------------------------------
    // Test 3: Location Selection and Real Report Submission Flow
    // -------------------------------------------------------------
    console.log('\n[Test 3] Location Selection & Real Report Submission Flow');
    returnEmptyLocations = false;

    await pageSignedIn.goto(`${baseUrl}/#`, { waitUntil: 'networkidle' });
    await pageSignedIn.waitForTimeout(300);
    await pageSignedIn.goto(`${baseUrl}/#report-outage`, { waitUntil: 'networkidle' });
    await pageSignedIn.waitForTimeout(600);

    const locationSelect = pageSignedIn.locator('select#outage-location-select');
    assert((await locationSelect.count()) > 0, 'Location select dropdown is present');
    await locationSelect.selectOption(mockLocationId);

    const disabledPhotoBadge = pageSignedIn.locator('text=Photo Upload Unavailable');
    assert((await disabledPhotoBadge.count()) > 0, 'Photo evidence upload is clearly marked unavailable');

    const descInput = pageSignedIn.locator('textarea');
    await descInput.fill('Loud noise heard near residential transformer unit');

    const nextBtn = pageSignedIn.locator('button[type="submit"]:has-text("Next: Review Report")');
    assert(await nextBtn.isEnabled(), 'Next button is enabled with valid location and authentication');
    await nextBtn.click();
    await pageSignedIn.waitForTimeout(300);

    const reviewHeader = pageSignedIn.locator('h2:has-text("Review Outage Notice")');
    assert((await reviewHeader.count()) > 0, 'Review report step reached');

    const submitReportBtn = pageSignedIn.locator('button:has-text("Submit Outage Report")');
    await submitReportBtn.click();
    await pageSignedIn.waitForTimeout(600);

    assert(postPayloadReceived !== null, 'POST /api/reports request was sent');
    assert(postPayloadReceived.location_id === mockLocationId, `Payload has real location_id UUID: ${postPayloadReceived.location_id}`);
    assert(postPayloadReceived.outage_type === 'Complete Power Outage', `Payload has outage_type: ${postPayloadReceived.outage_type}`);
    assert(postPayloadReceived.photo_url === null, 'Payload photo_url is null (no fake photo)');

    const successTitle = pageSignedIn.locator('text=Outage Report Submitted Successfully');
    assert((await successTitle.count()) > 0, 'Step 3 confirmation banner displayed');

    const reportIdDisplay = pageSignedIn.locator(`text=${mockReportId}`);
    assert((await reportIdDisplay.count()) > 0, 'Real report UUID displayed in confirmation');

    // -------------------------------------------------------------
    // Test 4: ReportOutageScreen Rejected Status Explicit Handling
    // -------------------------------------------------------------
    console.log('\n[Test 4] ReportOutageScreen Rejected Status Explicit Handling');
    postReturnsRejected = true;

    const reportAnotherBtn = pageSignedIn.locator('button:has-text("Report Another Outage")');
    await reportAnotherBtn.click();
    await pageSignedIn.waitForTimeout(300);

    const locationSelect2 = pageSignedIn.locator('select#outage-location-select');
    await locationSelect2.selectOption(mockLocationId);
    await pageSignedIn.locator('button[type="submit"]:has-text("Next: Review Report")').click();
    await pageSignedIn.waitForTimeout(300);

    await pageSignedIn.locator('button:has-text("Submit Outage Report")').click();
    await pageSignedIn.waitForTimeout(600);

    const rejectedBanner = pageSignedIn.locator('text=Outage Report Closed / Rejected');
    assert((await rejectedBanner.count()) > 0, 'Banner explicitly states report was Closed / Rejected');

    const rejectedDesc = pageSignedIn.locator('text=This report was reviewed and marked as rejected by operations.');
    assert((await rejectedDesc.count()) > 0, 'Banner states only that operations marked it as rejected without speculative examples');

    const speculativeText = await pageSignedIn.locator('text=e.g. duplicate').count();
    assert(speculativeText === 0, 'Speculative examples (e.g. duplicate notice or outside service area) removed');

    const rejectedBadge = pageSignedIn.locator('span:has-text("Rejected")').first();
    assert((await rejectedBadge.count()) > 0, 'Tracker badge explicitly displays Rejected status');

    const closedNotice = pageSignedIn.locator('text=Review concluded: This report was marked as rejected by operations.');
    assert((await closedNotice.count()) > 0, 'Explicit note explains review concluded with operations rejection');

    const pendingStages = pageSignedIn.locator('span.font-mono:has-text("Pending")');
    assert((await pendingStages.count()) === 0, 'Rejected report has 0 stages left as "Pending"');

    const closedStages = pageSignedIn.locator('span.font-mono:has-text("Closed")');
    assert((await closedStages.count()) >= 2, 'Downstream stages for rejected report explicitly marked "Closed"');

    // -------------------------------------------------------------
    // Test 5: Citizen Portal Initial Fetch via /api/reports/me
    // -------------------------------------------------------------
    console.log('\n[Test 5] Citizen Portal Displays Reports via GET /api/reports/me');
    currentMyReports = [mockReportSubmitted];

    await pageSignedIn.goto(`${baseUrl}/#citizen-demo`, { waitUntil: 'networkidle' });
    await pageSignedIn.waitForTimeout(600);

    assert(getMyReportsCalled, 'Citizen portal queried /api/reports/me for authenticated user');
    assert(!publicGetReportsCalled, 'Citizen portal did NOT call public /api/reports endpoint');

    const card2Active = pageSignedIn.locator('text=1 Active Report');
    assert((await card2Active.count()) > 0, 'Active Reports card displays "1 Active Report"');

    const reportCardId = pageSignedIn.locator(`text=ID: ${mockReportId}`);
    assert((await reportCardId.count()) > 0, 'Report card contains real Report UUID');

    // -------------------------------------------------------------
    // Test 6: Active Reports Card Status & Count Filtering
    // -------------------------------------------------------------
    console.log('\n[Test 6] Active Reports Card Status & Count Filtering');
    currentMyReports = [mockReportSubmitted, mockReportResolved, mockReportRejected];
    await pageSignedIn.locator('button:has-text("Refresh")').click();
    await pageSignedIn.waitForTimeout(400);

    const card2CountFiltered = pageSignedIn.locator('text=1 Active Report');
    assert((await card2CountFiltered.count()) > 0, 'Card 2 counts only active statuses (1 Active Report out of 3 total reports)');

    const card2StatusSubmitted = pageSignedIn.locator('span.text-secondary:has-text("Submitted")');
    assert((await card2StatusSubmitted.count()) > 0, 'Card 2 status shows "Submitted"');

    currentMyReports = [mockReportResolved, mockReportRejected];
    await pageSignedIn.locator('button:has-text("Refresh")').click();
    await pageSignedIn.waitForTimeout(400);

    const card2ZeroActive = pageSignedIn.locator('text=0 Active Reports');
    assert((await card2ZeroActive.count()) > 0, 'Card 2 shows "0 Active Reports" when all reports are closed');

    const card2NoneActive = pageSignedIn.locator('text=None Active');
    assert((await card2NoneActive.count()) > 0, 'Card 2 shows "None Active" without incorrectly labeling rejected as resolved');

    const falseResolved = pageSignedIn.locator('span.text-secondary:has-text("Resolved")');
    assert((await falseResolved.count()) === 0, 'Card 2 does NOT label closed/rejected reports as Resolved');

    // -------------------------------------------------------------
    // Test 7: Delayed Session Loading & Account Switch Immediate Clearing
    // -------------------------------------------------------------
    console.log('\n[Test 7] Delayed Session Loading & Immediate Clearing on User Switch');

    myReportsDelayMs = 600;
    currentMyReports = [mockReportUser2];

    await pageSignedIn.evaluate(({ sessionUser2 }) => {
      localStorage.setItem('sb-akryryfzxkyeqpvmkxoc-auth-token', JSON.stringify(sessionUser2));
    }, { sessionUser2: mockSessionUser2 });

    await pageSignedIn.reload();

    const oldReportPresent = await pageSignedIn.locator(`text=ID: ${mockReportId}`).isVisible();
    assert(!oldReportPresent, 'User 1 reports cleared immediately upon account change (not visible during loading)');

    const loadingSpinnerActive = await pageSignedIn.locator('text=Loading your outage reports from service...').isVisible();
    assert(loadingSpinnerActive, 'Loading indicator shown while fetching new user reports');

    await pageSignedIn.waitForTimeout(800);

    const user2ReportPresent = pageSignedIn.locator(`text=ID: ${mockReportId2}`);
    assert((await user2ReportPresent.count()) > 0, 'User 2 report successfully rendered after fetch completes');

    // -------------------------------------------------------------
    // Test 8: User-Switch Scenario Where New User's Report Request Fails
    // -------------------------------------------------------------
    console.log('\n[Test 8] User-Switch where new user request fails: old reports remain hidden, error & retry appear');

    myReportsDelayMs = 0;
    let reportsRequestShouldFail = true;
    let failedEndpointCalled = false;

    // Intercept reports/me to return HTTP 500 when switching back to User 1
    await pageSignedIn.route(/\/api\/reports\/me$/, async (route) => {
      if (reportsRequestShouldFail) {
        failedEndpointCalled = true;
        route.fulfill({
          status: 500,
          headers: { 'access-control-allow-origin': '*' },
          contentType: 'application/json',
          body: JSON.stringify({ detail: 'Database cluster connection failed' }),
        });
      } else {
        route.fulfill({
          status: 200,
          headers: { 'access-control-allow-origin': '*' },
          contentType: 'application/json',
          body: JSON.stringify([mockReportSubmitted]),
        });
      }
    });

    // Switch session in localStorage back to User 1
    await pageSignedIn.evaluate(({ sessionUser1 }) => {
      localStorage.setItem('sb-akryryfzxkyeqpvmkxoc-auth-token', JSON.stringify(sessionUser1));
    }, { sessionUser1: mockSessionUser1 });

    // Reload page to switch session
    await pageSignedIn.reload();
    await pageSignedIn.waitForTimeout(500);

    assert(failedEndpointCalled, 'Failed report endpoint was queried during user switch');

    // 1. Verify User 2's reports remain completely HIDDEN
    const user2ReportAfterFail = await pageSignedIn.locator(`text=ID: ${mockReportId2}`).count();
    assert(user2ReportAfterFail === 0, 'Previous user (User 2) reports remain completely hidden on fetch error');

    // 2. Verify not stuck on loading screen
    const loadingAfterFail = await pageSignedIn.locator('text=Loading your outage reports from service...').count();
    assert(loadingAfterFail === 0, 'Not stuck on loading screen when new user fetch fails');

    // 3. Verify error message appears in reports section and Card 2
    const errorBanner = pageSignedIn.locator('text=Database cluster connection failed');
    assert((await errorBanner.count()) > 0, 'Error banner rendered displaying backend error message');

    const card2Error = pageSignedIn.locator('text=Unable to load active reports');
    assert((await card2Error.count()) > 0, 'Card 2 indicates failure to load active reports');

    // 4. Verify Retry button is present and functional
    const retryBtn = pageSignedIn.locator('button:has-text("Retry")').first();
    assert((await retryBtn.count()) > 0, 'Retry button rendered in error state');

    // Now allow retry to succeed
    reportsRequestShouldFail = false;
    await retryBtn.click();
    await pageSignedIn.waitForTimeout(600);

    // Verify User 1's report is now displayed after retry
    const user1ReportAfterRetry = pageSignedIn.locator(`text=ID: ${mockReportId}`);
    assert((await user1ReportAfterRetry.count()) > 0, 'User 1 report rendered successfully after clicking Retry');

    // Verify User 2's reports are still NOT present
    const user2StillHidden = await pageSignedIn.locator(`text=ID: ${mockReportId2}`).count();
    assert(user2StillHidden === 0, 'Previous user reports still hidden after successful retry');

    await contextSignedIn.close();

    // -------------------------------------------------------------
    // Test 9: Citizen Portal Guest / Signed-Out State
    // -------------------------------------------------------------
    console.log('\n[Test 9] Citizen Portal Guest/Signed-Out State');
    const contextGuest = await browser.newContext();
    const pageGuest = await contextGuest.newPage();

    await pageGuest.goto(`${baseUrl}/#citizen-demo`, { waitUntil: 'networkidle' });
    await pageGuest.waitForTimeout(500);

    const guestCardPrompt = pageGuest.locator('text=Sign in to track reports');
    assert((await guestCardPrompt.count()) > 0, 'Active Reports card prompts to sign in');

    const guestSectionPrompt = pageGuest.locator('h3:has-text("Sign In to View Your Reports")');
    assert((await guestSectionPrompt.count()) > 0, 'Reports section prompts guest to sign in');

    await contextGuest.close();

    console.log('\n===========================================================');
    console.log(`Phase 8 Verification Summary: ${passedCount}/${totalCount} assertions passed.`);
    console.log('===========================================================');
  } catch (err) {
    console.error('\n✖ Phase 8 Verification Test encountered an error:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

runPhase8Tests();
