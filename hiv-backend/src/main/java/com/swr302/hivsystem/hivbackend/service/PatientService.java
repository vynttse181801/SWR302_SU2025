package com.swr302.hivsystem.hivbackend.service;

import com.swr302.hivsystem.hivbackend.dto.PatientDTO;
import java.util.List;

public interface PatientService {
    PatientDTO createPatient(PatientDTO patientDTO);
    PatientDTO updatePatient(Long id, PatientDTO patientDTO);
    void deletePatient(Long id);
    PatientDTO getPatientById(Long id);
    List<PatientDTO> getAllPatients();
    PatientDTO getPatientByPatientCode(String patientCode);
    List<PatientDTO> searchPatients(String keyword);
    boolean existsByPatientCode(String patientCode);
    boolean existsByEmail(String email);
    boolean existsByPhoneNumber(String phoneNumber);
} 