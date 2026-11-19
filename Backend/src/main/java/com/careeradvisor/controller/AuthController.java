package com.careeradvisor.controller;

import com.careeradvisor.dto.*;
import com.careeradvisor.entity.User;
import com.careeradvisor.repository.UserRepository;
import com.careeradvisor.security.JwtTokenProvider;
import com.careeradvisor.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final com.careeradvisor.repository.StudentSkillRepository studentSkillRepository;

    public AuthController(AuthService authService, 
                          UserRepository userRepository, 
                          PasswordEncoder passwordEncoder, 
                          JwtTokenProvider jwtTokenProvider,
                          com.careeradvisor.repository.StudentSkillRepository studentSkillRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.studentSkillRepository = studentSkillRepository;
    }

    @PostMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Email is required"));
        }
        Map<String, Object> result = authService.checkEmail(email);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@Valid @RequestBody OtpRequest request) {
        try {
            Map<String, Object> result = authService.sendOtp(request.getEmail());
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Failed to send OTP email: " + e.getMessage()));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        try {
            boolean verified = authService.verifyOtp(request.getEmail(), request.getOtpCode());
            return ResponseEntity.ok(new ApiResponse(true, "OTP verification successful"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest request) {
        try {
            // Verify OTP code first
            authService.verifyOtp(request.getEmail(), request.getOtpCode());

            User user = authService.registerUser(
                    request.getFullName(),
                    request.getEmail(),
                    request.getPassword(),
                    request.getEngineeringBranch(),
                    request.getAcademicYear(),
                    request.getTargetRoleId(),
                    request.getTargetCompanies()
            );

            String token = jwtTokenProvider.generateToken(user.getEmail());

            JwtResponse jwtResponse = new JwtResponse(
                    token,
                    user.getId(),
                    user.getFullName(),
                    user.getEmail(),
                    user.getEngineeringBranch(),
                    user.getAcademicYear(),
                    user.getTargetRoleId(),
                    new java.util.ArrayList<>(),
                    user.getTargetCompaniesList()
            );

            return ResponseEntity.ok(jwtResponse);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim()).orElse(null);

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(false, "Invalid email or password credentials."));
        }

        String token = jwtTokenProvider.generateToken(user.getEmail());

        // Fetch acquired skills from database
        java.util.List<com.careeradvisor.entity.StudentSkill> studentSkills = studentSkillRepository.findByUserId(user.getId());
        java.util.List<java.util.Map<String, Object>> acquiredSkills = new java.util.ArrayList<>();
        for (com.careeradvisor.entity.StudentSkill ss : studentSkills) {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("skillId", ss.getSkill().getId());
            map.put("skillName", ss.getSkill().getSkillName());
            map.put("category", ss.getSkill().getCategory());
            map.put("proficiency", ss.getProficiency());
            map.put("isVerified", ss.getIsVerified() != null ? ss.getIsVerified() : false);
            map.put("verifiedScore", ss.getVerifiedScore() != null ? ss.getVerifiedScore() : 0);
            acquiredSkills.add(map);
        }

        JwtResponse jwtResponse = new JwtResponse(
                token,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getEngineeringBranch(),
                user.getAcademicYear(),
                user.getTargetRoleId(),
                acquiredSkills,
                user.getTargetCompaniesList()
        );

        return ResponseEntity.ok(jwtResponse);
    }
}
