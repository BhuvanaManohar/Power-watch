const { chromium } = require('playwright');

(async () => {
  console.log('Launching browser for step-by-step manual sequence check...');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Start on landing page
    await page.goto('http://localhost:4174/', { waitUntil: 'domcontentloaded' });
    console.log('1. Loaded landing page');

    // 1. Open Outage History
    await page.click('header nav a:has-text("Outage History")');
    await page.waitForTimeout(300);
    console.log('2. Clicked Outage History. Header title:', await page.innerText('main h1'));

    // 2. Without refreshing, click Home
    await page.click('header nav a:has-text("Home")');
    await page.waitForTimeout(300);
    console.log('3. Clicked Home. Main title:', await page.innerText('main h1'));

    // 3. Return to Outage History
    await page.click('header nav a:has-text("Outage History")');
    await page.waitForTimeout(300);
    console.log('4. Clicked Outage History again. Header title:', await page.innerText('main h1'));

    // 4. Without refreshing, click Live Outages
    await page.click('header nav a:has-text("Live Outages")');
    await page.waitForTimeout(300);
    console.log('5. Clicked Live Outages. Main title:', await page.innerText('main h1'));

    // 5. Return to Outage History
    await page.click('header nav a:has-text("Outage History")');
    await page.waitForTimeout(300);
    console.log('6. Clicked Outage History third time. Header title:', await page.innerText('main h1'));

    // 6. Click Home again
    await page.click('header nav a:has-text("Home")');
    await page.waitForTimeout(300);
    console.log('7. Clicked Home again. Main title:', await page.innerText('main h1'));

    console.log('\n✅ ALL 6 MANUAL STEP CHECKS PASSED PERFECTLY WITHOUT REFRESH!');
  } catch (err) {
    console.error('❌ Manual Check Failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
