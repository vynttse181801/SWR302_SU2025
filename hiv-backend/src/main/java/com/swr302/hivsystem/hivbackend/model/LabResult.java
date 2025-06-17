package com.swr302.hivsystem.hivbackend.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "lab_results")
public class LabResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "test_type_id", nullable = false)
    private LabTestType testType;

    @Column(name = "test_date", nullable = false)
    private LocalDate testDate;

    @Column(name = "result_value", nullable = false, columnDefinition = "NVARCHAR(MAX)")
    private String resultValue;

    @Column(columnDefinition = "NVARCHAR(50)")
    private String unit;

    @Column(name = "normal_range", columnDefinition = "NVARCHAR(100)")
    private String normalRange;

    @Lob
    @Column(columnDefinition = "NVARCHAR(4000)")
    private String notes;

    @ManyToOne
    @JoinColumn(name = "entered_by_id", nullable = false)
    private Staff enteredBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public LabTestType getTestType() {
        return testType;
    }

    public void setTestType(LabTestType testType) {
        this.testType = testType;
    }

    public LocalDate getTestDate() {
        return testDate;
    }

    public void setTestDate(LocalDate testDate) {
        this.testDate = testDate;
    }

    public String getResultValue() {
        return resultValue;
    }

    public void setResultValue(String resultValue) {
        this.resultValue = resultValue;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getNormalRange() {
        return normalRange;
    }

    public void setNormalRange(String normalRange) {
        this.normalRange = normalRange;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Staff getEnteredBy() {
        return enteredBy;
    }

    public void setEnteredBy(Staff enteredBy) {
        this.enteredBy = enteredBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
} 