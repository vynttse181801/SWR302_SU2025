package com.swr302.hivsystem.hivbackend.dto;

import java.util.List;

public class PrescriptionRequestDTO {
    private Long treatmentPlanId;
    private String notes;
    private List<PrescriptionDetailDTO> details;

    public Long getTreatmentPlanId() {
        return treatmentPlanId;
    }

    public void setTreatmentPlanId(Long treatmentPlanId) {
        this.treatmentPlanId = treatmentPlanId;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public List<PrescriptionDetailDTO> getDetails() {
        return details;
    }

    public void setDetails(List<PrescriptionDetailDTO> details) {
        this.details = details;
    }
} 