# GAP-01 Guests: a value of only spaces says "required" instead of "Enter 1 to 6 guests"

**Type:** Bug · **Priority:** Low
**Page:** Booking form demo, `lantern-stay-tests/app/index.html`
**Requirement:** LS-106 AC6. For -1, abc *or a space*, show "Enter 1 to 6 guests" and block submit.
**Frequency:** Every time

## Preconditions
- Chrome, page opened straight from the file. No server needed.

## Steps to reproduce
1. Open `lantern-stay-tests/app/index.html`.
2. Click **Guests** and press the space bar once.

## Expected result
"Enter 1 to 6 guests" appears under Guests.

## Actual result
"Number of guests is required" appears. Submit is still blocked, so no bad booking gets through, but the message doesn't match the spec.

## Notes for the developer
`checkGuests()` trims the value before checking it, so `" "` becomes `""` and hits the "required" branch. The other AC6 values (`-1`, `abc`) already show the right message.

If the team prefers "required" for spaces, update LS-106 AC6 instead of the code.
