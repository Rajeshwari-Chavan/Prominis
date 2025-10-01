package com.promin.controller;

import com.promin.entity.Application;
import com.promin.entity.User;
import com.promin.repository.ApplicationRepository;
import com.promin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/applications")
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> myApplications(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        List<Application> apps = applicationRepository.findByTasker(user);
        return ResponseEntity.ok(apps);
    }
}


