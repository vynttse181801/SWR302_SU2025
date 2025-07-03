package com.swr302.hivsystem.hivbackend.controller;

import com.swr302.hivsystem.hivbackend.model.Patient;
import com.swr302.hivsystem.hivbackend.model.User;
import com.swr302.hivsystem.hivbackend.model.TreatmentReminder;
import com.swr302.hivsystem.hivbackend.model.MedicationSchedule;
import com.swr302.hivsystem.hivbackend.repository.PatientRepository;
import com.swr302.hivsystem.hivbackend.repository.UserRepository;
import com.swr302.hivsystem.hivbackend.repository.TreatmentReminderRepository;
import com.swr302.hivsystem.hivbackend.repository.MedicationScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/treatment-reminders")
public class TreatmentReminderController {

    @Autowired
    private TreatmentReminderRepository treatmentReminderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private MedicationScheduleRepository medicationScheduleRepository;

    @GetMapping
    public List<TreatmentReminder> getTreatmentReminders(
            @RequestParam(value = "patientId", required = false) Long patientId,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "reminderType", required = false) String reminderType
    ) {
        if (patientId != null && status != null && reminderType != null) {
            return treatmentReminderRepository.findByPatient_IdAndStatusAndReminderType(patientId, status, reminderType);
        } else if (patientId != null && status != null) {
            return treatmentReminderRepository.findByPatient_IdAndStatus(patientId, status);
        } else if (patientId != null && reminderType != null) {
            return treatmentReminderRepository.findByPatient_IdAndReminderType(patientId, reminderType);
        } else if (patientId != null) {
            return treatmentReminderRepository.findByPatient_Id(patientId);
        } else {
            return treatmentReminderRepository.findAll();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<TreatmentReminder> getTreatmentReminderById(@PathVariable Long id) {
        Optional<TreatmentReminder> treatmentReminder = treatmentReminderRepository.findById(id);
        return treatmentReminder.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TreatmentReminder> createTreatmentReminder(@RequestBody TreatmentReminder treatmentReminder) {
        Optional<User> createdByOptional = userRepository.findById(treatmentReminder.getCreatedBy().getId());
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

    @PutMapping("/{id}/send")
    public ResponseEntity<TreatmentReminder> sendTreatmentReminder(@PathVariable Long id) {
        Optional<TreatmentReminder> treatmentReminder = treatmentReminderRepository.findById(id);
        if (treatmentReminder.isPresent()) {
            TreatmentReminder reminder = treatmentReminder.get();
            reminder.setStatus("SENT");
            // TODO: Thêm logic gửi email/SMS nếu cần
            return ResponseEntity.ok(treatmentReminderRepository.save(reminder));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<TreatmentReminder> completeTreatmentReminder(@PathVariable Long id) {
        Optional<TreatmentReminder> treatmentReminder = treatmentReminderRepository.findById(id);
        if (treatmentReminder.isPresent()) {
            TreatmentReminder reminder = treatmentReminder.get();
            reminder.setStatus("COMPLETED");
            return ResponseEntity.ok(treatmentReminderRepository.save(reminder));
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

    // API tạo nhắc nhở uống thuốc từ lịch uống thuốc có sẵn cho bệnh nhân
    @PostMapping("/medication-reminders/patient/{patientId}")
    public ResponseEntity<String> createMedicationRemindersFromSchedules(@PathVariable Long patientId, @RequestParam Long createdById) {
        List<MedicationSchedule> schedules = medicationScheduleRepository.findByPrescription_TreatmentPlan_Patient_Id(patientId);
        Optional<User> createdByOpt = userRepository.findById(createdById);
        Optional<Patient> patientOpt = patientRepository.findById(patientId);
        if (createdByOpt.isEmpty() || patientOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid user or patient");
        }
        User createdBy = createdByOpt.get();
        Patient patient = patientOpt.get();
        int count = 0;
        LocalDateTime now = LocalDateTime.now();
        for (MedicationSchedule schedule : schedules) {
            // Chỉ tạo nhắc nhở cho các lịch uống thuốc trong tương lai
            if (schedule.getIntakeTime().isAfter(now)) {
                TreatmentReminder reminder = new TreatmentReminder();
                reminder.setCreatedBy(createdBy);
                reminder.setPatient(patient);
                reminder.setReminderType("MEDICATION");
                reminder.setReminderDate(schedule.getIntakeTime());
                reminder.setStatus("PENDING");
                treatmentReminderRepository.save(reminder);
                count++;
            }
        }
        return ResponseEntity.ok("Đã tạo " + count + " nhắc nhở uống thuốc cho bệnh nhân.");
    }

    // API xóa tất cả nhắc nhở uống thuốc (reminderType = 'MEDICATION') cho bệnh nhân
    @DeleteMapping("/medication-reminders/patient/{patientId}")
    public ResponseEntity<String> deleteMedicationRemindersByPatient(@PathVariable Long patientId) {
        try {
            treatmentReminderRepository.deleteAllMedicationRemindersByPatient(patientId, "MEDICATION");
            return ResponseEntity.ok("Đã xóa tất cả nhắc nhở uống thuốc cho bệnh nhân " + patientId);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi khi xóa nhắc nhở uống thuốc: " + e.getMessage());
        }
    }
} 