package com.promin.repository;

import com.promin.entity.Role;
import com.promin.entity.User;
import com.promin.entity.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    List<User> findByRole(Role role);
    
    List<User> findByStatus(UserStatus status);
    
    Page<User> findByRole(Role role, Pageable pageable);
    
    Page<User> findByStatus(UserStatus status, Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:role IS NULL OR u.role = :role) AND " +
           "(:status IS NULL OR u.status = :status)")
    Page<User> findBySearchCriteria(@Param("search") String search,
                                   @Param("role") Role role,
                                   @Param("status") UserStatus status,
                                   Pageable pageable);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    long countByRole(@Param("role") Role role);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.status = :status")
    long countByStatus(@Param("status") UserStatus status);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt >= :startDate")
    long countByCreatedAtAfter(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT u FROM User u WHERE u.lastLoginAt >= :startDate")
    List<User> findActiveUsersSince(@Param("startDate") LocalDateTime startDate);
}
