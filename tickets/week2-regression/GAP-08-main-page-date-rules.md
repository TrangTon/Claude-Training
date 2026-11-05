# GAP-08 Main booking page: date checks don't match LS-107

**Type:** Bug · **Priority:** High. Guests can price a stay in the past.
**Page:** Main booking page, `App/index.html`
**Requirement:** LS-107 AC2, AC7, AC9. AC6 is tracked separately in GAP-03.
**Related:** the BUG-01 draft (`bugs/BUG-01-past-dates-priced.md`, not committed yet) covers AC2 with full reproduction steps. Close one as a duplicate.

## Preconditions
- Chrome, page opened straight from the file. No server needed.
- **Guests** `2`, **Room** Standard.

## Steps to reproduce
Click **Check price** after each setup:

| AC | Setup | Expected (LS-107) | Actual |
|---|---|---|---|
| AC2 | Check-in **yesterday**, check-out tomorrow | "Check-in must be today or later"; the date picker doesn't offer past days | No error; a price is shown (e.g. `2 night(s) · Total 1,200,000 VND`); the picker allows any past date |
| AC7 | Computer set to New York time, 20:00 on 01/11/2026 (= 08:00 on 02/11 in Vietnam). Check-in 01/11/2026 | Rejected, because "today" is Vietnam time | Accepted and priced |
| AC9 | Both dates empty | "Choose check-in and check-out dates" | Chrome's own bubble: "Please fill out this field." |
| AC9 | Only check-out empty | "Choose check-in and check-out dates" | Chrome's own bubble: "Please fill out this field." |

To reproduce AC7 without changing the computer's clock, run the regression (`npx playwright test -c regression` in `lantern-stay-tests`). It fakes New York time.

## Notes for the developer
- The submit handler never compares check-in with today, and the input has no `min`.
- The booking form demo already does both, with `todayVN()` in Vietnam time and `checkin.min`. AC4, AC5 and AC11 already pass here.
