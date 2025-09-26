import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://testerbud.com/');
  await expect(page.getByRole('heading', { name: 'TesterBud – The Ultimate' })).toBeVisible();
  await page.getByRole('button', { name: 'Practice Sites' }).click();
  await expect(page.getByRole('link', { name: '🔐 Login Automation' })).toBeVisible();
  await page.getByRole('link', { name: '🔐 Login Automation' }).click();
  await expect(page.getByRole('heading', { name: 'Login to Your Practice Account' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Email Address' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Email Address' }).fill('varun@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Pass123');
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.locator('#root')).toContainText('Invalid email id and password');
});