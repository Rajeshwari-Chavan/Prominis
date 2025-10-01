package com.promin.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @GetMapping
    public ResponseEntity<?> list() {
        return ResponseEntity.ok(Collections.emptyList());
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markRead(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("status", "read"));
    }

    @PutMapping("/read-all")
    public ResponseEntity<?> markAllRead() {
        return ResponseEntity.ok(Map.of("status", "all-read"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return ResponseEntity.noContent().build();
    }
}


