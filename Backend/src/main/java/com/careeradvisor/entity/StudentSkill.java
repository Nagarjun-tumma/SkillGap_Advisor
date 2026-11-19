package com.careeradvisor.entity;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "student_skills")
public class StudentSkill {

    @EmbeddedId
    private StudentSkillId id;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("skillId")
    @JoinColumn(name = "skill_id")
    private Skill skill;

    @Column(nullable = false)
    private String proficiency; // BEGINNER, INTERMEDIATE, ADVANCED

    @Column(name = "is_verified")
    private Boolean isVerified = false;

    @Column(name = "verified_score")
    private Integer verifiedScore = 0;

    public StudentSkill() {}

    public StudentSkill(User user, Skill skill, String proficiency) {
        this.user = user;
        this.skill = skill;
        this.proficiency = proficiency;
        this.isVerified = false;
        this.verifiedScore = 0;
        this.id = new StudentSkillId(user.getId(), skill.getId());
    }

    public StudentSkill(User user, Skill skill, String proficiency, Boolean isVerified, Integer verifiedScore) {
        this.user = user;
        this.skill = skill;
        this.proficiency = proficiency;
        this.isVerified = isVerified != null ? isVerified : false;
        this.verifiedScore = verifiedScore != null ? verifiedScore : 0;
        this.id = new StudentSkillId(user.getId(), skill.getId());
    }

    public StudentSkillId getId() { return id; }
    public void setId(StudentSkillId id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Skill getSkill() { return skill; }
    public void setSkill(Skill skill) { this.skill = skill; }

    public String getProficiency() { return proficiency; }
    public void setProficiency(String proficiency) { this.proficiency = proficiency; }

    public Boolean getIsVerified() { return isVerified; }
    public void setIsVerified(Boolean isVerified) { this.isVerified = isVerified; }

    public Integer getVerifiedScore() { return verifiedScore; }
    public void setVerifiedScore(Integer verifiedScore) { this.verifiedScore = verifiedScore; }

    @Embeddable
    public static class StudentSkillId implements Serializable {
        private Long userId;
        private Long skillId;

        public StudentSkillId() {}

        public StudentSkillId(Long userId, Long skillId) {
            this.userId = userId;
            this.skillId = skillId;
        }

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }

        public Long getSkillId() { return skillId; }
        public void setSkillId(Long skillId) { this.skillId = skillId; }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            StudentSkillId that = (StudentSkillId) o;
            return Objects.equals(userId, that.userId) && Objects.equals(skillId, that.skillId);
        }

        @Override
        public int hashCode() {
            return Objects.hash(userId, skillId);
        }
    }
}
