package com.swr302.hivsystem.hivbackend.dto;

import com.swr302.hivsystem.hivbackend.model.Role;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public class UserDTO {
    private Long id;
    private String username;
    @Size(min = 8, message = "Mật khẩu phải có ít nhất 8 ký tự")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$",
             message = "Mật khẩu phải có ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt")
    private String password;
    private String email;
    private String fullName;
    @Pattern(regexp = "^\\d{10,11}$", message = "Số điện thoại phải là 10 hoặc 11 chữ số")
    private String phoneNumber;
    private Role role;
    private Boolean isAnonymous;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Boolean getIsAnonymous() {
        return isAnonymous;
    }

    public void setIsAnonymous(Boolean anonymous) {
        isAnonymous = anonymous;
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
        return "UserDTO{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", fullName='" + fullName + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", role=" + role +
                ", isAnonymous=" + isAnonymous +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        UserDTO userDTO = (UserDTO) o;

        if (isAnonymous != null ? !isAnonymous.equals(userDTO.isAnonymous) : userDTO.isAnonymous != null) return false;
        if (id != null ? !id.equals(userDTO.id) : userDTO.id != null) return false;
        if (username != null ? !username.equals(userDTO.username) : userDTO.username != null) return false;
        if (email != null ? !email.equals(userDTO.email) : userDTO.email != null) return false;
        if (fullName != null ? !fullName.equals(userDTO.fullName) : userDTO.fullName != null) return false;
        if (phoneNumber != null ? !phoneNumber.equals(userDTO.phoneNumber) : userDTO.phoneNumber != null) return false;
        if (role != null ? !role.equals(userDTO.role) : userDTO.role != null) return false;
        if (createdAt != null ? !createdAt.equals(userDTO.createdAt) : userDTO.createdAt != null) return false;
        return updatedAt != null ? updatedAt.equals(userDTO.updatedAt) : userDTO.updatedAt == null;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (username != null ? username.hashCode() : 0);
        result = 31 * result + (email != null ? email.hashCode() : 0);
        result = 31 * result + (fullName != null ? fullName.hashCode() : 0);
        result = 31 * result + (phoneNumber != null ? phoneNumber.hashCode() : 0);
        result = 31 * result + (role != null ? role.hashCode() : 0);
        result = 31 * result + (isAnonymous != null ? isAnonymous.hashCode() : 0);
        result = 31 * result + (createdAt != null ? createdAt.hashCode() : 0);
        result = 31 * result + (updatedAt != null ? updatedAt.hashCode() : 0);
        return result;
    }
} 