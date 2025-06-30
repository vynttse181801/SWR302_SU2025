package com.swr302.hivsystem.hivbackend.repository;

import com.swr302.hivsystem.hivbackend.model.PatientTreatmentPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientTreatmentPlanRepository extends JpaRepository<PatientTreatmentPlan, Long> {
    List<PatientTreatmentPlan> findByDoctorId(Long doctorId);
    List<PatientTreatmentPlan> findByPatientId(Long patientId);
    List<PatientTreatmentPlan> findByDoctorIdAndPatientId(Long doctorId, Long patientId);
} 