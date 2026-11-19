-- MySQL Database Schema for AI-Based Career and Skill Gap Advisor for Engineering Students

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    engineering_branch VARCHAR(100) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    target_role_id BIGINT,
    target_companies TEXT,
    is_email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. OTP Tokens Table (Email Validation)
CREATE TABLE IF NOT EXISTS otp_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    purpose VARCHAR(50) DEFAULT 'SIGNUP_VERIFICATION',
    expiry_time TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Engineering Branches Table
CREATE TABLE IF NOT EXISTS engineering_branches (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- 4. Career Roles Table
CREATE TABLE IF NOT EXISTS career_roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    avg_salary_lpa DECIMAL(5,2),
    market_demand_level VARCHAR(20)
);

-- 5. Skills Master Table
CREATE TABLE IF NOT EXISTS skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    skill_name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL
);

-- 6. Role Required Skills (Skill Matrix)
CREATE TABLE IF NOT EXISTS role_required_skills (
    role_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    importance VARCHAR(20) NOT NULL,
    required_proficiency VARCHAR(20) NOT NULL,
    PRIMARY KEY (role_id, skill_id),
    FOREIGN KEY (role_id) REFERENCES career_roles(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- 7. Student Acquired Skills
CREATE TABLE IF NOT EXISTS student_skills (
    user_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    proficiency VARCHAR(20) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_score INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, skill_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- 8. Learning Resources & Recommendations
CREATE TABLE IF NOT EXISTS learning_resources (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    skill_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL,
    provider VARCHAR(100),
    link VARCHAR(500),
    difficulty VARCHAR(20),
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);
