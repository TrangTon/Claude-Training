# GAP-03 Dates: changing check-in doesn't clear check-out

**Type:** Bug · **Priority:** Medium
**Pages:** Both. Booking form demo (`lantern-stay-tests/app/index.html`) and main booking page (`App/index.html`).
**Requirement:** LS-107 AC6. If check-in 10/11 and check-out 12/11 are set and I change check-in to 15/11, check-out is cleared and I'm asked to pick it again.
**Frequency:** Every time

## Preconditions
- Chrome, page opened straight from the file. No server needed.
- Any future dates work. The example uses the spec's dates, so today must be before 10/11/2026; otherwise shift all three dates forward.

## Steps to reproduce
1. Open `lantern-stay-tests/app/index.html`.
2. Set **Check-in** to 10/11/2026 and **Check-out** to 12/11/2026.
3. Change **Check-in** to 15/11/2026.

## Expected result
- **Check-out** is emptied.
- The page asks the guest to pick check-out again.

## Actual result
- **Check-out** still says 12/11/2026.
- The demo shows "Check-out must be after check-in".
- The main page shows nothing until **Check price** is clicked.

The guest has to work out for themselves that the old date is now invalid.

## Notes for the developer
On the demo, the `change` handler for `checkin` is the place to clear `checkout` when the new check-in is on or after it. The open question in LS-107 doesn't cover this; the AC is clear.
