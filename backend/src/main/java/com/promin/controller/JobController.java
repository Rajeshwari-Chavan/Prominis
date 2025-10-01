package com.promin.controller;

import com.promin.entity.*;
import com.promin.repository.UserRepository;
import com.promin.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/jobs")
public class JobController {

    @Autowired
    private JobService jobService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> list(@RequestParam Map<String, String> params,
                                  @RequestParam(defaultValue = "0") int page,
                                  @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Job> jobs = jobService.listJobs(params, pageable);
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam Map<String, String> params,
                                    @RequestParam(defaultValue = "0") int page,
                                    @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Job> jobs = jobService.listJobs(params, pageable);
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable Long id) {
        return jobService.getJob(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Job job, Authentication auth) {
        Long requesterId = userRepository.findByEmail(auth.getName()).orElseThrow().getId();
        Job created = jobService.createJob(job, requesterId);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Job payload, Authentication auth) {
        Long requesterId = userRepository.findByEmail(auth.getName()).orElseThrow().getId();
        Job updated = jobService.updateJob(id, payload, requesterId);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/apply")
    public ResponseEntity<?> apply(@PathVariable Long id, @RequestBody Map<String, Object> body, Authentication auth) {
        Long taskerId = userRepository.findByEmail(auth.getName()).orElseThrow().getId();
        String proposal = (String) body.get("proposal");
        BigDecimal proposedAmount = new BigDecimal(String.valueOf(body.get("proposedAmount")));
        String proposedDeadline = (String) body.get("proposedDeadline");
        Application app = jobService.applyToJob(id, taskerId, proposal, proposedAmount,
                proposedDeadline != null ? LocalDate.parse(proposedDeadline) : null);
        return ResponseEntity.ok(app);
    }

    @GetMapping("/{id}/applications")
    public ResponseEntity<?> listApplications(@PathVariable Long id) {
        List<Application> apps = jobService.listApplicationsForJob(id);
        return ResponseEntity.ok(apps);
    }

    @PostMapping("/{jobId}/applications/{appId}/accept")
    public ResponseEntity<?> accept(@PathVariable Long jobId, @PathVariable Long appId) {
        Application app = jobService.updateApplicationStatus(jobId, appId, ApplicationStatus.ACCEPTED);
        return ResponseEntity.ok(app);
    }

    @PostMapping("/{jobId}/applications/{appId}/reject")
    public ResponseEntity<?> reject(@PathVariable Long jobId, @PathVariable Long appId) {
        Application app = jobService.updateApplicationStatus(jobId, appId, ApplicationStatus.REJECTED);
        return ResponseEntity.ok(app);
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<?> complete(@PathVariable Long id) {
        Job job = jobService.completeJob(id);
        return ResponseEntity.ok(job);
    }
}


