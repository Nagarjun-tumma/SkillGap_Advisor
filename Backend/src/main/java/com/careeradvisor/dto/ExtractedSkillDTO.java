package com.careeradvisor.dto;

public class ExtractedSkillDTO {
    private String name;
    private String category;
    private String skillType; // "REQUIRED" or "PREFERRED"
    private String importance; // "MUST_HAVE", "CRITICAL", "NICE_TO_HAVE", "BONUS"
    private String contextSnippet;

    public ExtractedSkillDTO() {}

    public ExtractedSkillDTO(String name, String category, String skillType, String importance, String contextSnippet) {
        this.name = name;
        this.category = category;
        this.skillType = skillType;
        this.importance = importance;
        this.contextSnippet = contextSnippet;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getSkillType() { return skillType; }
    public void setSkillType(String skillType) { this.skillType = skillType; }

    public String getImportance() { return importance; }
    public void setImportance(String importance) { this.importance = importance; }

    public String getContextSnippet() { return contextSnippet; }
    public void setContextSnippet(String contextSnippet) { this.contextSnippet = contextSnippet; }
}
