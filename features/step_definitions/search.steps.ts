import { Given, When, Then } from '@cucumber/cucumber';
import { chromium, Browser, Page, expect } from '@playwright/test';

let browser: Browser;
let page: Page;

Given('the user is on the homepage', async function () {
  browser = await chromium.launch();
  page = await browser.newPage();
  await page.goto('https://example.com');
});

When('the user searches for {string}', async function (searchTerm: string) {
  await page.fill('#search', searchTerm);
  await page.click('#search-button');
});

Then('search results for {string} should be displayed', async function (searchTerm: string) {
  await page.waitForSelector('.search-results');
  const resultsText = await page.textContent('.search-results');
  expect(resultsText).toContain(searchTerm);
  await browser.close();
});
