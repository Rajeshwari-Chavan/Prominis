package com.promin.repository;

import com.promin.entity.FileResource;
import com.promin.entity.Job;
import com.promin.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileResourceRepository extends JpaRepository<FileResource, Long> {
    
    List<FileResource> findByJob(Job job);
    
    List<FileResource> findByUser(User user);
    
    List<FileResource> findByContentType(String contentType);
}
