package com.promin.controller;

import com.promin.config.JwtUtil;
import com.promin.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        Map<String, Object> result = authService.login(payload.get("email"), payload.get("password"));
        return ResponseEntity.ok(result);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(authService.register(payload));
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verify(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return ResponseEntity.ok(authService.verify(token));
    }

    // Mock endpoints
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> payload) {
        Map<String, Object> res = new HashMap<>();
        res.put("message", "If the email exists, reset instructions were sent.");
        return ResponseEntity.ok(res);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> payload) {
        Map<String, Object> res = new HashMap<>();
        res.put("message", "Password reset successful (mock)");
        return ResponseEntity.ok(res);
    }
}


