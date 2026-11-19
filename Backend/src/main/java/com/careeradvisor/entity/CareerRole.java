package com.careeradvisor.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "career_roles")
public class CareerRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String roleName;

    @Column(nullable = false)
    private String category;

    @Column(columnDefinition = "TEXT")
    private String description;

    private BigDecimal avgSalaryLpa;

    private String marketDemandLevel;

    public CareerRole() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRoleName() { return roleName; }
    public void setRoleName(String roleName) { this.roleName = roleName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getAvgSalaryLpa() { return avgSalaryLpa; }
    public void setAvgSalaryLpa(BigDecimal avgSalaryLpa) { this.avgSalaryLpa = avgSalaryLpa; }

    public String getMarketDemandLevel() { return marketDemandLevel; }
    public void setMarketDemandLevel(String marketDemandLevel) { this.marketDemandLevel = marketDemandLevel; }
}
