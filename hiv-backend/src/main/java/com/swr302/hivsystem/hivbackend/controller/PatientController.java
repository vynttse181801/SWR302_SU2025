package com.swr302.hivsystem.hivbackend.controller;

import com.swr302.hivsystem.hivbackend.model.Patient;
import com.swr302.hivsystem.hivbackend.model.User;
import com.swr302.hivsystem.hivbackend.repository.PatientRepository;
import com.swr302.hivsystem.hivbackend.repository.UserRepository;
import com.swr302.hivsystem.hivbackend.service.PatientService;
import com.swr302.hivsystem.hivbackend.dto.PatientDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/patients")
public class PatientController {
    private static final Logger logger = LoggerFactory.getLogger(PatientController.class);

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientService patientService;

    @GetMapping("/me")
    public ResponseEntity<PatientDTO> getCurrentPatientProfile(@AuthenticationPrincipal User user) {
        try {
            logger.info("Getting patient profile for user ID: {}", user.getId());
            Optional<Patient> patientOptional = patientRepository.findByUser_Id(user.getId());

            if (patientOptional.isPresent()) {
                logger.info("Found patient profile: {}", patientOptional.get().getId());
                Patient patient = patientOptional.get();
                // Convert Patient entity to PatientDTO
                PatientDTO patientDTO = patientService.getPatientById(patient.getId());
                return ResponseEntity.ok(patientDTO);
            } else {
                logger.info("No patient profile found for user ID: {}, creating new profile", user.getId());
                // Create a new patient profile
                Patient newPatient = new Patient();
                newPatient.setUser(user);
                newPatient.setFullName(user.getFullName());
                newPatient.setEmail(user.getEmail());
                newPatient.setPhoneNumber(user.getPhoneNumber());
                newPatient.setPatientCode("P" + System.currentTimeMillis()); // Generate a temporary patient code
                newPatient.setMedicalHistory(""); // Initialize to empty string
                newPatient.setAllergies(""); // Initialize to empty string
                newPatient.setMedicalRecordNumber(""); // Initialize to empty string
                newPatient.setNotes(""); // Initialize to empty string
                newPatient.setCreatedAt(LocalDateTime.now()); // Explicitly set createdAt
                newPatient.setUpdatedAt(LocalDateTime.now()); // Explicitly set updatedAt
                newPatient.setDateOfBirth(java.time.LocalDate.now()); // Initialize with current date
                newPatient.setGender("other"); // Initialize with a default gender
                newPatient.setAddress(""); // Initialize with empty string
                Patient savedPatient = patientRepository.save(newPatient);
                
                // Convert the newly created Patient entity to PatientDTO
                PatientDTO savedPatientDTO = patientService.getPatientById(savedPatient.getId());
                logger.info("Created new patient profile: {}", savedPatientDTO.getId());
                return ResponseEntity.ok(savedPatientDTO);
            }
        } catch (Exception e) {
            logger.error("Error getting patient profile for user ID: " + user.getId(), e);
            throw e;
        }
    }

    @GetMapping("/{id:[\\d]+}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        Optional<Patient> patient = patientRepository.findById(id);
        return patient.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Patient> createPatient(@RequestBody Patient patient) {
        Optional<User> userOptional = userRepository.findById(patient.getUser().getId());
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        patient.setUser(userOptional.get());
        return ResponseEntity.ok(patientRepository.save(patient));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable Long id, @RequestBody Patient patientDetails) {
        Optional<Patient> patient = patientRepository.findById(id);
        if (patient.isPresent()) {
            Patient existingPatient = patient.get();
            existingPatient.setMedicalRecordNumber(patientDetails.getMedicalRecordNumber());
            existingPatient.setBloodType(patientDetails.getBloodType());
            existingPatient.setAllergies(patientDetails.getAllergies());
            existingPatient.setNotes(patientDetails.getNotes());
            return ResponseEntity.ok(patientRepository.save(existingPatient));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        if (patientRepository.existsById(id)) {
            patientRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
} 