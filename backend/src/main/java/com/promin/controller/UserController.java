package com.promin.controller;

import com.promin.entity.User;
import com.promin.repository.UserRepository;
import com.promin.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody User payload, Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        user.setFirstName(payload.getFirstName());
        user.setLastName(payload.getLastName());
        user.setPhone(payload.getPhone());
        user.setLocation(payload.getLocation());
        user.setBio(payload.getBio());
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> body, Authentication auth) {
        // Mock change; in prod, validate currentPassword and update
        Map<String, Object> res = new HashMap<>();
        res.put("message", "Password changed");
        return ResponseEntity.ok(res);
    }

    @PostMapping("/avatar")
    public ResponseEntity<?> uploadAvatar(@RequestParam("file") MultipartFile file, Authentication auth) {
        // Mock: return a placeholder URL
        Map<String, Object> res = new HashMap<>();
        res.put("url", "/uploads/" + file.getOriginalFilename());
        return ResponseEntity.ok(res);
    }

    @DeleteMapping
    public ResponseEntity<?> deleteAccount(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        userRepository.delete(user);
        return ResponseEntity.noContent().build();
    }
}


