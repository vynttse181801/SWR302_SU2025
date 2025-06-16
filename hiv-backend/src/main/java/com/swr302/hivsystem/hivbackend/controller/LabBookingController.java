package com.swr302.hivsystem.hivbackend.controller;

import com.swr302.hivsystem.hivbackend.model.LabBooking;
import com.swr302.hivsystem.hivbackend.service.LabBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lab-tests")
public class LabBookingController {

    private final LabBookingService labBookingService;

    @Autowired
    public LabBookingController(LabBookingService labBookingService) {
        this.labBookingService = labBookingService;
    }

    @GetMapping
    public List<LabBooking> getAllLabBookings() {
        return labBookingService.getAllLabBookings();
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
} 