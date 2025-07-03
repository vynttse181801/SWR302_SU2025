package com.swr302.hivsystem.hivbackend.repository;

import com.swr302.hivsystem.hivbackend.model.MedicationSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MedicationScheduleRepository extends JpaRepository<MedicationSchedule, Long> {
    // Lấy tất cả lịch uống thuốc theo bệnh nhân
    List<MedicationSchedule> findByPrescription_TreatmentPlan_Patient_Id(Long patientId);
} 