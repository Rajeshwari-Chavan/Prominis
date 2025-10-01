package com.promin.service;

import com.promin.config.JwtUtil;
import com.promin.entity.Role;
import com.promin.entity.User;
import com.promin.entity.UserStatus;
import com.promin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    public Map<String, Object> register(Map<String, Object> payload) {
        String firstName = (String) payload.get("firstName");
        String lastName = (String) payload.get("lastName");
        String email = (String) payload.get("email");
        String password = (String) payload.get("password");
        String role = (String) payload.get("role");

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already in use");
        }
        User user = new User(firstName, lastName, email, passwordEncoder.encode(password), Role.valueOf(role));
        user.setStatus(UserStatus.ACTIVE);
        user.setEmailVerified(true);
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        Map<String, Object> result = new HashMap<>();
        result.put("user", sanitize(user));
        result.put("token", token);
        return result;
    }

    public Map<String, Object> login(String email, String password) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );
        } catch (BadCredentialsException ex) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        User user = userRepository.findByEmail(email).orElseThrow();
        String token = jwtUtil.generateToken(email, user.getRole().name());
        Map<String, Object> result = new HashMap<>();
        result.put("user", sanitize(user));
        result.put("token", token);
        return result;
    }

    public Map<String, Object> verify(String token) {
        if (!jwtUtil.validateToken(token)) {
            throw new IllegalArgumentException("Invalid token");
        }
        String email = jwtUtil.extractUsername(token);
        User user = userRepository.findByEmail(email).orElseThrow();
        Map<String, Object> result = new HashMap<>();
        result.put("user", sanitize(user));
        return result;
    }

    private Map<String, Object> sanitize(User user) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", user.getId());
        map.put("firstName", user.getFirstName());
        map.put("lastName", user.getLastName());
        map.put("email", user.getEmail());
        map.put("role", user.getRole().name());
        map.put("status", user.getStatus().name());
        map.put("createdAt", user.getCreatedAt());
        map.put("lastLoginAt", user.getLastLoginAt());
        map.put("avatar", user.getAvatar());
        map.put("location", user.getLocation());
        return map;
    }
}


