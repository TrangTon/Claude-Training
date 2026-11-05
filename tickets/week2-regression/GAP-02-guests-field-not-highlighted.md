# GAP-02 Guests: an invalid field isn't highlighted or linked to its error message

**Type:** Bug (accessibility) · **Priority:** Medium
**Pages:** Both. Booking form demo (`lantern-stay-tests/app/index.html`) and main booking page (`App/index.html`).
**Requirement:**
- LS-106 AC7: empty guests + Submit shows "Number of guests is required" **and the field is highlighted**.
- LS-106 Scope: error text that screen readers can announce, linked to the field with `aria-describedby`.

**Frequency:** Every time

## Preconditions
- Chrome, page opened straight from the file. No server needed.

## Steps to reproduce (booking form demo)
1. Open `lantern-stay-tests/app/index.html`.
2. Leave **Guests** empty and click **Book now**.
3. Look at the Guests input box.

## Expected result
- "Number of guests is required" appears.
- The Guests box is visibly highlighted, e.g. a red border.
- The input has `aria-invalid="true"` and `aria-describedby="guests-error"`, so a screen reader reads the message when the field gets focus.

## Actual result
- The message appears.
- The box keeps its normal grey border (`rgb(118, 118, 118)`).
- The input has no `aria-invalid` and no `aria-describedby`.

The main booking page has the same problem. Its single error box has `role="alert"`, so screen readers announce it, but it isn't linked to the field it belongs to. It also shows the wrong message here; see GAP-07.

## Notes for the developer
The booking form demo has no ARIA attributes on any field. Fix check-in and check-out the same way as Guests.
