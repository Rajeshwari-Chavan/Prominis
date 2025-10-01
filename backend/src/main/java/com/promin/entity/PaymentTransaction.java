package com.promin.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_transactions")
@EntityListeners(AuditingEntityListener.class)
public class PaymentTransaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Column(name = "transaction_id", unique = true)
    private String transactionId;
    
    @NotNull
    @Positive
    @Column(name = "amount", precision = 10, scale = 2)
    private BigDecimal amount;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status = PaymentStatus.PENDING;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentType type;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id")
    private Job job;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payer_id", nullable = false)
    private User payer;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payee_id")
    private User payee;
    
    @Column(name = "payment_method")
    private String paymentMethod;
    
    @Column(name = "external_transaction_id")
    private String externalTransactionId;
    
    @Column(name = "processed_at")
    private LocalDateTime processedAt;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public PaymentTransaction() {}
    
    public PaymentTransaction(String transactionId, BigDecimal amount, PaymentType type, User payer, User payee) {
        this.transactionId = transactionId;
        this.amount = amount;
        this.type = type;
        this.payer = payer;
        this.payee = payee;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTransactionId() {
        return transactionId;
    }
    
    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }
    
    public BigDecimal getAmount() {
        return amount;
    }
    
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
    
    public PaymentStatus getStatus() {
        return status;
    }
    
    public void setStatus(PaymentStatus status) {
        this.status = status;
    }
    
    public PaymentType getType() {
        return type;
    }
    
    public void setType(PaymentType type) {
        this.type = type;
    }
    
    public Job getJob() {
        return job;
    }
    
    public void setJob(Job job) {
        this.job = job;
    }
    
    public User getPayer() {
        return payer;
    }
    
    public void setPayer(User payer) {
        this.payer = payer;
    }
    
    public User getPayee() {
        return payee;
    }
    
    public void setPayee(User payee) {
        this.payee = payee;
    }
    
    public String getPaymentMethod() {
        return paymentMethod;
    }
    
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
    
    public String getExternalTransactionId() {
        return externalTransactionId;
    }
    
    public void setExternalTransactionId(String externalTransactionId) {
        this.externalTransactionId = externalTransactionId;
    }
    
    public LocalDateTime getProcessedAt() {
        return processedAt;
    }
    
    public void setProcessedAt(LocalDateTime processedAt) {
        this.processedAt = processedAt;
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
        return status == PaymentStatus.PENDING;
    }
    
    public boolean isCompleted() {
        return status == PaymentStatus.COMPLETED;
    }
    
    public boolean isFailed() {
        return status == PaymentStatus.FAILED;
    }
    
    public boolean isRefunded() {
        return status == PaymentStatus.REFUNDED;
    }
}
