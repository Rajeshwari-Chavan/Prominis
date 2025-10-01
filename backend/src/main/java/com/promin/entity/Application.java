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

@Entity
@Table(name = "applications")
@EntityListeners(AuditingEntityListener.class)
public class Application {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Column(columnDefinition = "TEXT")
    private String proposal;
    
    @NotNull
    @Positive
    @Column(name = "proposed_amount", precision = 10, scale = 2)
    private BigDecimal proposedAmount;
    
    @Column(name = "proposed_deadline")
    private LocalDateTime proposedDeadline;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status = ApplicationStatus.PENDING;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tasker_id", nullable = false)
    private User tasker;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public Application() {}
    
    public Application(String proposal, BigDecimal proposedAmount, LocalDateTime proposedDeadline, Job job, User tasker) {
        this.proposal = proposal;
        this.proposedAmount = proposedAmount;
        this.proposedDeadline = proposedDeadline;
        this.job = job;
        this.tasker = tasker;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getProposal() {
        return proposal;
    }
    
    public void setProposal(String proposal) {
        this.proposal = proposal;
    }
    
    public BigDecimal getProposedAmount() {
        return proposedAmount;
    }
    
    public void setProposedAmount(BigDecimal proposedAmount) {
        this.proposedAmount = proposedAmount;
    }
    
    public LocalDateTime getProposedDeadline() {
        return proposedDeadline;
    }
    
    public void setProposedDeadline(LocalDateTime proposedDeadline) {
        this.proposedDeadline = proposedDeadline;
    }
    
    public ApplicationStatus getStatus() {
        return status;
    }
    
    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }
    
    public Job getJob() {
        return job;
    }
    
    public void setJob(Job job) {
        this.job = job;
    }
    
    public User getTasker() {
        return tasker;
    }
    
    public void setTasker(User tasker) {
        this.tasker = tasker;
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
    
    // Helper methods
    public boolean isPending() {
        return status == ApplicationStatus.PENDING;
    }
    
    public boolean isAccepted() {
        return status == ApplicationStatus.ACCEPTED;
    }
    
    public boolean isRejected() {
        return status == ApplicationStatus.REJECTED;
    }
    
    public boolean isWithdrawn() {
        return status == ApplicationStatus.WITHDRAWN;
    }
}
