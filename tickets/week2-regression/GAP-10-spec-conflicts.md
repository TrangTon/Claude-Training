# GAP-10 Specs disagree with each other and point to old ticket numbers

**Type:** Task (BA) · **Priority:** Medium. It blocks GAP-07.
**Where:** `specs/LS-101.md`, `specs/LS-108.md`, GitHub Issues #10–12, `lantern-stay-tests/tests/booking.spec.js`

## 1. Two different error messages for the same rule (blocks GAP-07)

| Spec | Says that 0 or 7 guests shows |
|---|---|
| LS-101 (merged in PR #8, built on the main page, tested in `tests/ls-101-guests.spec.js`) | "Guests must be between 1 and 6." |
| LS-106 AC3/AC4 (Week-2 pack, Issue #10) | "Enter 1 to 6 guests" |

**Decision needed:** which wording wins? Then mark the other spec as superseded. If LS-106 wins, `tests/ls-101-guests.spec.js` must change at the same time as the main page.

## 2. LS-108 points to the wrong dates ticket
LS-108 says "This ticket depends on LS-102 for the number of nights", and AC8 says "(LS-102 errors)". The dates pack is **LS-107**. LS-102 (Issue #4) is the old "Price wrong" report.

**Fix:** change both references to LS-107 in `specs/LS-108.md` and Issue #12.

## 3. Old ticket numbers in the test suite
`tests/booking.spec.js` names its tests "LS-101 AC4/AC5", "LS-102 AC2/AC4" and "LS-103 AC2/AC6". These match old numbering, not the current packs. For example, "LS-103 AC2" is really LS-108 AC2, and "LS-102 AC2" is LS-107 AC2.

**Fix:** rename the tests to LS-106/107/108 AC numbers so test reports trace to the right ticket.

## 4. Issue #12 title is cut off
The title reads `LS-108: Show the price before they book." This ticket depends on LS-102…`. The note was pasted into the title. Trim it to `LS-108: Show the price before they book`.
