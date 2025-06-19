package com.swr302.hivsystem.hivbackend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Entity
@Table(name = "users") // Renamed to "users" to avoid conflicts with reserved keywords
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @Column(nullable = false)
    @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự")
    // @Size(min = 8, message = "Mật khẩu phải có ít nhất 8 ký tự")
    // @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$",
    //          message = "Mật khẩu phải có ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt")
    private String password;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(unique = true, nullable = false, length = 120)
    private String email;

    @Column(name = "phone_number", length = 20)
    @Pattern(regexp = "^\\d{10,11}$", message = "Số điện thoại phải là 10 hoặc 11 chữ số")
    private String phoneNumber;

    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @Column(name = "is_anonymous", nullable = true)
    private Boolean isAnonymous = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public Boolean isAnonymous() {
        return isAnonymous;
    }

    public void setAnonymous(Boolean anonymous) {
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
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", fullName='" + fullName + '\'' +
                ", email='" + email + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                "}";
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        User user = (User) o;

        if (!id.equals(user.id)) return false;
        if (!username.equals(user.username)) return false;
        if (!password.equals(user.password)) return false;
        if (!fullName.equals(user.fullName)) return false;
        if (!email.equals(user.email)) return false;
        if (!phoneNumber.equals(user.phoneNumber)) return false;
        if (!role.equals(user.role)) return false;
        if (!isAnonymous.equals(user.isAnonymous)) return false;
        return createdAt.equals(user.createdAt) && updatedAt.equals(user.updatedAt);
    }

    @Override
    public int hashCode() {
        int result = id.hashCode();
        result = 31 * result + username.hashCode();
        result = 31 * result + password.hashCode();
        result = 31 * result + fullName.hashCode();
        result = 31 * result + email.hashCode();
        result = 31 * result + phoneNumber.hashCode();
        result = 31 * result + role.hashCode();
        result = 31 * result + isAnonymous.hashCode();
        result = 31 * result + createdAt.hashCode();
        result = 31 * result + updatedAt.hashCode();
        return result;
    }

    @Override
    public java.util.Collection<? extends GrantedAuthority> getAuthorities() {
        return java.util.Collections.singletonList(new SimpleGrantedAuthority(role.getRoleName()));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
} 