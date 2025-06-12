package com.swr302.hivsystem.hivbackend.controller;

import com.swr302.hivsystem.hivbackend.model.MedicalService;
import com.swr302.hivsystem.hivbackend.repository.MedicalServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/medical-services")
public class MedicalServiceController {

    @Autowired
    private MedicalServiceRepository medicalServiceRepository;

    @GetMapping
    public List<MedicalService> getAllMedicalServices() {
        return medicalServiceRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalService> getMedicalServiceById(@PathVariable Long id) {
        Optional<MedicalService> medicalService = medicalServiceRepository.findById(id);
        return medicalService.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public MedicalService createMedicalService(@RequestBody MedicalService medicalService) {
        return medicalServiceRepository.save(medicalService);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicalService> updateMedicalService(@PathVariable Long id, @RequestBody MedicalService medicalServiceDetails) {
        Optional<MedicalService> medicalService = medicalServiceRepository.findById(id);
        if (medicalService.isPresent()) {
            MedicalService existingMedicalService = medicalService.get();
            existingMedicalService.setName(medicalServiceDetails.getName());
            existingMedicalService.setDescription(medicalServiceDetails.getDescription());
            existingMedicalService.setDefaultDuration(medicalServiceDetails.getDefaultDuration());
            existingMedicalService.setPrice(medicalServiceDetails.getPrice());
            return ResponseEntity.ok(medicalServiceRepository.save(existingMedicalService));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicalService(@PathVariable Long id) {
        if (medicalServiceRepository.existsById(id)) {
            medicalServiceRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
} 