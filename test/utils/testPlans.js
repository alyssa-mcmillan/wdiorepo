"use strict";

/**
 * Names of test plans that can be used in tests and will be automatically added to / managed in Jira. If you
 * would like to add a new Test Plan, add it as a constant here rather than directly hardcoding it in the
 * test you're creating.
 */
module.exports.testPlans = {
	CI: {
		BRANCH_CHANGE: "CI - Branch Change",
		NIGHTLY: "CI - Nightly",
		WEEKLY: "CI - Weekly",
	},
	FUNCTIONAL: {
		MEMBERSHIP_SALE: "Functional - Membership Sales",
	},
	SMOKE: "Smoke",
};
