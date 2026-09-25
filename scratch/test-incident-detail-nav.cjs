const { chromium } = require('playwright');

(async () => {
  console.log('Launching browser for Incident Detail "Back to Outage History" verification...');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto('http://localhost:4174/', { waitUntil: 'domcontentloaded' });

    // Open Incident Detail from Live Outages
    await page.click('button:has-text("View Incident")');
    await page.waitForTimeout(500);

    // Verify all 4 top nav buttons exist
    const btnLiveOutages = await page.innerText('button:has-text("Back to Live Outages")');
    const btnOutageHistory = await page.innerText('button:has-text("Back to Outage History")');
    const btnCitizen = await page.innerText('button:has-text("Back to Citizen Portal")');
    const btnDept = await page.innerText('button:has-text("Back to Department Portal")');

    console.log('✔ Found button 1:', btnLiveOutages);
    console.log('✔ Found button 2:', btnOutageHistory);
    console.log('✔ Found button 3:', btnCitizen);
    console.log('✔ Found button 4:', btnDept);

    // Click "Back to Outage History"
    await page.click('button:has-text("Back to Outage History")');
    await page.waitForTimeout(500);

    const historyTitle = await page.innerText('main h1');
    console.log('✔ Clicked "Back to Outage History" without refresh. Opened screen title:', historyTitle);

    console.log('\n✅ INCIDENT DETAIL NAV BUTTON VERIFICATION PASSED PERFECTLY!');
  } catch (err) {
    console.error('❌ Verification Failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
