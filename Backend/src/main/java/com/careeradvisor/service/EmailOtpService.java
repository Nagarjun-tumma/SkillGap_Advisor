package com.careeradvisor.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailOtpService {

    private static final Logger logger = LoggerFactory.getLogger(EmailOtpService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    public void sendOtpEmail(String recipientEmail, String otpCode) {
        String subject = "Verification Code for AI Career & Skill Gap Advisor";
        String messageBody = String.format(
            "Hello,\n\nYour 6-digit email verification code for the AI Career & Skill Gap Advisor portal is: %s\n\nThis code will expire in 5 minutes.\nIf you did not request this code, please ignore this email.\n\nBest regards,\nAI Career Advisor Team",
            otpCode
        );

        logger.info("=================================================");
        logger.info("  [OTP GENERATED] Email: {} | Code: {}", recipientEmail, otpCode);
        logger.info("=================================================");

        if (mailSender != null) {
            try {
                SimpleMailMessage mail = new SimpleMailMessage();
                if (fromEmail != null && !fromEmail.isBlank()) {
                    mail.setFrom(fromEmail.trim());
                }
                mail.setTo(recipientEmail);
                mail.setSubject(subject);
                mail.setText(messageBody);
                mailSender.send(mail);
                logger.info("OTP Email successfully dispatched via SMTP to {}", recipientEmail);
            } catch (Exception e) {
                logger.warn("SMTP Delivery Failed to {}: {} (Falling back to dev OTP)", recipientEmail, e.getMessage());
            }
        }
    }
}
