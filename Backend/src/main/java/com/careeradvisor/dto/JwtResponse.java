package com.careeradvisor.dto;

public class JwtResponse {
    private String token;
    private String tokenType = "Bearer";
    private Long userId;
    private String fullName;
    private String email;
    private String engineeringBranch;
    private String academicYear;
    private Long targetRoleId;
    private java.util.List<java.util.Map<String, Object>> acquiredSkills;
    private java.util.List<String> targetCompanies;

    public JwtResponse(String token, Long userId, String fullName, String email, String engineeringBranch, String academicYear, Long targetRoleId) {
        this(token, userId, fullName, email, engineeringBranch, academicYear, targetRoleId, new java.util.ArrayList<>(), new java.util.ArrayList<>());
    }

    public JwtResponse(String token, Long userId, String fullName, String email, String engineeringBranch, String academicYear, Long targetRoleId, java.util.List<java.util.Map<String, Object>> acquiredSkills) {
        this(token, userId, fullName, email, engineeringBranch, academicYear, targetRoleId, acquiredSkills, new java.util.ArrayList<>());
    }

    public JwtResponse(String token, Long userId, String fullName, String email, String engineeringBranch, String academicYear, Long targetRoleId, java.util.List<java.util.Map<String, Object>> acquiredSkills, java.util.List<String> targetCompanies) {
        this.token = token;
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.engineeringBranch = engineeringBranch;
        this.academicYear = academicYear;
        this.targetRoleId = targetRoleId;
        this.acquiredSkills = acquiredSkills;
        this.targetCompanies = targetCompanies != null ? targetCompanies : new java.util.ArrayList<>();
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getTokenType() { return tokenType; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getEngineeringBranch() { return engineeringBranch; }
    public void setEngineeringBranch(String engineeringBranch) { this.engineeringBranch = engineeringBranch; }

    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }

    public Long getTargetRoleId() { return targetRoleId; }
    public void setTargetRoleId(Long targetRoleId) { this.targetRoleId = targetRoleId; }

    public java.util.List<java.util.Map<String, Object>> getAcquiredSkills() { return acquiredSkills; }
    public void setAcquiredSkills(java.util.List<java.util.Map<String, Object>> acquiredSkills) { this.acquiredSkills = acquiredSkills; }

    public java.util.List<String> getTargetCompanies() { return targetCompanies; }
    public void setTargetCompanies(java.util.List<String> targetCompanies) { this.targetCompanies = targetCompanies; }
}
