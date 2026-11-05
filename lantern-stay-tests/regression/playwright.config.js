// Requirements regression: checks every Week-2 AC against both booking pages and
// writes PASS / GAP / N/A rows to results.jsonl. Run: npx playwright test -c regression
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: __dirname,
  reporter: 'dot',
  workers: 1,
  use: { browserName: 'chromium', actionTimeout: 3000 },
});
