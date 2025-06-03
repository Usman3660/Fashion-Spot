const Mocha = require('mocha');
const boxen = require('boxen');
const chalk = require('chalk');
const path = require('path');

// Initialize Mocha with mochawesome reporter
const mocha = new Mocha({
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: '../mochawesome-report',
    reportFilename: 'report',
    overwrite: true
  },
  timeout: 10000
});

// Add test files (relative to testcases folder)
const testDir = __dirname; // testcases folder
['auth.test.js', 'product.test.js'].forEach(file => {
  mocha.addFile(path.join(testDir, file));
});

// Run tests and print boxed summary
mocha.run((failures) => {
  const stats = mocha.suite.runner.stats;
  const passed = stats.passes;
  const failed = stats.failures;
  const total = passed + failed;

  // Create boxed summary
  const summary = [
    chalk.bold('Test Summary'),
    '',
    `${chalk.green('✔ Passed:')} ${passed}`,
    `${chalk.red('✖ Failed:')} ${failed}`,
    `${chalk.cyan('Total:')} ${total}`
  ].join('\n');

  const boxedSummary = boxen(summary, {
    padding: 1,
    margin: 1,
    borderStyle: 'double',
    borderColor: 'cyan',
    backgroundColor: 'black'
  });

  console.log(boxedSummary);

  // Exit with appropriate code
  process.exit(failures ? 1 : 0);
});