package com.swr302.hivsystem.hivbackend.controller;

import com.swr302.hivsystem.hivbackend.model.Medication;
import com.swr302.hivsystem.hivbackend.model.PatientTreatmentPlan;
import com.swr302.hivsystem.hivbackend.model.Prescription;
import com.swr302.hivsystem.hivbackend.model.MedicationSchedule;
import com.swr302.hivsystem.hivbackend.repository.MedicationRepository;
import com.swr302.hivsystem.hivbackend.repository.PatientTreatmentPlanRepository;
import com.swr302.hivsystem.hivbackend.repository.PrescriptionRepository;
import com.swr302.hivsystem.hivbackend.repository.MedicationScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import com.swr302.hivsystem.hivbackend.dto.PrescriptionRequestDTO;
import com.swr302.hivsystem.hivbackend.dto.PrescriptionDetailDTO;
import com.swr302.hivsystem.hivbackend.model.PrescriptionDetail;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private PatientTreatmentPlanRepository patientTreatmentPlanRepository;

    @Autowired
    private MedicationRepository medicationRepository;

    @Autowired
    private MedicationScheduleRepository medicationScheduleRepository;

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
    public ResponseEntity<Prescription> createPrescription(@RequestBody PrescriptionRequestDTO dto) {
        Optional<PatientTreatmentPlan> treatmentPlanOpt = patientTreatmentPlanRepository.findById(dto.getTreatmentPlanId());
        if (treatmentPlanOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Prescription prescription = new Prescription();
        prescription.setTreatmentPlan(treatmentPlanOpt.get());
        prescription.setNotes(dto.getNotes());

        List<PrescriptionDetail> details = new ArrayList<>();
        List<MedicationSchedule> schedules = new ArrayList<>();
        LocalDate startDate = LocalDate.now();
        for (PrescriptionDetailDTO d : dto.getDetails()) {
            Optional<Medication> medicationOpt = medicationRepository.findById(d.getMedicationId());
            if (medicationOpt.isEmpty()) continue;
            PrescriptionDetail detail = new PrescriptionDetail();
            detail.setPrescription(prescription);
            detail.setMedication(medicationOpt.get());
            detail.setDosage(d.getDosage());
            detail.setFrequency(d.getFrequency());
            detail.setDurationDays(d.getDurationDays());
            detail.setNotes(d.getNotes());
            details.add(detail);

            // Sinh lịch uống thuốc cho detail này
            if (d.getFrequency() != null && d.getDurationDays() != null && d.getDurationDays() > 0) {
                String[] times = d.getFrequency().split(",");
                for (int day = 0; day < d.getDurationDays(); day++) {
                    for (String timeStr : times) {
                        timeStr = timeStr.trim();
                        if (timeStr.isEmpty()) continue;
                        try {
                            String[] hm = timeStr.split(":");
                            int hour = Integer.parseInt(hm[0]);
                            int minute = Integer.parseInt(hm[1]);
                            LocalDateTime intakeTime = startDate.plusDays(day).atTime(hour, minute);
                            MedicationSchedule schedule = new MedicationSchedule();
                            schedule.setPrescription(prescription);
                            schedule.setIntakeTime(intakeTime);
                            schedule.setStatus("Pending");
                            schedules.add(schedule);
                        } catch (Exception e) {
                            // Bỏ qua nếu sai định dạng giờ
                        }
                    }
                }
            }
        }
        prescription.setDetails(details);

        Prescription saved = prescriptionRepository.save(prescription);
        // Lưu lịch uống thuốc
        for (MedicationSchedule schedule : schedules) {
            schedule.setPrescription(saved);
            medicationScheduleRepository.save(schedule);
        }
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Prescription> updatePrescription(@PathVariable Long id, @RequestBody Prescription prescriptionDetails) {
        Optional<Prescription> prescription = prescriptionRepository.findById(id);
        if (prescription.isPresent()) {
            Prescription existingPrescription = prescription.get();
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