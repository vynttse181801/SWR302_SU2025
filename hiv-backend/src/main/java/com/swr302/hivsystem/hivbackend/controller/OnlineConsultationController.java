package com.swr302.hivsystem.hivbackend.controller;

import com.swr302.hivsystem.hivbackend.model.OnlineConsultation;
import com.swr302.hivsystem.hivbackend.model.Appointment;
import com.swr302.hivsystem.hivbackend.model.ConsultationType;
import com.swr302.hivsystem.hivbackend.repository.OnlineConsultationRepository;
import com.swr302.hivsystem.hivbackend.repository.AppointmentRepository;
import com.swr302.hivsystem.hivbackend.repository.ConsultationTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/online-consultations")
public class OnlineConsultationController {

    @Autowired
    private OnlineConsultationRepository onlineConsultationRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private ConsultationTypeRepository consultationTypeRepository;

    @GetMapping
    public List<OnlineConsultation> getAllOnlineConsultations() {
        return onlineConsultationRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<OnlineConsultation> getOnlineConsultationById(@PathVariable Long id) {
        Optional<OnlineConsultation> onlineConsultation = onlineConsultationRepository.findById(id);
        return onlineConsultation.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<OnlineConsultation> createOnlineConsultation(@RequestBody OnlineConsultation onlineConsultation) {
        Optional<Appointment> appointmentOptional = appointmentRepository.findById(onlineConsultation.getAppointment().getId());
        Optional<ConsultationType> consultationTypeOptional = consultationTypeRepository.findById(onlineConsultation.getConsultationType().getId());

        if (appointmentOptional.isEmpty() || consultationTypeOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        onlineConsultation.setAppointment(appointmentOptional.get());
        onlineConsultation.setConsultationType(consultationTypeOptional.get());

        return ResponseEntity.ok(onlineConsultationRepository.save(onlineConsultation));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OnlineConsultation> updateOnlineConsultation(@PathVariable Long id, @RequestBody OnlineConsultation onlineConsultationDetails) {
        Optional<OnlineConsultation> onlineConsultation = onlineConsultationRepository.findById(id);
        if (onlineConsultation.isPresent()) {
            OnlineConsultation existingOnlineConsultation = onlineConsultation.get();
            existingOnlineConsultation.setMeetingLink(onlineConsultationDetails.getMeetingLink());
            existingOnlineConsultation.setStartTime(onlineConsultationDetails.getStartTime());
            existingOnlineConsultation.setEndTime(onlineConsultationDetails.getEndTime());
            existingOnlineConsultation.setNotes(onlineConsultationDetails.getNotes());
            return ResponseEntity.ok(onlineConsultationRepository.save(existingOnlineConsultation));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOnlineConsultation(@PathVariable Long id) {
        if (onlineConsultationRepository.existsById(id)) {
            onlineConsultationRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
} 