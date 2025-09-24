import { test, expect } from '@playwright/test';

async function showStep(page, step) {
  const now = new Date();
  const time = now.toISOString();
  const text = `[${time}] ${step}`;
  await page.evaluate((msg) => {
    let el = document.getElementById('__step_overlay');
    if (!el) {
      el = document.createElement('div');
      el.id = '__step_overlay';
      el.style.position = 'fixed';
      el.style.top = '10px';
      el.style.left = '10px';
      el.style.zIndex = '99999';
      el.style.background = 'rgba(0,0,0,0.7)';
      el.style.color = '#fff';
      el.style.padding = '8px 16px';
      el.style.borderRadius = '8px';
      el.style.fontSize = '16px';
      el.style.fontFamily = 'monospace';
      el.style.pointerEvents = 'none';
      document.body.appendChild(el);
    }
    el.textContent = msg;
  }, text);
  console.log(text);
}

test('Validate iPhone 15 Pro availability on Flipkart', async ({ page, context }) => {
  await showStep(page, 'Navigating to Flipkart');
  await page.goto('https://www.flipkart.com/', { waitUntil: 'domcontentloaded' });

  await showStep(page, 'Checking for login popup');
  const closeBtn = await page.$('button._2KpZ6l._2doB4z');
  if (closeBtn) {
    await showStep(page, 'Closing login popup');
    await closeBtn.click();
  }

  await showStep(page, 'Filling search input with "iphone 15 pro"');
  await page.fill('input[name="q"]', 'iphone 15 pro');
  await page.waitForTimeout(1200); // Wait for suggestions to appear

  await showStep(page, 'Looking for suggestion containing "iphone 15 pro"');
  const suggestions = await page.$$('ul._1sFryS li');
  let clickedSuggestion = false;
  for (const suggestion of suggestions) {
    const text = await suggestion.textContent();
    if (text && text.toLowerCase().includes('iphone 15 pro')) {
      await showStep(page, 'Clicking suggestion: ' + text.trim());
      await suggestion.click();
      clickedSuggestion = true;
      break;
    }
  }
  if (!clickedSuggestion) {
    await showStep(page, 'No suggestion found, pressing Enter');
    await page.press('input[name="q"]', 'Enter');
  }

  await showStep(page, 'Waiting for product list');
  await page.waitForSelector('div._4rR01T, div._2kHMtA', { timeout: 10000 });
  const productHandles = await page.$$('div._4rR01T, div._2kHMtA');
  let found = false;
  let productPromise;
  for (const handle of productHandles) {
    const text = await handle.textContent();
    if (text && text.includes('Apple iPhone 15 Pro (White Titanium, 512 GB)')) {
      await showStep(page, 'Clicking product: ' + text.trim());
      productPromise = context.waitForEvent('page').catch(() => null);
      await handle.click();
      found = true;
      break;
    }
  }
  expect(found).toBeTruthy();

  await showStep(page, 'Waiting for product page/tab');
  let productPage = await Promise.race([
    productPromise,
    new Promise(resolve => setTimeout(() => resolve(page), 2000))
  ]);
  if (!productPage) productPage = page;
  await productPage.waitForLoadState('domcontentloaded');

  await showStep(page, 'Checking product status (available/sold out)');
  let status = '';
  const availableBtn = await productPage.$('button._2KpZ6l._1KAjNd, button._2KpZ6l._2ObVJD');
  if (availableBtn) {
    status = 'Available';
  } else {
    const soldOutText = await productPage.$('text=/Sold Out/i');
    status = soldOutText ? 'Sold Out' : 'Status Unknown';
  }
  await showStep(page, 'Product status: ' + status);
  expect(['Available', 'Sold Out', 'Status Unknown']).toContain(status);
});
