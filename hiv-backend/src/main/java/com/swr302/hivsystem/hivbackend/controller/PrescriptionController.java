package com.swr302.hivsystem.hivbackend.controller;

import com.swr302.hivsystem.hivbackend.model.Medication;
import com.swr302.hivsystem.hivbackend.model.PatientTreatmentPlan;
import com.swr302.hivsystem.hivbackend.model.Prescription;
import com.swr302.hivsystem.hivbackend.repository.MedicationRepository;
import com.swr302.hivsystem.hivbackend.repository.PatientTreatmentPlanRepository;
import com.swr302.hivsystem.hivbackend.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private PatientTreatmentPlanRepository patientTreatmentPlanRepository;

    @Autowired
    private MedicationRepository medicationRepository;

    @GetMapping
    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Prescription> getPrescriptionById(@PathVariable Long id) {
        Optional<Prescription> prescription = prescriptionRepository.findById(id);
        return prescription.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Prescription> createPrescription(@RequestBody Prescription prescription) {
        Optional<PatientTreatmentPlan> treatmentPlanOptional = patientTreatmentPlanRepository.findById(prescription.getTreatmentPlan().getId());
        Optional<Medication> medicationOptional = medicationRepository.findById(prescription.getMedication().getId());

        if (treatmentPlanOptional.isEmpty() || medicationOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        prescription.setTreatmentPlan(treatmentPlanOptional.get());
        prescription.setMedication(medicationOptional.get());

        return ResponseEntity.ok(prescriptionRepository.save(prescription));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Prescription> updatePrescription(@PathVariable Long id, @RequestBody Prescription prescriptionDetails) {
        Optional<Prescription> prescription = prescriptionRepository.findById(id);
        if (prescription.isPresent()) {
            Prescription existingPrescription = prescription.get();
            existingPrescription.setDosage(prescriptionDetails.getDosage());
            existingPrescription.setFrequency(prescriptionDetails.getFrequency());
            existingPrescription.setDurationDays(prescriptionDetails.getDurationDays());
            existingPrescription.setNotes(prescriptionDetails.getNotes());
            return ResponseEntity.ok(prescriptionRepository.save(existingPrescription));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrescription(@PathVariable Long id) {
        if (prescriptionRepository.existsById(id)) {
            prescriptionRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
} 