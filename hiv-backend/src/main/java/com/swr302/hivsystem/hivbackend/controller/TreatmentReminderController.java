package com.swr302.hivsystem.hivbackend.controller;

import com.swr302.hivsystem.hivbackend.model.Patient;
import com.swr302.hivsystem.hivbackend.model.Staff;
import com.swr302.hivsystem.hivbackend.model.TreatmentReminder;
import com.swr302.hivsystem.hivbackend.repository.PatientRepository;
import com.swr302.hivsystem.hivbackend.repository.StaffRepository;
import com.swr302.hivsystem.hivbackend.repository.TreatmentReminderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/treatment-reminders")
public class TreatmentReminderController {

    @Autowired
    private TreatmentReminderRepository treatmentReminderRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private PatientRepository patientRepository;

    @GetMapping
    public List<TreatmentReminder> getAllTreatmentReminders() {
        return treatmentReminderRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TreatmentReminder> getTreatmentReminderById(@PathVariable Long id) {
        Optional<TreatmentReminder> treatmentReminder = treatmentReminderRepository.findById(id);
        return treatmentReminder.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TreatmentReminder> createTreatmentReminder(@RequestBody TreatmentReminder treatmentReminder) {
        Optional<Staff> createdByOptional = staffRepository.findById(treatmentReminder.getCreatedBy().getId());
        Optional<Patient> patientOptional = patientRepository.findById(treatmentReminder.getPatient().getId());

        if (createdByOptional.isEmpty() || patientOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        treatmentReminder.setCreatedBy(createdByOptional.get());
        treatmentReminder.setPatient(patientOptional.get());

        return ResponseEntity.ok(treatmentReminderRepository.save(treatmentReminder));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TreatmentReminder> updateTreatmentReminder(@PathVariable Long id, @RequestBody TreatmentReminder treatmentReminderDetails) {
        Optional<TreatmentReminder> treatmentReminder = treatmentReminderRepository.findById(id);
        if (treatmentReminder.isPresent()) {
            TreatmentReminder existingTreatmentReminder = treatmentReminder.get();
            existingTreatmentReminder.setReminderType(treatmentReminderDetails.getReminderType());
            existingTreatmentReminder.setReminderDate(treatmentReminderDetails.getReminderDate());
            existingTreatmentReminder.setStatus(treatmentReminderDetails.getStatus());
            return ResponseEntity.ok(treatmentReminderRepository.save(existingTreatmentReminder));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTreatmentReminder(@PathVariable Long id) {
        if (treatmentReminderRepository.existsById(id)) {
            treatmentReminderRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
} 