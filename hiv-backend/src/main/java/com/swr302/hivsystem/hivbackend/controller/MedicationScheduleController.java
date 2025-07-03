package com.swr302.hivsystem.hivbackend.controller;

import com.swr302.hivsystem.hivbackend.model.MedicationSchedule;
import com.swr302.hivsystem.hivbackend.model.Prescription;
import com.swr302.hivsystem.hivbackend.repository.MedicationScheduleRepository;
import com.swr302.hivsystem.hivbackend.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.swr302.hivsystem.hivbackend.dto.MedicationScheduleDTO;
import com.swr302.hivsystem.hivbackend.model.PrescriptionDetail;
import com.swr302.hivsystem.hivbackend.model.Medication;
import java.util.stream.Collectors;

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
    public List<MedicationScheduleDTO> getAllMedicationSchedules() {
        return medicationScheduleRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
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

    @GetMapping("/patient/{patientId}")
    public List<MedicationScheduleDTO> getMedicationSchedulesByPatient(@PathVariable Long patientId) {
        return medicationScheduleRepository.findByPrescription_TreatmentPlan_Patient_Id(patientId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    private MedicationScheduleDTO toDTO(MedicationSchedule schedule) {
        String medicationName = null;
        String dosage = null;
        String frequency = null;
        // Lấy thông tin thuốc từ prescription detail đầu tiên (nếu có)
        Prescription prescription = schedule.getPrescription();
        if (prescription != null && prescription.getDetails() != null && !prescription.getDetails().isEmpty()) {
            PrescriptionDetail detail = prescription.getDetails().get(0);
            Medication medication = detail.getMedication();
            if (medication != null) {
                medicationName = medication.getName();
            }
            dosage = detail.getDosage();
            frequency = detail.getFrequency();
        }
        return new MedicationScheduleDTO(
                schedule.getId(),
                schedule.getIntakeTime(),
                schedule.getStatus(),
                medicationName,
                dosage,
                frequency
        );
    }
} 