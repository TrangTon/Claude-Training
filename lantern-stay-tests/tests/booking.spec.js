// Lantern Stay booking form – tests based on tickets LS-101, LS-102, LS-103
const { test, expect } = require('@playwright/test');

// Helper: a date N days from today, as YYYY-MM-DD (Vietnam time)
function daysFromToday(n) {
  const d = new Date(Date.now() + n * 86400000);
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(d);
}

test.beforeEach(async ({ page }) => {
  await page.goto('index.html');
});

// Find the Guests field by its visible label, not its id (ids change in redesigns)
const guestsField = (page) => page.getByLabel('Guests', { exact: true });
const roomField = (page) => page.getByLabel('Room type');

// ---------- LS-101 Guests (R1) ----------
test('LS-101 AC1: 1 guest is accepted', async ({ page }) => {
  await guestsField(page).fill('1');
  await expect(page.locator('#guests-error')).toHaveText('');
});

test('LS-101 AC4: 7 guests shows an error', async ({ page }) => {
  await guestsField(page).fill('7');
  await expect(page.getByText('Enter 1 to 6 guests')).toBeVisible();
});

test('LS-101 AC5: 2.5 guests must be a whole number', async ({ page }) => {
  await guestsField(page).fill('2.5');
  await expect(page.getByText('Number of guests must be a whole number')).toBeVisible();
});

// ---------- LS-102 Dates (R2, R3) ----------
test('LS-102 AC2: check-in yesterday is rejected', async ({ page }) => {
  await page.locator('#checkin').fill(daysFromToday(-1));
  await expect(page.getByText('Check-in must be today or later')).toBeVisible();
});

test('LS-102 AC4: same-day check-out is rejected', async ({ page }) => {
  await page.locator('#checkin').fill(daysFromToday(5));
  await page.locator('#checkout').fill(daysFromToday(5));
  await expect(page.getByText('Check-out must be after check-in')).toBeVisible();
});

// ---------- LS-103 Price (R4) ----------
test('LS-103 AC2: Standard, 3 nights = 1,800,000 ₫', async ({ page }) => {
  await page.locator('#checkin').fill(daysFromToday(8));
  await page.locator('#checkout').fill(daysFromToday(11));
  await roomField(page).selectOption('standard');
  await expect(page.getByTestId('price')).toHaveText('3 nights × 600,000 ₫ = 1,800,000 ₫');
});

test('LS-103 AC6: switching to Deluxe updates the price', async ({ page }) => {
  await page.locator('#checkin').fill(daysFromToday(8));
  await page.locator('#checkout').fill(daysFromToday(11));
  await roomField(page).selectOption('standard');
  await roomField(page).selectOption('deluxe');
  await expect(page.getByTestId('price')).toHaveText('3 nights × 900,000 ₫ = 2,700,000 ₫');
});
