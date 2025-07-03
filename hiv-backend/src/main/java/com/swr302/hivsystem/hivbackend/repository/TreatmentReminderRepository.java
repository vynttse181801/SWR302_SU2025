package com.swr302.hivsystem.hivbackend.repository;

import com.swr302.hivsystem.hivbackend.model.TreatmentReminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TreatmentReminderRepository extends JpaRepository<TreatmentReminder, Long> {
    List<TreatmentReminder> findByStatusAndReminderDateBefore(String status, LocalDateTime dateTime);
    @Transactional
    @Modifying
    @Query("DELETE FROM TreatmentReminder tr WHERE tr.patient.id = :patientId AND tr.reminderType = :reminderType")
    void deleteAllMedicationRemindersByPatient(Long patientId, String reminderType);
    List<TreatmentReminder> findByPatient_Id(Long patientId);
    List<TreatmentReminder> findByPatient_IdAndStatus(Long patientId, String status);
    List<TreatmentReminder> findByPatient_IdAndReminderType(Long patientId, String reminderType);
    List<TreatmentReminder> findByPatient_IdAndStatusAndReminderType(Long patientId, String status, String reminderType);
    List<TreatmentReminder> findByPatient_IdAndReminderTypeAndReminderDate(Long patientId, String reminderType, LocalDateTime reminderDate);
} 