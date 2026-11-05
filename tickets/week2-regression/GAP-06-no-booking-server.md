# GAP-06 No booking server: server-side checks and pricing aren't built

**Type:** Story (feature not built) · **Priority:** High. Without it, every browser check can be bypassed.
**Pages:** Both booking pages
**Requirement:** every server AC in the Week-2 packs:

| Pack | AC | Rule |
|---|---|---|
| LS-106 | AC8 | Server rejects guests = 9 and saves nothing |
| LS-107 | AC8 | A form left open past midnight: server rejects a check-in that is now in the past ("Check-in must be today or later") |
| LS-107 | AC10 | Server rejects check-out ≤ check-in, or a past check-in, and saves nothing |
| LS-108 | AC9 | Server recalculates the price from dates and room type, ignores the price sent, saves the correct total |
| LS-108 | Scope | Nightly rates stored on the server in one place, not written into the page |

## What's built today
- There is no server. Both pages are static HTML files.
- The main page's **Check price** and the demo's **Book now** never send anything anywhere.
- The nightly rates (600,000 / 900,000) are hard-coded in each page's script.
- Every check above exists only in the browser, or not at all.

## What's needed
- An endpoint that accepts a booking and checks R1–R4 again on the server, using Vietnam time for "today".
- It rejects invalid bookings with a validation error and saves nothing.
- It saves the total it works out itself.
- Rates come from one place on the server, and the page reads them from there.

## Notes
- This blocks testing of 5 ACs. They're marked N/A in the regression results and `test.fixme` in `tests/ls-108-price.spec.js`.
- This is probably an architecture decision more than a ticket. Raise it with the tech lead before splitting it into tasks.
