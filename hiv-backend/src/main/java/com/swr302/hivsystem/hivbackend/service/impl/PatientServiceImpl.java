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

import java.util.Arrays;
import java.util.Collections;

@Service
@Transactional
public class PatientServiceImpl implements PatientService {

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
        patient.setPatientCode(dto.getPatientCode());
        patient.setFullName(dto.getFullName());
        patient.setDateOfBirth(dto.getDateOfBirth());
        patient.setGender(dto.getGender());
        patient.setAddress(dto.getAddress());
        patient.setPhoneNumber(dto.getPhoneNumber());
        patient.setEmail(dto.getEmail());
        patient.setBloodType(dto.getBloodType());

        try {
            if (dto.getMedicalHistory() != null) {
                patient.setMedicalHistory(objectMapper.writeValueAsString(dto.getMedicalHistory()));
            } else {
                patient.setMedicalHistory(null);
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting MedicalHistoryDTO to JSON string", e);
        }

        if (dto.getAllergies() != null && !dto.getAllergies().isEmpty()) {
            patient.setAllergies(String.join(",", dto.getAllergies()));
        } else {
            patient.setAllergies(null);
        }

        patient.setEmergencyContact(dto.getEmergencyContact());
        patient.setEmergencyPhone(dto.getEmergencyPhone());
    }

    private PatientDTO convertToDTO(Patient patient) {
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
                dto.setMedicalHistory(objectMapper.readValue(patient.getMedicalHistory(), MedicalHistoryDTO.class));
            } else {
                dto.setMedicalHistory(new MedicalHistoryDTO());
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting JSON string to MedicalHistoryDTO", e);
        }

        if (patient.getAllergies() != null && !patient.getAllergies().isEmpty()) {
            dto.setAllergies(Arrays.asList(patient.getAllergies().split(",")));
        } else {
            dto.setAllergies(Collections.emptyList());
        }

        dto.setEmergencyContact(patient.getEmergencyContact());
        dto.setEmergencyPhone(patient.getEmergencyPhone());
        dto.setCreatedAt(patient.getCreatedAt());
        dto.setUpdatedAt(patient.getUpdatedAt());
        return dto;
    }
} 