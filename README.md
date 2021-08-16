Hey Alyssa! 

I just added this readme in this last commit to give you a tour of how things are currently setup

1. So you would setup a Jenkins job that is a "Pipeline," and you'd configure it to use SCM (git) as the source of the pipeline, give it your repo credentials, and point it at the file `test/jenkins/Jenkinsfile`
1. That Jenkins file manages the whole lifecycle of the test run, including building then running our test container as managed by `test/jenkins/Dockerfile`
1. The Dockerfile creates a container that we know will be configured on any machine in exactly the right way to run our tests and in a way that's protected from any other processes running on the same physical hardware (blah blah blah, we talked about this)
1. Dockerfile then eventually runs the standard `npx wdio` command to run the tests (or a different variation if you're running a specific test plan, which you'll see when you dig into things
1. The example test under `test/specs/` then runs and either passes or fails
1. Upon the test running completing, we have told our `wdio.conf.js` file that we want to use our custom reporter found in `test/tractionWdioReporter` to report our tests.
1. `TractionWdioReporter` analyzes the tests that executed (note: it currently assumes you are running mocha tests, so if you are running cucumber, you'd have to edit this reporter to work with cucumber instead. referencing the standard wdio junit-reporter's repo could help you do that) and it does two things at the same time:
   1. If you've enabled the env variable 'JIRA_REPORTING_ENABLED' (set as a jenkins build parameter) to enable jira reporting, it ensures that:
      1. all tests have corresponding tickets in jira
      1. all test plans referenced by the executed tests have corresponding tickets in jira and are connected to the tests that ran and reference them
      1. all requirements referenced by the executed tickets have corresponding tickets in jira and are connected to the tests that ran and reference them
      1. for all tests with existing jira tickets already:
         1. if they're linked to a test plan or test requirement or known issue in jira that they're no longer linked to in the code, we remove that link
      1. If the test failed and has a knownIssue referenced in the code, we report those results to Jira right away with "known issue" status rather than failed and add an issue link, then omit this test from the JUnit report we'll save in a second
   1. It also builds a JUnit report that gets saved to `test/reports/junit`, which Jenkins will later use to report the rest of our results to Jira automatically
8. When TractionWdioReporter finishes and our test code ceases executing, the Jenkins pipeline's final stage runs, which uses the Xray plugin in Jenkins to read our JUnit report(s) on our tests and automatically import them to Jira for us

Yayfox!

------

**Config Note:** there are some environment variables that have to be set on your machine in order for our custom reporter to work. Our Jenkinsfile pulls these credentials automatically assuming your Jenkins instance has the credentials it's looking for, but on your local machine you'd have to set these up in your .env file, but i left all that out of here. Also, some elements of the code are still pointing at the "TSRQA" project's key specifically, which would have to be updated to your project's key if you take some of this. I left all that out since that's just wiggly config stuff. So if you do end up using this, I can help you with making sure the right credential variables and Jira keys and crap are in the right places for you
