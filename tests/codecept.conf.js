const { setHeadlessWhen, setCommonPlugins } = require('@codeceptjs/configure');

setHeadlessWhen(process.env.HEADLESS);
setCommonPlugins();

/** @type {CodeceptJS.MainConfig} */
exports.config = {
  tests: './*_test.js',
  output: './outputs',
  helpers: {
    REST: {
      endpoint: 'http://localhost:8080',
      defaultHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 10000,
      onRequest: (request) => {
        request.headers['Content-Type'] = 'application/json';
      }
    },
  },
  include: {},
  name: 'datetime-checker-tests',
  plugins: {
    retryFailedStep: {
      enabled: true
    },
    screenshotOnFail: {
      enabled: true
    }
  }
} 