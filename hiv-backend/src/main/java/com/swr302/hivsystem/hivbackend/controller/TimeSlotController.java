package com.swr302.hivsystem.hivbackend.controller;

import com.swr302.hivsystem.hivbackend.model.DoctorSchedule;
import com.swr302.hivsystem.hivbackend.model.Appointment;
import com.swr302.hivsystem.hivbackend.repository.DoctorScheduleRepository;
import com.swr302.hivsystem.hivbackend.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/time-slots")
public class TimeSlotController {

    @Autowired
    private DoctorScheduleRepository doctorScheduleRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @GetMapping
    public ResponseEntity<List<TimeSlotDTO>> getAvailableTimeSlots(
            @RequestParam Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        
        // Get doctor's schedule for the day of week
        DayOfWeek dayOfWeek = date.getDayOfWeek();
        List<DoctorSchedule> schedules = doctorScheduleRepository.findByDoctorIdAndDayOfWeek(doctorId, dayOfWeek);
        
        if (schedules.isEmpty()) {
            return ResponseEntity.ok(new ArrayList<>());
        }

        // Get existing appointments for the date
        List<Appointment> existingAppointments = appointmentRepository.findByDoctorIdAndAppointmentDate(doctorId, date);

        // Generate time slots
        List<TimeSlotDTO> timeSlots = new ArrayList<>();
        for (DoctorSchedule schedule : schedules) {
            LocalTime currentTime = schedule.getStartTime();
            while (currentTime.isBefore(schedule.getEndTime())) {
                // Create a final copy of currentTime for use in lambda
                final LocalTime slotTime = currentTime;
                
                // Check if this time slot is available
                boolean isAvailable = existingAppointments.stream()
                    .noneMatch(appointment -> appointment.getAppointmentTime().equals(slotTime));

                timeSlots.add(new TimeSlotDTO(
                    timeSlots.size() + 1L,
                    currentTime.toString(),
                    isAvailable
                ));

                // Move to next 30-minute slot
                currentTime = currentTime.plusMinutes(30);
            }
        }

        return ResponseEntity.ok(timeSlots);
    }

    // DTO class for time slots
    public static class TimeSlotDTO {
        private Long id;
        private String time;
        private boolean isAvailable;

        public TimeSlotDTO(Long id, String time, boolean isAvailable) {
            this.id = id;
            this.time = time;
            this.isAvailable = isAvailable;
        }

        // Getters and setters
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getTime() {
            return time;
        }

        public void setTime(String time) {
            this.time = time;
        }

        public boolean isAvailable() {
            return isAvailable;
        }

        public void setAvailable(boolean available) {
            isAvailable = available;
        }
    }
} 