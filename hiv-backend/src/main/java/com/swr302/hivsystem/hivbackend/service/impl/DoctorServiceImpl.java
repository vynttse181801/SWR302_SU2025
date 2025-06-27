package com.swr302.hivsystem.hivbackend.service.impl;

import com.swr302.hivsystem.hivbackend.dto.DoctorDTO;
import com.swr302.hivsystem.hivbackend.exception.ResourceNotFoundException;
import com.swr302.hivsystem.hivbackend.model.Doctor;
import com.swr302.hivsystem.hivbackend.repository.DoctorRepository;
import com.swr302.hivsystem.hivbackend.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DoctorServiceImpl implements DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Override
    public DoctorDTO createDoctor(DoctorDTO doctorDTO) {
        if (existsByDoctorCode(doctorDTO.getDoctorCode())) {
            throw new RuntimeException("Doctor code already exists");
        }
        if (existsByLicenseNumber(doctorDTO.getLicenseNumber())) {
            throw new RuntimeException("License number already exists");
        }
        if (existsByEmail(doctorDTO.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Doctor doctor = new Doctor();
        updateDoctorFromDTO(doctor, doctorDTO);
        Doctor savedDoctor = doctorRepository.save(doctor);
        return convertToDTO(savedDoctor);
    }

    @Override
    public DoctorDTO updateDoctor(Long id, DoctorDTO doctorDTO) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));

        updateDoctorFromDTO(doctor, doctorDTO);
        Doctor updatedDoctor = doctorRepository.save(doctor);
        return convertToDTO(updatedDoctor);
    }

    @Override
    public void deleteDoctor(Long id) {
        if (!doctorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Doctor not found with id: " + id);
        }
        doctorRepository.deleteById(id);
    }

    @Override
    public DoctorDTO getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
        return convertToDTO(doctor);
    }

    @Override
    public List<DoctorDTO> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DoctorDTO getDoctorByDoctorCode(String doctorCode) {
        Doctor doctor = doctorRepository.findByDoctorCode(doctorCode)
            .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with code: " + doctorCode));
        return convertToDTO(doctor);
    }

    @Override
    public List<DoctorDTO> getDoctorsBySpecialization(String specialization) {
        return doctorRepository.findBySpecialization(specialization).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<DoctorDTO> searchDoctors(String keyword) {
        return doctorRepository.findByFullNameContainingOrDoctorCodeContaining(keyword, keyword)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public boolean existsByDoctorCode(String doctorCode) {
        return doctorRepository.existsByDoctorCode(doctorCode);
    }

    @Override
    public boolean existsByLicenseNumber(String licenseNumber) {
        return doctorRepository.existsByLicenseNumber(licenseNumber);
    }

    @Override
    public boolean existsByEmail(String email) {
        return doctorRepository.existsByEmail(email);
    }

    @Override
    public Doctor getDoctorByUserId(Long userId) {
        return doctorRepository.findAll().stream()
            .filter(doctor -> doctor.getUser() != null && doctor.getUser().getId().equals(userId))
            .findFirst()
            .orElse(null);
    }

    @Override
    public DoctorDTO deactivateDoctor(Long id) {
        Doctor doctor = doctorRepository.findById(id)
            .orElse(null);
        if (doctor == null) {
            return null;
        }
        doctor.setStatus(com.swr302.hivsystem.hivbackend.model.DoctorStatus.INACTIVE);
        Doctor updatedDoctor = doctorRepository.save(doctor);
        return convertToDTO(updatedDoctor);
    }

    private void updateDoctorFromDTO(Doctor doctor, DoctorDTO dto) {
        doctor.setDoctorCode(dto.getDoctorCode());
        doctor.setFullName(dto.getName());
        doctor.setSpecialization(dto.getSpecialization());
        doctor.setQualification(dto.getQualification());
        doctor.setLicenseNumber(dto.getLicenseNumber());
        doctor.setPhoneNumber(dto.getPhoneNumber());
        doctor.setEmail(dto.getEmail());
        doctor.setAddress(dto.getAddress());
        doctor.setBio(dto.getBio());
        doctor.setStatus(dto.getStatus());
        doctor.setExperience(dto.getExperience());
        doctor.setRating(dto.getRating());
        doctor.setAvatar(dto.getAvatar());
    }

    private DoctorDTO convertToDTO(Doctor doctor) {
        DoctorDTO dto = new DoctorDTO();
        dto.setId(doctor.getId());
        dto.setDoctorCode(doctor.getDoctorCode());
        dto.setName(doctor.getFullName());
        dto.setSpecialization(doctor.getSpecialization());
        dto.setQualification(doctor.getQualification());
        dto.setLicenseNumber(doctor.getLicenseNumber());
        dto.setPhoneNumber(doctor.getPhoneNumber());
        dto.setEmail(doctor.getEmail());
        dto.setAddress(doctor.getAddress());
        dto.setBio(doctor.getBio());
        dto.setStatus(doctor.getStatus());
        dto.setCreatedAt(doctor.getCreatedAt());
        dto.setUpdatedAt(doctor.getUpdatedAt());
        dto.setExperience(doctor.getExperience());
        dto.setRating(doctor.getRating());
        dto.setAvatar(doctor.getAvatar());
        return dto;
    }
} 