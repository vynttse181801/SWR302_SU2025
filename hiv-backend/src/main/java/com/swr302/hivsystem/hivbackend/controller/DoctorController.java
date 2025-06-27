package com.swr302.hivsystem.hivbackend.controller;

import com.swr302.hivsystem.hivbackend.dto.DoctorDTO;
import com.swr302.hivsystem.hivbackend.model.Doctor;
import com.swr302.hivsystem.hivbackend.model.User;
import com.swr302.hivsystem.hivbackend.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @GetMapping
    public ResponseEntity<List<DoctorDTO>> getAllDoctors() {
        List<DoctorDTO> doctors = doctorService.getAllDoctors();
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoctorDTO> getDoctorById(@PathVariable Long id) {
        DoctorDTO doctor = doctorService.getDoctorById(id);
        return ResponseEntity.ok(doctor);
    }

    @PostMapping
    public ResponseEntity<DoctorDTO> createDoctor(@RequestBody DoctorDTO doctorDTO) {
        DoctorDTO createdDoctor = doctorService.createDoctor(doctorDTO);
        return ResponseEntity.ok(createdDoctor);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DoctorDTO> updateDoctor(@PathVariable Long id, @RequestBody DoctorDTO doctorDTO) {
        DoctorDTO updatedDoctor = doctorService.updateDoctor(id, doctorDTO);
        return ResponseEntity.ok(updatedDoctor);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<DoctorDTO> getCurrentDoctorProfile(@AuthenticationPrincipal User user) {
        Doctor doctor = doctorService.getDoctorByUserId(user.getId());
        if (doctor == null) {
            return ResponseEntity.notFound().build();
        }
        DoctorDTO doctorDTO = doctorService.getDoctorById(doctor.getId());
        return ResponseEntity.ok(doctorDTO);
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<DoctorDTO> deactivateDoctor(@PathVariable Long id) {
        DoctorDTO doctorDTO = doctorService.deactivateDoctor(id);
        if (doctorDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(doctorDTO);
    }
} 