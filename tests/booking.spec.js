// Lantern Stay booking form – checks the client rules R1–R4 from README.md
const { test, expect } = require('@playwright/test');

// Returns a date as YYYY-MM-DD, `offset` days from today
function day(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

test.beforeEach(async ({ page }) => {
  await page.goto('index.html');
});

test('R4: Standard room, 2 nights = 1,200,000 VND', async ({ page }) => {
  await page.locator('#checkin').fill(day(1));
  await page.locator('#checkout').fill(day(3));
  await page.locator('#guests').fill('2');
  await page.locator('#room').selectOption('standard');
  await page.locator('button[type="submit"]').click();
  await expect(page.locator('#result')).toHaveText('2 night(s) · Total 1,200,000 VND');
});

test('R4: Deluxe room, 3 nights = 2,700,000 VND', async ({ page }) => {
  await page.locator('#checkin').fill(day(1));
  await page.locator('#checkout').fill(day(4));
  await page.locator('#room').selectOption('deluxe');
  await page.locator('button[type="submit"]').click();
  await expect(page.locator('#result')).toHaveText('3 night(s) · Total 2,700,000 VND');
});

test('R3: check-out on the same day as check-in is rejected', async ({ page }) => {
  await page.locator('#checkin').fill(day(1));
  await page.locator('#checkout').fill(day(1));
  await page.locator('button[type="submit"]').click();
  await expect(page.locator('#error')).toHaveText('Check-out must be after check-in.');
  await expect(page.locator('#result')).toBeEmpty();
});

test('R1: 7 guests is rejected', async ({ page }) => {
  await page.locator('#checkin').fill(day(1));
  await page.locator('#checkout').fill(day(2));
  await page.locator('#guests').fill('7');
  await page.locator('button[type="submit"]').click();
  await expect(page.locator('#error')).toHaveText('Guests must be between 1 and 6.');
});

test('R1: 6 guests (upper boundary) is accepted', async ({ page }) => {
  await page.locator('#checkin').fill(day(1));
  await page.locator('#checkout').fill(day(2));
  await page.getByLabel('Guests').fill('6');
  await page.locator('button[type="submit"]').click();
  await expect(page.locator('#error')).toBeEmpty();
  await expect(page.locator('#result')).toHaveText('1 night(s) · Total 600,000 VND');
});
