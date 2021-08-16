/**
 *
 * @param {Object}		obj
 * @param {string}		obj.title			The title of the test case.
 * @param {string[]}	[obj.reqts]			A string array of Test Requirement Jira issue keys
 * 											covered by this test case.
 * @param {string[]}	[obj.plans]			A string array of Test Plan Jira issue titles that
 * 											this test case should be a part of.
 * @param {string[]}	[obj.knownIssues]	A string array of Bug issue keys for known issues
 * 											that cause this test to fail.
 * @returns 			A test case title string formatted such that wdio-traction-reporter
 * 						may parse its constituent parts out after the test case runs and link
 * 						the test case to the correct Jira records while also keeping the test
 * 						case name clean in Jira
 */
function testTitle({ title, reqts = [], plans = [], knownIssues = [] }) {
  return `${title} {reqts=[${reqts}]} {plans=['${plans.join("','")}']} {knownIssues=[${knownIssues}]}`;
}

module.exports = { testTitle };
