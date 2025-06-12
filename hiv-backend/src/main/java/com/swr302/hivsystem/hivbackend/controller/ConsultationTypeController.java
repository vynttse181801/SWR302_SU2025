package com.swr302.hivsystem.hivbackend.controller;

import com.swr302.hivsystem.hivbackend.model.ConsultationType;
import com.swr302.hivsystem.hivbackend.repository.ConsultationTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/consultation-types")
public class ConsultationTypeController {

    @Autowired
    private ConsultationTypeRepository consultationTypeRepository;

    @GetMapping
    public List<ConsultationType> getAllConsultationTypes() {
        return consultationTypeRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConsultationType> getConsultationTypeById(@PathVariable Long id) {
        Optional<ConsultationType> consultationType = consultationTypeRepository.findById(id);
        return consultationType.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ConsultationType createConsultationType(@RequestBody ConsultationType consultationType) {
        return consultationTypeRepository.save(consultationType);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ConsultationType> updateConsultationType(@PathVariable Long id, @RequestBody ConsultationType consultationTypeDetails) {
        Optional<ConsultationType> consultationType = consultationTypeRepository.findById(id);
        if (consultationType.isPresent()) {
            ConsultationType existingConsultationType = consultationType.get();
            existingConsultationType.setName(consultationTypeDetails.getName());
            existingConsultationType.setDescription(consultationTypeDetails.getDescription());
            return ResponseEntity.ok(consultationTypeRepository.save(existingConsultationType));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConsultationType(@PathVariable Long id) {
        if (consultationTypeRepository.existsById(id)) {
            consultationTypeRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
} 