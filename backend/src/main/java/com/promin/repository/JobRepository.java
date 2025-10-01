package com.promin.repository;

import com.promin.entity.Job;
import com.promin.entity.JobStatus;
import com.promin.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    
    List<Job> findByRequester(User requester);
    
    List<Job> findByAssignedTasker(User tasker);
    
    List<Job> findByStatus(JobStatus status);
    
    Page<Job> findByStatus(JobStatus status, Pageable pageable);
    
    @Query("SELECT j FROM Job j WHERE " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(j.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(j.description) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:status IS NULL OR j.status = :status) AND " +
           "(:minBudget IS NULL OR j.budget >= :minBudget) AND " +
           "(:maxBudget IS NULL OR j.budget <= :maxBudget) AND " +
           "(:location IS NULL OR :location = '' OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%')))")
    Page<Job> findBySearchCriteria(@Param("search") String search,
                                 @Param("status") JobStatus status,
                                 @Param("minBudget") BigDecimal minBudget,
                                 @Param("maxBudget") BigDecimal maxBudget,
                                 @Param("location") String location,
                                 Pageable pageable);
    
    @Query("SELECT j FROM Job j JOIN j.skills s WHERE s IN :skills")
    Page<Job> findBySkills(@Param("skills") List<String> skills, Pageable pageable);
    
    @Query("SELECT j FROM Job j WHERE j.deadline < :deadline AND j.status != 'COMPLETED'")
    List<Job> findOverdueJobs(@Param("deadline") LocalDateTime deadline);
    
    @Query("SELECT COUNT(j) FROM Job j WHERE j.status = :status")
    long countByStatus(@Param("status") JobStatus status);
    
    @Query("SELECT COUNT(j) FROM Job j WHERE j.requester = :requester")
    long countByRequester(@Param("requester") User requester);
    
    @Query("SELECT COUNT(j) FROM Job j WHERE j.assignedTasker = :tasker")
    long countByAssignedTasker(@Param("tasker") User tasker);
    
    @Query("SELECT SUM(j.budget) FROM Job j WHERE j.requester = :requester AND j.status = 'COMPLETED'")
    BigDecimal getTotalSpentByRequester(@Param("requester") User requester);
    
    @Query("SELECT SUM(j.budget) FROM Job j WHERE j.assignedTasker = :tasker AND j.status = 'COMPLETED'")
    BigDecimal getTotalEarnedByTasker(@Param("tasker") User tasker);
}
