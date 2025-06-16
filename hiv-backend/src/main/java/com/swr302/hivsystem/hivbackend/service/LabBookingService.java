package com.swr302.hivsystem.hivbackend.service;

import com.swr302.hivsystem.hivbackend.model.LabBooking;
import com.swr302.hivsystem.hivbackend.repository.LabBookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LabBookingService {

    private final LabBookingRepository labBookingRepository;

    @Autowired
    public LabBookingService(LabBookingRepository labBookingRepository) {
        this.labBookingRepository = labBookingRepository;
    }

    public List<LabBooking> getAllLabBookings() {
        return labBookingRepository.findAll();
    }

    public Optional<LabBooking> getLabBookingById(Long id) {
        return labBookingRepository.findById(id);
    }

    public LabBooking createLabBooking(LabBooking labBooking) {
        return labBookingRepository.save(labBooking);
    }

    public LabBooking updateLabBooking(Long id, LabBooking labBookingDetails) {
        LabBooking labBooking = labBookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("LabBooking not found with id " + id));

        labBooking.setPatientId(labBookingDetails.getPatientId());
        labBooking.setTestTypeId(labBookingDetails.getTestTypeId());
        labBooking.setDate(labBookingDetails.getDate());
        labBooking.setTimeSlotId(labBookingDetails.getTimeSlotId());
        labBooking.setNotes(labBookingDetails.getNotes());
        labBooking.setStatus(labBookingDetails.getStatus());

        return labBookingRepository.save(labBooking);
    }

    public void deleteLabBooking(Long id) {
        labBookingRepository.deleteById(id);
    }
} 