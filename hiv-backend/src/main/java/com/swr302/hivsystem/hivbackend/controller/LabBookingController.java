package com.swr302.hivsystem.hivbackend.controller;

import com.swr302.hivsystem.hivbackend.model.LabBooking;
import com.swr302.hivsystem.hivbackend.service.LabBookingService;
import com.swr302.hivsystem.hivbackend.repository.LabTestTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.HashMap;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/lab-tests")
public class LabBookingController {

    private final LabBookingService labBookingService;
    private final LabTestTypeRepository labTestTypeRepository;

    @Autowired
    public LabBookingController(LabBookingService labBookingService, LabTestTypeRepository labTestTypeRepository) {
        this.labBookingService = labBookingService;
        this.labTestTypeRepository = labTestTypeRepository;
    }

    @GetMapping
    public List<LabBooking> getAllLabBookings() {
        return labBookingService.getAllLabBookings();
    }

        // API trả về khung giờ cố định cho xét nghiệm (trừ chủ nhật)
        @GetMapping("/time-slots")
        public ResponseEntity<List<String>> getLabTestTimeSlots(@RequestParam(required = false) String date) {
            // Khung giờ tròn số: 07:00, 08:00, ..., 11:00, 13:00, ..., 16:00
            List<String> timeSlots = new ArrayList<>();
            for (int hour = 7; hour <= 11; hour++) {
                timeSlots.add(String.format("%02d:00", hour));
            }
            for (int hour = 13; hour <= 16; hour++) {
                timeSlots.add(String.format("%02d:00", hour));
            }
            
            // Nếu truyền ngày là chủ nhật thì trả về rỗng
            if (date != null) {
                java.time.LocalDate localDate = java.time.LocalDate.parse(date);
                if (localDate.getDayOfWeek() == java.time.DayOfWeek.SUNDAY) {
                    return ResponseEntity.ok(new ArrayList<>());
                }
            }
            return ResponseEntity.ok(timeSlots);
        }

    @GetMapping("/{id}")
    public ResponseEntity<LabBooking> getLabBookingById(@PathVariable Long id) {
        return labBookingService.getLabBookingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public LabBooking createLabBooking(@RequestBody LabBooking labBooking) {
        return labBookingService.createLabBooking(labBooking);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LabBooking> updateLabBooking(@PathVariable Long id, @RequestBody LabBooking labBookingDetails) {
        try {
            LabBooking updatedLabBooking = labBookingService.updateLabBooking(id, labBookingDetails);
            return ResponseEntity.ok(updatedLabBooking);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLabBooking(@PathVariable Long id) {
        try {
            labBookingService.deleteLabBooking(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/patient/{patientId}")
    public List<Map<String, Object>> getLabBookingsByPatient(@PathVariable Long patientId) {
        return labBookingService.getAllLabBookings()
            .stream()
            .filter(labBooking -> labBooking.getPatientId().equals(patientId))
            .map(labBooking -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", labBooking.getId());
                // Lấy tên loại xét nghiệm từ testTypeId
                String testTypeName = labTestTypeRepository.findById(labBooking.getTestTypeId())
                    .map(t -> t.getName()).orElse("");
                map.put("testTypeName", testTypeName);
                map.put("date", labBooking.getDate());
                map.put("timeSlot", labBooking.getTimeSlotId());
                map.put("status", labBooking.getStatus());
                map.put("doctorName", "");
                map.put("notes", labBooking.getNotes());
                return map;
            })
            .collect(Collectors.toList());
    }


} 