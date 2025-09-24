import { Given, When, Then } from '@cucumber/cucumber';
import { chromium, Browser, Page, expect } from '@playwright/test';

let browser: Browser;
let page: Page;

Given('the user is on the login page', async function () {
  browser = await chromium.launch();
  page = await browser.newPage();
  await page.goto('https://example.com/login');
});

When('the user enters valid credentials', async function () {
  await page.fill('#username', 'testuser');
  await page.fill('#password', 'password123');
  await page.click('button[type="submit"]');
});

Then('the user should be redirected to the dashboard', async function () {
  await page.waitForURL('**/dashboard');
  expect(page.url()).toContain('/dashboard');
  await browser.close();
});
