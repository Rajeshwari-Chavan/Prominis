package com.promin.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "file_resources")
@EntityListeners(AuditingEntityListener.class)
public class FileResource {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Column(name = "original_name")
    private String originalName;
    
    @NotBlank
    @Column(name = "file_name")
    private String fileName;
    
    @NotBlank
    @Column(name = "file_path")
    private String filePath;
    
    @NotBlank
    @Column(name = "content_type")
    private String contentType;
    
    @NotNull
    @Column(name = "file_size")
    private Long fileSize;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id")
    private Job job;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    // Constructors
    public FileResource() {}
    
    public FileResource(String originalName, String fileName, String filePath, String contentType, Long fileSize) {
        this.originalName = originalName;
        this.fileName = fileName;
        this.filePath = filePath;
        this.contentType = contentType;
        this.fileSize = fileSize;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getOriginalName() {
        return originalName;
    }
    
    public void setOriginalName(String originalName) {
        this.originalName = originalName;
    }
    
    public String getFileName() {
        return fileName;
    }
    
    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
    
    public String getFilePath() {
        return filePath;
    }
    
    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }
    
    public String getContentType() {
        return contentType;
    }
    
    public void setContentType(String contentType) {
        this.contentType = contentType;
    }
    
    public Long getFileSize() {
        return fileSize;
    }
    
    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }
    
    public Job getJob() {
        return job;
    }
    
    public void setJob(Job job) {
        this.job = job;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    // Helper methods
    public boolean isImage() {
        return contentType != null && contentType.startsWith("image/");
    }
    
    public boolean isPdf() {
        return contentType != null && contentType.equals("application/pdf");
    }
    
    public String getFileSizeFormatted() {
        if (fileSize == null) return "0 B";
        
        long bytes = fileSize;
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return String.format("%.1f KB", bytes / 1024.0);
        if (bytes < 1024 * 1024 * 1024) return String.format("%.1f MB", bytes / (1024.0 * 1024.0));
        return String.format("%.1f GB", bytes / (1024.0 * 1024.0 * 1024.0));
    }
}
