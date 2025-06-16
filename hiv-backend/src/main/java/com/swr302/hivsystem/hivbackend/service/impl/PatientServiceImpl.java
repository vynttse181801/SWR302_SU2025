package com.swr302.hivsystem.hivbackend.service.impl;

import com.swr302.hivsystem.hivbackend.dto.PatientDTO;
import com.swr302.hivsystem.hivbackend.exception.ResourceNotFoundException;
import com.swr302.hivsystem.hivbackend.model.Patient;
import com.swr302.hivsystem.hivbackend.repository.PatientRepository;
import com.swr302.hivsystem.hivbackend.repository.UserRepository;
import com.swr302.hivsystem.hivbackend.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import com.swr302.hivsystem.hivbackend.dto.MedicalHistoryDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;
import java.util.Collections;

@Service
@Transactional
public class PatientServiceImpl implements PatientService {

    private static final Logger logger = LoggerFactory.getLogger(PatientServiceImpl.class);

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public PatientDTO createPatient(PatientDTO patientDTO) {
        if (existsByPatientCode(patientDTO.getPatientCode())) {
            throw new RuntimeException("Patient code already exists");
        }
        if (existsByEmail(patientDTO.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (existsByPhoneNumber(patientDTO.getPhoneNumber())) {
            throw new RuntimeException("Phone number already exists");
        }

        Patient patient = new Patient();
        updatePatientFromDTO(patient, patientDTO);
        Patient savedPatient = patientRepository.save(patient);
        return convertToDTO(savedPatient);
    }

    @Override
    public PatientDTO updatePatient(Long id, PatientDTO patientDTO) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));

