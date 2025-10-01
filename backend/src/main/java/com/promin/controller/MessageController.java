package com.promin.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/messages")
public class MessageController {

    @GetMapping
    public ResponseEntity<?> conversations() {
        return ResponseEntity.ok(Collections.emptyList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> messages(@PathVariable Long id) {
        return ResponseEntity.ok(Collections.emptyList());
    }

    @PostMapping
    public ResponseEntity<?> send(@RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(Map.of("status", "sent"));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markRead(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("status", "read"));
    }
}


