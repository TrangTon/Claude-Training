# Week-2 requirements regression – 05/11/2026

**Packs checked:** LS-106 Guests (Issue #10), LS-107 Dates (Issue #11), LS-108 Price (Issue #12). The issue text matches `specs/LS-106–108.md` word for word.
**Built features checked:** the booking form demo (`lantern-stay-tests/app/index.html`) and the main booking page (`App/index.html`), both at `origin/main` 3a5d7e2.
**How:** every AC is checked by `lantern-stay-tests/regression/requirements.spec.js`, in Chromium, with "today" frozen at the packs' example date of 02/11/2026 (Vietnam time). Rerun with `npx playwright test -c regression` from `lantern-stay-tests/`.

## Result

| | Pass | Gap | Not testable (no server) |
|---|---|---|---|
| Booking form demo | 27 | 7 | 4 |
| Main booking page | 8 | 26 | 4 |

The booking form demo meets almost every Week-2 AC. The main booking page was built before these packs and meets few of them; it still follows LS-101. **Decide first which page ships.** If the demo replaces the main page, GAP-07, GAP-08 and GAP-09 become one "replace the page" task.

## Tickets

| Ticket | Pages | Pack / AC | Type | Priority |
|---|---|---|---|---|
| [GAP-01](GAP-01-guests-space-wrong-message.md) Guests of only spaces says "required" | Demo | LS-106 AC6 | Bug | Low |
| [GAP-02](GAP-02-guests-field-not-highlighted.md) Invalid field not highlighted or linked to its error | Both | LS-106 AC7, scope | Bug (a11y) | Medium |
| [GAP-03](GAP-03-checkout-not-cleared.md) Changing check-in doesn't clear check-out | Both | LS-107 AC6 | Bug | Medium |
| [GAP-04](GAP-04-no-date-message-when-both-empty.md) Both dates empty: no message | Demo | LS-107 AC9 | Bug | Medium |
| [GAP-05](GAP-05-no-vietnamese.md) No Vietnamese version | Both | LS-106 AC9, scopes | Story | Medium |
| [GAP-06](GAP-06-no-booking-server.md) No booking server | Both | LS-106 AC8, LS-107 AC8/AC10, LS-108 AC9, scope | Story | High |
| [GAP-07](GAP-07-main-page-guest-rules.md) Main page guest checks don't match LS-106 | Main | LS-106 AC3–7, AC10 | Bug | Medium |
| [GAP-08](GAP-08-main-page-date-rules.md) Main page date checks don't match LS-107 | Main | LS-107 AC2, AC7, AC9 | Bug | High |
| [GAP-09](GAP-09-main-page-price.md) Main page price doesn't match LS-108; wrong total after room switch | Main | LS-108 AC1–6, AC8, AC10 | Bug | High |
| [GAP-10](GAP-10-spec-conflicts.md) Specs conflict (LS-101 vs LS-106) and point to old ticket numbers | Specs | — | Task (BA) | Medium |

## Every AC

✅ pass · ❌ gap (with what the page showed) · ➖ not testable without a server

| AC | Check | Booking form demo | Main booking page |
|---|---|---|---|
| LS-106 AC1 | enter 1 → accepted, no error | ✅ | ✅ |
| LS-106 AC2 | enter 6 → accepted, no error | ✅ | ✅ |
| LS-106 AC3 | enter 0 → "Enter 1 to 6 guests", cannot submit | ✅ | ❌ messages="Guests must be between 1 and 6." submitted=false |
| LS-106 AC4 | enter 7 → "Enter 1 to 6 guests", cannot submit | ✅ | ❌ messages="Guests must be between 1 and 6." submitted=false |
| LS-106 AC5 | enter 2.5 → "Number of guests must be a whole number", cannot submit | ✅ | ❌ messages="native: Please enter a valid value. The two nearest valid values are 2 and 3." submitted=false |
| LS-106 AC6 | enter "-1" → "Enter 1 to 6 guests", cannot submit | ✅ | ❌ typed="-1" messages="Guests must be between 1 and 6." submitted=false |
| LS-106 AC6 | enter "abc" → "Enter 1 to 6 guests", cannot submit | ✅ | ❌ typed="" messages="Guests must be between 1 and 6." submitted=false |
| LS-106 AC6 | enter " " → "Enter 1 to 6 guests", cannot submit | ❌ typed=" " messages="Number of guests is required" submitted=false | ❌ typed="" messages="Guests must be between 1 and 6." submitted=false |
| LS-106 AC7 | empty guests + Submit → "Number of guests is required" and field highlighted | ❌ messages="Number of guests is required" highlight={"ariaInvalid":null,"border":"rgb(118, 118, 118)","outline":"none"} | ❌ messages="Guests must be between 1 and 6." highlight={"ariaInvalid":null,"border":"rgb(118, 118, 118)","outline":"none"} |
| LS-106 AC8 | server rejects guests = 9 and saves nothing | ➖ No booking server exists in the repo; the page never sends a booking anywhere. | ➖ No booking server exists in the repo; the page never sends a booking anywhere. |
| LS-106 AC9 | errors shown in Vietnamese when the form is in Vietnamese | ❌ html lang="en", Vietnamese switch present=false | ❌ html lang="en", Vietnamese switch present=false |
| LS-106 AC10 | error disappears when value becomes valid, without reload | ✅ | ❌ after 7: "Guests must be between 1 and 6." → after typing 3 (no submit): "Guests must be between 1 and 6." |
| LS-106 scope | error text linked to field with aria-describedby | ❌ aria-describedby=null | ❌ aria-describedby=null |
| LS-107 AC1 | check-in today (02/11) accepted | ✅ | ✅ |
| LS-107 AC2 | check-in yesterday → "Check-in must be today or later", picker blocks past | ✅ | ❌ messages="" submitted=true picker min=null |
| LS-107 AC3 | 10/11 → 11/11 accepted, nights = 1 | ✅ | ✅ |
| LS-107 AC4 | check-out same day → "Check-out must be after check-in", cannot submit | ✅ | ✅ |
| LS-107 AC5 | check-out earlier → "Check-out must be after check-in", cannot submit | ✅ | ✅ |
| LS-107 AC6 | changing check-in 10/11 → 15/11 clears check-out | ❌ check-out after change = "2026-11-12" | ❌ check-out after change = "2026-11-12" |
| LS-107 AC7 | guest in New York (20:00 01/11) picks 01/11 → rejected (Vietnam "today") | ✅ | ❌ messages="" submitted=true |
| LS-107 AC8 | form left open past midnight → server rejects stale check-in | ➖ Server-side rule; no booking server exists in the repo. | ➖ Server-side rule; no booking server exists in the repo. |
| LS-107 AC9 | both empty + Submit → "Choose check-in and check-out dates" | ❌ messages="" | ❌ messages="native: Please fill out this field. / native: Please fill out this field." |
| LS-107 AC9 | check-out empty + Submit → "Choose check-in and check-out dates" | ✅ | ❌ messages="native: Please fill out this field." |
| LS-107 AC10 | server rejects bad dates and saves nothing | ➖ Server-side rule; no booking server exists in the repo. | ➖ Server-side rule; no booking server exists in the repo. |
| LS-107 AC11 | 30/01/2027 → 02/02/2027 gives 3 nights | ✅ | ✅ |
| LS-108 AC1 | shows "1 night × 600,000 ₫ = 600,000 ₫" as soon as dates + room are picked | ✅ | ❌ before clicking: "" / after clicking submit: "1 night(s) · Total 600,000 VND" |
| LS-108 AC2 | shows "3 nights × 600,000 ₫ = 1,800,000 ₫" as soon as dates + room are picked | ✅ | ❌ before clicking: "" / after clicking submit: "3 night(s) · Total 1,800,000 VND" |
| LS-108 AC3 | shows "2 nights × 900,000 ₫ = 1,800,000 ₫" as soon as dates + room are picked | ✅ | ❌ before clicking: "" / after clicking submit: "2 night(s) · Total 1,800,000 VND" |
| LS-108 AC4 | shows "7 nights × 900,000 ₫ = 6,300,000 ₫" as soon as dates + room are picked | ✅ | ❌ before clicking: "" / after clicking submit: "7 night(s) · Total 6,300,000 VND" |
| LS-108 AC5 | shows "3 nights × 900,000 ₫ = 2,700,000 ₫" as soon as dates + room are picked | ✅ | ❌ before clicking: "" / after clicking submit: "3 night(s) · Total 2,700,000 VND" |
| LS-108 AC6 | switch Standard → Deluxe updates price to 2,700,000 ₫ without reload | ✅ | ❌ price after switch (no click)="3 night(s) · Total 1,800,000 VND" noReload=true |
| LS-108 AC7 | changing guests 2 → 4 keeps the price | ✅ | ✅ |
| LS-108 AC8 | dates missing → only "Choose dates and room type to see the price" | ✅ | ❌ price area="" |
| LS-108 AC8 | dates invalid → only "Choose dates and room type to see the price" | ✅ | ❌ price area="" |
| LS-108 AC8 | no room chosen → only "Choose dates and room type to see the price" | ✅ | ❌ price area="" (room select value="standard") |
| LS-108 AC9 | server recalculates a tampered price | ➖ Server-side rule; no booking server exists in the repo. | ➖ Server-side rule; no booking server exists in the repo. |
| LS-108 AC10 | whole VND, thousands separators, ₫ symbol | ✅ | ❌ price="7 night(s) · Total 6,300,000 VND" |
| LS-108 scope | nightly rates kept on the server, not written into the page | ❌ rates hard-coded in page HTML/script=true | ❌ rates hard-coded in page HTML/script=true |
