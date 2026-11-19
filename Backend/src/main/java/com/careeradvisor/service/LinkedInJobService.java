package com.careeradvisor.service;

import com.careeradvisor.dto.ExtractedSkillDTO;
import com.careeradvisor.dto.LinkedInJobDTO;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class LinkedInJobService {

    private final Map<Long, LinkedInJobDTO> jobCatalog = new HashMap<>();

    public LinkedInJobService() {
        initJobCatalog();
    }

    private void initJobCatalog() {
        // Role 1: AI & Machine Learning Engineer
        jobCatalog.put(1L, new LinkedInJobDTO(
            1L,
            "AI & Machine Learning Engineer",
            "Senior AI / Machine Learning Engineer (Generative AI & LLMs)",
            "NVIDIA",
            "https://cdn.iconscout.com/icon/free/png-256/free-nvidia-logo-icon-download-in-svg-png-gif-file-formats--brand-social-media-pack-logos-icons-283838.png",
            "Bengaluru, Karnataka, India (Hybrid)",
            "2 days ago",
            "https://www.linkedin.com/jobs/view/3892018491",
            "Full-Time",
            "Mid-Senior level (3-5 yrs)",
            "₹16 - ₹24 LPA",
            "About the job:\n" +
            "NVIDIA is looking for a passionate AI & Machine Learning Engineer to design, scale, and optimize next-generation deep learning architectures and LLM pipelines. You will work on high-throughput model inference, distributed training, and dataset engineering.\n\n" +
            "Basic Qualifications / Required Skills:\n" +
            "- Strong hands-on proficiency in Python and C++ for model development & performance optimization.\n" +
            "- Deep understanding of Machine Learning fundamentals, neural network architectures, Transformers, and gradient descent.\n" +
            "- Experience with Deep Learning frameworks such as PyTorch or TensorFlow for training and fine-tuning models.\n" +
            "- Solid foundation in Data Structures & Algorithms for efficient memory allocation and data processing.\n" +
            "- Proficiency in SQL & MySQL for querying large datasets, feature stores, and pipeline analytics.\n\n" +
            "Preferred Qualifications / Bonus Skills:\n" +
            "- Experience with Docker & Kubernetes for model deployment and microservice orchestration.\n" +
            "- Knowledge of Git & GitHub for collaborative code reviews and version control.\n" +
            "- Familiarity with CUDA GPU acceleration, TensorRT, or ONNX runtime optimization.\n" +
            "- Experience with MLOps tools (MLflow, Kubeflow) and cloud platforms (AWS/GCP).",
            List.of(
                new ExtractedSkillDTO("Python", "Programming Core", "REQUIRED", "MUST_HAVE", "Strong hands-on proficiency in Python for model development & performance optimization."),
                new ExtractedSkillDTO("Machine Learning", "Data & AI", "REQUIRED", "CRITICAL", "Deep understanding of Machine Learning fundamentals, neural network architectures, and Transformers."),
                new ExtractedSkillDTO("Deep Learning", "Data & AI", "REQUIRED", "CRITICAL", "Experience with Deep Learning frameworks such as PyTorch or TensorFlow for training and fine-tuning models."),
                new ExtractedSkillDTO("Data Structures & Algorithms", "Computer Science", "REQUIRED", "MUST_HAVE", "Solid foundation in Data Structures & Algorithms for efficient memory allocation."),
                new ExtractedSkillDTO("SQL & MySQL", "Database", "REQUIRED", "MUST_HAVE", "Proficiency in SQL & MySQL for querying large datasets and feature stores.")
            ),
            List.of(
                new ExtractedSkillDTO("Docker & Kubernetes", "DevOps & Cloud", "PREFERRED", "NICE_TO_HAVE", "Experience with Docker & Kubernetes for model deployment and microservice orchestration."),
                new ExtractedSkillDTO("Git & GitHub", "Tools & Version Control", "PREFERRED", "NICE_TO_HAVE", "Knowledge of Git & GitHub for collaborative code reviews and version control."),
                new ExtractedSkillDTO("PyTorch / TensorFlow", "Frameworks", "PREFERRED", "BONUS", "Familiarity with CUDA GPU acceleration, TensorRT, PyTorch and ONNX runtime optimization.")
            )
        ));

        // Role 2: Full Stack Java Developer
        jobCatalog.put(2L, new LinkedInJobDTO(
            2L,
            "Full Stack Java Developer",
            "Senior Full Stack Java Engineer (Spring Boot & React)",
            "Microsoft",
            "https://cdn.iconscout.com/icon/free/png-256/free-microsoft-logo-icon-download-in-svg-png-gif-file-formats--brand-social-media-pack-logos-icons-283833.png",
            "Hyderabad, Telangana, India (On-site)",
            "1 day ago",
            "https://www.linkedin.com/jobs/view/3892018492",
            "Full-Time",
            "Mid-Senior level (2-4 yrs)",
            "₹12 - ₹18 LPA",
            "About the job:\n" +
            "Microsoft Cloud & Enterprise team is hiring a Full Stack Java Developer. You will architect enterprise-grade microservices, develop clean React interfaces, and maintain highly secure cloud backends.\n\n" +
            "Basic Qualifications / Required Skills:\n" +
            "- Core expertise in Java (Java 17/21), Object-Oriented Programming, Multithreading, and Collections.\n" +
            "- Hands-on experience with Spring Boot, Spring Security, JPA Hibernate, and Dependency Injection.\n" +
            "- Strong frontend skills in React.js, JSX, Hooks, State Management, and modern JavaScript (ES6+).\n" +
            "- Relational database proficiency in SQL & MySQL schema design, indexing, and complex queries.\n" +
            "- Production experience with REST API Design, OpenAPI/Swagger, and JSON API standards.\n" +
            "- Version control proficiency using Git & GitHub for feature branching and pull requests.\n\n" +
            "Preferred Qualifications / Bonus Skills:\n" +
            "- Exposure to Docker & Kubernetes for containerized microservices deployment.\n" +
            "- Experience with System Design, distributed caching (Redis), and message queues (Kafka).\n" +
            "- AWS or Azure cloud certifications (AZ-900 or AWS Certified Developer).",
            List.of(
                new ExtractedSkillDTO("Java", "Programming Core", "REQUIRED", "CRITICAL", "Core expertise in Java (Java 17/21), Object-Oriented Programming, Multithreading."),
                new ExtractedSkillDTO("Spring Boot", "Framework", "REQUIRED", "CRITICAL", "Hands-on experience with Spring Boot, Spring Security, JPA Hibernate."),
                new ExtractedSkillDTO("React.js", "Frontend UI", "REQUIRED", "MUST_HAVE", "Strong frontend skills in React.js, JSX, Hooks, State Management."),
                new ExtractedSkillDTO("SQL & MySQL", "Database", "REQUIRED", "MUST_HAVE", "Relational database proficiency in SQL & MySQL schema design and complex queries."),
                new ExtractedSkillDTO("REST API Design", "API Architecture", "REQUIRED", "MUST_HAVE", "Production experience with REST API Design, OpenAPI/Swagger, and JSON API standards."),
                new ExtractedSkillDTO("Git & GitHub", "DevOps & Tools", "REQUIRED", "MUST_HAVE", "Version control proficiency using Git & GitHub for feature branching.")
            ),
            List.of(
                new ExtractedSkillDTO("Docker & Kubernetes", "DevOps & Cloud", "PREFERRED", "NICE_TO_HAVE", "Exposure to Docker & Kubernetes for containerized microservices deployment."),
                new ExtractedSkillDTO("System Design", "Core Architecture", "PREFERRED", "BONUS", "Experience with System Design, distributed caching (Redis), and message queues.")
            )
        ));

        // Role 3: Embedded Systems & IoT Engineer
        jobCatalog.put(3L, new LinkedInJobDTO(
            3L,
            "Embedded Systems & IoT Engineer",
            "Embedded Firmware & IoT Hardware Engineer",
            "Bosch India",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Bosch-logo.svg/1024px-Bosch-logo.svg.png",
            "Bengaluru, Karnataka, India",
            "3 days ago",
            "https://www.linkedin.com/jobs/view/3892018493",
            "Full-Time",
            "Associate (1-3 yrs)",
            "₹9.5 - ₹14 LPA",
            "About the job:\n" +
            "Bosch Mobility Solutions is looking for an Embedded Systems & IoT Engineer to write firmware for automotive microcontrollers, sensor integration, and connected vehicle hardware.\n\n" +
            "Basic Qualifications / Required Skills:\n" +
            "- Strong programming skills in C++ and Embedded C / Microcontrollers (ARM Cortex, STM32, ESP32, AVR).\n" +
            "- Hands-on knowledge of Robotics & Microprocessors, RTOS, GPIO, I2C, SPI, UART, and CAN protocols.\n" +
            "- Proficiency with Git & GitHub for embedded firmware repository management.\n\n" +
            "Preferred Qualifications / Bonus Skills:\n" +
            "- Experience with Python scripting for automated hardware test setups.\n" +
            "- Basic understanding of System Design for low-power IoT telemetry and cloud connectivity.",
            List.of(
                new ExtractedSkillDTO("C++", "Core Engineering", "REQUIRED", "CRITICAL", "Strong programming skills in C++ for embedded firmware development."),
                new ExtractedSkillDTO("Embedded C / Microcontrollers", "Firmware & Hardware", "REQUIRED", "CRITICAL", "Hands-on knowledge of Embedded C, ARM Cortex, STM32, and microcontrollers."),
                new ExtractedSkillDTO("Robotics & Microprocessors", "Hardware", "REQUIRED", "MUST_HAVE", "Experience with microprocessors, RTOS, I2C, SPI, and CAN bus protocols."),
                new ExtractedSkillDTO("Git & GitHub", "Tools", "REQUIRED", "MUST_HAVE", "Proficiency with Git & GitHub for embedded firmware repository management.")
            ),
            List.of(
                new ExtractedSkillDTO("Python", "Scripting", "PREFERRED", "NICE_TO_HAVE", "Experience with Python scripting for automated hardware test setups."),
                new ExtractedSkillDTO("System Design", "IoT Architecture", "PREFERRED", "BONUS", "Basic understanding of System Design for low-power IoT telemetry.")
            )
        ));

        // Role 4: Data Scientist & Analyst
        jobCatalog.put(4L, new LinkedInJobDTO(
            4L,
            "Data Scientist & Analyst",
            "Data Scientist - Predictive Modeling & Analytics",
            "Amazon",
            "https://cdn.iconscout.com/icon/free/png-256/free-amazon-logo-icon-download-in-svg-png-gif-file-formats--brand-social-media-pack-logos-icons-282404.png",
            "Hyderabad, Telangana, India",
            "4 days ago",
            "https://www.linkedin.com/jobs/view/3892018494",
            "Full-Time",
            "Mid Level (2-4 yrs)",
            "₹13 - ₹19 LPA",
            "About the job:\n" +
            "Amazon Customer Excellence team is seeking a Data Scientist to transform massive transactional logs into actionable predictive insights and automated ML forecasting tools.\n\n" +
            "Basic Qualifications / Required Skills:\n" +
            "- High proficiency in Python (Pandas, NumPy, Scipy, Statsmodels) for data wrangling and statistical analysis.\n" +
            "- Strong SQL & MySQL expertise for querying data warehouses, joins, window functions, and aggregation pipelines.\n" +
            "- Solid understanding of Machine Learning algorithms (Regression, Random Forest, XGBoost, Clustering).\n" +
            "- Strong Data Structures & Algorithms skills for processing high-volume datasets efficiently.\n\n" +
            "Preferred Qualifications / Bonus Skills:\n" +
            "- Experience with Deep Learning (PyTorch, TensorFlow) and NLP algorithms.\n" +
            "- Familiarity with Git & GitHub version control.",
            List.of(
                new ExtractedSkillDTO("Python", "Programming Core", "REQUIRED", "CRITICAL", "High proficiency in Python (Pandas, NumPy) for data wrangling and statistical analysis."),
                new ExtractedSkillDTO("SQL & MySQL", "Database", "REQUIRED", "CRITICAL", "Strong SQL expertise for querying data warehouses, joins, window functions."),
                new ExtractedSkillDTO("Machine Learning", "Data & AI", "REQUIRED", "MUST_HAVE", "Solid understanding of Machine Learning algorithms (Regression, Random Forest, XGBoost)."),
                new ExtractedSkillDTO("Data Structures & Algorithms", "Computer Science", "REQUIRED", "MUST_HAVE", "Strong DSA skills for processing high-volume datasets efficiently.")
            ),
            List.of(
                new ExtractedSkillDTO("Deep Learning", "Data & AI", "PREFERRED", "NICE_TO_HAVE", "Experience with Deep Learning (PyTorch, TensorFlow) and NLP algorithms."),
                new ExtractedSkillDTO("Git & GitHub", "Tools", "PREFERRED", "BONUS", "Familiarity with Git & GitHub version control.")
            )
        ));

        // Role 5: DevOps & Cloud Engineer
        jobCatalog.put(5L, new LinkedInJobDTO(
            5L,
            "DevOps & Cloud Engineer",
            "Senior Infrastructure & Cloud DevOps Engineer",
            "Red Hat / IBM",
            "https://cdn.iconscout.com/icon/free/png-256/free-redhat-logo-icon-download-in-svg-png-gif-file-formats--brand-social-media-pack-logos-icons-283186.png",
            "Pune, Maharashtra, India (Hybrid)",
            "2 days ago",
            "https://www.linkedin.com/jobs/view/3892018495",
            "Full-Time",
            "Senior Level (3-6 yrs)",
            "₹14 - ₹22 LPA",
            "About the job:\n" +
            "Red Hat OpenShift team is looking for a Cloud DevOps Engineer to automate multi-region Kubernetes clusters, CI/CD pipelines, and cloud native system architectures.\n\n" +
            "Basic Qualifications / Required Skills:\n" +
            "- Deep expertise in Docker & Kubernetes for containerization, helm charts, and cluster administration.\n" +
            "- Strong Python automation scripting for infrastructure tasks and REST integrations.\n" +
            "- Expert in Git & GitHub Actions, GitLab CI/CD, and infrastructure version control.\n" +
            "- Strong foundation in System Design, networking, security policies, and high-availability systems.\n\n" +
            "Preferred Qualifications / Bonus Skills:\n" +
            "- Experience with TerraForm, Ansible, or CloudFormation.\n" +
            "- AWS, GCP, or CKA (Certified Kubernetes Administrator) certifications.",
            List.of(
                new ExtractedSkillDTO("Docker & Kubernetes", "Cloud Infrastructure", "REQUIRED", "CRITICAL", "Deep expertise in Docker & Kubernetes for containerization, helm charts, cluster admin."),
                new ExtractedSkillDTO("Python", "Automation Scripting", "REQUIRED", "MUST_HAVE", "Strong Python automation scripting for infrastructure tasks and REST integrations."),
                new ExtractedSkillDTO("Git & GitHub", "DevOps & CI/CD", "REQUIRED", "MUST_HAVE", "Expert in Git & GitHub Actions CI/CD and infrastructure version control."),
                new ExtractedSkillDTO("System Design", "Core Architecture", "REQUIRED", "MUST_HAVE", "Strong foundation in System Design, networking, security policies.")
            ),
            List.of(
                new ExtractedSkillDTO("Spring Boot / Java", "Backend Context", "PREFERRED", "NICE_TO_HAVE", "Understanding of Java/Spring Boot microservice deployment needs."),
                new ExtractedSkillDTO("SQL & MySQL", "Database Admin", "PREFERRED", "BONUS", "Database administration and SQL backup automation skills.")
            )
        ));

        // Role 6: Civil Structural BIM & GIS Engineer
        jobCatalog.put(6L, new LinkedInJobDTO(
            6L,
            "Civil Structural BIM & GIS Engineer",
            "Civil Structural & BIM Systems Engineer",
            "L&T Construction",
            "https://upload.wikimedia.org/wikipedia/commons/e/e5/Larsen%26Toubro_logo.svg",
            "Chennai, Tamil Nadu, India",
            "5 days ago",
            "https://www.linkedin.com/jobs/view/3892018496",
            "Full-Time",
            "Mid Level (2-4 yrs)",
            "₹8.5 - ₹12 LPA",
            "About the job:\n" +
            "L&T Infrastructure is hiring a Structural BIM & GIS Engineer to build digital twin models, structural analytics tools, and spatial GIS database systems.\n\n" +
            "Basic Qualifications / Required Skills:\n" +
            "- Core expertise in System Design for large structural BIM frameworks and load-bearing calculations.\n" +
            "- SQL & MySQL proficiency for managing spatial databases and project asset inventories.\n" +
            "- Python scripting skills for automating structural analysis simulations.\n" +
            "- Git & GitHub proficiency for tracking computational engineering scripts.\n\n" +
            "Preferred Qualifications / Bonus Skills:\n" +
            "- Knowledge of Revit API, Dynamo scripting, or AutoCAD Automation.",
            List.of(
                new ExtractedSkillDTO("System Design", "Civil Engineering", "REQUIRED", "CRITICAL", "Core expertise in System Design for large structural BIM frameworks."),
                new ExtractedSkillDTO("SQL & MySQL", "Database", "REQUIRED", "MUST_HAVE", "SQL & MySQL proficiency for managing spatial databases and project asset inventories."),
                new ExtractedSkillDTO("Python", "Engineering Scripting", "REQUIRED", "MUST_HAVE", "Python scripting skills for automating structural analysis simulations."),
                new ExtractedSkillDTO("Git & GitHub", "Tools", "REQUIRED", "MUST_HAVE", "Git & GitHub proficiency for tracking computational engineering scripts.")
            ),
            List.of(
                new ExtractedSkillDTO("C++", "Computation", "PREFERRED", "NICE_TO_HAVE", "Experience with C++ for high-performance structural finite-element simulation code.")
            )
        ));

        // Role 7: Smart Infrastructure & Construction Specialist
        jobCatalog.put(7L, new LinkedInJobDTO(
            7L,
            "Smart Infrastructure & Construction Specialist",
            "Smart City & Infrastructure IoT Specialist",
            "Siemens India",
            "https://upload.wikimedia.org/wikipedia/commons/5/5f/Siemens-logo.svg",
            "Bengaluru, Karnataka, India",
            "3 days ago",
            "https://www.linkedin.com/jobs/view/3892018497",
            "Full-Time",
            "Mid Level (2-5 yrs)",
            "₹9 - ₹13.5 LPA",
            "About the job:\n" +
            "Siemens Smart Infrastructure division is seeking a Smart Infrastructure Specialist to deploy smart building IoT telemetry, energy grid monitoring, and asset lifecycle management systems.\n\n" +
            "Basic Qualifications / Required Skills:\n" +
            "- Python analytics skills for energy consumption and sensor telemetry forecasting.\n" +
            "- SQL & MySQL for relational asset management and sensor time-series databases.\n" +
            "- System Design knowledge for grid topology and smart city infrastructure.\n" +
            "- Git & GitHub version control for repository updates.\n\n" +
            "Preferred Qualifications / Bonus Skills:\n" +
            "- Embedded C / Microcontrollers sensor integration experience.",
            List.of(
                new ExtractedSkillDTO("Python", "Analytics", "REQUIRED", "CRITICAL", "Python analytics skills for energy consumption and sensor telemetry forecasting."),
                new ExtractedSkillDTO("SQL & MySQL", "Database", "REQUIRED", "MUST_HAVE", "SQL & MySQL for relational asset management and sensor time-series databases."),
                new ExtractedSkillDTO("System Design", "Smart Grid Architecture", "REQUIRED", "MUST_HAVE", "System Design knowledge for grid topology and smart city infrastructure."),
                new ExtractedSkillDTO("Git & GitHub", "Tools", "REQUIRED", "MUST_HAVE", "Git & GitHub version control for repository updates.")
            ),
            List.of(
                new ExtractedSkillDTO("Embedded C / Microcontrollers", "Hardware", "PREFERRED", "NICE_TO_HAVE", "Embedded C / Microcontrollers sensor integration experience.")
            )
        ));

        // Role 8: Robotics & CAD Automation Engineer
        jobCatalog.put(8L, new LinkedInJobDTO(
            8L,
            "Robotics & CAD Automation Engineer",
            "Robotics & Mechatronics Automation Engineer",
            "ABB Robotics",
            "https://upload.wikimedia.org/wikipedia/commons/0/00/ABB_logo.svg",
            "Bengaluru, Karnataka, India",
            "2 days ago",
            "https://www.linkedin.com/jobs/view/3892018498",
            "Full-Time",
            "Mid Level (2-4 yrs)",
            "₹10.5 - ₹15 LPA",
            "About the job:\n" +
            "ABB Robotics is hiring a Robotics & CAD Automation Engineer to develop kinematic control code, sensor feedback loops, and automated trajectory planning for industrial robotic arms.\n\n" +
            "Basic Qualifications / Required Skills:\n" +
            "- Strong C++ programming for real-time kinematic control algorithms.\n" +
            "- Embedded C / Microcontrollers for microcontroller sensor interfacing.\n" +
            "- Robotics & Microprocessors expertise (ROS / ROS2, motion planning, actuators).\n" +
            "- Git & GitHub for robotics code repositories.\n\n" +
            "Preferred Qualifications / Bonus Skills:\n" +
            "- Python scripting for CAD automation and Gazebo simulation.",
            List.of(
                new ExtractedSkillDTO("C++", "Core Programming", "REQUIRED", "CRITICAL", "Strong C++ programming for real-time kinematic control algorithms."),
                new ExtractedSkillDTO("Embedded C / Microcontrollers", "Firmware", "REQUIRED", "CRITICAL", "Embedded C / Microcontrollers for microcontroller sensor interfacing."),
                new ExtractedSkillDTO("Robotics & Microprocessors", "Robotics Core", "REQUIRED", "MUST_HAVE", "Robotics & Microprocessors expertise (ROS / ROS2, motion planning)."),
                new ExtractedSkillDTO("Git & GitHub", "Tools", "REQUIRED", "MUST_HAVE", "Git & GitHub for robotics code repositories.")
            ),
            List.of(
                new ExtractedSkillDTO("Python", "Simulation Scripting", "PREFERRED", "NICE_TO_HAVE", "Python scripting for CAD automation and Gazebo simulation.")
            )
        ));
    }

    public LinkedInJobDTO getJobByRoleId(Long roleId) {
        if (jobCatalog.containsKey(roleId)) {
            return jobCatalog.get(roleId);
        }
        // Default fallback if roleId not found in catalog
        return createFallbackJobDTO(roleId, "Custom Selected Role");
    }

    public LinkedInJobDTO getJobByRoleName(String roleName) {
        if (roleName != null) {
            String lower = roleName.toLowerCase();
            for (LinkedInJobDTO job : jobCatalog.values()) {
                if (job.getRoleName().toLowerCase().contains(lower) || lower.contains(job.getRoleName().toLowerCase())) {
                    return job;
                }
            }
        }
        return createFallbackJobDTO(999L, roleName != null ? roleName : "Specialist Career Role");
    }

    public LinkedInJobDTO extractSkillsFromCustomJob(String jobUrl, String text) {
        String jobDescriptionText = text != null ? text : "";
        List<ExtractedSkillDTO> required = new ArrayList<>();
        List<ExtractedSkillDTO> preferred = new ArrayList<>();

        Map<String, String> skillCatalog = new LinkedHashMap<>();
        skillCatalog.put("Java", "Programming Core");
        skillCatalog.put("Python", "Programming Core");
        skillCatalog.put("C++", "Programming Core");
        skillCatalog.put("Spring Boot", "Framework");
        skillCatalog.put("React.js", "Frontend UI");
        skillCatalog.put("SQL & MySQL", "Database");
        skillCatalog.put("Machine Learning", "Data & AI");
        skillCatalog.put("Deep Learning", "Data & AI");
        skillCatalog.put("Docker & Kubernetes", "DevOps & Cloud");
        skillCatalog.put("Git & GitHub", "Tools & Version Control");
        skillCatalog.put("Data Structures & Algorithms", "Computer Science");
        skillCatalog.put("REST API Design", "API Architecture");
        skillCatalog.put("System Design", "Core Architecture");
        skillCatalog.put("Embedded C / Microcontrollers", "Firmware & Hardware");
        skillCatalog.put("Robotics & Microprocessors", "Robotics Core");

        // Split text by lines and sentences
        String[] sentences = jobDescriptionText.split("(?<=[.!?\\n])\\s+");
        boolean isPreferredSection = false;

        for (String rawSentence : sentences) {
            String sentence = rawSentence.trim();
            if (sentence.isEmpty()) continue;
            String lower = sentence.toLowerCase();

            if (lower.contains("preferred") || lower.contains("nice to have") || lower.contains("bonus") || lower.contains("plus") || lower.contains("desired")) {
                isPreferredSection = true;
            } else if (lower.contains("required") || lower.contains("basic qualification") || lower.contains("must have") || lower.contains("minimum qualification")) {
                isPreferredSection = false;
            }

            for (Map.Entry<String, String> entry : skillCatalog.entrySet()) {
                String skillName = entry.getKey();
                String category = entry.getValue();

                boolean matched = false;
                if (skillName.equals("SQL & MySQL")) {
                    matched = lower.contains("sql") || lower.contains("mysql");
                } else if (skillName.equals("React.js")) {
                    matched = lower.contains("react");
                } else if (skillName.equals("Git & GitHub")) {
                    matched = lower.contains("git") || lower.contains("github");
                } else if (skillName.equals("Docker & Kubernetes")) {
                    matched = lower.contains("docker") || lower.contains("kubernetes") || lower.contains("k8s");
                } else if (skillName.equals("Embedded C / Microcontrollers")) {
                    matched = lower.contains("embedded") || lower.contains("microcontroller") || lower.contains("stm32") || lower.contains("arm");
                } else if (skillName.equals("Robotics & Microprocessors")) {
                    matched = lower.contains("robotics") || lower.contains("ros") || lower.contains("microprocessor");
                } else {
                    matched = lower.contains(skillName.toLowerCase());
                }

                if (matched) {
                    ExtractedSkillDTO skill = new ExtractedSkillDTO(
                        skillName,
                        category,
                        isPreferredSection ? "PREFERRED" : "REQUIRED",
                        isPreferredSection ? "NICE_TO_HAVE" : "MUST_HAVE",
                        sentence
                    );
                    if (isPreferredSection) {
                        if (preferred.stream().noneMatch(s -> s.getName().equalsIgnoreCase(skillName))) {
                            preferred.add(skill);
                        }
                    } else {
                        if (required.stream().noneMatch(s -> s.getName().equalsIgnoreCase(skillName))) {
                            required.add(skill);
                        }
                    }
                }
            }
        }

        // If no specific skills were found, provide reasonable defaults
        if (required.isEmpty() && preferred.isEmpty()) {
            required.add(new ExtractedSkillDTO("Python", "Programming Core", "REQUIRED", "MUST_HAVE", "Core programming competency extracted from posting requirements."));
            required.add(new ExtractedSkillDTO("SQL & MySQL", "Database", "REQUIRED", "MUST_HAVE", "Data storage and relational query skill requirement."));
            preferred.add(new ExtractedSkillDTO("Git & GitHub", "Tools", "PREFERRED", "NICE_TO_HAVE", "Version control and collaborative workflow experience."));
        }

        LinkedInJobDTO dto = new LinkedInJobDTO();
        dto.setRoleId(0L);
        dto.setRoleName("Extracted LinkedIn Posting");
        dto.setJobTitle("LinkedIn Career Opportunity");
        dto.setCompany("LinkedIn Recruiter / Partner");
        dto.setCompanyLogoUrl("https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png");
        dto.setLocation("Remote / Hybrid");
        dto.setPostedDate("Recently Posted");
        dto.setLinkedInUrl(jobUrl != null && !jobUrl.isBlank() ? jobUrl : "https://www.linkedin.com/jobs");
        dto.setJobType("Full-Time");
        dto.setExperienceLevel("Dynamic Experience Requirement");
        dto.setSalaryRange("Market Standard Competitive");
        dto.setFullDescription(jobDescriptionText);
        dto.setRequiredSkills(required);
        dto.setPreferredSkills(preferred);
        return dto;
    }

    private LinkedInJobDTO createFallbackJobDTO(Long roleId, String roleName) {
        return new LinkedInJobDTO(
            roleId,
            roleName,
            roleName + " - Tech Lead / Specialist",
            "Global Technology Leader",
            "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png",
            "Bengaluru / Remote",
            "Just posted",
            "https://www.linkedin.com/jobs/search/?keywords=" + roleName.replace(" ", "%20"),
            "Full-Time",
            "Entry - Mid Level (1-3 yrs)",
            "₹10 - ₹16 LPA",
            "About the job:\n" +
            "Seeking a high-performing " + roleName + " to join our global engineering team. The ideal candidate will design enterprise solutions, collaborate on core repositories, and deliver production features.\n\n" +
            "Basic Qualifications / Required Skills:\n" +
            "- Strong programming fundamentals and domain knowledge in " + roleName + ".\n" +
            "- Proficiency in SQL & MySQL databases and data analytics.\n" +
            "- Knowledge of version control with Git & GitHub.\n\n" +
            "Preferred Qualifications / Bonus Skills:\n" +
            "- Experience with Cloud technologies (AWS / Azure) and Docker containerization.",
            List.of(
                new ExtractedSkillDTO("Core Programming", "Technical Core", "REQUIRED", "CRITICAL", "Domain programming expertise in " + roleName + "."),
                new ExtractedSkillDTO("SQL & MySQL", "Database", "REQUIRED", "MUST_HAVE", "Proficiency in database querying and structured storage."),
                new ExtractedSkillDTO("Git & GitHub", "Tools", "REQUIRED", "MUST_HAVE", "Version control experience with Git & GitHub.")
            ),
            List.of(
                new ExtractedSkillDTO("Docker & Kubernetes", "Cloud Infrastructure", "PREFERRED", "NICE_TO_HAVE", "Exposure to modern cloud container orchestration.")
            )
        );
    }
}
