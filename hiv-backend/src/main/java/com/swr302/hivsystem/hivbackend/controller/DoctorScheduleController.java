package com.swr302.hivsystem.hivbackend.controller;

import com.swr302.hivsystem.hivbackend.model.Doctor;
import com.swr302.hivsystem.hivbackend.model.DoctorSchedule;
import com.swr302.hivsystem.hivbackend.repository.DoctorRepository;
import com.swr302.hivsystem.hivbackend.repository.DoctorScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/doctor-schedules")
public class DoctorScheduleController {

    @Autowired
    private DoctorScheduleRepository doctorScheduleRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @GetMapping
    public List<DoctorSchedule> getAllDoctorSchedules() {
        return doctorScheduleRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoctorSchedule> getDoctorScheduleById(@PathVariable Long id) {
        Optional<DoctorSchedule> doctorSchedule = doctorScheduleRepository.findById(id);
        return doctorSchedule.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<DoctorSchedule> createDoctorSchedule(@RequestBody DoctorSchedule doctorSchedule) {
        Optional<Doctor> doctorOptional = doctorRepository.findById(doctorSchedule.getDoctor().getId());
        if (doctorOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        doctorSchedule.setDoctor(doctorOptional.get());
        return ResponseEntity.ok(doctorScheduleRepository.save(doctorSchedule));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DoctorSchedule> updateDoctorSchedule(@PathVariable Long id, @RequestBody DoctorSchedule doctorScheduleDetails) {
        Optional<DoctorSchedule> doctorSchedule = doctorScheduleRepository.findById(id);
        if (doctorSchedule.isPresent()) {
            DoctorSchedule existingDoctorSchedule = doctorSchedule.get();
            existingDoctorSchedule.setDayOfWeek(doctorScheduleDetails.getDayOfWeek());
            existingDoctorSchedule.setStartTime(doctorScheduleDetails.getStartTime());
            existingDoctorSchedule.setEndTime(doctorScheduleDetails.getEndTime());
            existingDoctorSchedule.setLocation(doctorScheduleDetails.getLocation());
            existingDoctorSchedule.setNotes(doctorScheduleDetails.getNotes());
            return ResponseEntity.ok(doctorScheduleRepository.save(existingDoctorSchedule));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctorSchedule(@PathVariable Long id) {
        if (doctorScheduleRepository.existsById(id)) {
            doctorScheduleRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
} 