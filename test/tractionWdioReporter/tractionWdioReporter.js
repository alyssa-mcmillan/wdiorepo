"use strict";

require("colors");
require("dotenv").config();
const junit = require("junit-report-builder");
const validator = require("validator");
const WDIOReporter = require("@wdio/reporter").default;
const XrayClient = require("./xrayClient");

const jiraReportingEnabled = process.env.JIRA_REPORTING_ENABLED;

const ansiRegex = new RegExp(
	[
		"[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
		"(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))",
	].join("|"),
	"g"
);

class TractionWdioReporter extends WDIOReporter {
	constructor(options) {
		super(options);
		this._unsynced = [];
		this._interval = setInterval(this._sync.bind(this), 100);
	}

	/**
	 * overwrite isSynchronised method to allow async reporting
	 */
	get isSynchronised() {
		return this._unsynced.length === 0;
	}

	// onRunnerStart(runner) {}
	// onBeforeCommand(before) {}
	// onAfterCommand(after) {}
	// onScreenshot(screenshot) {}
	// onSuiteStart(suite) {}
	// onHookStart(hook) {}
	// onHookEnd(hook) {}
	// onTestStart(test) {}
	// onTestPass(test) {}
	// onTestFail(test) {}
	// onTestSkip(test) {}
	// onTestEnd(test) {}
	// onSuiteEnd(suite) {}
	onRunnerEnd(runner) {
		const xml = this._buildJunitXml(runner);
		this.write(xml);
	}

	_addFailedHooks(suite) {
		const failedHooks = suite.hooks.filter(
			hook => hook.error && hook.title.match(/^"(before|after)( all| each)?" hook/)
		);
		failedHooks.forEach(hook => {
			const { title, _duration, error, state } = hook;
			suite.tests.push({
				_duration,
				title,
				error,
				state,
				output: [],
			});
		});
		return suite;
	}

	_addSuiteToBuilder(builder, runner, specFileName, suite) {
		const suiteName = this._prepareName(suite.title);
		const filePath = specFileName.replace(process.cwd(), ".");

		let testSuite = builder
			.testSuite()
			.name(suiteName)
			.timestamp(suite.start)
			.time(suite._duration / 1000)
			.property("specId", 0)
			.property(this._suiteTitleLabel, suite.title)
			.property("capabilities", runner.sanitizedCapabilities)
			.property(this._fileNameLabel, filePath);

		suite = this._addFailedHooks(suite);

		for (let testKey of Object.keys(suite.tests)) {
			const test = suite.tests[testKey];
			const testName = this._prepareName(test.title);
			const { title, reqts, plans, knownIssues } = this._parseTestTitle(testName);
			if (title.length > 255) throw new Error(`tractionWdioReporter._addSuiteToBuilder() - Tests can't have a title >255 characters due to Jira ticket limits. Please shorten this test's title.\n\tSpec file:"${filePath}"\n\tTest title:"${title}"`.red);

			// const className = `${this._packageName}.${suiteName}`; // the default the Xray Jenkins plugin would use if we don't set it manually
			const className = suiteName;

			if (jiraReportingEnabled && jiraReportingEnabled.toLowerCase() === "true") {
				this._queueAsyncTask(async function() {
					try {
						const xray = new XrayClient();
						const testTicket = await xray.ensureTestExists(className, title);
						await xray.updateTestPlans(testTicket, plans);
						await xray.updateTestReqts(testTicket, reqts);
						await xray.updateKnownIssues(testTicket, knownIssues);
						if (test.state === "failed" && knownIssues.length > 0) {
							await xray.reportTestResult(
								process.env.TEST_EXECUTION_KEY,
								testTicket,
								"KNOWN_ISSUE",
								knownIssues
							);
						}
					} catch (err) {
						console.error(`Error running xray updates: ${err}`);
					}
				});
				// If we handled a known issue failure already above, we want to terminate
				// this iteration now to omit it from the JUnit report
				if (test.state === "failed" && knownIssues.length > 0) continue;
			}

			const testCase = testSuite
				.testCase()
				.className(className)
				.name(title)
				.time(test._duration / 1000);

			if (this.options.addFileAttribute) {
				testCase.file(filePath);
			}

			if (test.state === "skipped") {
				// Tests that are "skipped" in our repo are skipped due to
				// falling outside mochaGrep filters such as for specific
				// test plans or test titles, so they are essentially not a
				// part of the test run at all, so we don't want to include
				// them in the test results as it would just clutter reporting
				continue;
			} else if (test.state === "pending") {
				// we'll mark anything "pending" as skipped, since these are
				// tests that should have run, but for some reason have not,
				// so we DO want their status included in our reporting, so that
				// we don't swallow a potential problem with a test that should
				// have run and passed
				testCase.skipped();
			} else if (test.state === "failed") {
				if (test.error) {
					if (test.error.message) {
						test.error.message = test.error.message.replace(ansiRegex, "");
					}

					if (this.options.errorOptions) {
						const errorOptions = this.options.errorOptions;
						for (const key of Object.keys(errorOptions)) {
							testCase[key](test.error[errorOptions[key]]);
						}
					} else {
						// default
						testCase.error(test.error.message);
					}
					testCase.standardError(`\n${test.error.stack}\n`);
				} else {
					testCase.error();
				}
				testCase.failure();
			}

			const output = this._getStandardOutput(test);
			if (output) testCase.standardOutput(`\n${output}\n`);
		}
		return builder;
	}

