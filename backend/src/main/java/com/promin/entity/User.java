package com.promin.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(max = 50)
    @Column(name = "first_name")
    private String firstName;
    
    @NotBlank
    @Size(max = 50)
    @Column(name = "last_name")
    private String lastName;
    
    @NotBlank
    @Size(max = 100)
    @Email
    @Column(unique = true)
    private String email;
    
    @NotBlank
    @Size(max = 255)
    private String password;
    
    @Size(max = 20)
    private String phone;
    
    @Size(max = 100)
    private String location;
    
    @Column(columnDefinition = "TEXT")
    private String bio;
    
    @Size(max = 255)
    private String avatar;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status = UserStatus.ACTIVE;
    
    @Column(name = "email_verified")
    private Boolean emailVerified = false;
    
    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Relationships
    @OneToMany(mappedBy = "requester", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Job> postedJobs = new ArrayList<>();
    
    @OneToMany(mappedBy = "tasker", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Application> applications = new ArrayList<>();
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Review> reviews = new ArrayList<>();
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<AuditLog> auditLogs = new ArrayList<>();
    
    // Constructors
    public User() {}
    
    public User(String firstName, String lastName, String email, String password, Role role) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.role = role;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public String getBio() {
        return bio;
    }
    
    public void setBio(String bio) {
        this.bio = bio;
    }
    
    public String getAvatar() {
        return avatar;
    }
    
    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }
    
    public Role getRole() {
        return role;
    }
    
    public void setRole(Role role) {
        this.role = role;
    }
    
    public UserStatus getStatus() {
        return status;
    }
    
    public void setStatus(UserStatus status) {
        this.status = status;
    }
    
    public Boolean getEmailVerified() {
        return emailVerified;
    }
    
    public void setEmailVerified(Boolean emailVerified) {
        this.emailVerified = emailVerified;
    }
    
    public LocalDateTime getLastLoginAt() {
        return lastLoginAt;
    }
    
    public void setLastLoginAt(LocalDateTime lastLoginAt) {
        this.lastLoginAt = lastLoginAt;
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
    
    public List<Job> getPostedJobs() {
        return postedJobs;
    }
    
    public void setPostedJobs(List<Job> postedJobs) {
        this.postedJobs = postedJobs;
    }
    
    public List<Application> getApplications() {
        return applications;
    }
    
    public void setApplications(List<Application> applications) {
        this.applications = applications;
    }
    
    public List<Review> getReviews() {
        return reviews;
    }
    
    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }
    
    public List<AuditLog> getAuditLogs() {
        return auditLogs;
    }
    
    public void setAuditLogs(List<AuditLog> auditLogs) {
        this.auditLogs = auditLogs;
    }
    
    // Helper methods
    public String getFullName() {
        return firstName + " " + lastName;
    }
    
    public boolean isActive() {
        return status == UserStatus.ACTIVE;
    }
    
    public boolean isRequester() {
        return role == Role.REQUESTER;
    }
    
    public boolean isTasker() {
        return role == Role.TASKER;
    }
    
    public boolean isAdmin() {
        return role == Role.ADMIN;
    }
}
