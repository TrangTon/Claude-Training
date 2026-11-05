# GAP-05 The booking form has no Vietnamese version

**Type:** Story (feature not built) · **Priority:** Medium
**Pages:** Both booking pages
**Requirement:**
- LS-106 AC9: when the form language is Vietnamese, errors show in Vietnamese, e.g. "Vui lòng nhập từ 1 đến 6 khách".
- LS-106 Scope: error messages in English and Vietnamese.
- LS-107 Scope: messages in English and Vietnamese.

## What's built today
- Both pages are English only: `<html lang="en">`, no language switch, every message hard-coded in English.
- Nothing on either page lets a guest choose Vietnamese.

## What's needed
1. A way to show the form in Vietnamese: a switch, or the browser language.
2. A Vietnamese version of every message in LS-106 and LS-107:

   | English | Vietnamese |
   |---|---|
   | Enter 1 to 6 guests | Vui lòng nhập từ 1 đến 6 khách *(given in LS-106)* |
   | Number of guests must be a whole number | *needs translation* |
   | Number of guests is required | *needs translation* |
   | Check-in must be today or later | *needs translation* |
   | Check-out must be after check-in | *needs translation* |
   | Choose check-in and check-out dates | *needs translation* |
   | Choose dates and room type to see the price | *needs translation (LS-108)* |

## Questions for BA before dev starts
- Who provides and approves the Vietnamese text? Only one line is given in the packs.
- How does the guest pick the language: a switch, the browser setting, or the URL?
- Should LS-108's price separator change with the language (1,800,000 ₫ or 1.800.000 ₫)? This is already an open question in LS-108.