	_buildJunitXml(runner) {
		let builder = junit.newBuilder();
		this._packageName = this.options.packageName || runner.sanitizedCapabilities;
		this._suiteTitleLabel = "suiteName";
		this._fileNameLabel = "file";
		// each spec file has its own runner, so we can safely take the first element of the array
		const specFileName = runner.specs[0];
		this._buildOrderedReport(builder, runner, specFileName);
		return builder.build();
	}

	_buildOrderedReport(builder, runner, specFileName) {
		for (let suiteKey of Object.keys(this.suites)) {
			if (suiteKey.match(/^"before all"/)) {
				continue;
			}
			const suite = this.suites[suiteKey];
			builder = this._addSuiteToBuilder(builder, runner, specFileName, suite);
		}
		return builder;
	}

	_getStandardOutput(test) {
		let standardOutput = [];
		test.output.forEach(data => {
			switch (data.type) {
				case "command":
					standardOutput.push(
						data.method
							? `COMMAND: ${data.method.toUpperCase()} ` +
									`${data.endpoint.replace(":sessionId", data.sessionId)} - ${JSON.stringify(
										_limit(data.body)
									)}`
							: `COMMAND: ${data.command} - ${JSON.stringify(_limit(data.params))}`
					);
					break;
				case "result":
					standardOutput.push(`RESULT: ${JSON.stringify(_limit(data.body))}`);
					break;
			}
		});
		return standardOutput.length ? standardOutput.join("\n") : "";
	}

	_parseTestTitle(testTitle) {
		const plansRegex = new RegExp("{plans=\\[(?<plans>.*?)\\]}", "g");
		const reqtsRegex = new RegExp("{reqts=\\[(?<reqts>.*?)\\]}", "g");
		const knownRegex = new RegExp("{knownIssues=\\[(?<knownIssues>.*?)\\]}", "g");

		const plansMatch = plansRegex.exec(testTitle);
		const reqtsMatch = reqtsRegex.exec(testTitle);
		const knownMatch = knownRegex.exec(testTitle);

		// extracts the arrays and filters out empty strings
		let plans = [];
		if (plansMatch)
			plans = plansMatch.groups.plans
				.replace(/'/g, "")
				.split(",")
				.filter(plan => plan);
		let reqts = [];
		if (reqtsMatch)
			reqts = reqtsMatch.groups.reqts
				.replace(/'/g, "")
				.split(",")
				.filter(reqt => reqt);
		let knownIssues = [];
		if (knownMatch)
			knownIssues = knownMatch.groups.knownIssues
				.replace(/'/g, "")
				.split(",")
				.filter(bug => bug);

		const title = testTitle
			.replace(plansRegex, "")
			.replace(reqtsRegex, "")
			.replace(knownRegex, "")
			.trim();

		return {
			title,
			reqts,
			plans,
			knownIssues,
		};
	}

	_prepareName(name = "Skipped test") {
		return name
			.split(this._suiteNameRegEx)
			.filter(item => item && item.length)
			.join(" ");
	}

	/**
	 * Queues tasks to be run by _sync()
	 */
	_queueAsyncTask(asyncFn) {
		this._unsynced.push(asyncFn);
	}

	/**
	 * Wdio requires all event handlers to be synchronous, so this is a function for handling
	 * any async tasks needed, following the wdio docs' suggestion here:
	 * https://webdriver.io/docs/customreporter/#wait-until-issynchronised
	 */
	async _sync() {
		// Don't sync if something is already synchronizing or there's nothing left to sync
		if (this._isSynchronizing || this._unsynced.length === 0) return;

		// set _isSynchronizing to true so we don't sync again while a request is being made
		this._isSynchronizing = true;

		try {
			// pulling and running the first task from the list of outstanding async tasks
			await this._unsynced[0]();

			// removing the request from the list of outstanding requests now that it's been called
			this._unsynced.splice(0, 1);
		} catch (err) {
			console.error("TractionWdioReporter._sync() error is: ", err);
		} finally {
			// set _isSynchronizing to false so we free up this function to run the next request
			this._isSynchronizing = false;
		}
	}
}

function _limit(rawVal) {
	const OBJLENGTH = 10;
	const ARRLENGTH = 10;
	const STRINGLIMIT = 1000;
	const STRINGTRUNCATE = 200;
	if (!rawVal) return rawVal;

	// Ensure we're working with a copy
	let val = JSON.parse(JSON.stringify(rawVal));
	const type = Object.prototype.toString.call(val);

	if (type === "[object String]") {
		if (val.length > 100 && validator.isBase64(val)) {
			return `[base64] ${val.length} bytes`;
		}

		if (val.length > STRINGLIMIT) {
			return val.substr(0, STRINGTRUNCATE) + ` ... (${val.length - STRINGTRUNCATE} more bytes)`;
		}

		return val;
	} else if (type === "[object Array]") {
		const length = val.length;
		if (length > ARRLENGTH) {
			val = val.slice(0, ARRLENGTH);
			val.push(`(${length - ARRLENGTH} more items)`);
		}
		return val.map(_limit);
	} else if (type === "[object Object]") {
		const keys = Object.keys(val);
		const removed = [];
		for (let i = 0, l = keys.length; i < l; i++) {
			if (i < OBJLENGTH) {
				val[keys[i]] = _limit(val[keys[i]]);
			} else {
				delete val[keys[i]];
				removed.push(keys[i]);
			}
		}
		if (removed.length) {
			val._ = keys.length - OBJLENGTH + " more keys: " + JSON.stringify(removed);
		}
		return val;
	}
	return val;
}

module.exports = TractionWdioReporter;
