"use strict";

const iWantTheTestToPass = true;

const { testPlans } = require("../utils/testPlans");
const { testTitle } = require("../utils/helpers");

describe("The Heroku Site 'The-Internet'", function () {
  it(
    testTitle({
      title:
        "Heroku 'The-Internet' site has a link to a page called 'Drag and Drop' on the homepage",
      reqts: ["TSRQA-1"],
      plans: [testPlans.CI.BRANCH_CHANGE],
    }),
    function () {
      browser.url(browser.options.baseUrl);

      const locator = iWantTheTestToPass
        ? '//div[@id="content"]'
        : '//div[@id="contnt"]';

      browser.waitUntil(
        () => {
          return $(locator).isDisplayed();
        },
        {
          timeoutMsg: `Timed out waiting for ${locator} to be visible on Homepage`,
          timeout: 3000,
        }
      );

      expect($('//a[@href="/drag_and_drop"]').isDisplayed()).toBeTruthy();
    }
  );
});
