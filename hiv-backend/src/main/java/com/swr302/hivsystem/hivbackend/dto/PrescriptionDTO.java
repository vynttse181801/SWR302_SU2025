package com.swr302.hivsystem.hivbackend.dto;

import java.time.LocalDateTime;
import com.swr302.hivsystem.hivbackend.model.PatientTreatmentPlan;

public class PrescriptionDTO {
    private Long id;
    private String notes;
    private String status;
    private LocalDateTime createdAt;
    private TreatmentPlanDTO treatmentPlan;

    // getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public TreatmentPlanDTO getTreatmentPlan() { return treatmentPlan; }
    public void setTreatmentPlan(TreatmentPlanDTO treatmentPlan) { this.treatmentPlan = treatmentPlan; }

    // fromEntity
    public static PrescriptionDTO fromEntity(com.swr302.hivsystem.hivbackend.model.Prescription p) {
        PrescriptionDTO dto = new PrescriptionDTO();
        dto.setId(p.getId());
        dto.setNotes(p.getNotes());
        dto.setCreatedAt(p.getCreatedAt());
        if (p.getTreatmentPlan() != null) {
            dto.setTreatmentPlan(TreatmentPlanDTO.fromEntity(p.getTreatmentPlan()));
        }
        return dto;
    }
} 