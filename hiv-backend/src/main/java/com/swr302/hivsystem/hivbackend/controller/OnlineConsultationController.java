package com.swr302.hivsystem.hivbackend.controller;

import com.swr302.hivsystem.hivbackend.model.OnlineConsultation;
import com.swr302.hivsystem.hivbackend.model.Appointment;
import com.swr302.hivsystem.hivbackend.model.ConsultationType;
import com.swr302.hivsystem.hivbackend.model.Doctor;
import com.swr302.hivsystem.hivbackend.model.ConsultationTimeSlot;
import com.swr302.hivsystem.hivbackend.model.MedicalService;
import com.swr302.hivsystem.hivbackend.model.Patient;
import com.swr302.hivsystem.hivbackend.dto.ConsultationRequestDTO;
import com.swr302.hivsystem.hivbackend.repository.OnlineConsultationRepository;
import com.swr302.hivsystem.hivbackend.repository.AppointmentRepository;
import com.swr302.hivsystem.hivbackend.repository.ConsultationTypeRepository;
import com.swr302.hivsystem.hivbackend.repository.DoctorRepository;
import com.swr302.hivsystem.hivbackend.repository.ConsultationTimeSlotRepository;
import com.swr302.hivsystem.hivbackend.repository.MedicalServiceRepository;
import com.swr302.hivsystem.hivbackend.repository.PatientRepository;
import com.swr302.hivsystem.hivbackend.service.MeetingLinkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/online-consultations")
public class OnlineConsultationController {

    @Autowired
    private OnlineConsultationRepository onlineConsultationRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private ConsultationTypeRepository consultationTypeRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private ConsultationTimeSlotRepository consultationTimeSlotRepository;

    @Autowired
    private MedicalServiceRepository medicalServiceRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private MeetingLinkService meetingLinkService;

