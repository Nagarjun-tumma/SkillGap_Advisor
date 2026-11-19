package com.careeradvisor.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class RegisterRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Engineering branch is required")
    private String engineeringBranch;

    @NotBlank(message = "Academic year is required")
    private String academicYear;

    @NotBlank(message = "OTP verification code is required")
    private String otpCode;

    private Long targetRoleId;

    private java.util.List<String> targetCompanies = new java.util.ArrayList<>();

    public RegisterRequest() {}

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEngineeringBranch() { return engineeringBranch; }
    public void setEngineeringBranch(String engineeringBranch) { this.engineeringBranch = engineeringBranch; }

    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }

    public String getOtpCode() { return otpCode; }
    public void setOtpCode(String otpCode) { this.otpCode = otpCode; }

    public Long getTargetRoleId() { return targetRoleId; }
    public void setTargetRoleId(Long targetRoleId) { this.targetRoleId = targetRoleId; }

    public java.util.List<String> getTargetCompanies() { return targetCompanies; }
    public void setTargetCompanies(java.util.List<String> targetCompanies) { this.targetCompanies = targetCompanies; }
}
