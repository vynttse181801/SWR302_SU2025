package com.swr302.hivsystem.hivbackend.repository;

import com.swr302.hivsystem.hivbackend.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByPatientCode(String patientCode);
    List<Patient> findByFullNameContainingOrPatientCodeContaining(String fullName, String patientCode);
    boolean existsByPatientCode(String patientCode);
    boolean existsByEmail(String email);
    boolean existsByPhoneNumber(String phoneNumber);
} 