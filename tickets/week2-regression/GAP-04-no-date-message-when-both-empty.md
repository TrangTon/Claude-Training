# GAP-04 Dates: "Book now" with both dates empty shows no message

**Type:** Bug · **Priority:** Medium
**Page:** Booking form demo, `lantern-stay-tests/app/index.html`
**Requirement:** LS-107 AC9. If either date is empty and I press Submit, I see "Choose check-in and check-out dates".
**Frequency:** Every time
**Related:** the same bug as the BUG-02 draft (`bugs/BUG-02-no-date-error.md`, not committed yet). Close one of the two as a duplicate.

## Preconditions
- Chrome, a freshly loaded page. No server needed.

## Steps to reproduce
1. Open `lantern-stay-tests/app/index.html`.
2. Leave **Check-in** and **Check-out** empty.
3. Type `2` in **Guests** and choose **Standard** in **Room type**.
4. Click **Book now**.

## Expected result
"Choose check-in and check-out dates" appears under Check-out, and the booking isn't sent.

## Actual result
- No message appears anywhere, and the booking isn't sent.
- The guest gets no feedback at all.
- If only **one** date is empty, the message **does** appear.

## Notes for the developer
`checkDates()` (line 74) writes the check-out message only when at least one date is filled: `(ci || co) ? coMsg : ''`. On Submit, it should always show it.
