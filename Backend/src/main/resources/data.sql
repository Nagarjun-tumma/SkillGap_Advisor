-- Seed Data for AI-Based Career and Skill Gap Advisor

-- Insert Engineering Branches
INSERT INTO engineering_branches (code, name, description) VALUES
('CSE', 'Computer Science & Engineering', 'Software Engineering, Algorithms, AI, Data Science & Systems'),
('AIDS', 'Artificial Intelligence & Data Science', 'Machine Learning, Neural Networks, Data Analytics & Big Data'),
('ECE', 'Electronics & Communication Engineering', 'Embedded Systems, IoT, Microcontrollers, VLSI & Communications'),
('EEE', 'Electrical & Electronics Engineering', 'Power Systems, Control Systems, Power Electronics & Robotics'),
('MECH', 'Mechanical Engineering', 'CAD/CAM, Thermodynamics, Mechatronics, Robotics & Automobile'),
('CIVIL', 'Civil Engineering', 'Structural Design, BIM, Transportation Engineering & Construction Tech')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert Career Roles
INSERT INTO career_roles (id, role_name, category, description, avg_salary_lpa, market_demand_level) VALUES
(1, 'AI & Machine Learning Engineer', 'Data & AI', 'Develops machine learning models, deep learning architectures, and natural language applications.', 14.50, 'CRITICAL'),
(2, 'Full Stack Java Developer', 'Software', 'Builds scalable web applications using Java Spring Boot backend and React frontend.', 11.00, 'VERY_HIGH'),
(3, 'Embedded Systems & IoT Engineer', 'Hardware', 'Designs firmware, microcontroller code (C/C++), and smart connected device architectures.', 9.50, 'HIGH'),
(4, 'Data Scientist & Analyst', 'Data & AI', 'Analyzes complex datasets, builds predictive statistical models, and creates data visualizations.', 12.00, 'VERY_HIGH'),
(5, 'DevOps & Cloud Engineer', 'Software', 'Manages cloud infrastructure, CI/CD pipelines, Docker, Kubernetes, and automated deployment.', 13.00, 'CRITICAL'),
(6, 'Robotics & Automation Engineer', 'Core Engineering', 'Combines mechanical design, control systems, and embedded code for industrial automation.', 10.50, 'HIGH')
ON DUPLICATE KEY UPDATE role_name=VALUES(role_name);

-- Insert Master Skills
INSERT INTO skills (id, skill_name, category) VALUES
(1, 'Java', 'Programming'),
(2, 'Python', 'Programming'),
(3, 'C++', 'Programming'),
(4, 'React.js', 'Framework'),
(5, 'Spring Boot', 'Framework'),
(6, 'SQL & MySQL', 'Database'),
(7, 'Machine Learning (Scikit-Learn)', 'Data & AI'),
(8, 'Deep Learning (PyTorch/TensorFlow)', 'Data & AI'),
(9, 'Embedded C / Microcontrollers', 'Core Technical'),
(10, 'Docker & Kubernetes', 'Tools & DevOps'),
(11, 'Git & GitHub', 'Tools & DevOps'),
(12, 'Data Structures & Algorithms', 'Programming'),
(13, 'System Design', 'Core Technical'),
(14, 'REST API Design', 'Framework'),
(15, 'CAD & SolidWorks', 'Core Technical'),
(16, 'Robotics & Microprocessors', 'Core Technical')
ON DUPLICATE KEY UPDATE skill_name=VALUES(skill_name);

-- Insert Role Required Skills (Skill Matrix)
INSERT INTO role_required_skills (role_id, skill_id, importance, required_proficiency) VALUES
(1, 2, 'ESSENTIAL', 'ADVANCED'),
(1, 7, 'ESSENTIAL', 'ADVANCED'),
(1, 8, 'ESSENTIAL', 'INTERMEDIATE'),
(1, 12, 'HIGH', 'ADVANCED'),
(1, 6, 'HIGH', 'INTERMEDIATE'),
(2, 1, 'ESSENTIAL', 'ADVANCED'),
(2, 5, 'ESSENTIAL', 'ADVANCED'),
(2, 4, 'ESSENTIAL', 'INTERMEDIATE'),
(2, 6, 'ESSENTIAL', 'INTERMEDIATE'),
(2, 14, 'HIGH', 'ADVANCED'),
(2, 11, 'HIGH', 'INTERMEDIATE'),
(3, 3, 'ESSENTIAL', 'ADVANCED'),
(3, 9, 'ESSENTIAL', 'ADVANCED'),
(3, 16, 'ESSENTIAL', 'INTERMEDIATE'),
(3, 11, 'HIGH', 'INTERMEDIATE'),
(5, 10, 'ESSENTIAL', 'ADVANCED'),
(5, 2, 'HIGH', 'INTERMEDIATE'),
(5, 11, 'ESSENTIAL', 'ADVANCED'),
(5, 13, 'HIGH', 'INTERMEDIATE')
ON DUPLICATE KEY UPDATE importance=VALUES(importance);

-- Insert Learning Resources & Recommendations
INSERT INTO learning_resources (skill_id, title, type, provider, link, difficulty) VALUES
(1, 'Master Java Programming & Data Structures', 'COURSE', 'Coursera / Java Masterclass', 'https://www.oracle.com/java/', 'BEGINNER'),
(5, 'Building Microservices with Spring Boot 3 & Spring Security', 'PROJECT', 'Spring.io Guides', 'https://spring.io/guides', 'INTERMEDIATE'),
(4, 'Complete Modern React & Redux Toolkit', 'COURSE', 'React Official Docs', 'https://react.dev', 'INTERMEDIATE'),
(7, 'Applied Machine Learning in Python', 'COURSE', 'scikit-learn.org', 'https://scikit-learn.org', 'INTERMEDIATE'),
(8, 'Deep Learning Specialization with PyTorch', 'CERTIFICATION', 'DeepLearning.AI', 'https://www.deeplearning.ai', 'ADVANCED'),
(9, 'STM32 Microcontroller Embedded C Development', 'COURSE', 'Udemy / ARM Developer', 'https://arm.com', 'INTERMEDIATE'),
(10, 'Docker & Kubernetes Hands-on Deployment', 'CERTIFICATION', 'Linux Foundation CKA', 'https://kubernetes.io', 'ADVANCED')
ON DUPLICATE KEY UPDATE title=VALUES(title);
