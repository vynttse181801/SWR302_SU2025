const { setHeadlessWhen } = require('@codeceptjs/configure');
setHeadlessWhen(process.env.HEADLESS);

exports.config = {
  tests: './*_test.{js,ts}',
  output: './output',
  helpers: {
    REST: {
      endpoint: 'http://localhost:8080',
      defaultHeaders: {
        'Content-Type': 'application/json'
      }
    },
    JSONResponse: {}
  },
  name: 'DateTimeChecker'
} 