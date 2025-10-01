package com.promin.repository;

import com.promin.entity.AuditLog;
import com.promin.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    
    List<AuditLog> findByUser(User user);
    
    List<AuditLog> findByAction(String action);
    
    Page<AuditLog> findByUser(User user, Pageable pageable);
    
    @Query("SELECT a FROM AuditLog a WHERE " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(a.action) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(a.details) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:action IS NULL OR a.action = :action) AND " +
           "(:userId IS NULL OR a.user.id = :userId) AND " +
           "(:startDate IS NULL OR a.timestamp >= :startDate) AND " +
           "(:endDate IS NULL OR a.timestamp <= :endDate)")
    Page<AuditLog> findBySearchCriteria(@Param("search") String search,
                                       @Param("action") String action,
                                       @Param("userId") Long userId,
                                       @Param("startDate") LocalDateTime startDate,
                                       @Param("endDate") LocalDateTime endDate,
                                       Pageable pageable);
    
    @Query("SELECT a FROM AuditLog a WHERE a.timestamp >= :startDate")
    List<AuditLog> findByTimestampAfter(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT a FROM AuditLog a WHERE a.timestamp BETWEEN :startDate AND :endDate")
    List<AuditLog> findByTimestampBetween(@Param("startDate") LocalDateTime startDate, 
                                         @Param("endDate") LocalDateTime endDate);
}
