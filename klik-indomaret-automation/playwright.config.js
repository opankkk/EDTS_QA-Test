// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  retries: 1,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    browserName: 'chromium',
    viewport: { width: 1366, height: 900 },
    locale: 'id-ID',
    timezoneId: 'Asia/Jakarta',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
});
