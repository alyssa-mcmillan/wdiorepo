"use strict";

require("dotenv").config();
const fetch = require("node-fetch");

const jiraBaseUrl = "https://tractionrec.atlassian.net/";
const jiraProjectKey = "TSRQA";

const xrayBaseUrl = "https://xray.cloud.xpand-it.com";
const xrayGraphQlUrl = `${xrayBaseUrl}/api/v2/graphql`;
const xrayClientId = process.env.XRAY_CLIENT_ID;
const xrayClientSecret = process.env.XRAY_CLIENT_SECRET;
const jiraBasicAuthStr = process.env.JIRA_BASIC_AUTH_STR;

class XrayClient {
	/**
	 * @param {String} className  The title of the "describe" block the test is in
	 * @param {String} title      The title of the test case (the "it" block)
	 */
	async createTest(className, title) {
		const data = {
			query: `mutation {
				createTest(
					testType: { name: "Generic" },
					unstructured: "${className}.${title}",
					jira: {
						fields: {
							summary:"${title}",
							project: {key: "${jiraProjectKey}"}
						}
					}
				) {
					test {
						issueId
						testType { name }
						unstructured
						jira(fields: ["key"])
					}
					warnings
				}
			}`,
		};
		try {
			return await this._sendGraphQlRequest(data);
		} catch (err) {
			console.error(`XrayClient.createTest() error: ${err}`);
		}
	}

	/**
	 * @param {String} planTitle The name of the Test Plan ticket
	 */
	async createTestPlan(planTitle) {
		const data = {
			query: `mutation {
				createTestPlan(
					jira: {
						fields: { 
							summary: "${planTitle}",
							project: {key: "${jiraProjectKey}"}
						}
					}
				) {
					testPlan {
						issueId
						jira(fields: ["key"])
					}
					warnings
				}
			}`,
		};
		return await this._sendGraphQlRequest(data);
	}

	/**
	 * Gets a JSON object representing the test matching the given className
	 * and title. If no matching test case is found, one is created.
	 * @param {String} className  The title of the "describe" block the test is in
	 * @param {String} title      The title of the test case (the "it" block)
	 * @returns The given test as a JSON object, e.g.: ```{"issueId":"10042","projectId":"10001","testType":{"name":"Generic","kind":"Unstructured"},"unstructured":"Describe Block Title.It Block Title 2","jira":{"key":"RTP-42","summary":"It Block Title 2"},"testPlans":{"total":0,"start":0,"limit":20,"results":[]}}```
	 */
	async ensureTestExists(className, title) {
		try {
			const existingTest = await this._searchTestByGenericTestDefn(className, title);
			if (existingTest) {
				return existingTest;
			} else {
				const newTest = await this.createTest(className, title);
				return newTest.data.createTest.test;
			}
		} catch (err) {
			console.error(`XrayClient.ensureTestExists() error: ${err}`);
		}
	}

	/**
	 * @param {String} planTitle The name of the Test Plan ticket
	 */
	async ensureTestPlanExists(planTitle) {
		const existingTestPlan = await this._searchPlansByExactTitle(planTitle);
		if (existingTestPlan) {
			return existingTestPlan;
		} else {
			const newPlan = await this.createTestPlan(planTitle);
			return newPlan.data.createTestPlan.testPlan;
		}
	}

	/**
	 * @param {String} query  The parameters for the getTestPlans function, as documented here:
	 *                        https://xray.cloud.xpand-it.com/doc/graphql/gettestplans.doc.html
	 */
	async getPlans(query) {
		const data = {
			query: `{
				getTestPlans(${query}) {
					total
					start
					limit
					results {
						issueId
						projectId
						jira(fields: ["summary", "key"])
						tests(limit: 10) {
							total
							start
							limit
							results {
								issueId
								jira(fields: ["summary", "key"])
							}
						}
					}
				}
			}`,
		};
		const res = await this._sendGraphQlRequest(data);
		return res.data.getTestPlans.results;
	}

