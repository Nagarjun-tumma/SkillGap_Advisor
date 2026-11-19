# 🚀 AI-Powered Career & Skill Gap Advisor with Placement Readiness Engine

[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203.x-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![MySQL](https://img.shields.io/badge/Database-MySQL%208.0-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![JWT](https://img.shields.io/badge/Security-Spring%20Security%20%2B%20JWT-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **MGM's College of Engineering, Nanded** &bull; **Department of Computer Science & Engineering**  
> **Final Year B.Tech Capstone Project (Academic Year 2026–2027)**

---

## 📌 Project Overview

The **AI Career & Skill Gap Advisor** is an intelligent, full-stack career acceleration platform engineered to bridge the disconnect between academic curricula and actual hiring requirements of Tier-1 product companies (*Google, Microsoft, Amazon*) and enterprise IT recruiters (*TCS Digital, Infosys DSE*).

The platform quantifies missing skill gaps into an exact **Placement Readiness Score (%)**, delivers an interactive **4-Year Sequential Milestone Roadmap**, routes students to hands-on problem solving on **LeetCode & HackerRank**, evaluates submitted score proofs/screenshots using an **automated AI evaluation engine**, and maintains daily practice consistency via **post-login habit check-ins**.

---

## ✨ Key Modules & Features

### 1. 🤖 Automated Skill Gap & Weighted Readiness Scoring Engine
* Compares candidate skills against live hiring matrices for roles like **Full Stack Java Developer**, **AI/ML Engineer**, **DevOps & Cloud Specialist**, and **Data Scientist**.
* Computes an authentic **Placement Readiness Score (0–100%)** using weighted algorithmic logic.
* Separates skills into **Acquired & Verified Skills** vs. **High-Priority Skill Gaps**.

### 2. 🗺️ 4-Year Milestone Career Roadmap
* Structured pedagogical loop across 4 distinct stages:
  * **Stage 1 (Learn):** Curated video tutorials and official documentation.
  * **Stage 2 (Practice):** Hands-on problem solving on LeetCode & HackerRank with company interview archives.
  * **Stage 3 (Assess):** Deep algorithmic problem solver with time/space complexity analysis ($O(1)$, $O(N)$, $O(\log N)$).
  * **Stage 4 (Milestone Completion):** Confetti celebration, comprehension survey, and skill certification.

### 3. 💻 Hands-on Coding Practice Hub (LeetCode & HackerRank)
* Direct problem sets for **LeetCode 75 Core Study Plan**, **Top Interview 150**, and **HackerRank Language Domains**.
* **Proof Submission Modal:** Students enter problems solved, accuracy rate, score, and upload proof screenshots (auto-compressed via HTML Canvas).
* **Automated AI Analysis:** Categorizes difficulty breakdown (Easy, Medium, Hard), calculates verified readiness boost (e.g. `+18% Verified Mastery`), and awards the `🏆 Verified Hands-on Problem Solver` badge.

### 4. 🔔 Post-Login Habit Consistency Check-in
* Prompts students on login: *"Did you visit LeetCode or HackerRank and complete your practice session today?"*
* If **Yes** &rarr; opens score & screenshot submission directly.
* If **Not Yet** &rarr; provides 1-click launch buttons to LeetCode 75 or HackerRank tracks.

### 5. 📊 Real-Time Analytics & Authentic Reviews Showcase
* **Comprehension Donut Chart:** High-impact visual distribution (84% Deep Understanding / Interview Ready, 13% Moderate Grasp, 3% Foundational).
* **Placement Sentiment Bar Graph:** Reflects candidate feelings (72% Confident, 20% Motivated, 92%+ Placement Confidence).
* **Campus Social Video Wall:** Features authentic video reels and LinkedIn/YouTube/Instagram testimonials from students (including verified reviews from MGM COE Nanded).

### 6. 🔐 6-Digit Email OTP Authentication
* Authentic student onboarding with **JavaMailSender** SMTP 6-digit numeric OTP verification and stateless **Spring Security 6 JWT** token authorization.

---

## 🛠️ System Architecture & Tech Stack

```
AI-Career-Skill-Gap-Advisor/
│
├── Frontend/                 # React 18 + Vite Single Page Application
│   ├── src/
│   │   ├── components/       # Dashboards, Roadmaps, Modals, Showcases
│   │   ├── context/          # AuthContext (JWT, session, user state)
│   │   └── utils/            # practicePlatformService, feedbackService, virtualFeedbackService
│   └── package.json
│
├── Backend/                  # Spring Boot 3.x REST API Engine
│   ├── src/main/java/com/careeradvisor/
│   │   ├── controller/       # AuthController, StudentSkillController, LinkedInJobController
│   │   ├── entity/           # User, Skill, StudentSkill, CareerRole, OtpToken
│   │   ├── repository/       # JPA Repositories
│   │   ├── security/         # JwtTokenProvider, SecurityConfig
│   │   └── service/          # AuthService, EmailOtpService, LinkedInJobService
│   └── pom.xml
│
├── database/                 # MySQL Database Schemas & Initial Seed Data
│   └── schema.sql
│
└── Docs/                     # Academic Reports, Summary PDFs & Architecture Guides
```

---

## 🚀 Getting Started Locally

### Prerequisites
* **Node.js**: v18+ and **npm**
* **Java**: JDK 17+
* **Maven**: v3.8+ (or included `mvnw`)
* **MySQL**: Server v8.0+ running on port `3306`

---

### Step 1: Database Setup
1. Open your MySQL client (Workbench, phpMyAdmin, or CLI).
2. Create database and import schema:
```sql
CREATE DATABASE career_advisor;
USE career_advisor;
SOURCE database/schema.sql;
```

---

### Step 2: Backend Setup (Spring Boot)
1. Navigate to the Backend folder:
```bash
cd Backend
```
2. Configure database credentials in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/career_advisor?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_password
```
3. Build and run the Spring Boot server:
```bash
mvn clean spring-boot:run
```
*The backend API will start on `http://localhost:8080`.*

---

### Step 3: Frontend Setup (React + Vite)
1. Open a new terminal and navigate to the Frontend directory:
```bash
cd Frontend
```
2. Install dependencies:
```bash
npm install
```
3. Start development server:
```bash
npm run dev
```
*The web app will open at `http://localhost:5173`.*

---

## ☁️ Deployment Guide

| Component | Recommended Free / Affordable Cloud Platforms |
|---|---|
| **Frontend** | [Vercel](https://vercel.com/) / [Netlify](https://www.netlify.com/) (Deploy `Frontend/` folder with Vite preset) |
| **Backend** | [Render](https://render.com/) / [Railway](https://railway.app/) / [AWS Elastic Beanstalk](https://aws.amazon.com/) (Docker / Maven JAR) |
| **Database** | [Aiven MySQL](https://aiven.io/) / [Railway MySQL](https://railway.app/) / [Clever Cloud](https://www.clever-cloud.com/) |

---

## 👥 Authors & Academic Credits
* **Department of Computer Science & Engineering**
* **MGM's College of Engineering, Nanded**
* Developed for B.Tech Final Year Capstone Project (2026–2027).

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).

