package com.swr302.hivsystem.hivbackend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class PatientDTO {
    private Long id;
    private String patientCode;
    private String fullName;
    private LocalDate dateOfBirth;
    private String gender;
    private String address;
    private String phoneNumber;
    private String email;
    private String bloodType;
    private String medicalHistory;
    private String allergies;
    private String emergencyContact;
    private String emergencyPhone;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPatientCode() {
        return patientCode;
    }

    public void setPatientCode(String patientCode) {
        this.patientCode = patientCode;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getBloodType() {
        return bloodType;
    }

    public void setBloodType(String bloodType) {
        this.bloodType = bloodType;
    }

    public String getMedicalHistory() {
        return medicalHistory;
    }

    public void setMedicalHistory(String medicalHistory) {
        this.medicalHistory = medicalHistory;
    }

    public String getAllergies() {
        return allergies;
    }

    public void setAllergies(String allergies) {
        this.allergies = allergies;
    }

    public String getEmergencyContact() {
        return emergencyContact;
    }

    public void setEmergencyContact(String emergencyContact) {
        this.emergencyContact = emergencyContact;
    }

    public String getEmergencyPhone() {
        return emergencyPhone;
    }

    public void setEmergencyPhone(String emergencyPhone) {
        this.emergencyPhone = emergencyPhone;
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

    @Override
    public String toString() {
        return "PatientDTO{" +
                "id=" + id +
                ", patientCode='" + patientCode + '\'' +
                ", fullName='" + fullName + '\'' +
                ", dateOfBirth=" + dateOfBirth +
                ", gender='" + gender + '\'' +
                ", address='" + address + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", email='" + email + '\'' +
                ", bloodType='" + bloodType + '\'' +
                ", medicalHistory='" + medicalHistory + '\'' +
                ", allergies='" + allergies + '\'' +
                ", emergencyContact='" + emergencyContact + '\'' +
                ", emergencyPhone='" + emergencyPhone + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        PatientDTO patientDTO = (PatientDTO) o;

        if (id != null ? !id.equals(patientDTO.id) : patientDTO.id != null) return false;
        if (patientCode != null ? !patientCode.equals(patientDTO.patientCode) : patientDTO.patientCode != null)
            return false;
        if (fullName != null ? !fullName.equals(patientDTO.fullName) : patientDTO.fullName != null)
            return false;
        if (dateOfBirth != null ? !dateOfBirth.equals(patientDTO.dateOfBirth) : patientDTO.dateOfBirth != null)
            return false;
        if (gender != null ? !gender.equals(patientDTO.gender) : patientDTO.gender != null) return false;
        if (address != null ? !address.equals(patientDTO.address) : patientDTO.address != null)
            return false;
        if (phoneNumber != null ? !phoneNumber.equals(patientDTO.phoneNumber) : patientDTO.phoneNumber != null)
            return false;
        if (email != null ? !email.equals(patientDTO.email) : patientDTO.email != null) return false;
        if (bloodType != null ? !bloodType.equals(patientDTO.bloodType) : patientDTO.bloodType != null)
            return false;
        if (medicalHistory != null ? !medicalHistory.equals(patientDTO.medicalHistory) : patientDTO.medicalHistory != null)
            return false;
        if (allergies != null ? !allergies.equals(patientDTO.allergies) : patientDTO.allergies != null)
            return false;
        if (emergencyContact != null ? !emergencyContact.equals(patientDTO.emergencyContact) : patientDTO.emergencyContact != null)
            return false;
        if (emergencyPhone != null ? !emergencyPhone.equals(patientDTO.emergencyPhone) : patientDTO.emergencyPhone != null)
            return false;
        if (createdAt != null ? !createdAt.equals(patientDTO.createdAt) : patientDTO.createdAt != null)
            return false;
        return updatedAt != null ? updatedAt.equals(patientDTO.updatedAt) : patientDTO.updatedAt == null;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (patientCode != null ? patientCode.hashCode() : 0);
        result = 31 * result + (fullName != null ? fullName.hashCode() : 0);
        result = 31 * result + (dateOfBirth != null ? dateOfBirth.hashCode() : 0);
        result = 31 * result + (gender != null ? gender.hashCode() : 0);
        result = 31 * result + (address != null ? address.hashCode() : 0);
        result = 31 * result + (phoneNumber != null ? phoneNumber.hashCode() : 0);
        result = 31 * result + (email != null ? email.hashCode() : 0);
        result = 31 * result + (bloodType != null ? bloodType.hashCode() : 0);
        result = 31 * result + (medicalHistory != null ? medicalHistory.hashCode() : 0);
        result = 31 * result + (allergies != null ? allergies.hashCode() : 0);
        result = 31 * result + (emergencyContact != null ? emergencyContact.hashCode() : 0);
        result = 31 * result + (emergencyPhone != null ? emergencyPhone.hashCode() : 0);
        result = 31 * result + (createdAt != null ? createdAt.hashCode() : 0);
        result = 31 * result + (updatedAt != null ? updatedAt.hashCode() : 0);
        return result;
    }
} 