package com.careeradvisor.repository;

import com.careeradvisor.entity.CareerRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CareerRoleRepository extends JpaRepository<CareerRole, Long> {
}
