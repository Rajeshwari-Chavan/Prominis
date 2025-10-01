package com.promin.controller;

import com.promin.entity.Job;
import com.promin.entity.User;
import com.promin.repository.JobRepository;
import com.promin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @GetMapping("/users")
    public ResponseEntity<?> getUsers(@RequestParam(required = false) String search,
                                      @RequestParam(defaultValue = "0") int page,
                                      @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users = userRepository.findAll(pageable);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        return userRepository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User payload) {
        User user = userRepository.findById(id).orElseThrow();
        user.setFirstName(payload.getFirstName());
        user.setLastName(payload.getLastName());
        user.setRole(payload.getRole());
        user.setStatus(payload.getStatus());
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/jobs")
    public ResponseEntity<?> getJobs(@RequestParam(defaultValue = "0") int page,
                                     @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(jobRepository.findAll(pageable));
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable Long id) {
        jobRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/jobs/{id}/flag")
    public ResponseEntity<?> flagJob(@PathVariable Long id) {
        Map<String, Object> res = new HashMap<>();
        res.put("message", "Job flagged");
        return ResponseEntity.ok(res);
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<?> getAuditLogs(@RequestParam(defaultValue = "0") int page,
                                          @RequestParam(defaultValue = "20") int size) {
        // Mock empty page
        Map<String, Object> res = new HashMap<>();
        res.put("content", java.util.Collections.emptyList());
        res.put("number", 0);
        res.put("size", size);
        res.put("totalElements", 0);
        res.put("totalPages", 0);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/analytics")
    public ResponseEntity<?> analytics() {
        Map<String, Object> res = new HashMap<>();
        res.put("totalUsers", userRepository.count());
        res.put("totalJobs", jobRepository.count());
        res.put("platformRevenue", 0);
        res.put("growthRate", 12);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/export/{type}")
    public ResponseEntity<?> export(@PathVariable String type) {
        return ResponseEntity.ok("id,name\n1,example");
    }
}


