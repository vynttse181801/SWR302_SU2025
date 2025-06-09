package com.datetimechecker.controller;

import com.datetimechecker.model.DateRequest;
import com.datetimechecker.service.DateValidationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/date")
@CrossOrigin(origins = "http://localhost:3000")
public class DateValidationController {

    @Autowired
    private DateValidationService dateValidationService;

    @PostMapping("/validate")
    public Map<String, Object> validateDate(@RequestBody DateRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (request.getDay() == null || request.getMonth() == null || request.getYear() == null) {
                response.put("valid", false);
                response.put("message", "Invalid date");
                return response;
            }
            DateValidationService.ValidationResult result = dateValidationService.validateDate(request.getDay(), request.getMonth(), request.getYear());
            response.put("valid", result.isValid());
            response.put("message", result.getMessage());
        } catch (Exception e) {
            response.put("valid", false);
            response.put("message", "Invalid date");
        }
        return response;
    }

    public static class ValidationResponse {
        private boolean valid;
        private String message;

        public ValidationResponse(boolean valid, String message) {
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