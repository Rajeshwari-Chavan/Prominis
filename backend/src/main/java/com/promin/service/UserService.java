package com.promin.service;

import com.promin.entity.User;
import com.promin.entity.UserStatus;
import com.promin.repository.UserRepository;
import com.promin.repository.ReviewRepository;
import com.promin.repository.JobRepository;
import com.promin.repository.PaymentTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private PaymentTransactionRepository paymentTransactionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    public Page<User> searchUsers(String search, String role, String status, Pageable pageable) {
        return userRepository.findBySearchCriteria(
            search,
            role != null ? com.promin.entity.Role.valueOf(role) : null,
            status != null ? UserStatus.valueOf(status) : null,
            pageable
        );
    }

    public List<User> getUsersByRole(String role) {
        return userRepository.findByRole(com.promin.entity.Role.valueOf(role));
    }

    public List<User> getUsersByStatus(String status) {
        return userRepository.findByStatus(UserStatus.valueOf(status));
    }

    public long getUserCount() {
        return userRepository.count();
    }

    public long getUserCountByRole(String role) {
        return userRepository.countByRole(com.promin.entity.Role.valueOf(role));
    }

    public long getUserCountByStatus(String status) {
        return userRepository.countByStatus(UserStatus.valueOf(status));
    }

    public long getNewUserCountSince(LocalDateTime startDate) {
        return userRepository.countByCreatedAtAfter(startDate);
    }

    public List<User> getActiveUsersSince(LocalDateTime startDate) {
        return userRepository.findActiveUsersSince(startDate);
    }

    public User updateUserStatus(Long userId, UserStatus status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(status);
        return userRepository.save(user);
    }

    public User updateLastLogin(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setLastLoginAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public Double getAverageRating(User user) {
        return reviewRepository.getAverageRatingByReviewee(user);
    }

    public long getReviewCount(User user) {
        return reviewRepository.countByReviewee(user);
    }

    public long getJobCount(User user) {
        if (user.isRequester()) {
            return jobRepository.countByRequester(user);
        } else if (user.isTasker()) {
            return jobRepository.countByAssignedTasker(user);
        }
        return 0;
    }

    public BigDecimal getTotalSpent(User user) {
        if (user.isRequester()) {
            BigDecimal total = jobRepository.getTotalSpentByRequester(user);
            return total != null ? total : BigDecimal.ZERO;
        }
        return BigDecimal.ZERO;
    }

    public BigDecimal getTotalEarned(User user) {
        if (user.isTasker()) {
            BigDecimal total = jobRepository.getTotalEarnedByTasker(user);
            return total != null ? total : BigDecimal.ZERO;
        }
        return BigDecimal.ZERO;
    }
}


