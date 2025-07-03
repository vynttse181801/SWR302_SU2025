package com.swr302.hivsystem.hivbackend.dto;

import java.time.LocalDateTime;

public class MedicationScheduleDTO {
    private Long id;
    private LocalDateTime intakeTime;
    private String status;
    private String medicationName;
    private String dosage;
    private String frequency;

    public MedicationScheduleDTO() {}

    public MedicationScheduleDTO(Long id, LocalDateTime intakeTime, String status, String medicationName, String dosage, String frequency) {
        this.id = id;
        this.intakeTime = intakeTime;
        this.status = status;
        this.medicationName = medicationName;
        this.dosage = dosage;
        this.frequency = frequency;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getIntakeTime() {
        return intakeTime;
    }

    public void setIntakeTime(LocalDateTime intakeTime) {
        this.intakeTime = intakeTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMedicationName() {
        return medicationName;
    }

    public void setMedicationName(String medicationName) {
        this.medicationName = medicationName;
    }

    public String getDosage() {
        return dosage;
    }

    public void setDosage(String dosage) {
        this.dosage = dosage;
    }

    public String getFrequency() {
        return frequency;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }
} 