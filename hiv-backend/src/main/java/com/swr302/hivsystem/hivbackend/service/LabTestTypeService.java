package com.swr302.hivsystem.hivbackend.service;

import com.swr302.hivsystem.hivbackend.model.LabTestType;
import com.swr302.hivsystem.hivbackend.repository.LabTestTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LabTestTypeService {

    private final LabTestTypeRepository labTestTypeRepository;

    @Autowired
    public LabTestTypeService(LabTestTypeRepository labTestTypeRepository) {
        this.labTestTypeRepository = labTestTypeRepository;
    }

    public List<LabTestType> getAllLabTestTypes() {
        return labTestTypeRepository.findAll();
    }

    public Optional<LabTestType> getLabTestTypeById(Long id) {
        return labTestTypeRepository.findById(id);
    }

    public LabTestType createLabTestType(LabTestType labTestType) {
        return labTestTypeRepository.save(labTestType);
    }

    public LabTestType updateLabTestType(Long id, LabTestType labTestTypeDetails) {
        LabTestType labTestType = labTestTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("LabTestType not found with id " + id));

        labTestType.setName(labTestTypeDetails.getName());
        labTestType.setDescription(labTestTypeDetails.getDescription());
        labTestType.setPrice(labTestTypeDetails.getPrice());
        labTestType.setDurationMinutes(labTestTypeDetails.getDurationMinutes());

        return labTestTypeRepository.save(labTestType);
    }

    public void deleteLabTestType(Long id) {
        labTestTypeRepository.deleteById(id);
    }
} 