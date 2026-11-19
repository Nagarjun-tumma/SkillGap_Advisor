# AI-Based Career and Skill Gap Advisor for Engineering Students

## System Architecture & File Structure Overview

### Tech Stack
- **Frontend**: React 18 + Vite + Tailwind CSS v4 + Lucide Icons + Canvas Confetti
- **Backend**: Java 17 + Spring Boot 3 + Spring Security + Spring Data JPA + JavaMailSender + JJWT
- **Database**: MySQL (relational database schema & seed scripts)

---

### Project File Structure

```
d:\AI-Career-Skill-Gap-Advisor\
├── Frontend/                             # React (Vite) User Interface
│   ├── src/
│   │   ├── components/                   # Reusable UI Components
│   │   │   ├── Navbar.jsx                # Responsive Top Navigation & Auth state indicator
│   │   │   ├── Footer.jsx                # Footer with engineering department links & tech stack badges
│   │   │   ├── AuthModal.jsx             # Tabbed Login / Sign Up modal with OTP validation & strength meter
│   │   │   ├── LandingPage.jsx           # Hero page, branch explorer (CSE, AIDS, ECE, EEE, Mech), live preview
│   │   │   ├── StudentDashboard.jsx      # Skill gap matrix, placement readiness gauge, study plan, skill manager
│   │   │   └── CareerRoadmap.jsx         # Step-by-step 4-phase career path visualizer
│   │   ├── context/
│   │   │   └── AuthContext.jsx           # Authentication state manager (Login, Register, OTP, Local Storage)
│   │   ├── App.jsx                       # Main Routing Application
│   │   ├── main.jsx                      # React Root entry point
│   │   └── index.css                     # Tailwind CSS & Glassmorphism design tokens
│   ├── package.json
│   └── vite.config.js                    # Vite configuration with @tailwindcss/vite plugin & backend proxy
│
├── Backend/                              # Java Spring Boot 3 Application
│   ├── pom.xml                           # Maven dependencies (Spring Web, Security, JPA, MySQL, Mail, JWT)
│   ├── .mvn/wrapper/
│   │   └── maven-wrapper.properties
│   └── src/main/
│       ├── java/com/careeradvisor/
│       │   ├── CareerAdvisorApplication.java
│       │   ├── controller/
│       │   │   ├── AuthController.java   # /api/auth/check-email, /api/auth/send-otp, /api/auth/verify-otp, register, login
│       │   │   └── MasterDataController.java # /api/master/branches, /api/master/roles, /api/master/skills
│       │   ├── dto/
│       │   │   ├── LoginRequest.java, RegisterRequest.java, OtpRequest.java, VerifyOtpRequest.java, JwtResponse.java, ApiResponse.java
│       │   ├── entity/
│       │   │   ├── User.java, OtpToken.java, CareerRole.java, Skill.java, StudentSkill.java
│       │   ├── repository/
│       │   │   ├── UserRepository.java, OtpTokenRepository.java, CareerRoleRepository.java, SkillRepository.java
│       │   ├── security/
│       │   │   ├── JwtTokenProvider.java, SecurityConfig.java
│       │   └── service/
│       │       ├── AuthService.java, EmailOtpService.java
│       └── resources/
│           └── application.properties     # Server port, MySQL connection, JWT Secret, Mail settings
│
├── database/                             # Database SQL Scripts
│   ├── schema.sql                        # MySQL DDL (users, otp_tokens, career_roles, skills, student_skills, learning_resources)
│   └── data.sql                          # MySQL Seed data for engineering branches, roles, skills & roadmap matrix
│
└── Docs/                                 # Documentation
    └── Project_Architecture_Overview.md  # System Architecture Overview
```

---

### Key Features Implemented

1. **Email OTP Verification Flow**:
   - 6-Digit numerical OTP generation with 5-minute expiration window.
   - Real-time check if an email is already registered (`/api/auth/check-email`).
   - OTP delivery via JavaMailSender (with console logging fallback for development).
   - Auto-advancing 6-digit numeric input UI with 60-second countdown timer and resend capability.

2. **Professional Login & Sign Up UI**:
   - Glassmorphism design with responsive tab switcher.
   - Password strength meter (Weak, Medium, Strong indicators).
   - Branch Selection: CSE, AIDS, ECE, EEE, Mechanical, Civil.
   - Academic Year Selection: 1st Year, 2nd Year, 3rd Year, 4th Year.
   - Celebration confetti animation upon successful OTP signup.

3. **Student Career & Skill Gap Dashboard**:
   - **Placement Readiness Radial Gauge**: Live score calculation based on acquired skills vs target role requirements.
   - **Skill Gap Matrix**: Categorized breakdown into Acquired Skills vs Missing Critical Skill Gaps.
   - **Interactive Skill Assessor Drawer**: Allows students to add/remove skills, set proficiency (Beginner, Intermediate, Advanced), and recalculate readiness score in real-time.
   - **Personalized AI Recommendation Hub**: Tailored learning resources (Courses, Projects, Certifications) mapped to missing skills.
   - **4-Year Engineering Milestone Roadmap**: Year 1 to Year 4 timeline for the student's chosen career role.
