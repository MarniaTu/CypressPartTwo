const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    projectId: "4qtmrm",
    baseUrl: "http://qamid.tmweb.ru",
    setupNodeEvents(on, config) {
      // implement node event listeners here
      return {
        browsers: config.browsers.filter(
          (b) => b.family === 'chromium' && b.name !== 'electron'
        ),
      };
    },
  },
});
