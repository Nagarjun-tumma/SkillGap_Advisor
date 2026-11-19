import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Brain, CheckCircle2, AlertTriangle, Sparkles, Plus, Edit2, ShieldCheck, ArrowRight, Target, Award, BookOpen, ExternalLink, PlayCircle, Code, Layers, TrendingUp, Building2, X, Check, Search, Flame, Upload, Bell, Video } from 'lucide-react';
import { LinkedInJobSkillsCard } from './LinkedInJobSkillsCard';
import { CompanySkillVerificationModal } from './CompanySkillVerificationModal';
import { StudentStreakCard } from './StudentStreakCard';
import { PracticePlatformModal } from './PracticePlatformModal';
import { PostLoginPracticeReminderModal } from './PostLoginPracticeReminderModal';
import { VirtualFeedbackModal } from './VirtualFeedbackModal';
import { practicePlatformService } from '../utils/practicePlatformService';

const DREAM_COMPANIES_CATALOG = [
  { name: 'Google', tier: 'MAANG', category: 'Product' },
  { name: 'Microsoft', tier: 'MAANG', category: 'Product' },
  { name: 'Amazon', tier: 'MAANG', category: 'Product' },
  { name: 'Meta', tier: 'MAANG', category: 'Product' },
  { name: 'Apple', tier: 'MAANG', category: 'Product' },
  { name: 'Netflix', tier: 'MAANG', category: 'Product' },
  { name: 'Uber', tier: 'Tier-1', category: 'Product' },
  { name: 'Adobe', tier: 'Tier-1', category: 'Product' },
  { name: 'NVIDIA', tier: 'Core/AI', category: 'Hardware & AI' },
  { name: 'Goldman Sachs', tier: 'FinTech', category: 'Banking' },
  { name: 'J.P. Morgan', tier: 'FinTech', category: 'Banking' },
  { name: 'Morgan Stanley', tier: 'FinTech', category: 'Banking' },
  { name: 'Qualcomm', tier: 'Core', category: 'Semiconductor' },
  { name: 'Intel', tier: 'Core', category: 'Semiconductor' },
  { name: 'Bosch', tier: 'Core', category: 'IoT & Auto' },
  { name: 'Siemens', tier: 'Core', category: 'Automation' },
  { name: 'Larsen & Toubro', tier: 'Core', category: 'Engineering' },
  { name: 'Flipkart', tier: 'Unicorn', category: 'E-Commerce' },
  { name: 'Zomato', tier: 'Unicorn', category: 'Consumer Tech' },
  { name: 'Swiggy', tier: 'Unicorn', category: 'Consumer Tech' },
  { name: 'Razorpay', tier: 'Unicorn', category: 'FinTech' },
  { name: 'TCS', tier: 'IT Titan', category: 'Global Services' },
  { name: 'Infosys', tier: 'IT Titan', category: 'Global Services' },
  { name: 'Accenture', tier: 'Consulting', category: 'Tech Consulting' },
  { name: 'Wipro', tier: 'IT Titan', category: 'Global Services' },
  { name: 'Cognizant', tier: 'IT Titan', category: 'Global Services' }
];

