# Lantern Stay – BA/QA practice

Fictional client for the AI Tools training. Training data only – no real client data.

## Client rules for the booking form
- R1: Guests must be a whole number from 1 to 6.
- R2: Check-in must be today or later.
- R3: Check-out must be after check-in.
- R4: Price = nights × room rate (Standard 600,000 VND, Deluxe 900,000 VND).

## Folders
- app/      the booking page we test
- tickets/  ticket analyses and ticket packs
- specs/    specs written by BA
- tests/    test matrices (.md) and Playwright tests (.spec.js)
- notes/    personal notes, decision docs