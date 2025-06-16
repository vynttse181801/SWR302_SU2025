package com.swr302.hivsystem.hivbackend.controller;

import com.swr302.hivsystem.hivbackend.model.ConsultationTimeSlot;
import com.swr302.hivsystem.hivbackend.service.ConsultationTimeSlotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/consultation-time-slots")
public class ConsultationTimeSlotController {

    @Autowired
    private ConsultationTimeSlotService consultationTimeSlotService;

    @GetMapping
    public ResponseEntity<List<ConsultationTimeSlot>> getTimeSlotsByDoctorAndDate(
            @RequestParam("doctorId") Long doctorId,
            @RequestParam("date") LocalDate date) {
        List<ConsultationTimeSlot> slots = consultationTimeSlotService.getTimeSlotsByDoctorAndDate(doctorId, date);
        return ResponseEntity.ok(slots);
    }

    @PostMapping
    public ResponseEntity<ConsultationTimeSlot> createConsultationTimeSlot(@RequestBody ConsultationTimeSlot slot) {
        ConsultationTimeSlot newSlot = consultationTimeSlotService.createConsultationTimeSlot(slot);
        return ResponseEntity.ok(newSlot);
    }
} 