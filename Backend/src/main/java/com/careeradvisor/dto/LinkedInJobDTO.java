package com.careeradvisor.dto;

import java.util.List;

public class LinkedInJobDTO {
    private Long roleId;
    private String roleName;
    private String jobTitle;
    private String company;
    private String companyLogoUrl;
    private String location;
    private String postedDate;
    private String linkedInUrl;
    private String jobType;
    private String experienceLevel;
    private String salaryRange;
    private String fullDescription;
    private List<ExtractedSkillDTO> requiredSkills;
    private List<ExtractedSkillDTO> preferredSkills;

    public LinkedInJobDTO() {}

    public LinkedInJobDTO(Long roleId, String roleName, String jobTitle, String company, 
                          String companyLogoUrl, String location, String postedDate, 
                          String linkedInUrl, String jobType, String experienceLevel, 
                          String salaryRange, String fullDescription, 
                          List<ExtractedSkillDTO> requiredSkills, List<ExtractedSkillDTO> preferredSkills) {
        this.roleId = roleId;
        this.roleName = roleName;
        this.jobTitle = jobTitle;
        this.company = company;
        this.companyLogoUrl = companyLogoUrl;
        this.location = location;
        this.postedDate = postedDate;
        this.linkedInUrl = linkedInUrl;
        this.jobType = jobType;
        this.experienceLevel = experienceLevel;
        this.salaryRange = salaryRange;
        this.fullDescription = fullDescription;
        this.requiredSkills = requiredSkills;
        this.preferredSkills = preferredSkills;
    }

    public Long getRoleId() { return roleId; }
    public void setRoleId(Long roleId) { this.roleId = roleId; }

    public String getRoleName() { return roleName; }
    public void setRoleName(String roleName) { this.roleName = roleName; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getCompanyLogoUrl() { return companyLogoUrl; }
    public void setCompanyLogoUrl(String companyLogoUrl) { this.companyLogoUrl = companyLogoUrl; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getPostedDate() { return postedDate; }
    public void setPostedDate(String postedDate) { this.postedDate = postedDate; }

    public String getLinkedInUrl() { return linkedInUrl; }
    public void setLinkedInUrl(String linkedInUrl) { this.linkedInUrl = linkedInUrl; }

    public String getJobType() { return jobType; }
    public void setJobType(String jobType) { this.jobType = jobType; }

    public String getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }

    public String getSalaryRange() { return salaryRange; }
    public void setSalaryRange(String salaryRange) { this.salaryRange = salaryRange; }

    public String getFullDescription() { return fullDescription; }
    public void setFullDescription(String fullDescription) { this.fullDescription = fullDescription; }

    public List<ExtractedSkillDTO> getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(List<ExtractedSkillDTO> requiredSkills) { this.requiredSkills = requiredSkills; }

    public List<ExtractedSkillDTO> getPreferredSkills() { return preferredSkills; }
    public void setPreferredSkills(List<ExtractedSkillDTO> preferredSkills) { this.preferredSkills = preferredSkills; }
}
