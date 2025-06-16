package com.swr302.hivsystem.hivbackend.service;

import com.swr302.hivsystem.hivbackend.model.ConsultationTimeSlot;
import com.swr302.hivsystem.hivbackend.repository.ConsultationTimeSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ConsultationTimeSlotService {

    @Autowired
    private ConsultationTimeSlotRepository consultationTimeSlotRepository;

    public List<ConsultationTimeSlot> getAllConsultationTimeSlots() {
        return consultationTimeSlotRepository.findAll();
    }

    public List<ConsultationTimeSlot> getTimeSlotsByDoctorAndDate(Long doctorId, LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59);
        return consultationTimeSlotRepository.findByDoctorIdAndStartTimeBetween(doctorId, startOfDay, endOfDay);
    }

    public ConsultationTimeSlot createConsultationTimeSlot(ConsultationTimeSlot slot) {
        return consultationTimeSlotRepository.save(slot);
    }
} 