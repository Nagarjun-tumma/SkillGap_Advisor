package com.careeradvisor.controller;

import com.careeradvisor.entity.CareerRole;
import com.careeradvisor.entity.Skill;
import com.careeradvisor.repository.CareerRoleRepository;
import com.careeradvisor.repository.SkillRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/master")
@CrossOrigin(origins = "*")
public class MasterDataController {

    private final CareerRoleRepository careerRoleRepository;
    private final SkillRepository skillRepository;

    public MasterDataController(CareerRoleRepository careerRoleRepository, SkillRepository skillRepository) {
        this.careerRoleRepository = careerRoleRepository;
        this.skillRepository = skillRepository;
    }

    @GetMapping("/branches")
    public ResponseEntity<?> getEngineeringBranches() {
        List<Map<String, String>> branches = List.of(
            Map.of("code", "CSE", "name", "Computer Science & Engineering", "icon", "Laptop"),
            Map.of("code", "AIDS", "name", "Artificial Intelligence & Data Science", "icon", "Brain"),
            Map.of("code", "ECE", "name", "Electronics & Communication Engineering", "icon", "Cpu"),
            Map.of("code", "EEE", "name", "Electrical & Electronics Engineering", "icon", "Zap"),
            Map.of("code", "MECH", "name", "Mechanical Engineering", "icon", "Cog"),
            Map.of("code", "CIVIL", "name", "Civil Engineering", "icon", "Building")
        );
        return ResponseEntity.ok(branches);
    }

    @GetMapping("/roles")
    public ResponseEntity<?> getCareerRoles() {
        List<CareerRole> roles = careerRoleRepository.findAll();
        if (roles.isEmpty()) {
            // Provide default roles if DB seed is still running
            List<Map<String, Object>> defaultRoles = List.of(
                Map.of("id", 1L, "roleName", "AI & Machine Learning Engineer", "category", "Data & AI", "avgSalaryLpa", 14.5, "marketDemandLevel", "CRITICAL", "description", "Develops ML models, deep learning architectures & natural language systems."),
                Map.of("id", 2L, "roleName", "Full Stack Java Developer", "category", "Software", "avgSalaryLpa", 11.0, "marketDemandLevel", "VERY_HIGH", "description", "Builds scalable enterprise web apps using Java Spring Boot & React."),
                Map.of("id", 3L, "roleName", "Embedded Systems & IoT Engineer", "category", "Hardware", "avgSalaryLpa", 9.5, "marketDemandLevel", "HIGH", "description", "Designs microcontrollers firmware, sensors & smart connected devices."),
                Map.of("id", 4L, "roleName", "Data Scientist & Analyst", "category", "Data & AI", "avgSalaryLpa", 12.0, "marketDemandLevel", "VERY_HIGH", "description", "Analyzes complex datasets & builds statistical predictive pipelines."),
                Map.of("id", 5L, "roleName", "DevOps & Cloud Engineer", "category", "Software", "avgSalaryLpa", 13.0, "marketDemandLevel", "CRITICAL", "description", "Manages cloud infrastructure, Docker, Kubernetes & CI/CD pipelines.")
            );
            return ResponseEntity.ok(defaultRoles);
        }
        return ResponseEntity.ok(roles);
    }

    @GetMapping("/skills")
    public ResponseEntity<?> getMasterSkills() {
        List<Skill> skills = skillRepository.findAll();
        if (skills.isEmpty()) {
            List<Map<String, Object>> defaultSkills = List.of(
                Map.of("id", 1L, "skillName", "Java", "category", "Programming"),
                Map.of("id", 2L, "skillName", "Python", "category", "Programming"),
                Map.of("id", 3L, "skillName", "C++", "category", "Programming"),
                Map.of("id", 4L, "skillName", "React.js", "category", "Framework"),
                Map.of("id", 5L, "skillName", "Spring Boot", "category", "Framework"),
                Map.of("id", 6L, "skillName", "SQL & MySQL", "category", "Database"),
                Map.of("id", 7L, "skillName", "Machine Learning", "category", "Data & AI"),
                Map.of("id", 8L, "skillName", "Docker & Kubernetes", "category", "Tools & DevOps"),
                Map.of("id", 9L, "skillName", "Data Structures & Algorithms", "category", "Programming")
            );
            return ResponseEntity.ok(defaultSkills);
        }
        return ResponseEntity.ok(skills);
    }

