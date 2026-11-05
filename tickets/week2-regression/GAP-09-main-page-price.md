# GAP-09 Main booking page: price doesn't match LS-108, and shows the wrong total after a room switch

**Type:** Bug · **Priority:** High. A guest can see the Standard total while Deluxe is selected.
**Page:** Main booking page, `App/index.html`
**Requirement:** LS-108 AC1–AC6, AC8, AC10. AC7 passes; AC9 is in GAP-06.

## Preconditions
- Chrome, page opened straight from the file. No server needed.
- Any two future dates 3 nights apart, e.g. 10/11/2026 → 13/11/2026.

## Steps to reproduce: wrong total after switching room (the worst part)
1. Open `App/index.html`.
2. Set check-in 10/11/2026 and check-out 13/11/2026. Leave **Room** as Standard.
3. Click **Check price**. You see `3 night(s) · Total 1,800,000 VND`.
4. Change **Room** to **Deluxe**. Don't click anything.

**Expected (AC6):** the price changes to `3 nights × 900,000 ₫ = 2,700,000 ₫` straight away.
**Actual:** it still says `3 night(s) · Total 1,800,000 VND`, the Standard price, next to "Deluxe". It only updates when **Check price** is clicked again.

## Other gaps

| AC | Expected (LS-108) | Actual |
|---|---|---|
| AC1–AC5 | Price appears **as soon as** dates and room are picked | Nothing appears until **Check price** is clicked |
| AC1–AC5 | Format: `3 nights × 600,000 ₫ = 1,800,000 ₫` (nights, rate, total) | `3 night(s) · Total 1,800,000 VND` (no rate shown, "night(s)") |
| AC8 | Dates missing or invalid: the price area says "Choose dates and room type to see the price" | The price area is empty |
| AC8 | No room chosen: the placeholder | Not possible; Room always defaults to Standard |
| AC10 | Currency symbol **₫** | Currency written as **VND** |

The totals themselves are correct in every example, including the month change in AC5.

## Notes for the developer
- The booking form demo (`updatePrice()` on `change` events, and the `vnd()` formatter) passes every one of these. Port it rather than patching.
- Whether Room should start empty ("Choose a room") is a design choice. AC8 implies it should.