	/**
	 * @param {String} key The Jira issue key of the Test
	 */
	async getTest(key) {
		const results = await this.getTests(`jql: "issueKey='${key}'",limit: 1`);
		if (results.length === 0) return null;
		return results[0];
	}

	/**
	 * @param {String} query  The parameters for the getTests function, as documented here:
	 *                        https://xray.cloud.xpand-it.com/doc/graphql/gettests.doc.html
	 */
	async getTests(query) {
		const data = {
			query: `{
				getTests(${query}) {
					total
					start
					limit
					results {
						issueId
						projectId
						testType { name kind }
						unstructured
						jira(fields: ["summary", "key", "issuelinks"])
						testPlans(limit: 20) {
							total
							start
							limit
							results {
								issueId
								jira(fields: ["summary"])
							}
						}
					}
				}
			}`,
		};
		const res = await this._sendGraphQlRequest(data);
		return res.data.getTests.results;
	}

	async reportTestResult(testExecutionKey, test, status, defectKeys) {
		console.log(
			`testExecutionKey: ${testExecutionKey}, test: ${test}, status: ${status}, defectKeys: ${defectKeys}`
		);
		// TODO: implement this
		throw new Error("XrayClient.reportTestResult() - Not yet implemented - see the next commit ;)");
	}

	/**
	 * Checks what Test Requirements the given Test is linked to. Adds
	 * the Test to Test Requirements it isn't yet linked to and removes
	 * the Test from Test Requirements it's no longer meant to be
	 * linked to. If a Test Requirement referenced by the Test does
	 * not exist, it is created.
	 */
	async updateTestReqts(test, reqts) {
		const linkTypeName = "Test";
		try {
			// remove test from plans it's still in that it should no longer be in
			if (test.jira.issuelinks) {
				for (let i = 0; i < test.jira.issuelinks.length; i++) {
					if (
						test.jira.issuelinks[i].type.name === linkTypeName &&
						!reqts.includes(test.jira.issuelinks[i].outwardIssue.key)
					) {
						await JiraClient.removeIssueLink(test.jira.issuelinks[i].id);
					}
				}
			}
		} catch (err) {
			console.error(`XrayClient.updateTestReqts() error removing test from previous test requirements: ${err}`);
		}

		try {
			// ensure the test is in all plans it should be in, adding if necessary
			let existingReqts = [];
			if (test.jira.issuelinks) {
				existingReqts = test.jira.issuelinks.reduce((filtered, link) => {
					if (link.type.name === linkTypeName) {
						filtered.push(link.outwardIssue.key);
					}
					return filtered;
				}, []);
			}
			for (let i = 0; i < reqts.length; i++) {
				if (reqts[i] !== "" && !existingReqts.includes(reqts[i])) {
					await JiraClient.createIssueLink(test.jira.key, reqts[i], linkTypeName);
				}
			}
		} catch (err) {
			console.error(`XrayClient.updateTestReqts() error adding test to test requirements: ${err}`);
		}
	}

