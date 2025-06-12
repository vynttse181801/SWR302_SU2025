package com.swr302.hivsystem.hivbackend.repository;

import com.swr302.hivsystem.hivbackend.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByDoctorCode(String doctorCode);
    List<Doctor> findBySpecialization(String specialization);
    List<Doctor> findByFullNameContainingOrDoctorCodeContaining(String fullName, String doctorCode);
    boolean existsByDoctorCode(String doctorCode);
    boolean existsByLicenseNumber(String licenseNumber);
    boolean existsByEmail(String email);
} 