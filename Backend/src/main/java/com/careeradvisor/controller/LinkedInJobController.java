package com.careeradvisor.controller;

import com.careeradvisor.dto.JobSkillExtractionRequest;
import com.careeradvisor.dto.LinkedInJobDTO;
import com.careeradvisor.service.LinkedInJobService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*")
public class LinkedInJobController {

    private final LinkedInJobService linkedInJobService;

    public LinkedInJobController(LinkedInJobService linkedInJobService) {
        this.linkedInJobService = linkedInJobService;
    }

    @GetMapping("/linkedin/{roleId}")
    public ResponseEntity<LinkedInJobDTO> getJobByRoleId(@PathVariable Long roleId) {
        LinkedInJobDTO job = linkedInJobService.getJobByRoleId(roleId);
        return ResponseEntity.ok(job);
    }

    @GetMapping("/linkedin/role")
    public ResponseEntity<LinkedInJobDTO> getJobByRoleName(@RequestParam(name = "name") String roleName) {
        LinkedInJobDTO job = linkedInJobService.getJobByRoleName(roleName);
        return ResponseEntity.ok(job);
    }

    @PostMapping("/extract-skills")
    public ResponseEntity<LinkedInJobDTO> extractSkillsFromJobText(@RequestBody JobSkillExtractionRequest request) {
        LinkedInJobDTO job = linkedInJobService.extractSkillsFromCustomJob(
            request.getJobUrl(), 
            request.getJobDescriptionText()
        );
        return ResponseEntity.ok(job);
    }
}
