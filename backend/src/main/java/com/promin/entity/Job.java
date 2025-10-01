package com.promin.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "jobs")
@EntityListeners(AuditingEntityListener.class)
public class Job {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(max = 200)
    private String title;
    
    @NotBlank
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @NotNull
    @Positive
    @Column(precision = 10, scale = 2)
    private BigDecimal budget;
    
    @NotNull
    @Column(name = "deadline")
    private LocalDateTime deadline;
    
    @Size(max = 100)
    private String location;
    
    @ElementCollection
    @CollectionTable(name = "job_skills", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "skill")
    private List<String> skills = new ArrayList<>();
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobStatus status = JobStatus.OPEN;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_tasker_id")
    private User assignedTasker;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    // Relationships
    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Application> applications = new ArrayList<>();
    
    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Review> reviews = new ArrayList<>();
    
    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<FileResource> attachments = new ArrayList<>();
    
    // Constructors
    public Job() {}
    
    public Job(String title, String description, BigDecimal budget, LocalDateTime deadline, User requester) {
        this.title = title;
        this.description = description;
        this.budget = budget;
        this.deadline = deadline;
        this.requester = requester;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public BigDecimal getBudget() {
        return budget;
    }
    
    public void setBudget(BigDecimal budget) {
        this.budget = budget;
    }
    
    public LocalDateTime getDeadline() {
        return deadline;
    }
    
    public void setDeadline(LocalDateTime deadline) {
        this.deadline = deadline;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public List<String> getSkills() {
        return skills;
    }
    
    public void setSkills(List<String> skills) {
        this.skills = skills;
    }
    
    public JobStatus getStatus() {
        return status;
    }
    
    public void setStatus(JobStatus status) {
        this.status = status;
    }
    
    public User getRequester() {
        return requester;
    }
    
    public void setRequester(User requester) {
        this.requester = requester;
    }
    
    public User getAssignedTasker() {
        return assignedTasker;
    }
    
    public void setAssignedTasker(User assignedTasker) {
        this.assignedTasker = assignedTasker;
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
    
    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
    
    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
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
    
    public List<FileResource> getAttachments() {
        return attachments;
    }
    
    public void setAttachments(List<FileResource> attachments) {
        this.attachments = attachments;
    }
    
    // Helper methods
    public boolean isOpen() {
        return status == JobStatus.OPEN;
    }
    
    public boolean isInProgress() {
        return status == JobStatus.IN_PROGRESS;
    }
    
    public boolean isCompleted() {
        return status == JobStatus.COMPLETED;
    }
    
    public boolean isCancelled() {
        return status == JobStatus.CANCELLED;
    }
    
    public int getApplicationCount() {
        return applications != null ? applications.size() : 0;
    }
    
    public boolean isOverdue() {
        return deadline.isBefore(LocalDateTime.now()) && !isCompleted();
    }
}