    @GetMapping("/companies")
    public ResponseEntity<?> getDreamCompanies() {
        List<Map<String, Object>> companies = List.of(
            Map.of("id", "google", "name", "Google", "category", "Tier-1 Product", "tier", "MAANG", "badge", "Top Dream"),
            Map.of("id", "microsoft", "name", "Microsoft", "category", "Tier-1 Product", "tier", "MAANG", "badge", "Top Dream"),
            Map.of("id", "amazon", "name", "Amazon", "category", "Tier-1 Product", "tier", "MAANG", "badge", "Top Dream"),
            Map.of("id", "meta", "name", "Meta", "category", "Tier-1 Product", "tier", "MAANG", "badge", "Top Dream"),
            Map.of("id", "apple", "name", "Apple", "category", "Tier-1 Product", "tier", "MAANG", "badge", "Top Dream"),
            Map.of("id", "netflix", "name", "Netflix", "category", "Tier-1 Product", "tier", "MAANG", "badge", "Top Dream"),
            Map.of("id", "adobe", "name", "Adobe", "category", "Tier-1 Product", "tier", "Tier-1", "badge", "High Package"),
            Map.of("id", "uber", "name", "Uber", "category", "High-Scale Tech", "tier", "Tier-1", "badge", "High Package"),
            Map.of("id", "salesforce", "name", "Salesforce", "category", "Cloud & Enterprise", "tier", "Tier-1", "badge", "High Package"),
            Map.of("id", "oracle", "name", "Oracle", "category", "Enterprise Tech", "tier", "Tier-1", "badge", "High Package"),
            Map.of("id", "atlassian", "name", "Atlassian", "category", "Tier-1 Product", "tier", "Tier-1", "badge", "High Package"),
            Map.of("id", "nvidia", "name", "NVIDIA", "category", "AI & Hardware", "tier", "Tier-1", "badge", "AI Leader"),
            Map.of("id", "goldman_sachs", "name", "Goldman Sachs", "category", "Investment Banking / FinTech", "tier", "FinTech", "badge", "FinTech Giant"),
            Map.of("id", "jp_morgan", "name", "J.P. Morgan", "category", "Investment Banking / FinTech", "tier", "FinTech", "badge", "FinTech Giant"),
            Map.of("id", "morgan_stanley", "name", "Morgan Stanley", "category", "Investment Banking / FinTech", "tier", "FinTech", "badge", "FinTech Giant"),
            Map.of("id", "qualcomm", "name", "Qualcomm", "category", "Semiconductors & Embedded", "tier", "Core Tech", "badge", "Core Leader"),
            Map.of("id", "intel", "name", "Intel", "category", "Semiconductors & Systems", "tier", "Core Tech", "badge", "Core Leader"),
            Map.of("id", "bosch", "name", "Bosch", "category", "Automotive & IoT", "tier", "Core Tech", "badge", "Core Leader"),
            Map.of("id", "siemens", "name", "Siemens", "category", "Smart Infrastructure & Automation", "tier", "Core Tech", "badge", "Core Leader"),
            Map.of("id", "lt", "name", "Larsen & Toubro (L&T)", "category", "Engineering & Tech", "tier", "Core Tech", "badge", "Core Leader"),
            Map.of("id", "flipkart", "name", "Flipkart", "category", "E-Commerce Unicorn", "tier", "Unicorn", "badge", "High Growth"),
            Map.of("id", "zomato", "name", "Zomato", "category", "Consumer Tech Unicorn", "tier", "Unicorn", "badge", "High Growth"),
            Map.of("id", "swiggy", "name", "Swiggy", "category", "Consumer Tech Unicorn", "tier", "Unicorn", "badge", "High Growth"),
            Map.of("id", "razorpay", "name", "Razorpay", "category", "FinTech Unicorn", "tier", "Unicorn", "badge", "High Growth"),
            Map.of("id", "tcs", "name", "TCS", "category", "Global IT Services", "tier", "IT Titan", "badge", "Mass Recruiter"),
            Map.of("id", "infosys", "name", "Infosys", "category", "Global IT Services", "tier", "IT Titan", "badge", "Mass Recruiter"),
            Map.of("id", "accenture", "name", "Accenture", "category", "Tech Consulting", "tier", "IT Titan", "badge", "Mass Recruiter"),
            Map.of("id", "wipro", "name", "Wipro", "category", "Global IT Services", "tier", "IT Titan", "badge", "Mass Recruiter"),
            Map.of("id", "cognizant", "name", "Cognizant", "category", "Global IT Services", "tier", "IT Titan", "badge", "Mass Recruiter")
        );
        return ResponseEntity.ok(companies);
    }
}