        updatePatientFromDTO(patient, patientDTO);
        Patient updatedPatient = patientRepository.save(patient);
        return convertToDTO(updatedPatient);
    }

    @Override
    public void deletePatient(Long id) {
        if (!patientRepository.existsById(id)) {
            throw new ResourceNotFoundException("Patient not found with id: " + id);
        }
        patientRepository.deleteById(id);
    }

    @Override
    public PatientDTO getPatientById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
        return convertToDTO(patient);
    }

    @Override
    public List<PatientDTO> getAllPatients() {
        return patientRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PatientDTO getPatientByPatientCode(String patientCode) {
        Patient patient = patientRepository.findByPatientCode(patientCode)
            .orElseThrow(() -> new ResourceNotFoundException("Patient not found with code: " + patientCode));
        return convertToDTO(patient);
    }

    @Override
    public List<PatientDTO> searchPatients(String keyword) {
        return patientRepository.findByFullNameContainingOrPatientCodeContaining(keyword, keyword)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public boolean existsByPatientCode(String patientCode) {
        return patientRepository.existsByPatientCode(patientCode);
    }

    @Override
    public boolean existsByEmail(String email) {
        return patientRepository.existsByEmail(email);
    }

    @Override
    public boolean existsByPhoneNumber(String phoneNumber) {
        return patientRepository.existsByPhoneNumber(phoneNumber);
    }

    private void updatePatientFromDTO(Patient patient, PatientDTO dto) {
        logger.info("Entering updatePatientFromDTO. DTO received: {}", dto);
        patient.setPatientCode(dto.getPatientCode() != null ? dto.getPatientCode() : patient.getPatientCode());
        patient.setFullName(dto.getFullName() != null ? dto.getFullName() : "");
        patient.setDateOfBirth(dto.getDateOfBirth());
        patient.setGender(dto.getGender() != null ? dto.getGender() : "");
        patient.setAddress(dto.getAddress() != null ? dto.getAddress() : "");
        patient.setPhoneNumber(dto.getPhoneNumber() != null ? dto.getPhoneNumber() : "");
        patient.setEmail(dto.getEmail() != null ? dto.getEmail() : "");
        patient.setBloodType(dto.getBloodType() != null ? dto.getBloodType() : "");

        // Update related User entity fields
        if (patient.getUser() != null) {
            patient.getUser().setFullName(dto.getFullName() != null ? dto.getFullName() : "");
            patient.getUser().setEmail(dto.getEmail() != null ? dto.getEmail() : "");
            patient.getUser().setPhoneNumber(dto.getPhoneNumber() != null ? dto.getPhoneNumber() : "");
            userRepository.save(patient.getUser()); // Save the updated user
            logger.info("Updated associated User entity for patient ID: {}", patient.getId());
        }

        try {
            if (dto.getMedicalHistory() != null) {
                String medicalHistoryJson = objectMapper.writeValueAsString(dto.getMedicalHistory());
                patient.setMedicalHistory(medicalHistoryJson);
                logger.info("Converted medicalHistory to JSON: {}", medicalHistoryJson);
            } else {
                patient.setMedicalHistory(null);
                logger.info("MedicalHistory in DTO is null.");
            }
        } catch (JsonProcessingException e) {
            logger.error("Error converting MedicalHistoryDTO to JSON string", e);
            throw new RuntimeException("Error converting MedicalHistoryDTO to JSON string", e);
        }

        if (dto.getAllergies() != null && !dto.getAllergies().isEmpty()) {
            String allergiesString = String.join(",", dto.getAllergies());
            patient.setAllergies(allergiesString);
            logger.info("Converted allergies to string: {}", allergiesString);
        } else {
            patient.setAllergies(null);
            logger.info("Allergies in DTO is null or empty.");
        }

        patient.setEmergencyContact(dto.getEmergencyContact() != null ? dto.getEmergencyContact() : "");
        patient.setEmergencyPhone(dto.getEmergencyPhone() != null ? dto.getEmergencyPhone() : "");
        logger.info("Patient entity updated from DTO: {}", patient);
    }

    private PatientDTO convertToDTO(Patient patient) {
        logger.info("Entering convertToDTO. Patient entity received: {}", patient);
        PatientDTO dto = new PatientDTO();
        dto.setId(patient.getId());
        dto.setPatientCode(patient.getPatientCode());
        dto.setFullName(patient.getFullName());
        dto.setDateOfBirth(patient.getDateOfBirth());
        dto.setGender(patient.getGender());
        dto.setAddress(patient.getAddress());
        dto.setPhoneNumber(patient.getPhoneNumber());
        dto.setEmail(patient.getEmail());
        dto.setBloodType(patient.getBloodType());

        try {
            if (patient.getMedicalHistory() != null && !patient.getMedicalHistory().isEmpty()) {
                MedicalHistoryDTO medicalHistoryDTO = objectMapper.readValue(patient.getMedicalHistory(), MedicalHistoryDTO.class);
                dto.setMedicalHistory(medicalHistoryDTO);
                logger.info("Converted medicalHistory from JSON: {}", medicalHistoryDTO);
            } else {
                dto.setMedicalHistory(new MedicalHistoryDTO());
                logger.info("MedicalHistory in Patient entity is null or empty. Setting new MedicalHistoryDTO.");
            }
        } catch (JsonProcessingException e) {
            logger.error("Error converting JSON string to MedicalHistoryDTO", e);
            throw new RuntimeException("Error converting JSON string to MedicalHistoryDTO", e);
        }

        if (patient.getAllergies() != null && !patient.getAllergies().isEmpty()) {
            List<String> allergiesList = Arrays.asList(patient.getAllergies().split(","));
            dto.setAllergies(allergiesList);
            logger.info("Converted allergies from string: {}", allergiesList);
        } else {
            dto.setAllergies(Collections.emptyList());
            logger.info("Allergies in Patient entity is null or empty. Setting empty list.");
        }

        dto.setEmergencyContact(patient.getEmergencyContact());
        dto.setEmergencyPhone(patient.getEmergencyPhone());
        dto.setCreatedAt(patient.getCreatedAt());
        dto.setUpdatedAt(patient.getUpdatedAt());
        logger.info("PatientDTO converted from entity: {}", dto);
        return dto;
    }
} 