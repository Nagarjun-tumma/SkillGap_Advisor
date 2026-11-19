package com.careeradvisor.service;

import com.careeradvisor.entity.OtpToken;
import com.careeradvisor.entity.User;
import com.careeradvisor.repository.OtpTokenRepository;
import com.careeradvisor.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final OtpTokenRepository otpTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailOtpService emailOtpService;

    @Value("${app.otp.expiry-minutes:5}")
    private int otpExpiryMinutes;

    public AuthService(UserRepository userRepository, 
                       OtpTokenRepository otpTokenRepository, 
                       PasswordEncoder passwordEncoder,
                       EmailOtpService emailOtpService) {
        this.userRepository = userRepository;
        this.otpTokenRepository = otpTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailOtpService = emailOtpService;
    }

    public Map<String, Object> checkEmail(String email) {
        String cleanEmail = email != null ? email.toLowerCase().trim() : "";
        boolean isValidSyntax = cleanEmail.matches("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");

        Map<String, Object> response = new HashMap<>();
        response.put("email", cleanEmail);

        if (!isValidSyntax) {
            response.put("available", false);
            response.put("validFormat", false);
            response.put("message", "Invalid email format");
            return response;
        }

        boolean exists = userRepository.existsByEmail(cleanEmail);
        response.put("available", !exists);
        response.put("validFormat", true);
        response.put("message", exists ? "Email is already registered" : "Email is available");
        return response;
    }

    public Map<String, Object> sendOtp(String email) {
        String cleanEmail = email.toLowerCase().trim();
        
        if (userRepository.existsByEmail(cleanEmail)) {
            throw new IllegalArgumentException("Email address is already registered. Please login.");
        }

        // Generate 6 digit numeric OTP
        SecureRandom random = new SecureRandom();
        String otpCode = String.format("%06d", random.nextInt(900000) + 100000);

        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(otpExpiryMinutes);
        OtpToken otpToken = new OtpToken(cleanEmail, otpCode, expiryTime);
        otpTokenRepository.save(otpToken);

        // Send OTP via Email (or log in dev)
        emailOtpService.sendOtpEmail(cleanEmail, otpCode);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "6-Digit OTP sent successfully to " + cleanEmail);
        response.put("email", cleanEmail);
        response.put("devOtp", otpCode); // Handy fallback for instant test
        return response;
    }

    public boolean verifyOtp(String email, String otpCode) {
        String cleanEmail = email.toLowerCase().trim();
        Optional<OtpToken> tokenOpt = otpTokenRepository.findTopByEmailAndPurposeAndIsUsedFalseOrderByCreatedAtDesc(cleanEmail, "SIGNUP_VERIFICATION");

        if (tokenOpt.isEmpty()) {
            throw new IllegalArgumentException("No active OTP request found for this email. Please request a new OTP.");
        }

        OtpToken token = tokenOpt.get();

        if (token.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("OTP code has expired. Please request a new OTP.");
        }

        if (!token.getOtpCode().equals(otpCode.trim())) {
            throw new IllegalArgumentException("Incorrect OTP code. Please try again.");
        }

        token.setUsed(true);
        otpTokenRepository.save(token);
        return true;
    }

    public User registerUser(String fullName, String email, String password, String branch, String year, Long targetRoleId) {
        return registerUser(fullName, email, password, branch, year, targetRoleId, new java.util.ArrayList<>());
    }

    public User registerUser(String fullName, String email, String password, String branch, String year, Long targetRoleId, java.util.List<String> targetCompanies) {
        String cleanEmail = email.toLowerCase().trim();
        String cleanName = fullName != null ? fullName.trim() : "";
        if (cleanName.isEmpty() || !cleanName.matches("^[a-zA-Z][a-zA-Z\\s.'-]*$")) {
            throw new IllegalArgumentException("Full Name must start with letters and cannot contain numbers or special symbols.");
        }
        if (userRepository.existsByEmail(cleanEmail)) {
            throw new IllegalArgumentException("Email is already registered.");
        }

        String encodedPassword = passwordEncoder.encode(password);
        User user = new User(cleanName, cleanEmail, encodedPassword, branch, year);
        user.setTargetRoleId(targetRoleId != null ? targetRoleId : 2L);
        user.setTargetCompaniesList(targetCompanies);
        user.setEmailVerified(true);
        return userRepository.save(user);
    }
}
