package com.careeradvisor.repository;

import com.careeradvisor.entity.StudentSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentSkillRepository extends JpaRepository<StudentSkill, StudentSkill.StudentSkillId> {
    List<StudentSkill> findByUserId(Long userId);
    void deleteByUserId(Long userId);
}
