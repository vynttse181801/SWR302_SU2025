package com.datetimechecker.service;

import org.springframework.stereotype.Service;

@Service
public class DateValidationService {
    public ValidationResult validateDate(int day, int month, int year) {
        if (year < 1 || month < 1 || month > 12 || day < 1) {
            return new ValidationResult(false, "Invalid date");
        }
        int[] daysInMonth = {31, (isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
        if (day > daysInMonth[month - 1]) {
            return new ValidationResult(false, "Invalid date");
        }
        return new ValidationResult(true, "Valid date");
    }

    private boolean isLeapYear(int year) {
        return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
    }

    public static class ValidationResult {
        private boolean valid;
        private String message;

        public ValidationResult(boolean valid, String message) {
            this.valid = valid;
            this.message = message;
        }

        public boolean isValid() {
            return valid;
        }

        public String getMessage() {
            return message;
        }
    }
} 