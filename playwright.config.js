// @ts-check
const { defineConfig } = require('@playwright/test');
const path = require('path');

module.exports = defineConfig({
  testDir: './tests',
  reporter: 'list',
  use: {
    baseURL: 'file://' + path.resolve(__dirname, 'App') + '/',
    headless: true,
  },
});
