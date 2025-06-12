package com.swr302.hivsystem.hivbackend.controller;

import com.swr302.hivsystem.hivbackend.model.MedicationSchedule;
import com.swr302.hivsystem.hivbackend.model.Prescription;
import com.swr302.hivsystem.hivbackend.repository.MedicationScheduleRepository;
import com.swr302.hivsystem.hivbackend.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/medication-schedules")
public class MedicationScheduleController {

    @Autowired
    private MedicationScheduleRepository medicationScheduleRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @GetMapping
    public List<MedicationSchedule> getAllMedicationSchedules() {
        return medicationScheduleRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicationSchedule> getMedicationScheduleById(@PathVariable Long id) {
        Optional<MedicationSchedule> medicationSchedule = medicationScheduleRepository.findById(id);
        return medicationSchedule.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<MedicationSchedule> createMedicationSchedule(@RequestBody MedicationSchedule medicationSchedule) {
        Optional<Prescription> prescriptionOptional = prescriptionRepository.findById(medicationSchedule.getPrescription().getId());
        if (prescriptionOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        medicationSchedule.setPrescription(prescriptionOptional.get());
        return ResponseEntity.ok(medicationScheduleRepository.save(medicationSchedule));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicationSchedule> updateMedicationSchedule(@PathVariable Long id, @RequestBody MedicationSchedule medicationScheduleDetails) {
        Optional<MedicationSchedule> medicationSchedule = medicationScheduleRepository.findById(id);
        if (medicationSchedule.isPresent()) {
            MedicationSchedule existingMedicationSchedule = medicationSchedule.get();
            existingMedicationSchedule.setIntakeTime(medicationScheduleDetails.getIntakeTime());
            existingMedicationSchedule.setStatus(medicationScheduleDetails.getStatus());
            return ResponseEntity.ok(medicationScheduleRepository.save(existingMedicationSchedule));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicationSchedule(@PathVariable Long id) {
        if (medicationScheduleRepository.existsById(id)) {
            medicationScheduleRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
} 