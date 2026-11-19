package com.careeradvisor.controller;

import com.careeradvisor.entity.Skill;
import com.careeradvisor.entity.StudentSkill;
import com.careeradvisor.entity.User;
import com.careeradvisor.repository.SkillRepository;
import com.careeradvisor.repository.StudentSkillRepository;
import com.careeradvisor.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "*")
public class StudentSkillController {

    private final StudentSkillRepository studentSkillRepository;
    private final SkillRepository skillRepository;
    private final UserRepository userRepository;

    public StudentSkillController(StudentSkillRepository studentSkillRepository,
                                  SkillRepository skillRepository,
                                  UserRepository userRepository) {
        this.studentSkillRepository = studentSkillRepository;
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/skills/{userId}")
    public ResponseEntity<?> getUserSkills(@PathVariable Long userId) {
        List<StudentSkill> studentSkills = studentSkillRepository.findByUserId(userId);
        List<Map<String, Object>> result = new ArrayList<>();
        for (StudentSkill ss : studentSkills) {
            Map<String, Object> map = new HashMap<>();
            map.put("skillId", ss.getSkill().getId());
            map.put("skillName", ss.getSkill().getSkillName());
            map.put("category", ss.getSkill().getCategory());
            map.put("proficiency", ss.getProficiency());
            map.put("isVerified", ss.getIsVerified() != null ? ss.getIsVerified() : false);
            map.put("verifiedScore", ss.getVerifiedScore() != null ? ss.getVerifiedScore() : 0);
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/skills/{userId}")
    @Transactional
    public ResponseEntity<?> updateUserSkills(@PathVariable Long userId, @RequestBody List<Map<String, Object>> skillsPayload) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "User not found"));
        }

        // Delete existing student skills
        studentSkillRepository.deleteByUserId(userId);

        List<Map<String, Object>> savedResult = new ArrayList<>();
        for (Map<String, Object> payload : skillsPayload) {
            Long skillId = null;
            if (payload.get("skillId") != null) {
                skillId = Long.valueOf(payload.get("skillId").toString());
            }
            String skillName = (String) payload.get("skillName");
            String proficiency = payload.get("proficiency") != null ? (String) payload.get("proficiency") : "INTERMEDIATE";
            Boolean isVerified = payload.get("isVerified") != null ? Boolean.valueOf(payload.get("isVerified").toString()) : false;
            Integer verifiedScore = payload.get("verifiedScore") != null ? Integer.valueOf(payload.get("verifiedScore").toString()) : 0;

            Skill skill = null;
            if (skillId != null) {
                skill = skillRepository.findById(skillId).orElse(null);
            }
            if (skill == null && skillName != null) {
                skill = skillRepository.findAll().stream()
                        .filter(s -> s.getSkillName().equalsIgnoreCase(skillName))
                        .findFirst().orElse(null);
            }
            if (skill == null && skillName != null) {
                skill = new Skill(skillName, "Core Technical");
                skill = skillRepository.save(skill);
            }

            if (skill != null) {
                StudentSkill studentSkill = new StudentSkill(user, skill, proficiency, isVerified, verifiedScore);
                studentSkillRepository.save(studentSkill);

                Map<String, Object> map = new HashMap<>();
                map.put("skillId", skill.getId());
                map.put("skillName", skill.getSkillName());
                map.put("category", skill.getCategory());
                map.put("proficiency", proficiency);
                map.put("isVerified", isVerified);
                map.put("verifiedScore", verifiedScore);
                savedResult.add(map);
            }
        }

        return ResponseEntity.ok(savedResult);
    }

    @PutMapping("/target-role/{userId}")
    public ResponseEntity<?> updateTargetRole(@PathVariable Long userId, @RequestBody Map<String, Object> payload) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "User not found"));
        }
        if (payload.get("targetRoleId") != null) {
            user.setTargetRoleId(Long.valueOf(payload.get("targetRoleId").toString()));
            userRepository.save(user);
        }
        return ResponseEntity.ok(Map.of("success", true, "targetRoleId", user.getTargetRoleId()));
    }

    @GetMapping("/target-companies/{userId}")
    public ResponseEntity<?> getTargetCompanies(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "User not found"));
        }
        return ResponseEntity.ok(Map.of("success", true, "targetCompanies", user.getTargetCompaniesList()));
    }

    @PutMapping("/target-companies/{userId}")
    public ResponseEntity<?> updateTargetCompanies(@PathVariable Long userId, @RequestBody Map<String, Object> payload) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "User not found"));
        }
        Object compObj = payload.get("targetCompanies");
        if (compObj instanceof List) {
            List<String> companies = ((List<?>) compObj).stream().map(Object::toString).toList();
            user.setTargetCompaniesList(companies);
        } else if (compObj != null) {
            user.setTargetCompanies(compObj.toString());
        } else {
            user.setTargetCompanies("");
        }
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("success", true, "targetCompanies", user.getTargetCompaniesList()));
    }
}
