Feature('DateTime Validation API');

const validDates = [
  { day: 15, month: 6, year: 2025 },
  { day: 1, month: 1, year: 2025 },
  { day: 31, month: 12, year: 2025 }
];

const invalidDates = [
  { day: 31, month: 4, year: 2025 },
  { day: 29, month: 2, year: 2025 },
  { day: 0, month: 1, year: 2025 }
];

Scenario('test valid dates', async ({ I }) => {
  for (const date of validDates) {
    const response = await I.sendPostRequest('/api/validate', date);
    I.seeResponseCodeIs(200);
    I.seeResponseContainsJson({
      isValid: true
    });
  }
});

Scenario('test invalid dates', async ({ I }) => {
  for (const date of invalidDates) {
    const response = await I.sendPostRequest('/api/validate', date);
    I.seeResponseCodeIs(200);
    I.seeResponseContainsJson({
      isValid: false
    });
  }
});

Scenario('test invalid input types', async ({ I }) => {
  const invalidInputs = [
    { day: "abc", month: 1, year: 2025 },
    { day: 15, month: "xyz", year: 2025 },
    { day: 15, month: 6, year: "invalid" }
  ];

  for (const input of invalidInputs) {
    const response = await I.sendPostRequest('/api/validate', input);
    I.seeResponseCodeIs(400);
  }
});
