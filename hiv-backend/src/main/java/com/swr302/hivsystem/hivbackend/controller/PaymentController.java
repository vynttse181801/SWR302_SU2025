package com.swr302.hivsystem.hivbackend.controller;

import com.swr302.hivsystem.hivbackend.model.LabBooking;
import com.swr302.hivsystem.hivbackend.model.OnlineConsultation;
import com.swr302.hivsystem.hivbackend.model.Patient;
import com.swr302.hivsystem.hivbackend.model.Payment;
import com.swr302.hivsystem.hivbackend.repository.LabBookingRepository;
import com.swr302.hivsystem.hivbackend.repository.OnlineConsultationRepository;
import com.swr302.hivsystem.hivbackend.repository.PatientRepository;
import com.swr302.hivsystem.hivbackend.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private OnlineConsultationRepository onlineConsultationRepository;

    @Autowired
    private LabBookingRepository labBookingRepository;

    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Long id) {
        Optional<Payment> payment = paymentRepository.findById(id);
        return payment.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Payment> createPayment(@RequestBody Payment payment) {
        Optional<Patient> patientOptional = patientRepository.findById(payment.getPatient().getId());
        if (patientOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        payment.setPatient(patientOptional.get());

        if (payment.getOnlineConsultation() != null && payment.getOnlineConsultation().getId() != null) {
            Optional<OnlineConsultation> onlineConsultationOptional = onlineConsultationRepository.findById(payment.getOnlineConsultation().getId());
            if (onlineConsultationOptional.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            payment.setOnlineConsultation(onlineConsultationOptional.get());
        } else {
            payment.setOnlineConsultation(null);
        }

        if (payment.getLabBooking() != null && payment.getLabBooking().getId() != null) {
            Optional<LabBooking> labBookingOptional = labBookingRepository.findById(payment.getLabBooking().getId());
            if (labBookingOptional.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            payment.setLabBooking(labBookingOptional.get());
        } else {
            payment.setLabBooking(null);
        }

        return ResponseEntity.ok(paymentRepository.save(payment));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Payment> updatePayment(@PathVariable Long id, @RequestBody Payment paymentDetails) {
        Optional<Payment> payment = paymentRepository.findById(id);
        if (payment.isPresent()) {
            Payment existingPayment = payment.get();
            existingPayment.setAmount(paymentDetails.getAmount());
            existingPayment.setMethod(paymentDetails.getMethod());
            existingPayment.setStatus(paymentDetails.getStatus());
            existingPayment.setPaymentDate(paymentDetails.getPaymentDate());
            existingPayment.setNotes(paymentDetails.getNotes());
            return ResponseEntity.ok(paymentRepository.save(existingPayment));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        if (paymentRepository.existsById(id)) {
            paymentRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
} 