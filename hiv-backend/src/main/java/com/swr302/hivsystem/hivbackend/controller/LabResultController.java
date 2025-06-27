package com.swr302.hivsystem.hivbackend.controller;

import com.swr302.hivsystem.hivbackend.model.LabResult;
import com.swr302.hivsystem.hivbackend.model.Patient;
import com.swr302.hivsystem.hivbackend.model.Staff;
import com.swr302.hivsystem.hivbackend.repository.LabResultRepository;
import com.swr302.hivsystem.hivbackend.repository.PatientRepository;
import com.swr302.hivsystem.hivbackend.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/lab-results")
public class LabResultController {

    @Autowired
    private LabResultRepository labResultRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private StaffRepository staffRepository;

    @GetMapping
    public List<LabResult> getAllLabResults() {
        return labResultRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<LabResult> getLabResultById(@PathVariable Long id) {
        Optional<LabResult> labResult = labResultRepository.findById(id);
        return labResult.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    public List<LabResult> getLabResultsByPatient(@PathVariable Long patientId) {
        return labResultRepository.findByPatientId(patientId);
    }

    @PostMapping
    public ResponseEntity<LabResult> createLabResult(@RequestBody LabResult labResult) {
        // Validate patient exists
        Optional<Patient> patientOptional = patientRepository.findById(labResult.getPatient().getId());
        if (patientOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        labResult.setPatient(patientOptional.get());

        // Validate staff exists
        Optional<Staff> staffOptional = staffRepository.findById(labResult.getEnteredBy().getId());
        if (staffOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        labResult.setEnteredBy(staffOptional.get());

        return ResponseEntity.ok(labResultRepository.save(labResult));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LabResult> updateLabResult(@PathVariable Long id, @RequestBody LabResult labResultDetails) {
        Optional<LabResult> labResult = labResultRepository.findById(id);
        if (labResult.isPresent()) {
            LabResult existingLabResult = labResult.get();
            existingLabResult.setResultValue(labResultDetails.getResultValue());
            existingLabResult.setUnit(labResultDetails.getUnit());
            existingLabResult.setNormalRange(labResultDetails.getNormalRange());
            existingLabResult.setNotes(labResultDetails.getNotes());
            existingLabResult.setTestDate(labResultDetails.getTestDate());
            return ResponseEntity.ok(labResultRepository.save(existingLabResult));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLabResult(@PathVariable Long id) {
        if (labResultRepository.existsById(id)) {
            labResultRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
} 