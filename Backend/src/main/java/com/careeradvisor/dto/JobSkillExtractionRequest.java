package com.careeradvisor.dto;

public class JobSkillExtractionRequest {
    private String jobUrl;
    private String jobDescriptionText;

    public JobSkillExtractionRequest() {}

    public JobSkillExtractionRequest(String jobUrl, String jobDescriptionText) {
        this.jobUrl = jobUrl;
        this.jobDescriptionText = jobDescriptionText;
    }

    public String getJobUrl() { return jobUrl; }
    public void setJobUrl(String jobUrl) { this.jobUrl = jobUrl; }

    public String getJobDescriptionText() { return jobDescriptionText; }
    public void setJobDescriptionText(String jobDescriptionText) { this.jobDescriptionText = jobDescriptionText; }
}