	/**
	 * Checks what Test Plans the given Test is linked to. Adds the
	 * Test to Test Plans it isn't yet linked to and removes the Test
	 * from Test Plans it's no longer meant to be linked to. If a Test
	 * Plan referenced by the Test does not exist, it is created.
	 */
	async updateTestPlans(test, plans) {
		try {
			// remove test from plans it's still in that it should no longer be in
			if (test.testPlans) {
				for (let i = 0; i < test.testPlans.results.length; i++) {
					if (!plans.includes(test.testPlans.results[i].jira.summary)) {
						const data = {
							query: `mutation {
								removeTestsFromTestPlan(
									issueId: "${test.testPlans.results[i].issueId}",
									testIssueIds: ["${test.issueId}"]
								)
							}`,
						};
						await this._sendGraphQlRequest(data);
					}
				}
			}
		} catch (err) {
			console.error(`XrayClient.updateTestPlans() error removing test from previous test plans: ${err}`);
		}

		try {
			// ensure the test is in all plans it should be in, adding if necessary
			const existingPlans = test.testPlans ? test.testPlans.results.map(plan => plan.jira.summary) : [];
			for (let i = 0; i < plans.length; i++) {
				if (plans[i] !== "" && !existingPlans.includes(plans[i])) {
					const planTicket = await this.ensureTestPlanExists(plans[i]);
					const data = {
						query: `mutation {
							addTestsToTestPlan(
								issueId: "${planTicket.issueId}",
								testIssueIds: ["${test.issueId}"]
							) {
								addedTests
								warning
							}
						}`,
					};
					await this._sendGraphQlRequest(data);
				}
			}
		} catch (err) {
			console.error(`XrayClient.updateTestPlans() error adding test to test plans: ${err}`);
		}
	}

	/**
	 * Checks what "Known Issue" bugs the given Test is linked to. Adds the
	 * Test to "Known Issue" bugs it isn't yet linked to and removes the Test
	 * from "Known Issue" bugs it's no longer meant to be linked to. If a "Known
	 * Issue" bug referenced by the Test does not exist, it is created.
	 */
	async updateKnownIssues(test, knownIssues) {
		const linkTypeName = "Blocks";
		try {
			// remove the "is blocked by" link to previous known issue bugs that no longer block the test
			if (test.jira.issuelinks) {
				for (let i = 0; i < test.jira.issuelinks.length; i++) {
					if (
						test.jira.issuelinks[i].type.name === linkTypeName &&
						!knownIssues.includes(test.jira.issuelinks[i].inwardIssue.key)
					) {
						await JiraClient.removeIssueLink(test.jira.issuelinks[i].id);
					}
				}
			}
		} catch (err) {
			console.error(`XrayClient.updateKnownIssues() error removing outdated bug ticket link from test: ${err}`);
		}

		try {
			// ensure the test linked to all known issue bug tickets it should be in, adding if necessary
			let existingBugs = [];
			if (test.jira.issuelinks) {
				existingBugs = test.jira.issuelinks.reduce((filtered, link) => {
					if (link.type.name === linkTypeName) {
						filtered.push(link.inwardIssue.key);
					}
					return filtered;
				}, []);
			}
			for (let i = 0; i < knownIssues.length; i++) {
				if (knownIssues[i] !== "" && !existingBugs.includes(knownIssues[i])) {
					await JiraClient.createIssueLink(test.jira.key, knownIssues[i], linkTypeName);
				}
			}
		} catch (err) {
			console.error(`XrayClient.updateKnownIssues() error adding known issue bug ticket link to test: ${err}`);
		}
	}

