package com.promin.service;

import com.promin.entity.*;
import com.promin.repository.ApplicationRepository;
import com.promin.repository.JobRepository;
import com.promin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private UserRepository userRepository;

    public Page<Job> listJobs(Map<String, String> params, Pageable pageable) {
        String search = params.getOrDefault("search", null);
        JobStatus status = params.get("status") != null && !params.get("status").isEmpty() ? JobStatus.valueOf(params.get("status")) : null;
        BigDecimal minBudget = params.get("minBudget") != null && !params.get("minBudget").isEmpty() ? new BigDecimal(params.get("minBudget")) : null;
        BigDecimal maxBudget = params.get("maxBudget") != null && !params.get("maxBudget").isEmpty() ? new BigDecimal(params.get("maxBudget")) : null;
        String location = params.getOrDefault("location", null);
        return jobRepository.findBySearchCriteria(search, status, minBudget, maxBudget, location, pageable);
    }

    public Page<Job> listJobsForRequester(Long requesterId, Pageable pageable) {
        User requester = userRepository.findById(requesterId).orElseThrow();
        return jobRepository.findAll(pageable);
    }

    public Optional<Job> getJob(Long id) {
        return jobRepository.findById(id);
    }

    public Job createJob(Job job, Long requesterId) {
        User requester = userRepository.findById(requesterId).orElseThrow();
        job.setRequester(requester);
        return jobRepository.save(job);
    }

    public Job updateJob(Long id, Job payload, Long requesterId) {
        Job job = jobRepository.findById(id).orElseThrow();
        job.setTitle(payload.getTitle());
        job.setDescription(payload.getDescription());
        job.setBudget(payload.getBudget());
        job.setDeadline(payload.getDeadline());
        job.setLocation(payload.getLocation());
        job.setSkills(payload.getSkills());
        return jobRepository.save(job);
    }

    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }

    public Application applyToJob(Long jobId, Long taskerId, String proposal, BigDecimal proposedAmount, LocalDate proposedDeadline) {
        Job job = jobRepository.findById(jobId).orElseThrow();
        User tasker = userRepository.findById(taskerId).orElseThrow();
        Application app = new Application();
        app.setJob(job);
        app.setTasker(tasker);
        app.setProposal(proposal);
        app.setProposedAmount(proposedAmount);
        app.setProposedDeadline(proposedDeadline != null ? proposedDeadline.atStartOfDay() : null);
        app.setStatus(ApplicationStatus.PENDING);
        return applicationRepository.save(app);
    }

    public List<Application> listApplicationsForJob(Long jobId) {
        Job job = jobRepository.findById(jobId).orElseThrow();
        return applicationRepository.findByJob(job);
    }

    public Application updateApplicationStatus(Long jobId, Long applicationId, ApplicationStatus status) {
        Application app = applicationRepository.findById(applicationId).orElseThrow();
        app.setStatus(status);
        if (status == ApplicationStatus.ACCEPTED) {
            Job job = app.getJob();
            job.setAssignedTasker(app.getTasker());
            job.setStatus(JobStatus.IN_PROGRESS);
            jobRepository.save(job);
        }
        if (status == ApplicationStatus.REJECTED) {
            // no-op
        }
        return applicationRepository.save(app);
    }

    public Job completeJob(Long jobId) {
        Job job = jobRepository.findById(jobId).orElseThrow();
        job.setStatus(JobStatus.COMPLETED);
        job.setCompletedAt(LocalDateTime.now());
        return jobRepository.save(job);
    }
}


