package com.swr302.hivsystem.hivbackend.controller;

import com.swr302.hivsystem.hivbackend.model.Appointment;
import com.swr302.hivsystem.hivbackend.model.AppointmentReminder;
import com.swr302.hivsystem.hivbackend.repository.AppointmentReminderRepository;
import com.swr302.hivsystem.hivbackend.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/appointment-reminders")
public class AppointmentReminderController {

    @Autowired
    private AppointmentReminderRepository appointmentReminderRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @GetMapping
    public List<AppointmentReminder> getAllAppointmentReminders() {
        return appointmentReminderRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentReminder> getAppointmentReminderById(@PathVariable Long id) {
        Optional<AppointmentReminder> appointmentReminder = appointmentReminderRepository.findById(id);
        return appointmentReminder.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<AppointmentReminder> createAppointmentReminder(@RequestBody AppointmentReminder appointmentReminder) {
        Optional<Appointment> appointmentOptional = appointmentRepository.findById(appointmentReminder.getAppointment().getId());
        if (appointmentOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        appointmentReminder.setAppointment(appointmentOptional.get());
        return ResponseEntity.ok(appointmentReminderRepository.save(appointmentReminder));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AppointmentReminder> updateAppointmentReminder(@PathVariable Long id, @RequestBody AppointmentReminder appointmentReminderDetails) {
        Optional<AppointmentReminder> appointmentReminder = appointmentReminderRepository.findById(id);
        if (appointmentReminder.isPresent()) {
            AppointmentReminder existingAppointmentReminder = appointmentReminder.get();
            existingAppointmentReminder.setReminderType(appointmentReminderDetails.getReminderType());
            existingAppointmentReminder.setReminderTime(appointmentReminderDetails.getReminderTime());
            existingAppointmentReminder.setStatus(appointmentReminderDetails.getStatus());
            return ResponseEntity.ok(appointmentReminderRepository.save(existingAppointmentReminder));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointmentReminder(@PathVariable Long id) {
        if (appointmentReminderRepository.existsById(id)) {
            appointmentReminderRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
} 