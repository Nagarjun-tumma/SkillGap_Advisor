package com.careeradvisor.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String engineeringBranch;

    @Column(nullable = false)
    private String academicYear;

    private Long targetRoleId;

    @Column(name = "target_companies", columnDefinition = "TEXT")
    private String targetCompanies;

    private boolean isEmailVerified = false;

    private LocalDateTime createdAt = LocalDateTime.now();

    public User() {}

    public User(String fullName, String email, String password, String engineeringBranch, String academicYear) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.engineeringBranch = engineeringBranch;
        this.academicYear = academicYear;
        this.isEmailVerified = true;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public Long getTargetRoleId() { return targetRoleId; }
    public void setTargetRoleId(Long targetRoleId) { this.targetRoleId = targetRoleId; }

    public String getTargetCompanies() { return targetCompanies; }
    public void setTargetCompanies(String targetCompanies) { this.targetCompanies = targetCompanies; }

    public java.util.List<String> getTargetCompaniesList() {
        if (targetCompanies == null || targetCompanies.trim().isEmpty()) {
            return new java.util.ArrayList<>();
        }
        return java.util.Arrays.stream(targetCompanies.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(java.util.stream.Collectors.toList());
    }

    public void setTargetCompaniesList(java.util.List<String> companies) {
        if (companies == null || companies.isEmpty()) {
            this.targetCompanies = "";
        } else {
            this.targetCompanies = String.join(",", companies);
        }
    }

    public boolean isEmailVerified() { return isEmailVerified; }
    public void setEmailVerified(boolean emailVerified) { isEmailVerified = emailVerified; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
