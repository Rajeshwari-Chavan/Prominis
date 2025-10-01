package com.promin.controller;

import com.promin.entity.Role;
import com.promin.entity.User;
import com.promin.repository.ApplicationRepository;
import com.promin.repository.JobRepository;
import com.promin.repository.PaymentTransactionRepository;
import com.promin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private PaymentTransactionRepository paymentTransactionRepository;

    @GetMapping("/requester")
    public ResponseEntity<?> requester(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        Map<String, Object> res = new HashMap<>();
        res.put("totalJobs", jobRepository.countByRequester(user));
        res.put("activeApplications", applicationRepository.findByJobRequester(user).size());
        BigDecimal spent = jobRepository.getTotalSpentByRequester(user);
        res.put("totalSpent", spent != null ? spent : BigDecimal.ZERO);
        res.put("openJobs", jobRepository.countByStatus(com.promin.entity.JobStatus.OPEN));
        res.put("inProgressJobs", jobRepository.countByStatus(com.promin.entity.JobStatus.IN_PROGRESS));
        res.put("completedJobs", jobRepository.countByStatus(com.promin.entity.JobStatus.COMPLETED));
        res.put("cancelledJobs", jobRepository.countByStatus(com.promin.entity.JobStatus.CANCELLED));
        res.put("averageRating", 4.8);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/tasker")
    public ResponseEntity<?> tasker(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        Map<String, Object> res = new HashMap<>();
        res.put("totalApplications", applicationRepository.countByTasker(user));
        res.put("pendingApplications", applicationRepository.countByTaskerAndStatus(user, com.promin.entity.ApplicationStatus.PENDING));
        res.put("acceptedApplications", applicationRepository.countByTaskerAndStatus(user, com.promin.entity.ApplicationStatus.ACCEPTED));
        res.put("rejectedApplications", applicationRepository.countByTaskerAndStatus(user, com.promin.entity.ApplicationStatus.REJECTED));
        BigDecimal earned = jobRepository.getTotalEarnedByTasker(user);
        res.put("totalEarned", earned != null ? earned : BigDecimal.ZERO);
        res.put("completedJobs", jobRepository.countByAssignedTasker(user));
        res.put("averageRating", 4.7);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/admin")
    public ResponseEntity<?> admin() {
        Map<String, Object> res = new HashMap<>();
        res.put("totalUsers", userRepository.count());
        res.put("requesterCount", userRepository.countByRole(Role.REQUESTER));
        res.put("taskerCount", userRepository.countByRole(Role.TASKER));
        res.put("adminCount", userRepository.countByRole(Role.ADMIN));
        res.put("totalJobs", jobRepository.count());
        res.put("openJobs", jobRepository.countByStatus(com.promin.entity.JobStatus.OPEN));
        res.put("inProgressJobs", jobRepository.countByStatus(com.promin.entity.JobStatus.IN_PROGRESS));
        res.put("completedJobs", jobRepository.countByStatus(com.promin.entity.JobStatus.COMPLETED));
        res.put("cancelledJobs", jobRepository.countByStatus(com.promin.entity.JobStatus.CANCELLED));
        BigDecimal revenue = paymentTransactionRepository.getTotalPlatformRevenue();
        res.put("platformRevenue", revenue != null ? revenue : BigDecimal.ZERO);
        res.put("growthRate", 12);
        return ResponseEntity.ok(res);
    }
}


