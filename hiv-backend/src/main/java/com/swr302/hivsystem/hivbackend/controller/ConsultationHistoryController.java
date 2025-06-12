package com.swr302.hivsystem.hivbackend.controller;

import com.swr302.hivsystem.hivbackend.model.ConsultationHistory;
import com.swr302.hivsystem.hivbackend.model.Appointment;
import com.swr302.hivsystem.hivbackend.repository.ConsultationHistoryRepository;
import com.swr302.hivsystem.hivbackend.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/consultation-histories")
public class ConsultationHistoryController {

    @Autowired
    private ConsultationHistoryRepository consultationHistoryRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @GetMapping
    public List<ConsultationHistory> getAllConsultationHistories() {
        return consultationHistoryRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConsultationHistory> getConsultationHistoryById(@PathVariable Long id) {
        Optional<ConsultationHistory> consultationHistory = consultationHistoryRepository.findById(id);
        return consultationHistory.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ConsultationHistory> createConsultationHistory(@RequestBody ConsultationHistory consultationHistory) {
        Optional<Appointment> appointmentOptional = appointmentRepository.findById(consultationHistory.getAppointment().getId());
        if (appointmentOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        consultationHistory.setAppointment(appointmentOptional.get());
        return ResponseEntity.ok(consultationHistoryRepository.save(consultationHistory));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ConsultationHistory> updateConsultationHistory(@PathVariable Long id, @RequestBody ConsultationHistory consultationHistoryDetails) {
        Optional<ConsultationHistory> consultationHistory = consultationHistoryRepository.findById(id);
        if (consultationHistory.isPresent()) {
            ConsultationHistory existingConsultationHistory = consultationHistory.get();
            existingConsultationHistory.setDoctorNotes(consultationHistoryDetails.getDoctorNotes());
            existingConsultationHistory.setPatientFeedback(consultationHistoryDetails.getPatientFeedback());
            existingConsultationHistory.setConsultationContent(consultationHistoryDetails.getConsultationContent());
            return ResponseEntity.ok(consultationHistoryRepository.save(existingConsultationHistory));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConsultationHistory(@PathVariable Long id) {
        if (consultationHistoryRepository.existsById(id)) {
            consultationHistoryRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
} 