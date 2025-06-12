package com.swr302.hivsystem.hivbackend.controller;

import com.swr302.hivsystem.hivbackend.model.MedicalRecord;
import com.swr302.hivsystem.hivbackend.model.Patient;
import com.swr302.hivsystem.hivbackend.repository.MedicalRecordRepository;
import com.swr302.hivsystem.hivbackend.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/medicalrecords")
public class MedicalRecordController {

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private PatientRepository patientRepository;

    @GetMapping
    public List<MedicalRecord> getAllMedicalRecords() {
        return medicalRecordRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalRecord> getMedicalRecordById(@PathVariable Long id) {
        Optional<MedicalRecord> medicalRecord = medicalRecordRepository.findById(id);
        return medicalRecord.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<MedicalRecord> createMedicalRecord(@RequestBody MedicalRecord medicalRecord) {
        Optional<Patient> patientOptional = patientRepository.findById(medicalRecord.getPatient().getId());
        if (patientOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        medicalRecord.setPatient(patientOptional.get());
        return ResponseEntity.ok(medicalRecordRepository.save(medicalRecord));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicalRecord> updateMedicalRecord(@PathVariable Long id, @RequestBody MedicalRecord medicalRecordDetails) {
        Optional<MedicalRecord> medicalRecord = medicalRecordRepository.findById(id);
        if (medicalRecord.isPresent()) {
            MedicalRecord existingMedicalRecord = medicalRecord.get();
            existingMedicalRecord.setArvRegimen(medicalRecordDetails.getArvRegimen());
            existingMedicalRecord.setCd4Count(medicalRecordDetails.getCd4Count());
            existingMedicalRecord.setViralLoad(medicalRecordDetails.getViralLoad());
            existingMedicalRecord.setNotes(medicalRecordDetails.getNotes());
            // Date created is usually not updated
            return ResponseEntity.ok(medicalRecordRepository.save(existingMedicalRecord));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicalRecord(@PathVariable Long id) {
        if (medicalRecordRepository.existsById(id)) {
            medicalRecordRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
} 