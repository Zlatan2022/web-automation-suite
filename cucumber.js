require('dotenv').config();
const reporter = require('cucumber-html-reporter');

// Generate HTML report after the tests
const generateReport = () => {
  const options = {
    theme: 'bootstrap',
    jsonFile: 'reports/cucumber-report.json',
    output: 'reports/cucumber-report.html',
    reportSuiteAsScenarios: true,
    scenarioTimestamp: true,
    launchReport: true,
  };

  reporter.generate(options);
};

module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    requireModule: ['@babel/register'],
    require: ['features/step-definitions/**/*.js', 'features/support/**/*.js'],
    format: [
      'json:reports/cucumber-report.json', // Save JSON report in the reports folder
      'html:reports/cucumber-report.html', // Save HTML report in the reports folder
    ],
    formatOptions: { snippetInterface: 'async-await' },
    timeout: 60000, // 60 seconds timeout
  },
  after: generateReport, // Generate the HTML report after test execution
};
