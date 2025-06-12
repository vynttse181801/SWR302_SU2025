package com.swr302.hivsystem.hivbackend.service;

import com.swr302.hivsystem.hivbackend.dto.DoctorDTO;
import java.util.List;

public interface DoctorService {
    DoctorDTO createDoctor(DoctorDTO doctorDTO);
    DoctorDTO updateDoctor(Long id, DoctorDTO doctorDTO);
    void deleteDoctor(Long id);
    DoctorDTO getDoctorById(Long id);
    List<DoctorDTO> getAllDoctors();
    DoctorDTO getDoctorByDoctorCode(String doctorCode);
    List<DoctorDTO> getDoctorsBySpecialization(String specialization);
    List<DoctorDTO> searchDoctors(String keyword);
    boolean existsByDoctorCode(String doctorCode);
    boolean existsByLicenseNumber(String licenseNumber);
    boolean existsByEmail(String email);
} 