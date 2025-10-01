package com.promin.repository;

import com.promin.entity.Application;
import com.promin.entity.ApplicationStatus;
import com.promin.entity.Job;
import com.promin.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    
    List<Application> findByJob(Job job);
    
    List<Application> findByTasker(User tasker);
    
    List<Application> findByStatus(ApplicationStatus status);
    
    Page<Application> findByTasker(User tasker, Pageable pageable);
    
    Page<Application> findByJob(Job job, Pageable pageable);
    
    @Query("SELECT a FROM Application a WHERE a.job = :job AND a.status = :status")
    List<Application> findByJobAndStatus(@Param("job") Job job, @Param("status") ApplicationStatus status);
    
    @Query("SELECT a FROM Application a WHERE a.tasker = :tasker AND a.status = :status")
    List<Application> findByTaskerAndStatus(@Param("tasker") User tasker, @Param("status") ApplicationStatus status);
    
    @Query("SELECT a FROM Application a WHERE a.job.requester = :requester")
    List<Application> findByJobRequester(@Param("requester") User requester);
    
    @Query("SELECT COUNT(a) FROM Application a WHERE a.job = :job")
    long countByJob(@Param("job") Job job);
    
    @Query("SELECT COUNT(a) FROM Application a WHERE a.tasker = :tasker")
    long countByTasker(@Param("tasker") User tasker);
    
    @Query("SELECT COUNT(a) FROM Application a WHERE a.tasker = :tasker AND a.status = :status")
    long countByTaskerAndStatus(@Param("tasker") User tasker, @Param("status") ApplicationStatus status);
    
    @Query("SELECT a FROM Application a WHERE a.job = :job AND a.tasker = :tasker")
    Optional<Application> findByJobAndTasker(@Param("job") Job job, @Param("tasker") User tasker);
    
    @Query("SELECT a FROM Application a WHERE a.job = :job AND a.status = 'ACCEPTED'")
    Optional<Application> findAcceptedApplicationByJob(@Param("job") Job job);
}