    @GetMapping
    public List<OnlineConsultation> getAllOnlineConsultations() {
        return onlineConsultationRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<OnlineConsultation> getOnlineConsultationById(@PathVariable Long id) {
        Optional<OnlineConsultation> onlineConsultation = onlineConsultationRepository.findById(id);
        return onlineConsultation.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<OnlineConsultation> createOnlineConsultation(@RequestBody ConsultationRequestDTO requestDTO) {
        try {
            // Fetch Doctor and TimeSlot
            Optional<Doctor> doctorOptional = doctorRepository.findById(requestDTO.getDoctorId());
            Optional<ConsultationTimeSlot> timeSlotOptional = consultationTimeSlotRepository.findById(requestDTO.getTimeSlotId());

            if (doctorOptional.isEmpty() || timeSlotOptional.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            Doctor doctor = doctorOptional.get();
            ConsultationTimeSlot timeSlot = timeSlotOptional.get();

            // Fetch a default MedicalService (e.g., 'Tư vấn HIV' or the first one available)
            Optional<MedicalService> medicalServiceOptional = medicalServiceRepository.findByName("Tư vấn HIV");
            if (medicalServiceOptional.isEmpty()) {
                medicalServiceOptional = medicalServiceRepository.findAll().stream().findFirst();
            }
            
            if (medicalServiceOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
            }
            MedicalService medicalService = medicalServiceOptional.get();

            // Fetch a patient (for now, just get the first one available)
            Optional<Patient> patientOptional = patientRepository.findAll().stream().findFirst();
            if (patientOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
            }
            Patient patient = patientOptional.get();

            // Create an Appointment object
            Appointment newAppointment = new Appointment();
            newAppointment.setDoctor(doctor);
            newAppointment.setAppointmentDate(requestDTO.getDate());
            newAppointment.setAppointmentTime(timeSlot.getStartTime().toLocalTime());
            newAppointment.setStatus("Scheduled");
            newAppointment.setMedicalService(medicalService);
            newAppointment.setPatient(patient);
            
            Appointment savedAppointment = appointmentRepository.save(newAppointment);

            // Đánh dấu slot đã được đặt
            timeSlot.setBooked(true);
            consultationTimeSlotRepository.save(timeSlot);

            // Fetch ConsultationType (assuming a fixed ID for now, e.g., ID 1)
            Optional<ConsultationType> consultationTypeOptional = consultationTypeRepository.findById(requestDTO.getConsultationTypeId() != null ? requestDTO.getConsultationTypeId() : 1L);
            if (consultationTypeOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            ConsultationType consultationType = consultationTypeOptional.get();

            // Create OnlineConsultation object
            OnlineConsultation onlineConsultation = new OnlineConsultation();
            onlineConsultation.setAppointment(savedAppointment);
            onlineConsultation.setConsultationType(consultationType);
            onlineConsultation.setStartTime(timeSlot.getStartTime());
            onlineConsultation.setEndTime(timeSlot.getEndTime());
            onlineConsultation.setNotes(requestDTO.getNotes());
            
            // Tự động tạo link meet
            String meetingLink = meetingLinkService.generateMeetingLink(
                doctor.getFullName(),
                patient.getFullName(),
                timeSlot.getStartTime()
            );
            onlineConsultation.setMeetingLink(meetingLink);
            
            OnlineConsultation savedConsultation = onlineConsultationRepository.save(onlineConsultation);
            
            return ResponseEntity.ok(savedConsultation);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<OnlineConsultation> updateOnlineConsultation(@PathVariable Long id, @RequestBody OnlineConsultation onlineConsultationDetails) {
        Optional<OnlineConsultation> onlineConsultation = onlineConsultationRepository.findById(id);
        if (onlineConsultation.isPresent()) {
            OnlineConsultation existingOnlineConsultation = onlineConsultation.get();
            existingOnlineConsultation.setMeetingLink(onlineConsultationDetails.getMeetingLink());
            existingOnlineConsultation.setStartTime(onlineConsultationDetails.getStartTime());
            existingOnlineConsultation.setEndTime(onlineConsultationDetails.getEndTime());
            existingOnlineConsultation.setNotes(onlineConsultationDetails.getNotes());
            return ResponseEntity.ok(onlineConsultationRepository.save(existingOnlineConsultation));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOnlineConsultation(@PathVariable Long id) {
        if (onlineConsultationRepository.existsById(id)) {
            onlineConsultationRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/patient/{patientId}")
    public List<Map<String, Object>> getConsultationsByPatient(@PathVariable Long patientId) {
        return onlineConsultationRepository.findAll()
            .stream()
            .filter(consultation -> consultation.getAppointment().getPatient().getId().equals(patientId))
            .map(consultation -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", consultation.getId());
                map.put("appointmentId", consultation.getAppointment().getId());
                map.put("consultationType", consultation.getConsultationType().getName());
                map.put("meetingLink", consultation.getMeetingLink());
                map.put("startTime", consultation.getStartTime());
                map.put("endTime", consultation.getEndTime());
                map.put("notes", consultation.getNotes());
                map.put("createdAt", consultation.getCreatedAt());
                map.put("updatedAt", consultation.getUpdatedAt());
                map.put("status", consultation.getAppointment().getStatus());
                map.put("doctorName", consultation.getAppointment().getDoctor() != null ? consultation.getAppointment().getDoctor().getFullName() : "");
                return map;
            })
            .collect(Collectors.toList());
    }

    @GetMapping("/doctor/{doctorId}")
    public List<Map<String, Object>> getConsultationsByDoctor(@PathVariable Long doctorId) {
        return onlineConsultationRepository.findAll()
            .stream()
            .filter(consultation -> consultation.getAppointment().getDoctor().getId().equals(doctorId))
            .map(consultation -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", consultation.getId());
                map.put("appointmentId", consultation.getAppointment().getId());
                map.put("consultationType", consultation.getConsultationType().getName());
                map.put("meetingLink", consultation.getMeetingLink());
                map.put("startTime", consultation.getStartTime());
                map.put("endTime", consultation.getEndTime());
                map.put("notes", consultation.getNotes());
                map.put("createdAt", consultation.getCreatedAt());
                map.put("updatedAt", consultation.getUpdatedAt());
                map.put("status", consultation.getAppointment().getStatus());
                map.put("patientName", consultation.getAppointment().getPatient() != null ? consultation.getAppointment().getPatient().getFullName() : "");
                map.put("patientId", consultation.getAppointment().getPatient() != null ? consultation.getAppointment().getPatient().getId() : "");
                return map;
            })
            .collect(Collectors.toList());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<OnlineConsultation> updateOnlineConsultationStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        Optional<OnlineConsultation> onlineConsultation = onlineConsultationRepository.findById(id);
        if (onlineConsultation.isPresent()) {
            String status = request.get("status");
            if (status == null) {
                return ResponseEntity.badRequest().build();
            }
            
            OnlineConsultation existingOnlineConsultation = onlineConsultation.get();
            existingOnlineConsultation.getAppointment().setStatus(status);
            appointmentRepository.save(existingOnlineConsultation.getAppointment());
            
            return ResponseEntity.ok(onlineConsultationRepository.save(existingOnlineConsultation));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/regenerate-meeting-link")
    public ResponseEntity<OnlineConsultation> regenerateMeetingLink(@PathVariable Long id) {
        Optional<OnlineConsultation> onlineConsultation = onlineConsultationRepository.findById(id);
        if (onlineConsultation.isPresent()) {
            OnlineConsultation existingOnlineConsultation = onlineConsultation.get();
            
            // Tạo lại link meet
            String newMeetingLink = meetingLinkService.generateMeetingLink(
                existingOnlineConsultation.getAppointment().getDoctor().getFullName(),
                existingOnlineConsultation.getAppointment().getPatient().getFullName(),
                existingOnlineConsultation.getStartTime()
            );
            
            existingOnlineConsultation.setMeetingLink(newMeetingLink);
            
            return ResponseEntity.ok(onlineConsultationRepository.save(existingOnlineConsultation));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}