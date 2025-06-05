Feature('DateTime Validation API');

const validDates = [
  { day: 15, month: 6, year: 2025 },
  { day: 1, month: 1, year: 2025 },
  { day: 31, month: 12, year: 2025 },
  { day: 29, month: 2, year: 2024 }, // Năm nhuận
  { day: 28, month: 2, year: 2025 }, // Năm không nhuận
  { day: 30, month: 4, year: 2025 }, // Tháng 30 ngày
  { day: 31, month: 1, year: 2025 }, // Tháng 31 ngày
  { day: 15, month: 8, year: 2025 }  // Tháng 8
];

const invalidDates = [
  { day: 31, month: 4, year: 2025 },
  { day: 29, month: 2, year: 2025 },
  { day: 0, month: 1, year: 2025 }
];

Scenario('test valid dates', async ({ I }) => {
  for (const date of validDates) {
    await I.sendPostRequest('/api/date/validate', date);
    I.seeResponseCodeIs(200);
    I.seeResponseContainsJson({ valid: true });
  }
});

Scenario('test invalid dates', async ({ I }) => {
  for (const date of invalidDates) {
    await I.sendPostRequest('/api/date/validate', date);
    I.seeResponseCodeIs(200);
    I.seeResponseContainsJson({ valid: false });
  }
});

Scenario('test invalid input types', async ({ I }) => {
  const invalidInputs = [
    { day: "abc", month: 1, year: 2025 },
    { day: 15, month: "xyz", year: 2025 },
    { day: 15, month: 6, year: "invalid" }
  ];

  for (const input of invalidInputs) {
    await I.sendPostRequest('/api/date/validate', input);
    I.seeResponseCodeIs(400);
  }
}); 