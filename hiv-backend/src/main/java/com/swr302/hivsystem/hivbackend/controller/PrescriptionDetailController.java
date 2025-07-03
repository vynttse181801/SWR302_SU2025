package com.swr302.hivsystem.hivbackend.controller;

import com.swr302.hivsystem.hivbackend.model.PrescriptionDetail;
import com.swr302.hivsystem.hivbackend.model.Prescription;
import com.swr302.hivsystem.hivbackend.model.Medication;
import com.swr302.hivsystem.hivbackend.repository.PrescriptionDetailRepository;
import com.swr302.hivsystem.hivbackend.repository.PrescriptionRepository;
import com.swr302.hivsystem.hivbackend.repository.MedicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/prescription-details")
public class PrescriptionDetailController {

    @Autowired
    private PrescriptionDetailRepository prescriptionDetailRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private MedicationRepository medicationRepository;

    // Lấy tất cả chi tiết thuốc của một đơn
    @GetMapping("/prescription/{prescriptionId}")
    public ResponseEntity<List<PrescriptionDetail>> getDetailsByPrescription(@PathVariable Long prescriptionId) {
        Optional<Prescription> prescriptionOpt = prescriptionRepository.findById(prescriptionId);
        if (prescriptionOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        List<PrescriptionDetail> details = prescriptionOpt.get().getDetails();
        return ResponseEntity.ok(details);
    }

    // Thêm mới một chi tiết thuốc vào đơn
    @PostMapping
    public ResponseEntity<PrescriptionDetail> addDetail(@RequestBody PrescriptionDetail detail) {
        // Kiểm tra prescription và medication có tồn tại không
        if (detail.getPrescription() == null || detail.getMedication() == null) {
            return ResponseEntity.badRequest().build();
        }
        Optional<Prescription> prescriptionOpt = prescriptionRepository.findById(detail.getPrescription().getId());
        Optional<Medication> medicationOpt = medicationRepository.findById(detail.getMedication().getId());
        if (prescriptionOpt.isEmpty() || medicationOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        detail.setPrescription(prescriptionOpt.get());
        detail.setMedication(medicationOpt.get());
        PrescriptionDetail saved = prescriptionDetailRepository.save(detail);
        return ResponseEntity.ok(saved);
    }

    // Sửa thông tin một chi tiết thuốc
    @PutMapping("/{id}")
    public ResponseEntity<PrescriptionDetail> updateDetail(@PathVariable Long id, @RequestBody PrescriptionDetail detailUpdate) {
        Optional<PrescriptionDetail> detailOpt = prescriptionDetailRepository.findById(id);
        if (detailOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        PrescriptionDetail detail = detailOpt.get();
        detail.setDosage(detailUpdate.getDosage());
        detail.setFrequency(detailUpdate.getFrequency());
        detail.setDurationDays(detailUpdate.getDurationDays());
        detail.setNotes(detailUpdate.getNotes());
        // Nếu muốn cho phép đổi thuốc, prescription thì thêm ở đây
        PrescriptionDetail saved = prescriptionDetailRepository.save(detail);
        return ResponseEntity.ok(saved);
    }

    // Xoá một chi tiết thuốc
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDetail(@PathVariable Long id) {
        if (!prescriptionDetailRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        prescriptionDetailRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
} 