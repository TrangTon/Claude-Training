# Review: Fix BUG-102 ("Open Account" button ignores taps on text/icon)

## Peer-swap check: "Could I implement or review this from the description alone?"
**Yes.** It explains why the bug was intermittent and mobile-only (with % numbers), names the exact root cause, lists the hypotheses that were ruled out, and includes verify steps and before/after screenshots. A reviewer who has never seen the code could follow it.

## Checklist walkthrough

| # | Area | Verdict | Notes |
|---|---|---|---|
| 1 | Correctness | ✅ | `currentTarget` is the correct fix. Verified: text, icon and edge all work on desktop and iPhone, and keyboard Enter works too. |
| 2 | Tests | ⚠️ | Good coverage (6 cases), but the wait swallows errors and the 1.5 s timeout may be too short on slow CI machines. |
| 3 | Readability | ✅ | Clear one-line fix with a helpful comment. The test names read like the ticket. |
| 4 | Security basics | ⚠️ minor | `window.location.href` takes whatever is in `data-href`. That's safe today because the value is hard-coded, but it becomes risky if a CMS ever fills it in. |
| 5 | Scope | ✅ | Only `app.js` (1 line) and a new test file. The screenshots are attached to the PR rather than committed. |

## Actionable comments

1. **`public/index.html` + `app.js` (Correctness / robustness):** this button only navigates to another page, so it should be a real link: `<a class="cta" href="/open-account">…</a>`, with the JS handler removed. Verified by running: **with JavaScript turned off, the current button does nothing**, while a link always works. A link also lets users long-press it or open it in a new tab, and screen readers announce it correctly. Fine as a follow-up ticket if you want to keep this PR minimal.

2. **`test/open-account.e2e.test.js` L37 (Tests):** `waitForURL(...).catch(() => {})` hides the real error, and a 1,500 ms timeout can make the test fail on a slow CI runner even when the code is fine (a flaky test). *Suggestion:* drop the `.catch`, let `waitForURL` fail with its own message, and use the default timeout or at least 5 s.

3. **`package.json` (Tests / developer experience):** `npm test` now needs Playwright and a downloaded Chromium (~150 MB). A teammate who only wants to run the loan unit tests will hit an error. *Suggestion:* add separate scripts, `"test:unit"` and `"test:e2e"`, plus a `"postinstall": "playwright install chromium"` step or a short README note.

4. **`public/app.js` L5 (Security basics):** if the URL ever comes from content (CMS or query string), check that it is a same-site path before navigating, e.g. `if (!href.startsWith('/') || href.startsWith('//')) return;`. That prevents an open redirect to a phishing site, which matters a lot on a **bank** page.

5. **Test coverage (BA/QA input):** add one assertion that the button is **visible and at least 44 px tall on mobile**, the minimum touch-target size. The iPhone button is currently 35 px tall, which is small for a thumb. Raise this with the designer and decide whether it belongs in this ticket or a new one.

**Decision:** Approve with comments. Comment 2 should be fixed before merge (flaky tests waste everyone's time). Comments 1, 3, 4 and 5 can become follow-up tickets.
