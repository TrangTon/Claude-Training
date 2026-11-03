// LS-101 Guests must be 1–6 – acceptance criteria from specs/LS-101.md
// Runs against the main app (App/index.html), which LS-101 changed.
const { test, expect } = require('@playwright/test');
const path = require('path');
const { pathToFileURL } = require('url');

const APP_URL = pathToFileURL(path.join(__dirname, '../../App/index.html')).href;
const GUESTS_ERROR = 'Guests must be between 1 and 6.';
const PRICE_FOR_2_STANDARD_NIGHTS = '2 night(s) · Total 1,200,000 VND';

// Helper: a date N days from today, as YYYY-MM-DD (Vietnam time)
function daysFromToday(n) {
  const d = new Date(Date.now() + n * 86400000);
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(d);
}

async function checkPriceFor(page, guests) {
  await page.getByLabel('Guests').fill(guests);
  await page.getByRole('button', { name: 'Check price' }).click();
}

// Given valid dates: 2 nights in a Standard room (the default)
test.beforeEach(async ({ page }) => {
  await page.goto(APP_URL);
  await page.getByLabel('Check-in').fill(daysFromToday(7));
  await page.getByLabel('Check-out').fill(daysFromToday(9));
});

test('LS-101 AC1: 0 guests shows the error and no price', async ({ page }) => {
  await checkPriceFor(page, '0');
  await expect(page.getByRole('alert')).toHaveText(GUESTS_ERROR);
  await expect(page.locator('#result')).toBeEmpty();
});

for (const guests of ['1', '6']) {
  test(`LS-101 AC2: ${guests} guest(s) shows the price`, async ({ page }) => {
    await checkPriceFor(page, guests);
    await expect(page.locator('#result')).toHaveText(PRICE_FOR_2_STANDARD_NIGHTS);
    await expect(page.getByRole('alert')).toBeEmpty();
  });
}

test('LS-101 AC3: 7 guests shows the same error and no price', async ({ page }) => {
  await checkPriceFor(page, '7');
  await expect(page.getByRole('alert')).toHaveText(GUESTS_ERROR);
  await expect(page.locator('#result')).toBeEmpty();
});
