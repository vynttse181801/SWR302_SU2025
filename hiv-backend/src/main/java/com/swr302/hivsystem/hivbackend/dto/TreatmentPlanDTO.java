package com.swr302.hivsystem.hivbackend.dto;

import java.time.LocalDate;

public class TreatmentPlanDTO {
    private Long id;
    private LocalDate startDate;
    private LocalDate endDate;
    private String notes;
    private ArvProtocolDTO arvProtocol;

    // getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public ArvProtocolDTO getArvProtocol() { return arvProtocol; }
    public void setArvProtocol(ArvProtocolDTO arvProtocol) { this.arvProtocol = arvProtocol; }

    // fromEntity
    public static TreatmentPlanDTO fromEntity(com.swr302.hivsystem.hivbackend.model.PatientTreatmentPlan plan) {
        TreatmentPlanDTO dto = new TreatmentPlanDTO();
        dto.setId(plan.getId());
        dto.setStartDate(plan.getStartDate());
        dto.setEndDate(plan.getEndDate());
        dto.setNotes(plan.getNotes());
        if (plan.getArvProtocol() != null) {
            dto.setArvProtocol(ArvProtocolDTO.fromEntity(plan.getArvProtocol()));
        }
        return dto;
    }
} 