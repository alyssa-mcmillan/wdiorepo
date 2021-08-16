"use strict";

const TractionWdioReporter = require("./test/tractionWdioReporter/tractionWdioReporter");

exports.config = {
  runner: "local",
  specs: ["./test/specs/**/*.spec.js"],
  maxInstances: 1,
  capabilities: [
    {
      browserName: "chrome",
      acceptInsecureCerts: true,
      "goog:chromeOptions": {
        args: ["--headless", "--disable-gpu", "--disable-notifications", "--no-sandbox"],
      },
    },
  ],
  logLevel: "error",
  bail: 0,
  baseUrl: "http://the-internet.herokuapp.com/",
  waitforTimeout: 60000,
  connectionRetryTimeout: 60001,
  connectionRetryCount: 3,
  services: ["selenium-standalone"],
  framework: "mocha",
  reporters: [
    "spec",
    // ["allure", { outputDir: "./test/reports/allure-results" }],
    [
      TractionWdioReporter,
      {
        clientId: "E691221EAFB84DBB9B058942388B86CA",
        clientSecret:
          "80344da0f48415ebf7fa843086ea987814490c8875305d734c7708f86df45318",
        outputDir: "./test/reports/junit/",
        outputFileFormat: function (options) {
          return `${new Date().toISOString()}-testReportNum[${
            options.cid
          }].xml`;
        },
      },
    ],
  ],
  reporterSyncTimeout: 60000,
  mochaOpts: {
    ui: "bdd",
    timeout: 60002,
  },
};
