package com.swr302.hivsystem.hivbackend.controller;

import com.swr302.hivsystem.hivbackend.model.ArvProtocol;
import com.swr302.hivsystem.hivbackend.model.Doctor;
import com.swr302.hivsystem.hivbackend.model.Patient;
import com.swr302.hivsystem.hivbackend.model.PatientTreatmentPlan;
import com.swr302.hivsystem.hivbackend.repository.ArvProtocolRepository;
import com.swr302.hivsystem.hivbackend.repository.DoctorRepository;
import com.swr302.hivsystem.hivbackend.repository.PatientRepository;
import com.swr302.hivsystem.hivbackend.repository.PatientTreatmentPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/patient-treatment-plans")
public class PatientTreatmentPlanController {

    @Autowired
    private PatientTreatmentPlanRepository patientTreatmentPlanRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private ArvProtocolRepository arvProtocolRepository;

    @GetMapping
    public List<PatientTreatmentPlan> getAllPatientTreatmentPlans(
            @RequestParam(required = false) Long doctorId,
            @RequestParam(required = false) Long patientId) {
        if (doctorId != null && patientId != null) {
            return patientTreatmentPlanRepository.findByDoctorIdAndPatientId(doctorId, patientId);
        } else if (doctorId != null) {
            return patientTreatmentPlanRepository.findByDoctorId(doctorId);
        } else if (patientId != null) {
            return patientTreatmentPlanRepository.findByPatientId(patientId);
        }
        return patientTreatmentPlanRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatientTreatmentPlan> getPatientTreatmentPlanById(@PathVariable Long id) {
        Optional<PatientTreatmentPlan> patientTreatmentPlan = patientTreatmentPlanRepository.findById(id);
        return patientTreatmentPlan.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PatientTreatmentPlan> createPatientTreatmentPlan(@RequestBody PatientTreatmentPlan patientTreatmentPlan) {
        Optional<Patient> patientOptional = patientRepository.findById(patientTreatmentPlan.getPatient().getId());
        Optional<Doctor> doctorOptional = doctorRepository.findById(patientTreatmentPlan.getDoctor().getId());
        Optional<ArvProtocol> arvProtocolOptional = arvProtocolRepository.findById(patientTreatmentPlan.getArvProtocol().getId());

        if (patientOptional.isEmpty() || doctorOptional.isEmpty() || arvProtocolOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        patientTreatmentPlan.setPatient(patientOptional.get());
        patientTreatmentPlan.setDoctor(doctorOptional.get());
        patientTreatmentPlan.setArvProtocol(arvProtocolOptional.get());

        // Tự động set endDate cho phác đồ cũ
        List<PatientTreatmentPlan> oldPlans = patientTreatmentPlanRepository.findByPatientId(patientTreatmentPlan.getPatient().getId());
        if (oldPlans != null && !oldPlans.isEmpty()) {
            for (PatientTreatmentPlan plan : oldPlans) {
                if (plan.getEndDate() == null || plan.getEndDate().isAfter(patientTreatmentPlan.getStartDate())) {
                    plan.setEndDate(patientTreatmentPlan.getStartDate().minusDays(1));
                    patientTreatmentPlanRepository.save(plan);
                }
            }
        }

        return ResponseEntity.ok(patientTreatmentPlanRepository.save(patientTreatmentPlan));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PatientTreatmentPlan> updatePatientTreatmentPlan(@PathVariable Long id, @RequestBody PatientTreatmentPlan patientTreatmentPlanDetails) {
        Optional<PatientTreatmentPlan> patientTreatmentPlan = patientTreatmentPlanRepository.findById(id);
        if (patientTreatmentPlan.isPresent()) {
            PatientTreatmentPlan existingPatientTreatmentPlan = patientTreatmentPlan.get();
            existingPatientTreatmentPlan.setStartDate(patientTreatmentPlanDetails.getStartDate());
            existingPatientTreatmentPlan.setEndDate(patientTreatmentPlanDetails.getEndDate());
            existingPatientTreatmentPlan.setNotes(patientTreatmentPlanDetails.getNotes());
            return ResponseEntity.ok(patientTreatmentPlanRepository.save(existingPatientTreatmentPlan));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatientTreatmentPlan(@PathVariable Long id) {
        if (patientTreatmentPlanRepository.existsById(id)) {
            patientTreatmentPlanRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
} 