// Playwright settings for the Lantern Stay demo
const { defineConfig } = require('@playwright/test');
const path = require('path');

module.exports = defineConfig({
  testDir: './tests',
  reporter: 'list',
  use: {
    // Open the booking form straight from the file – no server needed
    baseURL: 'file://' + path.join(__dirname, 'app') + '/',
    timezoneId: 'Asia/Ho_Chi_Minh',
  },
});