	async _getAuthToken() {
		if (this._authToken) return this._authToken;
		const res = await fetch(`${xrayBaseUrl}/api/v2/authenticate`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				client_id: xrayClientId,
				client_secret: xrayClientSecret,
			}),
		});
		if (res.statusText === "OK") {
			this._authToken = await res.json();
			return this._authToken;
		} else {
			throw new Error("Problem authenticating with Xray Cloud");
		}
	}

	/**
	 * Search Jira for tickets of issue type "Test" which have the given
	 * value in their "Generic Test Definition" Xray field. This is the
	 * field Xray uses as a unique identifier of automated test cases.
	 * @param {String} genericTestDefn
	 */
	async _searchTestByGenericTestDefn(className, title) {
		const expectedDefinition = `${className}.${title}`;
		let matchingTest = null;

		try {
			const jql = `summary~\\"\\\\\\"${title}\\\\\\"\\"`;
			const results = await this.getTests(`jql: "${jql}",limit: 100`);
			results.some(function(test) {
				if (test.unstructured && test.unstructured === expectedDefinition) {
					matchingTest = test;
					return true;
				}
			});
		} catch (err) {
			console.error(`XrayClient._searchTestByGenericTestDefn() error: ${err}`);
		}

		return matchingTest;
	}

	/**
	 * Jira doesn't allow exact searches for the summary field, so we get their "approximate"
	 * search results and then ensuring we find the ticket with the exact match ourselves.
	 * @param {String} planTitle The name of the Test Plan ticket
	 */
	async _searchPlansByExactTitle(title) {
		let matchingPlan = null;
		const jql = `project='${jiraProjectKey}' AND issuetype='Test Plan' AND summary~\\"\\\\\\"${title}\\\\\\"\\"`;
		const results = await this.getPlans(`jql: "${jql}",limit: 100`);
		results.some(function(plan) {
			if (plan.jira.summary && plan.jira.summary === title) {
				matchingPlan = plan;
				return true;
			}
		});
		return matchingPlan;
	}

	async _sendGraphQlRequest(data) {
		const token = await this._getAuthToken();
		const res = await fetch(xrayGraphQlUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		});
		const resJson = await res.json();
		if (res.statusText === "OK") {
			return resJson;
		} else {
			throw new Error(
				`XrayClient._sendGraphQlRequest() - Problem with GraphQL request.\n\tError: ${JSON.stringify(
					resJson
				)}\n\tRequest body: ${JSON.stringify(data)}`
			);
		}
	}
}

class JiraClient {
	/**
	 * @param {String} testKey        The Jira issue key of the Test ticket being linked e.g. "TSRQA-123"
	 * @param {String} otherTicketKey The Jira issue key of the ticket being linked to the Test e.g. "TSRQA-456"
	 * @param {String} issueLinkName  The "name" of the Issue Link Type you want to create e.g. "Blocks"
	 */
	static async createIssueLink(testKey, otherTicketKey, issueLinkName) {
		const endpoint = `${jiraBaseUrl}/rest/api/3/issueLink`;

		let inwardIssueKey = testKey;
		let outwardIssueKey = otherTicketKey;
		if (issueLinkName === "Blocks") {
			inwardIssueKey = otherTicketKey;
			outwardIssueKey = testKey;
		}

		const data = {
			type: { name: issueLinkName },
			inwardIssue: { key: inwardIssueKey },
			outwardIssue: { key: outwardIssueKey },
		};

		return await this._sendRequest(endpoint, "POST", data);
	}

	/**
	 * @param {String} issueLinkId The raw id of the existing issue link record you want to remove e.g. "10014"
	 */
	static async removeIssueLink(issueLinkId) {
		try {
			const endpoint = `${jiraBaseUrl}/rest/api/3/issueLink/${issueLinkId}`;
			return await this._sendRequest(endpoint, "DELETE");
		} catch (err) {
			console.log(`JiraClient.removeIssueLink() - error in response: ${err}`);
		}
	}

	/**
	 * For use fetching IDs for project, issue types, etc; Farm this
	 * for necessary IDs, store them in this file, and then remove
	 * this method
	 */
	static async getCreateIssueMetadata() {
		const endpoint = `${jiraBaseUrl}/rest/api/3/issue/createmeta`;
		try {
			return await this._sendRequest(endpoint, "GET");
		} catch (err) {
			console.log("JiraClient._getCreateIssueMetadata() - error: ", err);
		}
	}

	static async _sendRequest(uri, method, data) {
		const response = await fetch(uri, {
			method: method,
			headers: {
				Authorization: `Basic ${Buffer.from(jiraBasicAuthStr).toString("base64")}`,
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		let resJson;

		try {
			resJson = await response.json();
		} catch (jsonErr) {
			// the response isn't JSON (you're probably dealing with issue links) so we'll just return status
			return response.status;
		}

		if (resJson.errorMessages && resJson.errorMessages.length > 0) {
			throw new Error(resJson.errorMessages.toString());
		}
		return await resJson;
	}
}

module.exports = XrayClient;
