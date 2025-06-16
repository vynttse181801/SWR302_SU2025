package com.swr302.hivsystem.hivbackend.controller;

import com.swr302.hivsystem.hivbackend.model.LabTestType;
import com.swr302.hivsystem.hivbackend.service.LabTestTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/labtesttypes")
public class LabTestTypeController {

    private final LabTestTypeService labTestTypeService;

    @Autowired
    public LabTestTypeController(LabTestTypeService labTestTypeService) {
        this.labTestTypeService = labTestTypeService;
    }

    @GetMapping
    public List<LabTestType> getAllLabTestTypes() {
        return labTestTypeService.getAllLabTestTypes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<LabTestType> getLabTestTypeById(@PathVariable Long id) {
        return labTestTypeService.getLabTestTypeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public LabTestType createLabTestType(@RequestBody LabTestType labTestType) {
        return labTestTypeService.createLabTestType(labTestType);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LabTestType> updateLabTestType(@PathVariable Long id, @RequestBody LabTestType labTestTypeDetails) {
        try {
            LabTestType updatedLabTestType = labTestTypeService.updateLabTestType(id, labTestTypeDetails);
            return ResponseEntity.ok(updatedLabTestType);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLabTestType(@PathVariable Long id) {
        try {
            labTestTypeService.deleteLabTestType(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
} 