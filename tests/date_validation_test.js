const assert = require('assert');

Feature('Date Validation API');

Scenario('Valid date test', async ({ I }) => {
  const response = await I.sendPostRequest('/api/date/validate', {
    day: 15,
    month: 6,
    year: 2024
  });
  assert.strictEqual(response.data.valid, true);
  assert.strictEqual(response.data.message, 'Valid date');
});

Scenario('Invalid day test', async ({ I }) => {
  const response = await I.sendPostRequest('/api/date/validate', {
    day: 32,
    month: 6,
    year: 2024
  });
  assert.strictEqual(response.data.valid, false);
  assert.strictEqual(response.data.message, 'Invalid date');
});

Scenario('Invalid month test', async ({ I }) => {
  const response = await I.sendPostRequest('/api/date/validate', {
    day: 15,
    month: 13,
    year: 2024
  });
  assert.strictEqual(response.data.valid, false);
  assert.strictEqual(response.data.message, 'Invalid date');
});

Scenario('Invalid year test', async ({ I }) => {
  const response = await I.sendPostRequest('/api/date/validate', {
    day: 15,
    month: 6,
    year: -1
  });
  assert.strictEqual(response.data.valid, false);
  assert.strictEqual(response.data.message, 'Invalid date');
});

Scenario('Leap year test - February 29', async ({ I }) => {
  const response = await I.sendPostRequest('/api/date/validate', {
    day: 29,
    month: 2,
    year: 2024
  });
  assert.strictEqual(response.data.valid, true);
  assert.strictEqual(response.data.message, 'Valid date');
});

Scenario('Non-leap year test - February 29', async ({ I }) => {
  const response = await I.sendPostRequest('/api/date/validate', {
    day: 29,
    month: 2,
    year: 2023
  });
  assert.strictEqual(response.data.valid, false);
  assert.strictEqual(response.data.message, 'Invalid date');
});

Scenario('Edge case - January 1', async ({ I }) => {
  const response = await I.sendPostRequest('/api/date/validate', {
    day: 1,
    month: 1,
    year: 2024
  });
  assert.strictEqual(response.data.valid, true);
  assert.strictEqual(response.data.message, 'Valid date');
});

Scenario('Edge case - December 31', async ({ I }) => {
  const response = await I.sendPostRequest('/api/date/validate', {
    day: 31,
    month: 12,
    year: 2024
  });
  assert.strictEqual(response.data.valid, true);
  assert.strictEqual(response.data.message, 'Valid date');
}); 