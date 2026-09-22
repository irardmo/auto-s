const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Go to site
  await page.goto('http://localhost:3000/auto.html');
  await page.waitForTimeout(1000);

  // Select Per-Section tab if needed
  const sectionTab = page.locator('button:has-text("Per-Section Auto Generator")');
  if (await sectionTab.isVisible()) {
    await sectionTab.click();
  }

  // Fill section options: BSIT, Year 1, Block A
  await page.selectOption('#section-course', 'BSIT');
  await page.selectOption('#section-year', '1');
  await page.selectOption('#section-block', 'A');

  await page.click('button:has-text("Load Section Subjects")');
  await page.waitForTimeout(1000);

  // Assign instructors to all
  const selectors = await page.$$('.section-instructor-select');
  for (const sel of selectors) {
    const options = await sel.$$('option');
    if (options.length > 1) {
      const val = await options[1].getAttribute('value');
      await sel.selectOption(val);
    }
  }

  // Set single subject hours if available
  const hoursSelects = await page.$$('.section-hours-select');
  for (const hs of hoursSelects) {
    await hs.selectOption('3');
  }

  // Click generate
  await page.click('#generateSectionBtn');
  await page.waitForTimeout(2000);

  // Navigate to schedule board
  await page.goto('http://localhost:3000/board.html');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/tmp/verified_board.png', fullPage: true });

  await browser.close();
  console.log('Verification completed.');
})();