export const StudentDashboard = ({ onNavigateRoadmap, onNavigateProgress }) => {
  const { user, updateUserTargetRole, updateUserSkills, updateUserTargetCompanies } = useAuth();

  const careerRoles = [
    { id: 1, name: 'AI & Machine Learning Engineer', category: 'Data & AI', avgSalary: '₹14.5 LPA', demand: 'CRITICAL', requiredSkills: ['Python', 'Machine Learning', 'Deep Learning', 'Data Structures & Algorithms', 'SQL & MySQL'] },
    { id: 2, name: 'Full Stack Java Developer', category: 'Software', avgSalary: '₹11.0 LPA', demand: 'VERY_HIGH', requiredSkills: ['Java', 'Spring Boot', 'React.js', 'SQL & MySQL', 'REST API Design', 'Git & GitHub'] },
    { id: 3, name: 'Embedded Systems & IoT Engineer', category: 'Hardware & IoT', avgSalary: '₹9.5 LPA', demand: 'HIGH', requiredSkills: ['C++', 'Embedded C / Microcontrollers', 'Robotics & Microprocessors', 'Git & GitHub'] },
    { id: 4, name: 'Data Scientist & Analyst', category: 'Data & AI', avgSalary: '₹12.0 LPA', demand: 'VERY_HIGH', requiredSkills: ['Python', 'SQL & MySQL', 'Machine Learning', 'Data Structures & Algorithms'] },
    { id: 5, name: 'DevOps & Cloud Engineer', category: 'Software', avgSalary: '₹13.0 LPA', demand: 'CRITICAL', requiredSkills: ['Docker & Kubernetes', 'Python', 'Git & GitHub', 'System Design'] },
    { id: 6, name: 'Civil Structural BIM & GIS Engineer', category: 'Civil Engineering', avgSalary: '₹8.8 LPA', demand: 'VERY_HIGH', requiredSkills: ['System Design', 'SQL & MySQL', 'Python', 'Git & GitHub'] },
    { id: 7, name: 'Smart Infrastructure & Construction Specialist', category: 'Civil & Smart Cities', avgSalary: '₹9.2 LPA', demand: 'HIGH', requiredSkills: ['Python', 'SQL & MySQL', 'System Design', 'Git & GitHub'] },
    { id: 8, name: 'Robotics & CAD Automation Engineer', category: 'Mechanical & Robotics', avgSalary: '₹10.5 LPA', demand: 'VERY_HIGH', requiredSkills: ['C++', 'Embedded C / Microcontrollers', 'Robotics & Microprocessors', 'Git & GitHub'] },
  ];

  const allAvailableSkills = [
    { id: 1, name: 'Java', category: 'Programming' },
    { id: 2, name: 'Python', category: 'Programming' },
    { id: 3, name: 'C++', category: 'Programming' },
    { id: 4, name: 'React.js', category: 'Framework' },
    { id: 5, name: 'Spring Boot', category: 'Framework' },
    { id: 6, name: 'SQL & MySQL', category: 'Database' },
    { id: 7, name: 'Machine Learning', category: 'Data & AI' },
    { id: 8, name: 'Deep Learning', category: 'Data & AI' },
    { id: 9, name: 'Embedded C / Microcontrollers', category: 'Core Technical' },
    { id: 10, name: 'Docker & Kubernetes', category: 'Tools & DevOps' },
    { id: 11, name: 'Git & GitHub', category: 'Tools & DevOps' },
    { id: 12, name: 'Data Structures & Algorithms', category: 'Programming' },
    { id: 13, name: 'System Design', category: 'Core Technical' },
    { id: 14, name: 'REST API Design', category: 'Framework' },
  ];

  const skillLearningResources = {
    'Java': {
      title: 'Java Enterprise Fundamentals & OOPs',
      steps: [
        'Understand JVM Architecture, Memory Management & Garbage Collection',
        'Master Core OOP Principles: Encapsulation, Inheritance, Polymorphism, Abstraction',
        'Practice Exception Handling, Collections Framework (List, Map, Set) & Streams API',
        'Learn Multithreading, Concurrency Utilities & File I/O'
      ],
      resources: [
        { name: 'Java Programming Full Course (FreeCodeCamp)', type: 'Video Course', link: 'https://www.youtube.com/watch?v=A74TOX803D0', provider: 'YouTube / freeCodeCamp' },
        { name: 'Oracle Official Java Documentation & Tutorials', type: 'Official Docs', link: 'https://docs.oracle.com/en/java/', provider: 'Oracle Docs' },
        { name: 'Java Problem Solving & Algorithmic Practice', type: 'Practice Portal', link: 'https://www.hackerrank.com/domains/java', provider: 'HackerRank' }
      ]
    },
    'Spring Boot': {
      title: 'Spring Boot 3 & Enterprise Backend Architecture',
      steps: [
        'Understand Inversion of Control (IoC), Dependency Injection & Spring Beans',
        'Build RESTful APIs with @RestController, @GetMapping, @PostMapping & DTOs',
        'Integrate Spring Data JPA & Hibernate ORM with MySQL relational database',
        'Implement Spring Security 6, JWT Authentication & Email OTP Services'
      ],
      resources: [
        { name: 'Spring Boot 3 Masterclass Full Course', type: 'Video Course', link: 'https://www.youtube.com/results?search_query=spring+boot+3+full+course', provider: 'YouTube / Amigoscode' },
        { name: 'Spring Boot Official Guides & Reference Documentation', type: 'Official Docs', link: 'https://spring.io/guides', provider: 'Spring.io' },
        { name: 'Building REST Services with Spring Boot', type: 'Interactive Guide', link: 'https://spring.io/guides/gs/rest-service/', provider: 'Spring Guides' }
      ]
    },
    'React.js': {
      title: 'Modern React 18 & Frontend Architecture',
      steps: [
        'Master JSX, Components, Props & State Management with useState / useEffect',
        'Build custom Hooks & Context API for Global Auth State Management',
        'Integrate REST APIs with Axios / Fetch API & Handle Loading / Errors',
        'Style interfaces using Tailwind CSS / Custom CSS & UI Component Libraries'
      ],
      resources: [
        { name: 'React Full Course for Beginners (FreeCodeCamp)', type: 'Video Course', link: 'https://www.youtube.com/watch?v=bMknfKXIFA8', provider: 'YouTube / freeCodeCamp' },
        { name: 'Official React Documentation & Interactive Tutorials', type: 'Official Docs', link: 'https://react.dev/learn', provider: 'React.dev' },
        { name: 'React 19 & Frontend Project Showcases', type: 'Projects', link: 'https://github.com/topics/react', provider: 'GitHub' }
      ]
    },
    'SQL & MySQL': {
      title: 'Relational Database Design & SQL Query Optimization',
      steps: [
        'Master DDL & DML: CREATE, ALTER, INSERT, UPDATE, DELETE',
        'Write complex queries using INNER JOIN, LEFT JOIN, GROUP BY & Aggregates',
        'Design Normalized Schemas (1NF, 2NF, 3NF) & Indexing Strategies',
        'Understand Transactions (ACID properties), Stored Procedures & Triggers'
      ],
      resources: [
        { name: 'SQL & Database Design Tutorial (FreeCodeCamp)', type: 'Video Course', link: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', provider: 'YouTube' },
        { name: 'MySQL Official Reference Manual & Syntax Guide', type: 'Official Docs', link: 'https://dev.mysql.com/doc/refman/8.0/en/', provider: 'MySQL Docs' },
        { name: 'SQL Practice Problems & Query Challenges', type: 'Practice Portal', link: 'https://leetcode.com/problemset/database/', provider: 'LeetCode' }
      ]
    },
    'REST API Design': {
      title: 'RESTful API Principles & OpenAPI Specification',
      steps: [
        'Understand HTTP Verbs (GET, POST, PUT, DELETE, PATCH) & Status Codes',
        'Design Clean Resource URI Endpoints & Request/Response JSON Payloads',
        'Implement Authentication (JWT / Bearer Tokens), Rate Limiting & Validation',
        'Document APIs with Swagger / OpenAPI 3.0 & Postman Testing'
      ],
      resources: [
        { name: 'RESTful API Design Best Practices Guide', type: 'Guide', link: 'https://restfulapi.net/', provider: 'RESTfulAPI.net' },
        { name: 'Postman API Fundamentals Student Expert Course', type: 'Course', link: 'https://www.postman.com/student-program/student-expert/', provider: 'Postman Academy' }
      ]
    },
    'Git & GitHub': {
      title: 'Version Control & Collaborative Development',
      steps: [
        'Master Git commands: init, clone, status, add, commit, push, pull',
        'Work with Git Branches: checkout, merge, rebase & resolve merge conflicts',
        'Understand GitHub Pull Requests, Code Reviews & Issues Workflow',
        'Automate builds & deployments using GitHub Actions CI/CD'
      ],
      resources: [
        { name: 'Git and GitHub Complete Crash Course', type: 'Video Course', link: 'https://www.youtube.com/watch?v=RGOj5yH7evk', provider: 'YouTube' },
        { name: 'Git Official Book (Pro Git)', type: 'Official Docs', link: 'https://git-scm.com/book/en/v2', provider: 'Git-SCM' }
      ]
    },
    'Python': {
      title: 'Python Core & Data Science Ecosystem',
      steps: [
        'Master Python Syntax, Data Structures (Lists, Dicts, Sets, Tuples)',
        'Understand Functional Programming: Lambda, Map, Filter, List Comprehensions',
        'Master Object-Oriented Programming & File / JSON Processing',
        'Work with NumPy, Pandas & Matplotlib for Data Analysis'
      ],
      resources: [
        { name: 'Python for Beginners Full Course', type: 'Video Course', link: 'https://www.youtube.com/watch?v=rfscVS0vtbw', provider: 'YouTube / freeCodeCamp' },
        { name: 'Official Python Documentation & Standard Library', type: 'Official Docs', link: 'https://docs.python.org/3/', provider: 'Python Docs' }
      ]
    },
    'Machine Learning': {
      title: 'Machine Learning Algorithms & Model Training',
      steps: [
        'Understand Supervised vs Unsupervised Learning & Feature Engineering',
        'Master Scikit-Learn: Linear Regression, Logistic Regression, Decision Trees',
        'Understand Model Evaluation: Precision, Recall, F1-Score, ROC-AUC',
        'Practice Cross-Validation, Hyperparameter Tuning (GridSearchCV)'
      ],
      resources: [
        { name: 'Machine Learning Specialization by Andrew Ng', type: 'Course', link: 'https://www.coursera.org/specializations/machine-learning-introduction', provider: 'Coursera' },
        { name: 'Scikit-Learn Official User Guide & Tutorials', type: 'Official Docs', link: 'https://scikit-learn.org/stable/user_guide.html', provider: 'Scikit-Learn' }
      ]
    },
    'Deep Learning': {
      title: 'Deep Learning & Neural Networks',
      steps: [
        'Understand Artificial Neural Networks (ANNs), Backpropagation & Loss Functions',
        'Build CNNs for Computer Vision & RNNs/LSTMs for Sequential Data',
        'Master PyTorch / TensorFlow Frameworks & Model Training Pipelines',
        'Explore Modern Transformers, Fine-Tuning & Generative AI'
      ],
      resources: [
        { name: 'Deep Learning Specialization by DeepLearning.AI', type: 'Course', link: 'https://www.deeplearning.ai/courses/deep-learning-specialization/', provider: 'DeepLearning.AI' },
        { name: 'PyTorch Tutorials & Official Guides', type: 'Official Docs', link: 'https://pytorch.org/tutorials/', provider: 'PyTorch.org' }
      ]
    },
    'Docker & Kubernetes': {
      title: 'Containerization & Cloud Orchestration',
      steps: [
        'Write Dockerfiles, Build Container Images & Manage Docker Containers',
        'Master Docker Compose for Multi-Container Microservices',
        'Understand Kubernetes Architecture: Pods, Deployments, Services & Ingress',
        'Deploy Clusters on Cloud Platforms (AWS EKS, GKE, Azure AKS)'
      ],
      resources: [
        { name: 'Docker and Kubernetes Full Course for Beginners', type: 'Video Course', link: 'https://www.youtube.com/watch?v=X48VuDVv0do', provider: 'YouTube / freeCodeCamp' },
        { name: 'Docker Official Documentation & Hands-On Labs', type: 'Official Docs', link: 'https://docs.docker.com/get-started/', provider: 'Docker Docs' }
      ]
    },
    'Data Structures & Algorithms': {
      title: 'Data Structures & Algorithmic Problem Solving',
      steps: [
        'Master Time & Space Complexity Analysis (Big-O Notation)',
        'Arrays, Linked Lists, Stacks, Queues, Hash Tables & Trees',
        'Sorting, Searching, Recursion & Backtracking Algorithms',
        'Dynamic Programming & Graph Traversal (BFS / DFS)'
      ],
      resources: [
        { name: 'Data Structures and Algorithms Course (FreeCodeCamp)', type: 'Video Course', link: 'https://www.youtube.com/watch?v=8hly31xKLI0', provider: 'YouTube' },
        { name: 'LeetCode 75 & Blind 75 Interview Roadmap', type: 'Practice Portal', link: 'https://leetcode.com/studyplan/leetcode-75/', provider: 'LeetCode' }
      ]
    }
  };

  // Target Role from registration / context
  const [selectedRoleId, setSelectedRoleId] = useState(user?.targetRoleId || 2);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [selectedSkillForResource, setSelectedSkillForResource] = useState(null);
  const [skillFilterTab, setSkillFilterTab] = useState('role'); // 'role' | 'all'
  const [verifyingSkill, setVerifyingSkill] = useState(null);
  const [streakDays, setStreakDays] = useState(1);

  // Dream companies state
  const [dashboardCompanies, setDashboardCompanies] = useState(user?.targetCompanies || []);
  const [modalCompanySearch, setModalCompanySearch] = useState('');
  const [modalCustomCompany, setModalCustomCompany] = useState('');

  // Practice Platform (LeetCode / HackerRank) state
  const [isPracticeModalOpen, setIsPracticeModalOpen] = useState(false);
  const [practiceModalSkill, setPracticeModalSkill] = useState('Data Structures & Algorithms');
  const [practiceModalPlatform, setPracticeModalPlatform] = useState('leetcode');
  const [recentPracticeSubmissions, setRecentPracticeSubmissions] = useState(practicePlatformService.getSubmissions(user?.email));
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isVirtualModalOpen, setIsVirtualModalOpen] = useState(false);

  // User acquired skills state
  const [userSkills, setUserSkills] = useState(user?.acquiredSkills || []);

  useEffect(() => {
    if (user?.acquiredSkills) {
      setUserSkills(user.acquiredSkills);
    }
    if (user?.targetRoleId) {
      setSelectedRoleId(user.targetRoleId);
    }
    if (user?.targetCompanies && Array.isArray(user.targetCompanies)) {
      setDashboardCompanies(user.targetCompanies);
    }

    const handlePracticeUpdate = () => {
      setRecentPracticeSubmissions(practicePlatformService.getSubmissions(user?.email));
    };

    window.addEventListener('career_advisor_practice_updated', handlePracticeUpdate);
    return () => {
      window.removeEventListener('career_advisor_practice_updated', handlePracticeUpdate);
    };
  }, [user]);

  const handleToggleDashboardCompany = (companyName) => {
    let updated;
    if (dashboardCompanies.includes(companyName)) {
      if (dashboardCompanies.length <= 1) {
        alert('You must have at least 1 dream company selected.');
        return;
      }
      updated = dashboardCompanies.filter(c => c !== companyName);
    } else {
      updated = [...dashboardCompanies, companyName];
    }
    setDashboardCompanies(updated);
    if (updateUserTargetCompanies) {
      updateUserTargetCompanies(updated);
    }
  };

  const handleAddModalCustomCompany = (e) => {
    if (e) e.preventDefault();
    const trimmed = modalCustomCompany.trim();
    if (!trimmed) return;
    if (!dashboardCompanies.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      const updated = [...dashboardCompanies, trimmed];
      setDashboardCompanies(updated);
      if (updateUserTargetCompanies) {
        updateUserTargetCompanies(updated);
      }
    }
    setModalCustomCompany('');
  };

  const currentRole = careerRoles.find(r => r.id === Number(selectedRoleId)) || careerRoles[1];
  const acquiredSkillNames = userSkills.map(s => typeof s === 'string' ? s : (s.skillName || s.name || ''));
  const requiredForRole = currentRole.requiredSkills;

  const acquiredRoleSkills = requiredForRole.filter(s => acquiredSkillNames.includes(s));
  const missingRoleSkills = requiredForRole.filter(s => !acquiredSkillNames.includes(s));

  // Verified Skills Filtering
  const verifiedRoleSkills = requiredForRole.filter(req => {
    const found = userSkills.find(s => (typeof s === 'string' ? s : (s.skillName || s.name || '')).toLowerCase() === req.toLowerCase());
    return found && (found.isVerified === true || found.isVerified === 'true');
  });

  const unverifiedRoleSkills = acquiredRoleSkills.filter(req => !verifiedRoleSkills.includes(req));

  // Corporate Placement Readiness: Verified skills carry full weight (1.0), self-reported unverified carry 40% (0.4)
  const readinessScore = requiredForRole.length > 0
    ? Math.min(100, Math.round(((verifiedRoleSkills.length * 1.0 + unverifiedRoleSkills.length * 0.4) / requiredForRole.length) * 100))
    : 0;

  const rawMatchRate = Math.min(100, Math.round((acquiredRoleSkills.length / requiredForRole.length) * 100));

  const handleToggleSkill = (skillObj) => {
    const exists = userSkills.some(s => s.skillId === skillObj.id || (typeof s === 'object' && (s.skillName === skillObj.name || s.name === skillObj.name)));
    let updated;
    if (exists) {
      updated = userSkills.filter(s => !(s.skillId === skillObj.id || (typeof s === 'object' && (s.skillName === skillObj.name || s.name === skillObj.name))));
    } else {
      updated = [...userSkills, { skillId: skillObj.id, skillName: skillObj.name, proficiency: 'INTERMEDIATE', isVerified: false, verifiedScore: 0 }];
    }
    setUserSkills(updated);
    updateUserSkills(updated);
  };

  const handleSaveSkillVerification = (skillName, { isVerified, verifiedScore, verifiedLevel }) => {
    const updated = userSkills.map(s => {
      const sName = typeof s === 'string' ? s : (s.skillName || s.name || '');
      if (sName.toLowerCase() === skillName.toLowerCase()) {
        return {
          ...(typeof s === 'object' ? s : { skillName: s, proficiency: 'INTERMEDIATE' }),
          isVerified: isVerified,
          verifiedScore: verifiedScore,
          verifiedLevel: verifiedLevel
        };
      }
      return s;
    });

    const exists = userSkills.some(s => (typeof s === 'string' ? s : (s.skillName || s.name || '')).toLowerCase() === skillName.toLowerCase());
    let finalSkills = updated;
    if (!exists) {
      const matched = allAvailableSkills.find(sk => sk.name.toLowerCase() === skillName.toLowerCase()) || { id: Date.now(), name: skillName };
      finalSkills = [...updated, {
        skillId: matched.id,
        skillName: matched.name,
        proficiency: verifiedLevel === 'TIER_1_PRODUCT_READY' ? 'ADVANCED' : 'INTERMEDIATE',
        isVerified: isVerified,
        verifiedScore: verifiedScore,
        verifiedLevel: verifiedLevel
      }];
    }

    setUserSkills(finalSkills);
    updateUserSkills(finalSkills);
  };

  const handleSelectRole = (roleId) => {
    setSelectedRoleId(roleId);
    updateUserTargetRole(roleId);
    setIsRoleModalOpen(false);
  };

  const handleSkillCompletedFromRoadmap = (skillName) => {
    const matched = allAvailableSkills.find(s => s.name.toLowerCase() === skillName.toLowerCase()) || { id: Date.now(), name: skillName, category: 'Core Technical' };
    const exists = userSkills.some(s => s.skillName.toLowerCase() === skillName.toLowerCase());
    if (!exists) {
      const updated = [...userSkills, { skillId: matched.id, skillName: matched.name, proficiency: 'INTERMEDIATE' }];
      setUserSkills(updated);
      updateUserSkills(updated);
    }
  };

  const getScoreColor = (score) => {
    if (score === 0) return '#64748b';
    if (score < 40) return '#ef4444';
    if (score < 75) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="section-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Onboarding Callout Banner for New Users */}
      {userSkills.length === 0 && (
        <div style={{
          padding: '20px 24px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
          border: '1px solid #f59e0b',
          color: '#78350f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 4px 15px rgba(245, 158, 11, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', fontWeight: 800 }}>
              <Sparkles size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#92400e' }}>
                Account Created for {currentRole.name}! 🎯
              </h4>
              <p style={{ fontSize: '13px', color: '#b45309', marginTop: '2px' }}>
                Select the technical skills you currently know to calculate your skill gap and placement readiness score.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSkillModalOpen(true)}
            style={{
              padding: '10px 20px',
              borderRadius: '9999px',
              background: '#b45309',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '13px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(180, 83, 9, 0.3)'
            }}
          >
            <Plus size={16} />
            <span>Select Your Skills Now</span>
          </button>
        </div>
      )}

      {/* Student Welcome Header Banner */}
      <div style={{
        padding: '32px',
        borderRadius: '24px',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
        color: '#ffffff',
        boxShadow: '0 20px 40px -15px rgba(67, 56, 202, 0.35)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px', position: 'relative', zIndex: 2 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700, color: '#6ee7b7', marginBottom: '8px', flexWrap: 'wrap' }}>
              <ShieldCheck size={16} />
              <span>Verified Student • {user?.academicYear || 'Engineering Student'}</span>
              <span style={{
                background: 'rgba(249, 115, 22, 0.25)',
                color: '#fdba74',
                padding: '2px 9px',
                borderRadius: '9999px',
                border: '1px solid rgba(251, 146, 60, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 800,
                fontSize: '11px'
              }}>
                <Flame size={12} color="#fb923c" />
                <span>{streakDays}d Streak Active 🔥</span>
              </span>
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em' }}>
              Welcome, {user?.fullName || 'Student'} 👋
            </h1>
            <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.85)', marginTop: '6px' }}>
              Branch: <strong style={{ color: '#ffffff' }}>{user?.engineeringBranch || 'Computer Science & Engineering'}</strong>
            </p>
          </div>

          {/* Target Track & Dream Companies Cards */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              padding: '18px 24px',
              borderRadius: '18px',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '20px'
            }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#a5b4fc', letterSpacing: '0.05em' }}>Target Career Track</span>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>{currentRole.name}</h3>
                <span style={{ fontSize: '12px', color: '#6ee7b7', fontWeight: 700 }}>{currentRole.avgSalary} Avg Package</span>
              </div>

              <button
                onClick={() => setIsRoleModalOpen(true)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '12px',
                  background: '#ffffff',
                  color: '#4338ca',
                  fontSize: '12px',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              >
                <Edit2 size={14} />
                <span>Change Track</span>
              </button>
            </div>

            {/* Dream Companies Card */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              padding: '16px 20px',
              borderRadius: '18px',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              minWidth: '240px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building2 size={14} color="#a5b4fc" />
                  <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#a5b4fc', letterSpacing: '0.05em' }}>
                    Dream Companies ({dashboardCompanies.length})
                  </span>
                </div>
                <button
                  onClick={() => setIsCompanyModalOpen(true)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Edit2 size={11} />
                  <span>Manage</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {dashboardCompanies.length > 0 ? (
                  <>
                    {dashboardCompanies.slice(0, 4).map(c => (
                      <span
                        key={c}
                        style={{
                          background: 'rgba(255, 255, 255, 0.22)',
                          padding: '3px 9px',
                          borderRadius: '9999px',
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#ffffff',
                          border: '1px solid rgba(255, 255, 255, 0.35)'
                        }}
                      >
                        🏢 {c}
                      </span>
                    ))}
                    {dashboardCompanies.length > 4 && (
                      <span
                        onClick={() => setIsCompanyModalOpen(true)}
                        style={{
                          background: 'rgba(165, 180, 252, 0.3)',
                          padding: '3px 8px',
                          borderRadius: '9999px',
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#e0e7ff',
                          cursor: 'pointer'
                        }}
                      >
                        +{dashboardCompanies.length - 4} more
                      </span>
                    )}
                  </>
                ) : (
                  <span
                    onClick={() => setIsCompanyModalOpen(true)}
                    style={{ fontSize: '11px', color: '#c7d2fe', fontStyle: 'italic', cursor: 'pointer' }}
                  >
                    + Add target companies
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Study Streak & Placement Consistency Badges Hub */}
      <StudentStreakCard 
        userEmail={user?.email} 
        onStreakUpdate={(s) => setStreakDays(s.currentStreak)} 
      />

      {/* LinkedIn Job Posting & Extracted Required / Preferred Skills */}
      <LinkedInJobSkillsCard 
        roleId={selectedRoleId} 
        roleName={currentRole.name} 
        userSkills={userSkills} 
      />

      {/* Grid: Placement Readiness Score & Skill Matrix */}
      <div className="grid grid-cols-3 gap-6">
        
        {/* Placement Readiness Score Card */}
        <div className="feature-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Placement Readiness</h3>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Industry Benchmark Calibrated</span>
              </div>
              <Target size={20} color="#7c3aed" />
            </div>
            
            <div style={{ textAlign: 'center', margin: '14px 0' }}>
              <div style={{ fontSize: '52px', fontWeight: 900, color: getScoreColor(readinessScore), lineHeight: 1 }}>
                {readinessScore}%
              </div>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: getScoreColor(readinessScore), letterSpacing: '0.04em', marginTop: '4px', display: 'block' }}>
                Corporate Placement Ready
              </span>
              
              {/* Progress Bar */}
              <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', marginTop: '12px', overflow: 'hidden' }}>
                <div style={{ width: `${readinessScore}%`, height: '100%', backgroundColor: getScoreColor(readinessScore), transition: 'all 0.4s ease' }} />
              </div>

              {/* Verified vs Unverified breakdown */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '12px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#047857', background: '#ecfdf5', padding: '3px 8px', borderRadius: '6px', border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <ShieldCheck size={11} />
                  <span>{verifiedRoleSkills.length} Verified</span>
                </span>
                <span style={{ fontSize: '10px', fontWeight: 800, color: unverifiedRoleSkills.length > 0 ? '#b45309' : '#64748b', background: unverifiedRoleSkills.length > 0 ? '#fef3c7' : '#f1f5f9', padding: '3px 8px', borderRadius: '6px', border: unverifiedRoleSkills.length > 0 ? '1px solid #fde68a' : '1px solid #e2e8f0' }}>
                  ⚠️ {unverifiedRoleSkills.length} Self-Reported
                </span>
              </div>
            </div>

            <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5, textAlign: 'center' }}>
              {acquiredRoleSkills.length === 0 ? (
                <span>No technical skills selected yet. Click below to add the skills you currently know!</span>
              ) : unverifiedRoleSkills.length > 0 ? (
                <span>
                  <strong>{unverifiedRoleSkills.length} skill{unverifiedRoleSkills.length > 1 ? 's' : ''} unverified.</strong> Companies expect verified depth. Click "Verify for Companies" in your skill list to unlock 100% placement readiness.
                </span>
              ) : (
                <span>🏆 Outstanding! All acquired skills are verified against company hiring benchmarks.</span>
              )}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '18px' }}>
            <button
              onClick={() => setIsSkillModalOpen(true)}
              className="btn-purple-pill"
              style={{ width: '100%', padding: '12px' }}
            >
              <Plus size={16} />
              <span>Update Technical Skills</span>
            </button>

            {onNavigateProgress && (
              <button
                onClick={onNavigateProgress}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '9999px',
                  background: '#ecfdf5',
                  color: '#047857',
                  border: '1px solid #a7f3d0',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <TrendingUp size={16} />
                <span>View Detailed Progress &amp; Badges</span>
              </button>
            )}
          </div>
        </div>

        {/* Skill Gap Matrix Card */}
        <div className="feature-card" style={{ gridColumn: window.innerWidth > 768 ? 'span 2' : 'span 1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Skill Gap Matrix</h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Placement requirements for <strong>{currentRole.name}</strong></span>
              </div>
              <button
                onClick={() => setIsSkillModalOpen(true)}
                style={{ background: 'none', border: 'none', color: '#7c3aed', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
              >
                Manage Skills →
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              
              {/* Acquired Skills Box */}
              <div style={{ padding: '16px', borderRadius: '14px', background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#047857' }}>
                    ✓ Acquired Skills ({acquiredRoleSkills.length})
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#059669' }}>
                    {verifiedRoleSkills.length}/{acquiredRoleSkills.length} Verified
                  </span>
                </div>

                {acquiredRoleSkills.length === 0 ? (
                  <p style={{ fontSize: '12px', color: '#059669', fontStyle: 'italic' }}>
                    No matching skills acquired for this role yet.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {acquiredRoleSkills.map(sk => {
                      const userSkillObj = userSkills.find(s => (typeof s === 'string' ? s : (s.skillName || s.name)) === sk);
                      const isVer = userSkillObj && (userSkillObj.isVerified === true || userSkillObj.isVerified === 'true');
                      const verScore = userSkillObj?.verifiedScore || 0;

                      return (
                        <div key={sk} style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          borderRadius: '10px',
                          background: '#ffffff',
                          border: isVer ? '1.5px solid #10b981' : '1px dashed #f59e0b',
                          gap: '8px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>{sk}</span>
                            {isVer ? (
                              <span style={{ fontSize: '10px', fontWeight: 800, color: '#047857', background: '#dcfce7', padding: '1px 6px', borderRadius: '4px', border: '1px solid #86efac', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                <ShieldCheck size={10} />
                                <span>Verified ({verScore}%)</span>
                              </span>
                            ) : (
                              <span style={{ fontSize: '10px', fontWeight: 700, color: '#b45309', background: '#fef3c7', padding: '1px 6px', borderRadius: '4px', border: '1px solid #fde68a' }}>
                                ⚠️ Self-Reported
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => setVerifyingSkill(sk)}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '6px',
                              background: isVer ? '#f1f5f9' : '#7c3aed',
                              color: isVer ? '#475569' : '#ffffff',
                              fontSize: '10px',
                              fontWeight: 800,
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            <span>{isVer ? 'Re-test' : 'Verify for Companies ⚡'}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Missing Skills Box */}
              <div style={{ padding: '16px', borderRadius: '14px', background: '#fef2f2', border: '1px solid #fecaca' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#dc2626', display: 'block', marginBottom: '10px' }}>
                  ⚠ Missing Skill Gaps ({missingRoleSkills.length})
                </span>
                {missingRoleSkills.length === 0 ? (
                  <p style={{ fontSize: '12px', color: '#dc2626', fontStyle: 'italic' }}>
                    Great job! You have acquired all required skills.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {missingRoleSkills.map(sk => (
                      <span
                        key={sk}
                        onClick={() => {
                          setPracticeModalSkill(sk);
                          setIsPracticeModalOpen(true);
                        }}
                        style={{ padding: '5px 12px', borderRadius: '8px', background: '#ffffff', color: '#dc2626', fontSize: '12px', fontWeight: 700, border: '1px solid #fecaca', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                        title="Click to practice on LeetCode / HackerRank and submit score proof"
                      >
                        <span>{sk}</span>
                        <Code size={12} color="#dc2626" />
                      </span>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>

          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px', marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#64748b' }}>
            <span>Market Demand: <strong style={{ color: '#0f172a', background: '#f1f5f9', padding: '2px 8px', borderRadius: '6px' }}>{currentRole.demand}</strong></span>
            <span>Total Skills Selected: <strong style={{ color: '#7c3aed' }}>{userSkills.length} Skills</strong></span>
          </div>
        </div>

      </div>

      {/* Row 2: Key Career Metrics Cards */}
      <div className="grid grid-cols-3 gap-6">
        <div className="feature-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="icon-box-emerald">
              <Award size={22} />
            </div>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Salary Benchmark</span>
              <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{currentRole.avgSalary}</h4>
            </div>
          </div>
        </div>

        <div className="feature-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="icon-box-purple">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Skill Matching</span>
              <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{acquiredRoleSkills.length} / {requiredForRole.length} Skills</h4>
            </div>
          </div>
        </div>

        <div className="feature-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="icon-box-amber">
              <BookOpen size={22} />
            </div>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Top Priority Gap</span>
              <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                {missingRoleSkills[0] || 'All Skills Completed! 🎉'}
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* HANDS-ON CODING PRACTICE & BENCHMARK HUB (LEETCODE / HACKERRANK) */}
      <div className="feature-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: '#059669', background: '#ecfdf5', padding: '3px 10px', borderRadius: '6px', marginBottom: '4px', border: '1px solid #a7f3d0' }}>
              <Code size={13} />
              <span>Recommended Practice Platforms &bull; Tier-1 Placement Readiness</span>
            </div>
            <h3 style={{ fontSize: '19px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
              Hands-on Coding Practice Hub (LeetCode &amp; HackerRank)
            </h3>
            <p style={{ fontSize: '12.5px', color: '#64748b', margin: '3px 0 0 0' }}>
              Directly practice topics for <strong>{currentRole.name}</strong>, submit your score or screenshot, and get automated AI evaluation.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={() => setIsReminderModalOpen(true)}
              style={{
                padding: '9px 16px',
                borderRadius: '9999px',
                background: '#f8fafc',
                color: '#334155',
                border: '1.5px solid #cbd5e1',
                fontSize: '12.5px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Bell size={14} color="#7c3aed" />
              <span>Practice Check-in</span>
            </button>

            <button
              onClick={() => setIsVirtualModalOpen(true)}
              style={{
                padding: '9px 16px',
                borderRadius: '9999px',
                background: '#fdf2f8',
                color: '#db2777',
                border: '1.5px solid #fbcfe8',
                fontSize: '12.5px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Video size={14} color="#db2777" />
              <span>Video Review</span>
            </button>

            <button
              onClick={() => {
                setPracticeModalSkill(missingRoleSkills[0] || 'Data Structures & Algorithms');
                setIsPracticeModalOpen(true);
              }}
              style={{
                padding: '10px 20px',
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(124, 58, 237, 0.25)'
              }}
            >
              <Upload size={15} />
              <span>Share Practice Score / Screenshot</span>
            </button>
          </div>
        </div>

        {/* 2 Featured Practice Cards: LeetCode & HackerRank */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {/* LeetCode Card */}
          <div style={{
            padding: '20px',
            borderRadius: '18px',
            background: '#fffbeb',
            border: '1.5px solid #fde68a',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#d97706', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '13px' }}>
                    LC
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#92400e', margin: 0 }}>LeetCode</h4>
                    <span style={{ fontSize: '11px', color: '#b45309' }}>Algorithmic OA Screening &amp; SDE 1 Prep</span>
                  </div>
                </div>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#92400e', background: '#ffffff', padding: '2px 8px', borderRadius: '6px', border: '1px solid #fde68a' }}>
                  Tier-1 OA
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#78350f', margin: '8px 0 0 0', lineHeight: 1.5 }}>
                Practice LeetCode 75 and Top Interview 150 tagged problems matching company technical rounds.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  practicePlatformService.recordVisit({
                    platformId: 'leetcode',
                    platformName: 'LeetCode',
                    skillName: missingRoleSkills[0] || 'Data Structures & Algorithms',
                    url: 'https://leetcode.com/studyplan/leetcode-75/',
                    userEmail: user?.email
                  });
                  window.open('https://leetcode.com/studyplan/leetcode-75/', '_blank', 'noopener,noreferrer');
                }}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: '10px',
                  background: '#d97706',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <ExternalLink size={13} />
                <span>Go to LeetCode 75 →</span>
              </button>

              <button
                onClick={() => {
                  setPracticeModalPlatform('leetcode');
                  setPracticeModalSkill(missingRoleSkills[0] || 'Data Structures & Algorithms');
                  setIsPracticeModalOpen(true);
                }}
                style={{
                  padding: '9px 14px',
                  borderRadius: '10px',
                  background: '#ffffff',
                  color: '#92400e',
                  fontSize: '12px',
                  fontWeight: 700,
                  border: '1px solid #fde68a',
                  cursor: 'pointer'
                }}
              >
                Submit Score
              </button>
            </div>
          </div>

          {/* HackerRank Card */}
          <div style={{
            padding: '20px',
            borderRadius: '18px',
            background: '#ecfdf5',
            border: '1.5px solid #a7f3d0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#059669', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '13px' }}>
                    HR
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#065f46', margin: 0 }}>HackerRank</h4>
                    <span style={{ fontSize: '11px', color: '#047857' }}>Language Domain &amp; Certified Tests</span>
                  </div>
                </div>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#065f46', background: '#ffffff', padding: '2px 8px', borderRadius: '6px', border: '1px solid #a7f3d0' }}>
                  Official Certs
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#064e3b', margin: '8px 0 0 0', lineHeight: 1.5 }}>
                Master language fundamentals (Java, Python, C++, SQL) and earn verified problem-solving skill badges.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  practicePlatformService.recordVisit({
                    platformId: 'hackerrank',
                    platformName: 'HackerRank',
                    skillName: missingRoleSkills[0] || 'Java',
                    url: 'https://www.hackerrank.com/domains',
                    userEmail: user?.email
                  });
                  window.open('https://www.hackerrank.com/domains', '_blank', 'noopener,noreferrer');
                }}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: '10px',
                  background: '#059669',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <ExternalLink size={13} />
                <span>Go to HackerRank →</span>
              </button>

              <button
                onClick={() => {
                  setPracticeModalPlatform('hackerrank');
                  setPracticeModalSkill(missingRoleSkills[0] || 'Java');
                  setIsPracticeModalOpen(true);
                }}
                style={{
                  padding: '9px 14px',
                  borderRadius: '10px',
                  background: '#ffffff',
                  color: '#065f46',
                  fontSize: '12px',
                  fontWeight: 700,
                  border: '1px solid #a7f3d0',
                  cursor: 'pointer'
                }}
              >
                Submit Score
              </button>
            </div>
          </div>
        </div>

        {/* Live Submissions Log Preview */}
        {recentPracticeSubmissions.length > 0 && (
          <div style={{ background: '#f8fafc', padding: '16px 20px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={20} />
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#059669', textTransform: 'uppercase' }}>
                  Latest AI Evaluated Practice
                </span>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                  {recentPracticeSubmissions[0].platformName} &bull; {recentPracticeSubmissions[0].skillName} ({recentPracticeSubmissions[0].problemsSolved} Solved, {recentPracticeSubmissions[0].score})
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#7c3aed', background: '#f3e8ff', padding: '4px 10px', borderRadius: '8px' }}>
                ⚡ {recentPracticeSubmissions[0].readinessBoost}
              </span>
              <button
                onClick={() => setIsPracticeModalOpen(true)}
                style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '12px', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}
              >
                View Details &amp; History →
              </button>
            </div>
          </div>
        )}
      </div>



      {/* SKILL MANAGER MODAL */}
      {isSkillModalOpen && (
        <div className="split-modal-overlay">
          <div style={{ background: '#ffffff', padding: '32px', borderRadius: '24px', maxWidth: '680px', width: '100%', maxHeight: '88vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: '#7c3aed', background: '#f3e8ff', padding: '4px 10px', borderRadius: '6px', marginBottom: '6px' }}>
                  <Sparkles size={14} />
                  <span>Tailored for {user?.engineeringBranch || 'Engineering'} • {currentRole.name}</span>
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>Update Technical Skills</h3>
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Skills required for <strong>{currentRole.name}</strong> are highlighted below.</p>
              </div>
              <button onClick={() => setIsSkillModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}>✕</button>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
              <button
                type="button"
                onClick={() => setSkillFilterTab('role')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  background: skillFilterTab === 'role' ? '#7c3aed' : '#f1f5f9',
                  color: skillFilterTab === 'role' ? '#ffffff' : '#475569',
                  transition: 'all 0.15s ease'
                }}
              >
                🎯 Required for {currentRole.name} ({requiredForRole.length})
              </button>

              <button
                type="button"
                onClick={() => setSkillFilterTab('all')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  background: skillFilterTab === 'all' ? '#7c3aed' : '#f1f5f9',
                  color: skillFilterTab === 'all' ? '#ffffff' : '#475569',
                  transition: 'all 0.15s ease'
                }}
              >
                🌐 All Engineering Skills ({allAvailableSkills.length})
              </button>
            </div>

            {/* Skill Cards Grid */}
            <div className="grid grid-cols-2 gap-3">
              {(skillFilterTab === 'role' 
                ? allAvailableSkills.filter(sk => requiredForRole.some(req => req.toLowerCase() === sk.name.toLowerCase()))
                : [...allAvailableSkills].sort((a, b) => {
                    const aReq = requiredForRole.some(req => req.toLowerCase() === a.name.toLowerCase());
                    const bReq = requiredForRole.some(req => req.toLowerCase() === b.name.toLowerCase());
                    return bReq - aReq;
                  })
              ).map(sk => {
                const matchedUserSkill = userSkills.find(s => s.skillId === sk.id || (typeof s === 'object' && (s.skillName === sk.name || s.name === sk.name)) || (typeof s === 'string' && s.toLowerCase() === sk.name.toLowerCase()));
                const isSelected = !!matchedUserSkill;
                const isVerified = matchedUserSkill && (matchedUserSkill.isVerified === true || matchedUserSkill.isVerified === 'true');
                const isCoreRequired = requiredForRole.some(req => req.toLowerCase() === sk.name.toLowerCase());

                return (
                  <label key={sk.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    border: isSelected 
                      ? (isVerified ? '2px solid #10b981' : '1.5px solid #f59e0b') 
                      : isCoreRequired 
                        ? '1.5px solid #a855f7' 
                        : '1px solid #e2e8f0',
                    background: isSelected 
                      ? (isVerified ? '#f0fdf4' : '#fffbeb') 
                      : isCoreRequired 
                        ? '#faf5ff' 
                        : '#f8fafc',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSkill(sk)}
                      style={{ width: '16px', height: '16px', accentColor: '#10b981' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: isSelected ? (isVerified ? '#15803d' : '#92400e') : '#0f172a' }}>{sk.name}</span>
                        {isCoreRequired && (
                          <span style={{ fontSize: '9px', fontWeight: 800, color: '#7c3aed', background: '#f3e8ff', padding: '1px 6px', borderRadius: '4px', border: '1px solid #d8b4fe' }}>
                            🎯 Core Track
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '10px', color: isSelected ? (isVerified ? '#16a34a' : '#b45309') : '#64748b' }}>
                        {isSelected ? (isVerified ? '✓ Company-Verified' : '⚠️ Self-Reported') : sk.category}
                      </span>
                    </div>

                    {isSelected && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setVerifyingSkill(sk.name);
                        }}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          background: isVerified ? '#ecfdf5' : '#7c3aed',
                          color: isVerified ? '#047857' : '#ffffff',
                          fontSize: '10px',
                          fontWeight: 800,
                          border: isVerified ? '1px solid #a7f3d0' : 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {isVerified ? (
                          <>
                            <ShieldCheck size={11} />
                            <span>Verified</span>
                          </>
                        ) : (
                          <>
                            <Sparkles size={11} />
                            <span>Verify ⚡</span>
                          </>
                        )}
                      </button>
                    )}
                  </label>
                );
              })}
            </div>

            <button
              onClick={() => setIsSkillModalOpen(false)}
              className="btn-purple-pill"
              style={{ width: '100%', padding: '14px', marginTop: '10px' }}
            >
              Save Skills &amp; Recalculate Readiness Score
            </button>
          </div>
        </div>
      )}

      {/* CHANGE ROLE MODAL */}
      {isRoleModalOpen && (
        <div className="split-modal-overlay">
          <div style={{ background: '#ffffff', padding: '32px', borderRadius: '24px', maxWidth: '520px', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>Select Target Career Track</h3>
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Choose your desired engineering career role</p>
              </div>
              <button onClick={() => setIsRoleModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {careerRoles.map(role => (
                <div
                  key={role.id}
                  onClick={() => handleSelectRole(role.id)}
                  style={{ padding: '16px', borderRadius: '16px', border: selectedRoleId === role.id ? '2px solid #7c3aed' : '1px solid #e2e8f0', background: selectedRoleId === role.id ? '#f3e8ff' : '#f8fafc', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.15s ease' }}
                >
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>{role.name}</h4>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{role.category} • {role.requiredSkills.length} Required Skills</span>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 900, color: '#059669', background: '#ecfdf5', padding: '4px 10px', borderRadius: '8px', border: '1px solid #a7f3d0' }}>{role.avgSalary}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MANAGE DREAM COMPANIES MODAL */}
      {isCompanyModalOpen && (
        <div className="split-modal-overlay">
          <div style={{ background: '#ffffff', padding: '32px', borderRadius: '24px', maxWidth: '580px', width: '100%', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building2 size={20} color="#7c3aed" />
                </div>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>Manage Dream Companies</h3>
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Choose 1, 2, or many companies you want to get shortlisted for</p>
                </div>
              </div>
              <button onClick={() => setIsCompanyModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}>✕</button>
            </div>

            {/* Selected Companies Preview */}
            <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#334155' }}>
                  Active Dream Companies ({dashboardCompanies.length}):
                </span>
                <span style={{ fontSize: '11px', color: '#7c3aed', fontWeight: 700 }}>
                  Personalized Roadmap Active
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {dashboardCompanies.map(c => (
                  <span
                    key={c}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 700
                    }}
                  >
                    <span>🏢 {c}</span>
                    <button
                      type="button"
                      onClick={() => handleToggleDashboardCompany(c)}
                      style={{
                        background: 'rgba(255,255,255,0.25)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '14px',
                        height: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#ffffff',
                        padding: 0
                      }}
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Search & Custom Add */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  value={modalCompanySearch}
                  onChange={(e) => setModalCompanySearch(e.target.value)}
                  placeholder="Search popular companies..."
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 32px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '4px' }}>
                <input
                  type="text"
                  value={modalCustomCompany}
                  onChange={(e) => setModalCustomCompany(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddModalCustomCompany(); } }}
                  placeholder="Other company..."
                  style={{
                    width: '130px',
                    padding: '8px 10px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddModalCustomCompany}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '10px',
                    background: '#7c3aed',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Plus size={14} />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Catalog Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '8px', maxHeight: '240px', overflowY: 'auto', paddingRight: '4px' }}>
              {DREAM_COMPANIES_CATALOG
                .filter(c => !modalCompanySearch || c.name.toLowerCase().includes(modalCompanySearch.toLowerCase()))
                .map(comp => {
                  const isSelected = dashboardCompanies.includes(comp.name);
                  return (
                    <div
                      key={comp.name}
                      onClick={() => handleToggleDashboardCompany(comp.name)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '12px',
                        border: isSelected ? '1.5px solid #7c3aed' : '1px solid #e2e8f0',
                        background: isSelected ? '#f5f3ff' : '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '6px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: isSelected ? '#6d28d9' : '#0f172a' }}>{comp.name}</div>
                        <div style={{ fontSize: '10px', color: '#64748b' }}>{comp.tier} • {comp.category}</div>
                      </div>
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: isSelected ? '#7c3aed' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isSelected ? <Check size={12} color="#ffffff" /> : <Plus size={11} color="#94a3b8" />}
                      </div>
                    </div>
                  );
                })}
            </div>

            <button
              onClick={() => setIsCompanyModalOpen(false)}
              className="btn-purple-pill"
              style={{ width: '100%', padding: '14px', marginTop: '6px' }}
            >
              Done &amp; Update Placement Roadmaps
            </button>
          </div>
        </div>
      )}

      {/* COMPANY SKILL VERIFICATION MODAL */}
      {verifyingSkill && (
        <CompanySkillVerificationModal
          skillName={verifyingSkill}
          onClose={() => setVerifyingSkill(null)}
          onSaveVerification={handleSaveSkillVerification}
        />
      )}

      {/* PRACTICE PLATFORM (LEETCODE / HACKERRANK) MODAL */}
      <PracticePlatformModal
        isOpen={isPracticeModalOpen}
        onClose={() => setIsPracticeModalOpen(false)}
        initialSkill={practiceModalSkill}
        initialPlatform={practiceModalPlatform}
        user={user}
        onPracticeSubmitted={(res) => {
          if (res && res.skillName) {
            const existingIdx = userSkills.findIndex(s => 
              (typeof s === 'string' && s.toLowerCase() === res.skillName.toLowerCase()) ||
              (s.skillName && s.skillName.toLowerCase() === res.skillName.toLowerCase())
            );

            let updated;
            if (existingIdx >= 0) {
              updated = [...userSkills];
              const old = updated[existingIdx];
              updated[existingIdx] = typeof old === 'string' 
                ? { skillId: Date.now(), skillName: old, proficiency: 'ADVANCED', isVerified: true, verifiedScore: 92 }
                : { ...old, proficiency: 'ADVANCED', isVerified: true, verifiedScore: 92 };
            } else {
              const matchedSkill = allAvailableSkills.find(s => s.name.toLowerCase() === res.skillName.toLowerCase()) || { id: Date.now(), name: res.skillName, category: 'Core Technical' };
              updated = [...userSkills, { skillId: matchedSkill.id, skillName: matchedSkill.name, proficiency: 'ADVANCED', isVerified: true, verifiedScore: 92 }];
            }
            setUserSkills(updated);
            updateUserSkills(updated);
          }
        }}
      />

      {/* Change 4: Post-Login Practice Check-in & Habit Reminder Modal */}
      <PostLoginPracticeReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        user={user}
        onOpenScoreSubmission={() => {
          setIsReminderModalOpen(false);
          setIsPracticeModalOpen(true);
        }}
      />

      {/* Change 5: Virtual Social Media Video/Voice Feedback Modal */}
      <VirtualFeedbackModal
        isOpen={isVirtualModalOpen}
        onClose={() => setIsVirtualModalOpen(false)}
        user={user}
      />

    </div>
  );
};
