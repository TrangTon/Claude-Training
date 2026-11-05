// LS-108 Show the price before they book – acceptance criteria from specs/LS-108.md
const { test, expect } = require('@playwright/test');

const PLACEHOLDER = 'Choose dates and room type to see the price';

// The spec's examples use dates in November 2026. Freeze "today" at 02/11/2026
// (Vietnam time, as in LS-107) so those dates never fall into the past.
test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-11-02T09:00:00+07:00'));
  await page.goto('index.html');
});

async function choose(page, { checkin, checkout, room }) {
  if (checkin) await page.getByLabel('Check-in').fill(checkin);
  if (checkout) await page.getByLabel('Check-out').fill(checkout);
  if (room) await page.getByLabel('Room type').selectOption(room);
}

const price = (page) => page.getByTestId('price');

// ---------- AC1–AC5: total = nights × nightly rate (R4) ----------
const priceExamples = [
  { ac: 'AC1', title: 'Standard, 1 night', checkin: '2026-11-10', checkout: '2026-11-11', room: 'standard',
    expected: '1 night × 600,000 ₫ = 600,000 ₫' },
  { ac: 'AC2', title: 'Standard, 3 nights', checkin: '2026-11-10', checkout: '2026-11-13', room: 'standard',
    expected: '3 nights × 600,000 ₫ = 1,800,000 ₫' },
  { ac: 'AC3', title: 'Deluxe, 2 nights', checkin: '2026-11-10', checkout: '2026-11-12', room: 'deluxe',
    expected: '2 nights × 900,000 ₫ = 1,800,000 ₫' },
  { ac: 'AC4', title: 'Deluxe, 7 nights', checkin: '2026-11-10', checkout: '2026-11-17', room: 'deluxe',
    expected: '7 nights × 900,000 ₫ = 6,300,000 ₫' },
  { ac: 'AC5', title: 'Deluxe, 3 nights across a month change', checkin: '2027-01-30', checkout: '2027-02-02', room: 'deluxe',
    expected: '3 nights × 900,000 ₫ = 2,700,000 ₫' },
];

for (const { ac, title, expected, ...booking } of priceExamples) {
  test(`LS-108 ${ac}: ${title} shows ${expected}`, async ({ page }) => {
    await choose(page, booking);
    await expect(price(page)).toHaveText(expected);
  });
}

// ---------- AC6–AC7: the price reacts to room type, not to guests ----------
test('LS-108 AC6: switching Standard to Deluxe updates the price without a reload', async ({ page }) => {
  await choose(page, { checkin: '2026-11-10', checkout: '2026-11-13', room: 'standard' });
  await expect(price(page)).toHaveText('3 nights × 600,000 ₫ = 1,800,000 ₫');
  await page.evaluate(() => { window.notReloaded = true; });

  await page.getByLabel('Room type').selectOption('deluxe');

  await expect(price(page)).toHaveText('3 nights × 900,000 ₫ = 2,700,000 ₫');
  expect(await page.evaluate(() => window.notReloaded)).toBe(true);
});

test('LS-108 AC7: changing guests from 2 to 4 keeps the same price', async ({ page }) => {
  await page.getByLabel('Guests', { exact: true }).fill('2');
  await choose(page, { checkin: '2026-11-10', checkout: '2026-11-13', room: 'standard' });
  await expect(price(page)).toHaveText('3 nights × 600,000 ₫ = 1,800,000 ₫');

  await page.getByLabel('Guests', { exact: true }).fill('4');

  await expect(price(page)).toHaveText('3 nights × 600,000 ₫ = 1,800,000 ₫');
});

// ---------- AC8: no number until dates and room type are valid ----------
const notReady = [
  { title: 'no room type is chosen', checkin: '2026-11-10', checkout: '2026-11-13' },
  { title: 'check-out is missing', checkin: '2026-11-10', room: 'standard' },
  { title: 'check-in is in the past', checkin: '2026-11-01', checkout: '2026-11-03', room: 'standard' },
  { title: 'check-out is before check-in', checkin: '2026-11-10', checkout: '2026-11-08', room: 'standard' },
];

for (const { title, ...booking } of notReady) {
  test(`LS-108 AC8: shows only the placeholder when ${title}`, async ({ page }) => {
    await choose(page, booking);
    await expect(price(page)).toHaveText(PLACEHOLDER);
  });
}

test('LS-108 AC8: a shown price goes back to the placeholder when the dates become invalid', async ({ page }) => {
  await choose(page, { checkin: '2026-11-10', checkout: '2026-11-13', room: 'standard' });
  await expect(price(page)).toHaveText('3 nights × 600,000 ₫ = 1,800,000 ₫');

  await page.getByLabel('Check-out').fill('2026-11-10');

  await expect(price(page)).toHaveText(PLACEHOLDER);
});

// ---------- AC9–AC10 ----------
test.fixme('LS-108 AC9: the server recalculates a tampered price', async () => {
  // Needs the booking server, which this repo doesn't have yet.
});

test('LS-108 AC10: the total is whole VND with thousands separators and ₫', async ({ page }) => {
  await choose(page, { checkin: '2026-11-10', checkout: '2026-11-17', room: 'deluxe' });
  await expect(price(page)).toHaveText(/= \d{1,3}(,\d{3})+ ₫$/);
});
