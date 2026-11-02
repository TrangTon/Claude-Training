# Lantern Stay – "break a selector" exercise

Training demo only (fictional homestay).

## Setup (once)

1. Install Node.js 18 or newer.
2. Unzip this folder, open a terminal inside it, and run:

   ```bash
   npm install
   npx playwright install chromium
   ```

## The exercise

| Step | Do this | Expect |
|---|---|---|
| 1. Run the suite | `npx playwright test` | 7 passed |
| 2. Break a selector | In `app/index.html`, rename the Guests field id: `guests` → `guest-count` (3 places: `for=`, `id=`, and `$('guests')` in the script) | 3 LS-101 tests fail: "waiting for locator('#guests')" |
| 3. Let Claude repair it | Ask Claude: *"3 LS-101 tests fail with 'waiting for locator('#guests')'. Find why and fix the tests. Don't change the app code and don't remove any checks."* | Claude switches to `page.getByLabel('Guests', { exact: true })` |
| 4. Re-run green | `npx playwright test` | 7 passed |

Note: this copy is the **finished** version (already broken and repaired).
To start from the beginning, change the id back to `guests` in `app/index.html`,
and in `tests/booking.spec.js` replace `guestsField(page)` with `page.locator('#guests')`.

## Useful commands

- `npx playwright test --headed` – watch the browser
- `npx playwright test --ui` – step through tests visually
- `npx playwright show-report` – open the last HTML report
