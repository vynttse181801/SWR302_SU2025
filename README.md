# CodeceptJS CICD Testing Project

This project demonstrates automated testing using CodeceptJS with Playwright and GitHub Actions for CI/CD.

## Prerequisites

- Node.js (version 18 or higher)
- npm (comes with Node.js)

## Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## Running Tests

To run the tests locally:

```bash
npx codeceptjs run --steps
```

To run tests with debug output:

```bash
npx codeceptjs run --debug
```

## Project Structure

- `codecept.conf.ts` - Main configuration file
- `example_test.ts` - Example test file
- `.github/workflows/test.yml` - GitHub Actions workflow configuration
- `output/` - Test artifacts (screenshots, reports)

## CI/CD

This project uses GitHub Actions for continuous integration. The workflow:
- Runs on every push to main branch
- Runs on every pull request to main branch
- Installs dependencies
- Runs tests
- Uploads test results as artifacts

## Writing Tests

Tests are written using CodeceptJS syntax. Example:

```typescript
Feature('Example Test');

Scenario('test something', ({ I }) => {
  I.amOnPage('https://www.google.com');
  I.fillField('input[name=q]', 'CodeceptJS');
  I.click('input[name=btnK]');
  I.see('CodeceptJS');
});
```

For more information on writing tests, visit the [CodeceptJS documentation](https://codecept.io/). 