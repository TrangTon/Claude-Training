# GAP-07 Main booking page: guest checks don't match LS-106

**Type:** Bug · **Priority:** Medium
**Page:** Main booking page, `App/index.html`
**Requirement:** LS-106 AC3–AC7 and AC10
**Blocked by:** GAP-10. LS-101 and LS-106 disagree on the error text, so BA has to choose before dev changes anything.

## Preconditions
- Chrome, page opened straight from the file. No server needed.
- Valid inputs for every other field: any two future dates, check-out after check-in, and **Standard** room.

## Steps to reproduce
1. Open `App/index.html` and fill in valid dates.
2. Put each value from the table in **Guests**, then click **Check price**.

| AC | Guests | Expected (LS-106) | Actual |
|---|---|---|---|
| AC3 | `0` | "Enter 1 to 6 guests" | "Guests must be between 1 and 6." |
| AC4 | `7` | "Enter 1 to 6 guests" | "Guests must be between 1 and 6." |
| AC5 | `2.5` | "Number of guests must be a whole number" | Chrome's own bubble: "Please enter a valid value. The two nearest valid values are 2 and 3." |
| AC6 | `-1` | "Enter 1 to 6 guests" | "Guests must be between 1 and 6." |
| AC6 | `abc` | "Enter 1 to 6 guests" | The field won't accept letters (number input); then the same as empty |
| AC7 | *(empty)* | "Number of guests is required" + field highlighted | "Guests must be between 1 and 6.", no highlight |
| AC10 | `7`, Check price, then change to `3` | Error disappears straight away | Error stays until **Check price** is clicked again |

In every case the booking is blocked correctly. Only the wording, the timing and the highlight are wrong.

## Notes for the developer
- The booking form demo (`lantern-stay-tests/app/index.html`, `checkGuests()`) already does all of this, live on every keystroke. Reuse it rather than rewriting it.
- The highlight part is tracked in GAP-02.
