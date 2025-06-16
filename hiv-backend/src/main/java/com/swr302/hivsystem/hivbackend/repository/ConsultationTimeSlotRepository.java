package com.swr302.hivsystem.hivbackend.repository;

import com.swr302.hivsystem.hivbackend.model.ConsultationTimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ConsultationTimeSlotRepository extends JpaRepository<ConsultationTimeSlot, Long> {
    List<ConsultationTimeSlot> findByDoctorIdAndStartTimeBetween(Long doctorId, LocalDateTime startOfDay, LocalDateTime endOfDay);
} 