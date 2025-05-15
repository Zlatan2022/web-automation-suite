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
      'json:reports/cucumber-report.json',
      'html:reports/cucumber-report.html',
      'junit:reports/junit-report.xml'
    ],
    formatOptions: { snippetInterface: 'async-await' },
    timeout: 70000,
  },
  after: generateReport,
};
