import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Target, Sparkles, CheckCircle2, ArrowDown, BookOpen, 
  Code, Award, PlayCircle, ChevronRight, HelpCircle, 
  Check, Lock, ArrowRight, Zap, RefreshCw, X, FileCheck, GraduationCap,
  Building2, Briefcase, ExternalLink, Filter, Plus, Flame, ShieldCheck, Compass, Star, ChevronDown, CheckCheck,
  Brain, AlertTriangle, CheckCircle, XCircle, Terminal, Upload
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { FeedbackRatingModal } from './FeedbackRatingModal';
import { PracticePlatformModal } from './PracticePlatformModal';
import { ChainedRoadmapFlow } from './ChainedRoadmapFlow';
import { useAntiCheatAssessment, exitFullScreen } from '../utils/useAntiCheatAssessment';
import { 
  AntiCheatLiveBanner, 
  AntiCheatStartCard, 
  AntiCheatModals, 
  AntiCheatAuditBadge 
} from './AntiCheatProctor';

// Step-by-step career tracks roadmap configuration
const CAREER_ROADMAPS_DATA = {
  // Role 2: Full Stack Java Developer
  2: {
    roleName: 'Full Stack Java Developer',
    description: 'Master backend Java, databases, APIs, and modern React frontend step-by-step.',
    steps: [
      { id: 'java_fund', name: 'Java Fundamentals', category: 'Programming Core', approxWeeks: '1-2 Weeks', skillName: 'Java' },
      { id: 'adv_java', name: 'Advanced Java & OOPs', category: 'Programming Core', approxWeeks: '2 Weeks', skillName: 'Java' },
      { id: 'sql_db', name: 'SQL & MySQL Databases', category: 'Database', approxWeeks: '2 Weeks', skillName: 'SQL & MySQL' },
      { id: 'spring_boot', name: 'Spring Boot Backend', category: 'Framework', approxWeeks: '3 Weeks', skillName: 'Spring Boot' },
      { id: 'rest_api', name: 'REST API Design & Swagger', category: 'API Architecture', approxWeeks: '1-2 Weeks', skillName: 'REST API Design' },
      { id: 'react_ui', name: 'React.js Frontend', category: 'Frontend UI', approxWeeks: '3 Weeks', skillName: 'React.js' },
      { id: 'git_github', name: 'Git & GitHub Version Control', category: 'DevOps & Tools', approxWeeks: '1 Week', skillName: 'Git & GitHub' },
      { id: 'fullstack_proj', name: 'Full Stack Capstone Project', category: 'Portfolio Project', approxWeeks: '3 Weeks', skillName: 'Spring Boot' }
    ]
  },

  // Role 1: AI & Machine Learning Engineer
  1: {
    roleName: 'AI & Machine Learning Engineer',
    description: 'Build foundational Python, mathematics, ML algorithms, and deep neural networks.',
    steps: [
      { id: 'py_fund', name: 'Python Fundamentals', category: 'Programming Core', approxWeeks: '2 Weeks', skillName: 'Python' },
      { id: 'dsa_core', name: 'Data Structures & Algorithms', category: 'Computer Science', approxWeeks: '3 Weeks', skillName: 'Data Structures & Algorithms' },
      { id: 'sql_ai', name: 'SQL & Data Extraction', category: 'Database', approxWeeks: '2 Weeks', skillName: 'SQL & MySQL' },
      { id: 'ml_algos', name: 'Machine Learning Algorithms', category: 'Data & AI', approxWeeks: '4 Weeks', skillName: 'Machine Learning' },
      { id: 'deep_learning', name: 'Deep Learning & Neural Networks', category: 'Data & AI', approxWeeks: '4 Weeks', skillName: 'Deep Learning' },
      { id: 'git_ai', name: 'Git & GitHub Version Control', category: 'DevOps & Tools', approxWeeks: '1 Week', skillName: 'Git & GitHub' },
      { id: 'ai_proj', name: 'AI & ML Capstone Project', category: 'Portfolio Project', approxWeeks: '3 Weeks', skillName: 'Machine Learning' }
    ]
  },

  // Role 4: Data Scientist & Analyst
  4: {
    roleName: 'Data Scientist & Analyst',
    description: 'Master Python analytics, SQL database querying, statistics, and predictive modeling.',
    steps: [
      { id: 'py_ds', name: 'Python Core & Data Wrangling', category: 'Programming Core', approxWeeks: '2 Weeks', skillName: 'Python' },
      { id: 'sql_ds', name: 'SQL & Database Aggregations', category: 'Database', approxWeeks: '2 Weeks', skillName: 'SQL & MySQL' },
      { id: 'dsa_ds', name: 'Data Structures & Algorithms', category: 'Computer Science', approxWeeks: '3 Weeks', skillName: 'Data Structures & Algorithms' },
      { id: 'ml_ds', name: 'Machine Learning for Analytics', category: 'Data & AI', approxWeeks: '4 Weeks', skillName: 'Machine Learning' },
      { id: 'git_ds', name: 'Git & GitHub Project Management', category: 'Tools', approxWeeks: '1 Week', skillName: 'Git & GitHub' },
      { id: 'ds_proj', name: 'Data Science Capstone Project', category: 'Portfolio Project', approxWeeks: '3 Weeks', skillName: 'Machine Learning' }
    ]
  },

  // Role 3: Embedded Systems & IoT Engineer
  3: {
    roleName: 'Embedded Systems & IoT Engineer',
    description: 'Learn C/C++ memory management, microcontroller firmware, and smart IoT devices.',
    steps: [
      { id: 'cpp_fund', name: 'C & C++ Programming Core', category: 'Core Engineering', approxWeeks: '3 Weeks', skillName: 'C++' },
      { id: 'emb_c', name: 'Embedded C & Microcontrollers', category: 'Firmware & Hardware', approxWeeks: '4 Weeks', skillName: 'Embedded C / Microcontrollers' },
      { id: 'robotics', name: 'Robotics & Microprocessors', category: 'Hardware', approxWeeks: '3 Weeks', skillName: 'Robotics & Microprocessors' },
      { id: 'git_emb', name: 'Git & GitHub Version Control', category: 'Tools', approxWeeks: '1 Week', skillName: 'Git & GitHub' },
      { id: 'iot_proj', name: 'IoT & Firmware Capstone Project', category: 'Portfolio Project', approxWeeks: '3 Weeks', skillName: 'Embedded C / Microcontrollers' }
    ]
  },

  // Role 5: DevOps & Cloud Engineer
  5: {
    roleName: 'DevOps & Cloud Engineer',
    description: 'Automate infrastructure with Python scripting, Docker, Kubernetes, and CI/CD pipelines.',
    steps: [
      { id: 'py_devops', name: 'Python Automation Scripting', category: 'Programming Core', approxWeeks: '2 Weeks', skillName: 'Python' },
      { id: 'git_devops', name: 'Git & GitHub Actions CI/CD', category: 'DevOps & Tools', approxWeeks: '2 Weeks', skillName: 'Git & GitHub' },
      { id: 'sys_design', name: 'System Design & Networking', category: 'Core Technical', approxWeeks: '3 Weeks', skillName: 'System Design' },
      { id: 'docker_k8s', name: 'Docker & Kubernetes Containers', category: 'Cloud Infrastructure', approxWeeks: '4 Weeks', skillName: 'Docker & Kubernetes' },
      { id: 'cloud_proj', name: 'DevOps Pipeline Capstone Project', category: 'Portfolio Project', approxWeeks: '3 Weeks', skillName: 'Docker & Kubernetes' }
    ]
  },

  // Role 6: Civil Structural BIM & GIS Engineer (Civil Core Track)
  6: {
    roleName: 'Civil Structural BIM & GIS Engineer',
    description: 'Master structural system design, engineering scripting, spatial GIS databases, and BIM modeling.',
    steps: [
      { id: 'py_civil', name: 'Python Engineering Scripting', category: 'Engineering Core', approxWeeks: '2 Weeks', skillName: 'Python' },
      { id: 'sql_civil', name: 'SQL & Spatial GIS Databases', category: 'Database', approxWeeks: '2 Weeks', skillName: 'SQL & MySQL' },
      { id: 'git_civil', name: 'Git & GitHub Project Management', category: 'Tools', approxWeeks: '1 Week', skillName: 'Git & GitHub' },
      { id: 'sys_civil', name: 'Structural System Design', category: 'Core Civil Tech', approxWeeks: '3 Weeks', skillName: 'System Design' },
      { id: 'civil_proj', name: 'Smart BIM Structural Capstone Project', category: 'Portfolio Project', approxWeeks: '3 Weeks', skillName: 'System Design' }
    ]
  },

  // Role 7: Smart Infrastructure & Construction Specialist (Civil Core Track)
  7: {
    roleName: 'Smart Infrastructure & Construction Specialist',
    description: 'Build smart city sensor integrations, construction analytics, asset databases, and grid system design.',
    steps: [
      { id: 'py_infra', name: 'Python Analytics & Cost Estimations', category: 'Analytics Core', approxWeeks: '2 Weeks', skillName: 'Python' },
      { id: 'git_infra', name: 'Git & GitHub Team Collaboration', category: 'Tools', approxWeeks: '1 Week', skillName: 'Git & GitHub' },
      { id: 'sql_infra', name: 'SQL & Asset Data Management', category: 'Database', approxWeeks: '2 Weeks', skillName: 'SQL & MySQL' },
      { id: 'sys_infra', name: 'Smart City Grid Architecture', category: 'System Engineering', approxWeeks: '3 Weeks', skillName: 'System Design' },
      { id: 'infra_proj', name: 'Smart Infrastructure Capstone Project', category: 'Portfolio Project', approxWeeks: '3 Weeks', skillName: 'System Design' }
    ]
  },

  // Role 8: Robotics & CAD Automation Engineer (Mechanical Core Track)
  8: {
    roleName: 'Robotics & CAD Automation Engineer',
    description: 'Master C++ robotics programming, microcontroller sensors, kinematic motion control, and automation.',
    steps: [
      { id: 'cpp_mech', name: 'C & C++ Programming Core', category: 'Core Engineering', approxWeeks: '3 Weeks', skillName: 'C++' },
      { id: 'emb_mech', name: 'Embedded C & Microcontrollers', category: 'Firmware & Sensors', approxWeeks: '4 Weeks', skillName: 'Embedded C / Microcontrollers' },
      { id: 'robot_mech', name: 'Robotics Kinematics & Actuators', category: 'Hardware Automation', approxWeeks: '3 Weeks', skillName: 'Robotics & Microprocessors' },
      { id: 'git_mech', name: 'Git & GitHub Version Control', category: 'Tools', approxWeeks: '1 Week', skillName: 'Git & GitHub' },
      { id: 'robot_proj', name: 'Industrial Robotics Capstone Project', category: 'Portfolio Project', approxWeeks: '3 Weeks', skillName: 'Robotics & Microprocessors' }
    ]
  }
};

// Detailed resources & quiz content for interactive modal
const SKILL_STAGES_CONTENT = {
  'Java': {
    learn: [
      { title: 'Java Core Full Course (FreeCodeCamp)', type: 'Video Tutorial', link: 'https://www.youtube.com/watch?v=A74TOX803D0' },
      { title: 'Oracle Java Documentation & OOPs Guide', type: 'Official Docs', link: 'https://docs.oracle.com/en/java/' }
    ],
    practice: [
      { title: 'Solve 15 Core Java Challenges on HackerRank', link: 'https://www.hackerrank.com/domains/java' },
      { title: 'Build a Banking CLI Application in Java', task: 'Implement classes for Account, Customer, and Transaction with OOP inheritance.' }
    ],
    quiz: [
      {
        question: 'Which OOP principle allows a class to inherit fields and methods from another class?',
        options: ['Encapsulation', 'Inheritance', 'Polymorphism', 'Abstraction'],
        answer: 1,
        explanation: 'Inheritance enables a derived child class to acquire the properties and behaviors (methods and fields) of a parent class via the "extends" keyword, promoting code reusability.'
      },
      {
        question: 'Which data structure in Java Collections guarantees unique elements?',
        options: ['ArrayList', 'LinkedList', 'HashSet', 'Vector'],
        answer: 2,
        explanation: 'HashSet implements the Set interface, backed by a HashMap, which strictly disallows duplicate elements using hashCode() and equals() checks.'
      },
      {
        question: 'What is the entry point method signature for any standard Java application?',
        options: ['public void main(String args)', 'public static void main(String[] args)', 'static void main()', 'public int main()'],
        answer: 1,
        explanation: 'The JVM looks specifically for "public static void main(String[] args)" so it can execute the application entry point without instantiating the class first.'
      }
    ]
  },
  'Spring Boot': {
    learn: [
      { title: 'Spring Boot 3 Masterclass Full Course', type: 'Video Tutorial', link: 'https://www.youtube.com/results?search_query=spring+boot+3+full+course' },
      { title: 'Building RESTful Web Services Guide (Spring.io)', type: 'Official Guide', link: 'https://spring.io/guides/gs/rest-service/' }
    ],
    practice: [
      { title: 'Build a REST API with @RestController and JPA Repository', task: 'Create endpoints for GET, POST, PUT, DELETE operations connected to MySQL database.' },
      { title: 'Practice Exception Handling with @ControllerAdvice', task: 'Handle ResourceNotFoundException and return clean JSON error responses.' }
    ],
    quiz: [
      {
        question: 'Which Spring annotation is used to create RESTful web endpoints that automatically output JSON?',
        options: ['@Component', '@Service', '@RestController', '@Entity'],
        answer: 2,
        explanation: '@RestController combines @Controller and @ResponseBody, meaning handler methods write domain objects directly into JSON/XML HTTP response bodies.'
      },
      {
        question: 'What is the purpose of Spring Inversion of Control (IoC) / Dependency Injection?',
        options: ['To compile Java bytecode faster', 'To decouple components and manage bean object lifecycles automatically', 'To encrypt database passwords', 'To replace SQL queries with HTML'],
        answer: 1,
        explanation: 'IoC delegates the responsibility of instantiating, configuring, and assembling object beans to the Spring container, decoupling components for modularity and testability.'
      },
      {
        question: 'Which Spring Data JPA annotation marks an interface for automatic CRUD database operations?',
        options: ['@Repository', '@Autowired', '@Entity', '@Value'],
        answer: 0,
        explanation: '@Repository designates a Data Access Object (DAO) interface or class, enabling automatic database exception translation and CRUD method implementation.'
      }
    ]
  },
  'React.js': {
    learn: [
      { title: 'React.js Complete Course for Beginners', type: 'Video Course', link: 'https://www.youtube.com/watch?v=bMknfKXIFA8' },
      { title: 'Official React Documentation & Interactive Tutorials', type: 'Official Docs', link: 'https://react.dev/learn' }
    ],
    practice: [
      { title: 'Build a Dynamic Skill Matrix Component with useState', task: 'Manage local component state and update UI upon user button clicks.' },
      { title: 'Fetch REST API data using useEffect & Axios/Fetch', task: 'Display loading spinners while fetching and handle network error states.' }
    ],
    quiz: [
      {
        question: 'Which React Hook is primarily used for managing state in functional components?',
        options: ['useEffect', 'useState', 'useContext', 'useRef'],
        answer: 1,
        explanation: 'useState declares a state variable and provides a setter function to update it, triggering React to re-render the component with updated values.'
      },
      {
        question: 'What is JSX in React?',
        options: ['A new database query language', 'Syntax extension allowing HTML-like templates inside JavaScript', 'A CSS styling framework', 'A server deployment tool'],
        answer: 1,
        explanation: 'JSX is a syntax extension for JavaScript that looks similar to HTML. Under the hood, Babel transforms JSX into React.createElement() method calls.'
      },
      {
        question: 'When does the useEffect hook with an empty dependency array [] run?',
        options: ['On every single state re-render', 'Only once when the component mounts', 'When the user scrolls the page', 'Never'],
        answer: 1,
        explanation: 'Passing an empty dependency array [] specifies that the effect has no reactive dependencies, so it runs only once after the initial render (component mount).'
      }
    ]
  },
  'SQL & MySQL': {
    learn: [
      { title: 'SQL & Database Design Masterclass', type: 'Video Course', link: 'https://www.youtube.com/watch?v=HXV3zeQKqGY' },
      { title: 'MySQL 8.0 Reference Manual & Query Syntax', type: 'Official Docs', link: 'https://dev.mysql.com/doc/refman/8.0/en/' }
    ],
    practice: [
      { title: 'Solve 20 SQL Query Challenges on LeetCode', link: 'https://leetcode.com/problemset/database/' },
      { title: 'Design a Normalized E-Commerce Database Schema', task: 'Create tables for Users, Orders, Products with Primary & Foreign Key constraints.' }
    ],
    quiz: [
      {
        question: 'Which SQL clause is used to filter records based on aggregate functions (e.g. COUNT, SUM)?',
        options: ['WHERE', 'HAVING', 'ORDER BY', 'GROUP BY'],
        answer: 1,
        explanation: 'HAVING is evaluated after GROUP BY aggregations (e.g., HAVING COUNT(*) > 5), whereas WHERE filters individual rows prior to grouping.'
      },
      {
        question: 'Which JOIN returns all rows from the left table and matched rows from the right table?',
        options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN'],
        answer: 1,
        explanation: 'LEFT JOIN (or LEFT OUTER JOIN) guarantees all rows from the left table are returned; unmatched right table columns are populated with NULL.'
      },
      {
        question: 'What does ACID stand for in Database Transactions?',
        options: ['Atomicity, Consistency, Isolation, Durability', 'Access, Control, Index, Data', 'Array, Code, Input, Display', 'Automatic, Concurrent, Internal, Distributed'],
        answer: 0,
        explanation: 'ACID stands for Atomicity (all-or-nothing), Consistency (integrity constraints), Isolation (transaction independence), and Durability (persisted commits).'
      }
    ]
  },
  'REST API Design': {
    learn: [
      { title: 'RESTful API Best Practices & Architecture', type: 'Guide', link: 'https://restfulapi.net/' },
      { title: 'Postman Student Expert API Course', type: 'Course', link: 'https://www.postman.com/student-program/student-expert/' }
    ],
    practice: [
      { title: 'Design REST Endpoints for Student Skill Gap System', task: 'Use standard URIs: GET /api/students, POST /api/skills, DELETE /api/skills/{id}.' },
      { title: 'Test APIs with Postman & Validate Status Codes', task: 'Ensure 200 OK, 201 Created, 400 Bad Request, 404 Not Found are returned appropriately.' }
    ],
    quiz: [
      {
        question: 'Which HTTP method should be used to create a new resource on a server?',
        options: ['GET', 'POST', 'PUT', 'DELETE'],
        answer: 1,
        explanation: 'POST is the standard REST method for submitting an entity to create a new subordinate resource under a collection URI.'
      },
      {
        question: 'What HTTP status code indicates successful resource creation?',
        options: ['200 OK', '201 Created', '400 Bad Request', '500 Server Error'],
        answer: 1,
        explanation: 'HTTP status 201 Created signifies that the request succeeded and resulted in one or more new resources being created on the server.'
      },
      {
        question: 'What is the standard format used for data exchange in modern RESTful APIs?',
        options: ['XML', 'JSON', 'CSV', 'Plain Text'],
        answer: 1,
        explanation: 'JSON (JavaScript Object Notation) is the universally standard lightweight format for modern REST APIs due to its human-readability and native browser JSON parsing.'
      }
    ]
  },
  'Git & GitHub': {
    learn: [
      { title: 'Git & GitHub Crash Course for Beginners', type: 'Video Course', link: 'https://www.youtube.com/watch?v=RGOj5yH7evk' },
      { title: 'Official Pro Git Book', type: 'Official Guide', link: 'https://git-scm.com/book/en/v2' }
    ],
    practice: [
      { title: 'Create a Feature Branch and Submit a Pull Request', task: 'Execute git checkout -b feature/auth, commit changes, push and open PR.' },
      { title: 'Resolve a Merge Conflict in Git', task: 'Simulate conflicting edits on main branch and rebase/merge cleanly.' }
    ],
    quiz: [
      {
        question: 'Which Git command stages modified files for the next commit?',
        options: ['git push', 'git add', 'git checkout', 'git init'],
        answer: 1,
        explanation: '"git add <file>" moves changes from the local working tree into the staging index, staging them to be committed.'
      },
      {
        question: 'What command creates and switches to a new branch named "feature"?',
        options: ['git branch feature', 'git checkout -b feature', 'git commit -m "feature"', 'git pull feature'],
        answer: 1,
        explanation: '"git checkout -b feature" (or "git switch -c feature") creates a new branch pointer and checks it out immediately.'
      },
      {
        question: 'What is a Pull Request (PR) on GitHub?',
        options: ['A command to download files', 'A request to review and merge code changes from one branch into another', 'A password reset request', 'A build error report'],
        answer: 1,
        explanation: 'A Pull Request is a collaborative GitHub mechanism proposing changes from a branch to be code-reviewed, tested, and merged into a target branch.'
      }
    ]
  },
  'Python': {
    learn: [
      { title: 'Python for Beginners Full Course', type: 'Video Tutorial', link: 'https://www.youtube.com/watch?v=rfscVS0vtbw' },
      { title: 'Python Official Documentation & Standard Library', type: 'Official Docs', link: 'https://docs.python.org/3/' }
    ],
    practice: [
      { title: 'Practice List Comprehensions & Lambda Functions', task: 'Filter and transform lists using clean one-line Python expressions.' }
    ],
    quiz: [
      {
        question: 'Which immutable data structure in Python is defined using parentheses ()?',
        options: ['List', 'Dictionary', 'Tuple', 'Set'],
        answer: 2,
        explanation: 'Tuples are immutable ordered collections defined with round parentheses (). Once instantiated, elements cannot be modified, added, or deleted.'
      },
      {
        question: 'What Keyword is used to define a function in Python?',
        options: ['func', 'def', 'function', 'define'],
        answer: 1,
        explanation: 'In Python, functions are defined using the "def" keyword, followed by the function name and argument parameters.'
      },
      {
        question: 'How do you handle exceptions in Python?',
        options: ['try / catch', 'try / except', 'do / error', 'if / else'],
        answer: 1,
        explanation: 'Python uses "try" and "except" blocks (with optional "else" and "finally") to gracefully intercept and handle exceptions at runtime.'
      }
    ]
  },
  'Machine Learning': {
    learn: [
      { title: 'Machine Learning Specialization by Andrew Ng', type: 'Course', link: 'https://www.coursera.org/specializations/machine-learning-introduction' },
      { title: 'Scikit-Learn Official User Guide', type: 'Docs', link: 'https://scikit-learn.org/stable/user_guide.html' }
    ],
    practice: [
      { title: 'Train a Classification Model with Scikit-Learn', task: 'Load dataset, split train/test sets, train Random Forest, evaluate Accuracy.' }
    ],
    quiz: [
      {
        question: 'Which type of Machine Learning uses labeled training data?',
        options: ['Unsupervised Learning', 'Supervised Learning', 'Reinforcement Learning', 'Clustering'],
        answer: 1,
        explanation: 'Supervised Learning trains models using datasets with known input-output pairs, enabling the model to learn mapping relationships from features to labels.'
      },
      {
        question: 'Which metric measures the percentage of correct predictions out of total predictions?',
        options: ['Recall', 'Precision', 'Accuracy', 'MSE'],
        answer: 2,
        explanation: 'Accuracy is calculated as (True Positives + True Negatives) / Total Samples, representing the proportion of all predictions that were correct.'
      },
      {
        question: 'What tool in Scikit-Learn is used to split datasets into training and testing portions?',
        options: ['GridSearchCV', 'train_test_split', 'StandardScaler', 'Pipeline'],
        answer: 1,
        explanation: 'train_test_split from sklearn.model_selection partitions datasets into training and testing subsets to evaluate out-of-sample model generalization.'
      }
    ]
  },
  'Embedded C / Microcontrollers': {
    learn: [
      { title: 'Embedded C & Microcontroller Architecture Course', type: 'Video Tutorial', link: 'https://www.youtube.com/results?search_query=embedded+c+microcontroller+course' },
      { title: 'STM32 & Microchip Official Firmware Documentation', type: 'Official Docs', link: 'https://www.microchip.com/' }
    ],
    practice: [
      { title: 'Write GPIO Driver & LED Blinking in Embedded C', task: 'Configure microcontroller registers, directional pins, and delay timers.' },
      { title: 'Implement I2C / SPI Sensor Communication Interface', task: 'Read temperature & accelerometer data via I2C bus protocol.' }
    ],
    quiz: [
      {
        question: 'Which C keyword prevents compiler optimization on hardware register addresses?',
        options: ['static', 'volatile', 'extern', 'const'],
        answer: 1,
        explanation: 'The "volatile" qualifier warns the compiler that the variable memory location can change outside program flow (e.g., via hardware), preventing caching reads.'
      },
      {
        question: 'Which serial protocol uses two signal lines (SDA & SCL) for sensor communication?',
        options: ['UART', 'SPI', 'I2C', 'CAN Bus'],
        answer: 2,
        explanation: 'I2C (Inter-Integrated Circuit) communicates synchronously over two bidirectional bus lines: SDA (Serial Data) and SCL (Serial Clock).'
      },
      {
        question: 'What routine is executed when a hardware interrupt is triggered in a microcontroller?',
        options: ['Main Loop', 'Interrupt Service Routine (ISR)', 'System Call', 'Thread Worker'],
        answer: 1,
        explanation: 'An Interrupt Service Routine (ISR) is a hardware-invoked handler that executes with high priority when a peripheral or external interrupt fires.'
      }
    ]
  },
  'C++': {
    learn: [
      { title: 'C++ Programming Complete Masterclass (FreeCodeCamp)', type: 'Video Tutorial', link: 'https://www.youtube.com/watch?v=vLnPwxZdW4w' },
      { title: 'cppreference.com Official C++ Standard Library Reference', type: 'Official Docs', link: 'https://en.cppreference.com/' }
    ],
    practice: [
      { title: 'Solve 20 Pointer & Memory Management Challenges on HackerRank', link: 'https://www.hackerrank.com/domains/cpp' },
      { title: 'Implement a Custom Dynamic Vector Class using Pointers & OOP', task: 'Manage heap allocation, copy constructors, and destructors.' }
    ],
    quiz: [
      {
        question: 'Which keyword in C++ enables runtime dynamic polymorphism for member functions?',
        options: ['virtual', 'override', 'static', 'inline'],
        answer: 0,
        explanation: 'The "virtual" keyword instructs C++ to resolve function calls dynamically at runtime using a virtual method table (vtable), enabling polymorphism.'
      },
      {
        question: 'Which operator allocates dynamic memory on the heap in C++?',
        options: ['malloc()', 'alloc()', 'new', 'create'],
        answer: 2,
        explanation: '"new" is the type-safe C++ operator that allocates memory from the heap and automatically calls constructor initialization for the object.'
      },
      {
        question: 'Which C++ Standard Template Library (STL) container provides O(1) average lookup time?',
        options: ['std::vector', 'std::list', 'std::unordered_map', 'std::set'],
        answer: 2,
        explanation: 'std::unordered_map utilizes an internal hash table, delivering O(1) average constant-time complexity for key lookups and insertions.'
      }
    ]
  },
  'Robotics & Microprocessors': {
    learn: [
      { title: 'Robotics Kinematics & Motor Control Masterclass', type: 'Course', link: 'https://www.youtube.com/results?search_query=robotics+kinematics+course' },
      { title: 'ROS (Robot Operating System) Official Documentation', type: 'Official Docs', link: 'https://www.ros.org/' }
    ],
    practice: [
      { title: 'Simulate Robotic Arm Forward & Inverse Kinematics', task: 'Calculate end-effector positions using joint angles and transformation matrices.' },
      { title: 'Build Obstacle Avoidance Algorithm with Ultrasonic Sensors', task: 'Implement PID control loop for smooth motor speed adjustments.' }
    ],
    quiz: [
      {
        question: 'What open-source middleware framework is widely used for robotics software development?',
        options: ['ROS (Robot Operating System)', 'TensorFlow', 'Spring Boot', 'Node.js'],
        answer: 0,
        explanation: 'ROS (Robot Operating System) is the global robotics standard, providing device drivers, visualizers, message-passing nodes, and package management.'
      },
      {
        question: 'Which component converts electrical signals into mechanical motion in a robot?',
        options: ['Transducer', 'Actuator / Servo Motor', 'Resistor', 'Capacitor'],
        answer: 1,
        explanation: 'Actuators (e.g. servo motors, stepper motors, linear actuators) convert electronic control signals into kinetic physical movement and torque.'
      },
      {
        question: 'What mathematical model calculates joint angles required to reach a target 3D coordinate?',
        options: ['Forward Kinematics', 'Inverse Kinematics', 'Differential Equations', 'Fourier Transform'],
        answer: 1,
        explanation: 'Inverse Kinematics (IK) computes the specific robotic joint angles and links configuration required to place an end-effector at a desired Cartesian coordinate.'
      }
    ]
  },
  'Deep Learning': {
    learn: [
      { title: 'Deep Learning Specialization by Andrew Ng', type: 'Video Course', link: 'https://www.coursera.org/specializations/machine-learning-introduction' },
      { title: 'PyTorch Official Neural Network Tutorials', type: 'Official Docs', link: 'https://pytorch.org/tutorials/' }
    ],
    practice: [
      { title: 'Train a Convolutional Neural Network (CNN) on ImageNet/MNIST', task: 'Build Conv2D, MaxPooling, and Dense layers to classify images with PyTorch.' }
    ],
    quiz: [
      {
        question: 'Which activation function is commonly used in deep neural network hidden layers to solve vanishing gradients?',
        options: ['Sigmoid', 'Tanh', 'ReLU (Rectified Linear Unit)', 'Linear'],
        answer: 2,
        explanation: 'ReLU f(x) = max(0, x) maintains a constant derivative of 1 for all positive activations, preventing the gradient from diminishing across deep network layers.'
      },
      {
        question: 'Which algorithm updates neural network weights by calculating loss gradients using the chain rule?',
        options: ['Forward Propagation', 'Backpropagation', 'K-Means Clustering', 'Decision Tree'],
        answer: 1,
        explanation: 'Backpropagation applies the calculus chain rule recursively backwards from the loss function to calculate partial derivatives and update weight matrices.'
      },
      {
        question: 'Which layer type is specialized for processing 2D grid image data in deep learning?',
        options: ['Dense Layer', 'Convolutional Layer (CNN)', 'Recurrent Layer (RNN)', 'Embedding Layer'],
        answer: 1,
        explanation: 'Convolutional layers apply 2D spatial filtering kernels across input feature maps, preserving local spatial hierarchies such as edges and textures.'
      }
    ]
  },
  'Docker & Kubernetes': {
    learn: [
      { title: 'Docker & Kubernetes Full Course for Beginners', type: 'Video Tutorial', link: 'https://www.youtube.com/watch?v=X48VuDVv0do' },
      { title: 'Docker Official Get Started Documentation', type: 'Official Docs', link: 'https://docs.docker.com/get-started/' }
    ],
    practice: [
      { title: 'Write a Dockerfile and Containerize a Microservice API', task: 'Create multi-stage builds and run containers with environment variables.' },
      { title: 'Deploy a 3-Pod Cluster on Kubernetes with Deployment & Service YAMLs', task: 'Configure NodePort / LoadBalancer service endpoints.' }
    ],
    quiz: [
      {
        question: 'Which Docker CLI command builds an image from a Dockerfile?',
        options: ['docker run', 'docker build', 'docker create', 'docker start'],
        answer: 1,
        explanation: '"docker build" parses instructions in the Dockerfile (FROM, RUN, COPY) and packages them into an immutable container image layer.'
      },
      {
        question: 'What is the smallest deployable execution unit in Kubernetes containing one or more containers?',
        options: ['Node', 'Pod', 'Cluster', 'Namespace'],
        answer: 1,
        explanation: 'A Pod is the atomic building block of Kubernetes; it wraps one or more tightly coupled containers sharing network namespaces and storage volumes.'
      },
      {
        question: 'Which Kubernetes manifest object manages pod scaling and rolling updates automatically?',
        options: ['Deployment', 'ConfigMap', 'Secret', 'Ingress'],
        answer: 0,
        explanation: 'A Kubernetes Deployment controller declaratively orchestrates ReplicaSets, providing zero-downtime rolling updates, canary rollouts, and automatic pod rollbacks.'
      }
    ]
  },
  'Data Structures & Algorithms': {
    learn: [
      { title: 'Data Structures and Algorithms Full Course', type: 'Video Tutorial', link: 'https://www.youtube.com/watch?v=8hly31xKLI0' },
      { title: 'LeetCode Blind 75 & Top Interview Roadmap', type: 'Practice Portal', link: 'https://leetcode.com/studyplan/leetcode-75/' }
    ],
    practice: [
      { title: 'Solve 20 Array, Hash Table & Two-Pointer Problems on LeetCode', link: 'https://leetcode.com/problemset/all/' },
      { title: 'Implement Binary Search Tree (BST) & Graph BFS/DFS Traversal', task: 'Write recursive and iterative graph traversal algorithms.' }
    ],
    quiz: [
      {
        question: 'What is the average time complexity of QuickSort and MergeSort?',
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'],
        answer: 1,
        explanation: 'Both algorithms use divide-and-conquer to recursively split arrays and recombine them, achieving optimal O(n log n) average comparison sorting.'
      },
      {
        question: 'Which data structure operates strictly on a Last-In-First-Out (LIFO) order?',
        options: ['Queue', 'Stack', 'Array', 'LinkedList'],
        answer: 1,
        explanation: 'A Stack strictly manages elements such that the last element inserted (pushed) is the first element retrieved (popped), operating under LIFO.'
      },
      {
        question: 'Which graph algorithm finds the shortest path in a weighted graph with non-negative edges?',
        options: ['Breadth-First Search (BFS)', 'Dijkstra\'s Algorithm', 'Kruskal\'s Algorithm', 'Depth-First Search (DFS)'],
        answer: 1,
        explanation: 'Dijkstra\'s algorithm uses a priority queue (min-heap) to compute the single-source shortest path tree on non-negatively weighted graphs in O((V + E) log V).'
      }
    ]
  },
  'System Design': {
    learn: [
      { title: 'System Design Primer & Scalable Architecture Guide', type: 'GitHub Guide', link: 'https://github.com/donnemartin/system-design-primer' },
      { title: 'High Scalability & Distributed Systems Principles', type: 'Guide', link: 'http://highscalability.com/' }
    ],
    practice: [
      { title: 'Design a Distributed URL Shortener System (TinyURL)', task: 'Incorporate Load Balancers, Redis caching layer, and DB Sharding.' }
    ],
    quiz: [
      {
        question: 'According to the CAP Theorem, which 3 properties cannot all be simultaneously guaranteed in a distributed system during network partition?',
        options: ['Consistency, Availability, Partition Tolerance', 'Concurrency, Access, Performance', 'Control, Authentication, Protection', 'CPU, Array, Process'],
        answer: 0,
        explanation: 'The CAP Theorem establishes that during a network partition, a distributed system must choose between guaranteeing Consistency (C) or Availability (A).'
      },
      {
        question: 'Which tool distributes incoming client traffic across multiple backend app instances?',
        options: ['Database Index', 'Load Balancer', 'API Gateway', 'DNS Server'],
        answer: 1,
        explanation: 'A Load Balancer distributes client network requests across pools of upstream application servers to optimize throughput and ensure fault tolerance.'
      },
      {
        question: 'Which caching strategy writes data directly to the cache and database at the same time?',
        options: ['Cache-Aside', 'Write-Through', 'Write-Behind', 'Read-Through'],
        answer: 1,
        explanation: 'Write-Through caching writes updates to both the cache store and backing database synchronously, eliminating stale cache reads at the cost of higher write latency.'
      }
    ]
  }
};

// Helper function to safely fetch stage content for any skill without fallback to Java
const getSkillStageContent = (skillName) => {
  if (!skillName) return SKILL_STAGES_CONTENT['Python'];
  if (SKILL_STAGES_CONTENT[skillName]) return SKILL_STAGES_CONTENT[skillName];
  
  // Fuzzy match
  const matchedKey = Object.keys(SKILL_STAGES_CONTENT).find(key => 
    skillName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(skillName.toLowerCase())
  );
  if (matchedKey) return SKILL_STAGES_CONTENT[matchedKey];

  // Dynamic fallback custom-tailored for skillName
  return {
    learn: [
      { title: `${skillName} Core Tutorials & Fundamentals`, type: 'Video Tutorial', link: `https://www.youtube.com/results?search_query=${encodeURIComponent(skillName + ' tutorial')}` },
      { title: `Official ${skillName} Documentation & Developer Guide`, type: 'Official Docs', link: `https://www.google.com/search?q=${encodeURIComponent(skillName + ' official documentation')}` }
    ],
    practice: [
      { title: `Solve Hands-on ${skillName} Exercises & Mini-Projects`, task: `Apply core concepts of ${skillName} by writing modular code and testing edge cases.` }
    ],
    quiz: [
      {
        question: `What is the primary core objective when implementing ${skillName}?`,
        options: [`To build robust & efficient ${skillName} architecture`, 'To slow down server response', 'To bypass compiler checks', 'To output plain HTML'],
        answer: 0,
        explanation: `Building a robust, scalable architecture with optimal performance is the core objective when developing systems with ${skillName}.`
      },
      {
        question: `Which best practice should be followed when working with ${skillName}?`,
        options: ['Follow clean modular code design and handle errors gracefully', 'Ignore exception handling', 'Hardcode credentials in production', 'Delete unit tests'],
        answer: 0,
        explanation: 'Clean code architecture with robust defensive error handling ensures enterprise codebases remain testable, maintainable, and secure.'
      },
      {
        question: `What metric evaluates successful implementation of ${skillName}?`,
        options: ['Correct functionality and performance benchmarks', 'File size only', 'Line count of code', 'Number of console logs'],
        answer: 0,
        explanation: 'Technical interviewers evaluate both functional correctness and runtime performance efficiency (time/space complexity) against production benchmarks.'
      }
    ]
  };
};

// ==========================================
// TARGET DREAM COMPANY INTERVIEW BLUEPRINTS
// ==========================================
const COMPANY_INTERVIEW_BLUEPRINTS = {
  'google': {
    name: 'Google',
    tier: 'MAANG / Tier-1 Global',
    logoColor: '#ea4335',
    bgTint: '#fef2f2',
    badge: 'Top Algorithmic Bar',
    cutoffScore: 80,
    shortlistingTips: [
      'Resume Screening: Heavy weightage on competitive programming profiles, open-source GitHub contributions, and algorithmic depth.',
      'Online Assessment: 2 medium-hard questions on Graphs, Trees, and Dynamic Programming with strict time/space complexity.',
      'Interview Rounds: Live coding on Google Meet/Docs without IDE autocomplete; prioritizes clean code, edge testing, and time complexity analysis.'
    ],
    interviewRounds: [
      { round: 'Round 1: Online Assessment (OA)', duration: '90 Mins', platform: 'CodeSignal / Google Portal', focus: '2 Algorithmic challenges (Graphs, Trees, DP) with tight CPU/memory limits.' },
      { round: 'Round 2: Tech Interview 1 (DSA & Coding)', duration: '45 Mins', platform: 'Google Meet', focus: 'Live coding on Data Structures, edge case testing, and clean modular code design.' },
      { round: 'Round 3: Tech Interview 2 (Role & System Depth)', duration: '45 Mins', platform: 'Google Meet', focus: 'Concurrency, memory management, JVM/Python internals, scalable APIs, and database indexing.' },
      { round: 'Round 4: Googliness & Leadership', duration: '45 Mins', platform: 'Google Meet', focus: 'Culture fit, navigating ambiguity, ethical problem solving, and cross-functional collaboration.' }
    ],
    skillShortlistWeight: {
      'Java': { level: 'Crucial', note: 'Multithreading, concurrency, thread pools & JVM garbage collection internals' },
      'Spring Boot': { level: 'High', note: 'Microservices architecture, thread pools & REST contracts' },
      'Python': { level: 'Crucial', note: 'Clean algorithmic scripting & standard library performance' },
      'Machine Learning': { level: 'Crucial', note: 'Mathematical foundations, gradient descent & neural architectures' },
      'Deep Learning': { level: 'Crucial', note: 'PyTorch/TensorFlow, Transformers & attention mechanisms' },
      'Data Structures & Algorithms': { level: 'Critical', note: 'LeetCode Medium/Hard graphs, trees, and dynamic programming' },
      'System Design': { level: 'Critical', note: 'High throughput, distributed consensus, caching & CAP theorem trade-offs' },
      'SQL & MySQL': { level: 'High', note: 'Query optimization, indexing strategies & ACID guarantees' },
      'React.js': { level: 'High', note: 'State management, custom hooks, and rendering optimizations' },
      'Git & GitHub': { level: 'Standard', note: 'Branching strategies, CI/CD integrations & code reviews' }
    },
    companyQuestions: {
      'Java': [
        { question: 'How would you design a thread-safe LRU Cache in Java without using LinkedHashMap?', type: 'Concurrency & Design' },
        { question: 'Explain how the JVM Garbage Collector handles memory fragmentation during high throughput.', type: 'JVM Internals' }
      ],
      'Spring Boot': [
        { question: 'How do you design an idempotent REST API in Spring Boot for high-traffic financial transactions?', type: 'Enterprise API' }
      ],
      'Python': [
        { question: 'Implement an asynchronous rate limiter in Python using asyncio and token-bucket algorithm.', type: 'Concurrency' }
      ],
      'Machine Learning': [
        { question: 'How do you prevent vanishing and exploding gradients in deep neural network backpropagation?', type: 'Neural Networks' }
      ],
      'Data Structures & Algorithms': [
        { question: 'Find the Shortest Path in a Weighted Directed Acyclic Graph (DAG) in O(V + E) time.', type: 'Graph Theory' }
      ],
      'System Design': [
        { question: 'Design Google Drive / Dropbox file chunking, de-duplication, and synchronization architecture.', type: 'Distributed Storage' }
      ],
      'SQL & MySQL': [
        { question: 'How does a B-Tree index work in MySQL InnoDB, and why are composite indexes order-sensitive?', type: 'DB Internals' }
      ],
      'React.js': [
        { question: 'How would you build a virtualized infinite scroll component in React to render 100,000 records smoothly?', type: 'UI Optimization' }
      ]
    }
  },

  'amazon': {
    name: 'Amazon',
    tier: 'MAANG / Cloud & E-Commerce',
    logoColor: '#f59e0b',
    bgTint: '#fffbeb',
    badge: 'Leadership Principles & LLD',
    cutoffScore: 75,
    shortlistingTips: [
      'Resume Screening: Emphasize quantifiable metrics (e.g. "reduced latency by 35%"), Java/Python microservices, and end-to-end projects.',
      'Online Assessment: 2 coding questions on HackerRank (AMCAT) + Work Style simulation questionnaire.',
      'Interview Rounds: Every technical round evaluates both coding/design AND 2 Amazon Leadership Principles using the STAR method.'
    ],
    interviewRounds: [
      { round: 'Round 1: Online Assessment (OA)', duration: '90 Mins', platform: 'HackerRank (AMCAT)', focus: '2 Coding challenges (Arrays, HashMaps, Trees) + Work Style Simulation.' },
      { round: 'Round 2: Tech Interview 1 (Problem Solving & LLD)', duration: '60 Mins', platform: 'Amazon Chime', focus: 'Low-level design (Design Parking Lot / Locker System) with OOP & Design Patterns.' },
      { round: 'Round 3: Tech Interview 2 (Backend & System Depth)', duration: '60 Mins', platform: 'Amazon Chime', focus: 'REST APIs, Spring Boot microservices, database schemas, queues (SQS/Kafka).' },
      { round: 'Round 4: Bar Raiser & Leadership Principles', duration: '60 Mins', platform: 'Amazon Chime', focus: 'Customer Obsession, Ownership, Bias for Action stories using STAR framework.' }
    ],
    skillShortlistWeight: {
      'Java': { level: 'Critical', note: 'Core OOP, Collections framework & SOLID design principles' },
      'Spring Boot': { level: 'Critical', note: 'Enterprise microservices, JPA repositories & transactional isolation' },
      'SQL & MySQL': { level: 'High', note: 'Relational schemas, query optimization & transaction locks' },
      'REST API Design': { level: 'Critical', note: 'RESTful idempotency, pagination, status codes & Swagger specs' },
      'Data Structures & Algorithms': { level: 'Critical', note: 'Binary Search Trees, Heaps, Priority Queues & HashMaps' },
      'System Design': { level: 'Critical', note: 'Distributed microservices, asynchronous message queues & caching' },
      'React.js': { level: 'High', note: 'Modular UI architecture & API integration' },
      'Docker & Kubernetes': { level: 'High', note: 'Containerized deployment & cloud elasticity' }
    },
    companyQuestions: {
      'Java': [
        { question: 'Design an Object-Oriented Amazon Locker Delivery System with sizes, pin authentication, and expiry.', type: 'Low-Level Design' },
        { question: 'Explain how HashMap handles hash collisions in Java 8+ (LinkedList vs Red-Black Tree threshold).', type: 'Collections' }
      ],
      'Spring Boot': [
        { question: 'Implement distributed order processing with optimistic locking in Spring Boot & MySQL to avoid double-booking.', type: 'Backend Architecture' }
      ],
      'REST API Design': [
        { question: 'Design a REST API contract for Amazon Prime Cart Checkout supporting idempotency keys.', type: 'API Architecture' }
      ],
      'SQL & MySQL': [
        { question: 'Write a SQL query to calculate top 3 selling product categories per city per month.', type: 'Aggregation' }
      ]
    }
  },

  'microsoft': {
    name: 'Microsoft',
    tier: 'MAANG / Enterprise Cloud & AI',
    logoColor: '#0284c7',
    bgTint: '#f0f9ff',
    badge: 'Clean Code & Cloud Architecture',
    cutoffScore: 75,
    shortlistingTips: [
      'Resume Screening: Clear project architectures, clean code conventions, and strong CS fundamentals.',
      'Online Assessment: 2-3 Codility questions emphasizing edge cases (null inputs, integer overflows, boundary limits).',
      'Technical Screens: Live coding on Teams with an emphasis on code readability, modularity, and testing.'
    ],
    interviewRounds: [
      { round: 'Round 1: Codility Online Assessment', duration: '75 Mins', platform: 'Codility', focus: '2-3 algorithmic problems focusing on Strings, HashMaps, and Binary Trees.' },
      { round: 'Round 2: Tech Interview 1 (DSA & Problem Solving)', duration: '45 Mins', platform: 'Microsoft Teams', focus: 'Problem solving with focus on time complexity and bug-free production code.' },
      { round: 'Round 3: Tech Interview 2 (Role & Frameworks)', duration: '45 Mins', platform: 'Microsoft Teams', focus: 'Spring Boot / C# backend, REST APIs, database queries, and unit testing.' },
      { round: 'Round 4: Technical & Cultural Fit (AA Round)', duration: '45 Mins', platform: 'Microsoft Teams', focus: 'Past capstone projects, architectural decisions, and growth mindset.' }
    ],
    skillShortlistWeight: {
      'Java': { level: 'Critical', note: 'Clean OOP hierarchy, exception handling, and memory lifecycle' },
      'Spring Boot': { level: 'High', note: 'Enterprise web services, Spring Security & dependency injection' },
      'Data Structures & Algorithms': { level: 'Critical', note: 'Tree traversals, BFS/DFS graph search & binary search' },
      'System Design': { level: 'High', note: 'Cloud architecture, caching layers & API gateways' },
      'React.js': { level: 'High', note: 'Reusable component libraries & TypeScript integration' },
      'SQL & MySQL': { level: 'High', note: 'Relational data modeling, foreign keys & query execution plans' }
    },
    companyQuestions: {
      'Java': [
        { question: 'Implement an In-Order traversal of a Binary Tree both recursively and iteratively.', type: 'Trees & OOP' }
      ],
      'Spring Boot': [
        { question: 'How do you secure a Spring Boot REST API using JWT tokens and role-based access control?', type: 'Security' }
      ],
      'System Design': [
        { question: 'Design a distributed rate limiter for Microsoft Azure API Management.', type: 'Cloud Systems' }
      ]
    }
  },

  'meta': {
    name: 'Meta',
    tier: 'MAANG / Social & High Scale',
    logoColor: '#0668e1',
    bgTint: '#eff6ff',
    badge: 'Speed & Distributed Scale',
    cutoffScore: 80,
    shortlistingTips: [
      'Fast Problem Solving: Candidates are expected to solve 2 LeetCode Medium/Hard problems cleanly within 40 minutes.',
      'System Design: Focuses on massive distributed data (billions of users), graph databases, and caching.',
      'Frontend: In-depth understanding of React internals, fiber architecture, and reconciliation.'
    ],
    interviewRounds: [
      { round: 'Round 1: Online Assessment (OA)', duration: '70 Mins', platform: 'CodeSignal', focus: '2-3 algorithmic problems focusing on speed, edge cases, and algorithmic efficiency.' },
      { round: 'Round 2: Coding Technical Screen 1', duration: '45 Mins', platform: 'CoderPad / Video', focus: '2 algorithmic questions (Binary Trees, Graphs, DP) in 40 minutes.' },
      { round: 'Round 3: Coding Technical Screen 2', duration: '45 Mins', platform: 'CoderPad / Video', focus: 'System coding, custom data structure implementation, and string manipulation.' },
      { round: 'Round 4: System Design & Culture', duration: '45 Mins', platform: 'Video Call', focus: 'Scalable social feed design, caching strategies, and live-site debugging.' }
    ],
    skillShortlistWeight: {
      'React.js': { level: 'Critical', note: 'React virtual DOM, fiber reconciler, state management & performance' },
      'Data Structures & Algorithms': { level: 'Critical', note: 'Rapid BFS/DFS, hash sets, graph cycles & sliding window' },
      'Python': { level: 'High', note: 'Clean algorithmic execution and data wrangling' },
      'System Design': { level: 'Critical', note: 'Global scale feeds, pub/sub queues, and distributed caches' }
    },
    companyQuestions: {
      'React.js': [
        { question: 'How does React 18 Concurrent Mode and automatic batching work under the hood?', type: 'React Internals' }
      ],
      'Data Structures & Algorithms': [
        { question: 'Find the Minimum Window Substring containing all characters of a target string in O(N).', type: 'Sliding Window' }
      ]
    }
  },

  'tcs': {
    name: 'TCS',
    tier: 'IT Titan / Global Services',
    logoColor: '#1d4ed8',
    bgTint: '#eff6ff',
    badge: 'TCS NQT Placement Drive',
    cutoffScore: 65,
    shortlistingTips: [
      'TCS NQT Score: A high NQT score qualifies candidates for TCS Digital (7 LPA) and Prime (9 LPA) packages.',
      'Core Programming: Focuses on Java/Python fundamentals, OOPs concepts, basic DSA, and SQL queries.',
      'Technical Interview: Evaluates college academic projects, database normalization, and communication skills.'
    ],
    interviewRounds: [
      { round: 'Round 1: TCS NQT Exam', duration: '120 Mins', platform: 'TCS iON Portal', focus: 'Cognitive skills + Hands-on Coding (Strings, Arrays, Number Theory in Java/Python).' },
      { round: 'Round 2: Technical Interview', duration: '35 Mins', platform: 'In-person / Teams', focus: 'Core Java OOP concepts, SQL queries (JOINs, GROUP BY), and academic projects.' },
      { round: 'Round 3: Managerial & HR Round', duration: '20 Mins', platform: 'In-person / Teams', focus: 'Willingness to learn new tech stacks, shift flexibility, and communication skills.' }
    ],
    skillShortlistWeight: {
      'Java': { level: 'Critical', note: 'OOP concepts (Inheritance, Polymorphism), Collections, Exception handling' },
      'SQL & MySQL': { level: 'Critical', note: 'Writing DDL/DML, JOINs, subqueries, and table constraints' },
      'Spring Boot': { level: 'High', note: 'Crucial for qualifying for high-tier TCS Digital & Prime offers' },
      'React.js': { level: 'High', note: 'Enterprise web development capability' },
      'Data Structures & Algorithms': { level: 'High', note: 'Linear structures, searching, sorting & string manipulation' }
    },
    companyQuestions: {
      'Java': [
        { question: 'Explain the difference between StringBuffer and StringBuilder with memory considerations.', type: 'Core Java' },
        { question: 'How does Method Overloading differ from Method Overriding in Java?', type: 'OOP Principles' }
      ],
      'SQL & MySQL': [
        { question: 'Write a SQL query to find the 2nd highest salary from an Employee table without using LIMIT.', type: 'Query Problem' }
      ],
      'Spring Boot': [
        { question: 'What is the role of @Autowired and Dependency Injection in Spring Boot?', type: 'Spring Core' }
      ]
    }
  },

  'infosys': {
    name: 'Infosys',
    tier: 'IT Titan / Global Services',
    logoColor: '#007cc3',
    bgTint: '#f0f9ff',
    badge: 'InfyTQ & HackWithInfy',
    cutoffScore: 65,
    shortlistingTips: [
      'HackWithInfy / InfyTQ: Certifications unlock Specialist Programmer (9.5 LPA) and Digital Specialist Engineer (6.5 LPA) roles.',
      'Foundation: Strong grasp of Java/Python, database queries, and algorithmic problem solving.',
      'Project Discussion: Ability to explain database schema and architecture of your capstone project.'
    ],
    interviewRounds: [
      { round: 'Round 1: InfyTQ / Online Assessment', duration: '90 Mins', platform: 'Infosys Portal', focus: 'Java/Python programming, Data Structures & Algorithms, and DBMS queries.' },
      { round: 'Round 2: Technical Interview', duration: '40 Mins', platform: 'Infosys Platform / Teams', focus: 'Live coding on arrays/strings, OOP principles, and deep dive into college projects.' },
      { round: 'Round 3: HR & Behavioral Round', duration: '20 Mins', platform: 'Teams', focus: 'Interpersonal skills, willingness to relocate, and career vision.' }
    ],
    skillShortlistWeight: {
      'Java': { level: 'Critical', note: 'OOP inheritance, collections, interface vs abstract class' },
      'SQL & MySQL': { level: 'Critical', note: 'Joins, group by, aggregations, primary/foreign keys' },
      'Spring Boot': { level: 'High', note: 'REST APIs and microservices for DSE/SP tracks' },
      'React.js': { level: 'High', note: 'UI components and event handling' }
    },
    companyQuestions: {
      'Java': [
        { question: 'What is the difference between Comparable and Comparator interfaces in Java?', type: 'Collections' },
        { question: 'Can an Abstract class have a constructor? Explain when it gets invoked.', type: 'OOP' }
      ],
      'SQL & MySQL': [
        { question: 'Explain the difference between INNER JOIN, LEFT JOIN, and CROSS JOIN with example queries.', type: 'SQL Queries' }
      ]
    }
  },

  'accenture': {
    name: 'Accenture',
    tier: 'Global Tech Consulting',
    logoColor: '#a100ff',
    bgTint: '#faf5ff',
    badge: 'ASE & FSE Engineering Tracks',
    cutoffScore: 65,
    shortlistingTips: [
      'Accenture National Assessment: Cognitive ability + Technical assessment (Pseudocode, Common Application, MS Office, Cloud, Coding).',
      'Full Stack Track: Mastering Spring Boot + React qualifies candidates for High-Package Advanced Associate Software Engineer (6.5 LPA).',
      'Interview: Clear communication of coding approach and fundamentals.'
    ],
    interviewRounds: [
      { round: 'Round 1: Cognitive & Technical Assessment', duration: '90 Mins', platform: 'Wheebox Portal', focus: 'Critical reasoning, English, Pseudocode, Cloud & Network fundamentals.' },
      { round: 'Round 2: Hands-on Coding Assessment', duration: '45 Mins', platform: 'Wheebox Coding', focus: '2 programming problems in Java/Python (Arrays, Matrix, Strings).' },
      { round: 'Round 3: Communication Assessment', duration: '20 Mins', platform: 'Pearson Test Platform', focus: 'Listening, speaking, reading fluency, and comprehension.' },
      { round: 'Round 4: Technical & HR Interview', duration: '30 Mins', platform: 'Microsoft Teams', focus: 'Project architecture, strengths, and alignment with Accenture values.' }
    ],
    skillShortlistWeight: {
      'Java': { level: 'Critical', note: 'Core logic, looping, collections & OOP structure' },
      'SQL & MySQL': { level: 'High', note: 'Query execution, database normalization & table joins' },
      'Spring Boot': { level: 'High', note: 'REST services & MVC enterprise patterns' },
      'React.js': { level: 'High', note: 'Component based web design' }
    },
    companyQuestions: {
      'Java': [
        { question: 'Write a program to find duplicate elements in an array using Java Collections.', type: 'Core Java' }
      ],
      'SQL & MySQL': [
        { question: 'What is the difference between DELETE, TRUNCATE, and DROP statements?', type: 'Database' }
      ]
    }
  },

  'flipkart': {
    name: 'Flipkart',
    tier: 'E-Commerce Unicorn',
    logoColor: '#2874f0',
    bgTint: '#eff6ff',
    badge: 'Machine Coding & High Scale',
    cutoffScore: 75,
    shortlistingTips: [
      'Machine Coding Round: Flipkart features a signature 90-minute Machine Coding Round (writing clean, working OOP code with SOLID design).',
      'High Concurrency: Focuses on Java/Spring Boot microservices, Kafka event queues, and Redis caching.',
      'Data Structures: LeetCode medium/hard problem solving on Trees, Graphs, and HashMaps.'
    ],
    interviewRounds: [
      { round: 'Round 1: Online Assessment (OA)', duration: '90 Mins', platform: 'HackerEarth', focus: '3 algorithmic problems on Arrays, Trees, Dynamic Programming.' },
      { round: 'Round 2: Machine Coding Round', duration: '90 Mins', platform: 'Live IDE Coding', focus: 'Write fully functional, modular Object-Oriented code (e.g. In-Memory Key-Value Store / Ride Booking).' },
      { round: 'Round 3: Problem Solving & DSA', duration: '60 Mins', platform: 'Google Meet', focus: 'Algorithmic problem solving, complexity analysis, and edge cases.' },
      { round: 'Round 4: Hiring Manager & Culture', duration: '45 Mins', platform: 'Google Meet', focus: 'Scale challenges, architectural design decisions, and culture fit.' }
    ],
    skillShortlistWeight: {
      'Java': { level: 'Critical', note: 'Clean OOP, SOLID principles, design patterns (Factory, Strategy, Observer)' },
      'Spring Boot': { level: 'Critical', note: 'Microservices, REST APIs, caching & transactional reliability' },
      'System Design': { level: 'Critical', note: 'High throughput, distributed locks, Redis caching & message queues' },
      'SQL & MySQL': { level: 'High', note: 'Sharding, indexing & high-volume transactional tables' }
    },
    companyQuestions: {
      'Java': [
        { question: 'Machine Coding Task: Design an In-Memory Key-Value Store with TTL (Time To Live) and transaction rollback.', type: 'Machine Coding' }
      ],
      'Spring Boot': [
        { question: 'How would you implement a distributed flash-sale inventory reservation system with Redis and MySQL?', type: 'High Scale Backend' }
      ]
    }
  },

  'qualcomm': {
    name: 'Qualcomm',
    tier: 'Semiconductors & Embedded Systems',
    logoColor: '#3253dc',
    bgTint: '#eef2ff',
    badge: 'Core Hardware & Firmware Leader',
    cutoffScore: 72,
    shortlistingTips: [
      'Low-Level C/C++: Qualcomm focuses on memory management, bitwise manipulation, pointers, and CPU architecture.',
      'Embedded Systems: Knowledge of microcontrollers, RTOS, interrupts, and I2C/SPI protocols is essential.',
      'Coding: Bit manipulation, memory alignment, and device driver architecture.'
    ],
    interviewRounds: [
      { round: 'Round 1: Online Assessment', duration: '90 Mins', platform: 'HackerRank', focus: 'C/C++ pointers, bitwise operators, OS concepts, and digital electronics.' },
      { round: 'Round 2: Tech Interview 1 (C/C++ & DSA)', duration: '60 Mins', platform: 'Microsoft Teams', focus: 'Pointers, memory leaks, custom malloc/free, linked lists, and bit manipulation.' },
      { round: 'Round 3: Tech Interview 2 (Firmware & RTOS)', duration: '60 Mins', platform: 'Microsoft Teams', focus: 'Interrupt service routines, concurrency, mutexes, I2C/SPI communication.' },
      { round: 'Round 4: Managerial Round', duration: '45 Mins', platform: 'Teams', focus: 'Hardware-software trade-offs, past capstone projects, and team fit.' }
    ],
    skillShortlistWeight: {
      'C++': { level: 'Critical', note: 'Low-level pointers, dynamic memory, structs & bitwise operations' },
      'Embedded C / Microcontrollers': { level: 'Critical', note: 'Microcontroller registers, interrupts, timers, and communication buses' },
      'Robotics & Microprocessors': { level: 'High', note: 'ARM architecture, cache memory & real-time scheduling' },
      'Git & GitHub': { level: 'Standard', note: 'Firmware repository versioning & release management' }
    },
    companyQuestions: {
      'C++': [
        { question: 'Write a C function to reverse bits of a 32-bit unsigned integer using bitwise operations.', type: 'Bit Manipulation' },
        { question: 'What is memory alignment and structure padding in C/C++? How does it affect CPU bus cycles?', type: 'Low-Level Systems' }
      ],
      'Embedded C / Microcontrollers': [
        { question: 'How do you design a non-blocking UART circular buffer (ring buffer) using pointers in Embedded C?', type: 'Firmware Driver' }
      ]
    }
  }
};

// Helper function to safely fetch company interview blueprint for any company
const getCompanyBlueprint = (companyName) => {
  if (!companyName || companyName === 'ALL') {
    return {
      name: 'All Target Companies',
      tier: 'Target Industry Benchmark',
      logoColor: '#7c3aed',
      bgTint: '#f5f3ff',
      badge: 'Composite Shortlisting Track',
      cutoffScore: 72,
      shortlistingTips: [
        'Complete high-priority sequential roadmap steps to maximize composite shortlist probability across all target companies.',
        'Target an overall placement readiness score of 75%+ to comfortably clear online assessment screening filters.',
        'Build a production-grade full-stack / AI capstone project hosted live with GitHub source code.'
      ],
      interviewRounds: [
        { round: 'Round 1: Online Assessment (OA)', duration: '75-90 Mins', platform: 'HackerRank / CodeSignal', focus: 'Algorithmic coding, data structures, and fundamental role problem-solving.' },
        { round: 'Round 2: Tech Interview 1 (DSA & Core)', duration: '45-60 Mins', platform: 'Live Virtual Coding', focus: 'Live coding problem solving, time/space complexity analysis, and OOP principles.' },
        { round: 'Round 3: Framework & Architecture Deep Dive', duration: '45-60 Mins', platform: 'Video Conference', focus: 'APIs, database schemas, frameworks, and capstone project architectural decisions.' },
        { round: 'Round 4: Bar Raiser & Culture Fit', duration: '30-45 Mins', platform: 'Video Conference', focus: 'Collaboration, handling ambiguity, learning agility, and cultural alignment.' }
      ],
      skillShortlistWeight: {
        'Java': { level: 'Critical', note: 'Strong OOP, collections, multithreading, and memory design' },
        'Spring Boot': { level: 'Critical', note: 'REST APIs, Spring Data JPA, and microservices architecture' },
        'Python': { level: 'Critical', note: 'Algorithmic scripting, clean syntax, and data wrangling' },
        'React.js': { level: 'High', note: 'Component lifecycle, hooks, and responsive state management' },
        'SQL & MySQL': { level: 'High', note: 'Complex queries, schema normalization, and index optimization' },
        'Data Structures & Algorithms': { level: 'Critical', note: 'Hash tables, binary trees, recursion, and search algorithms' },
        'Docker & Kubernetes': { level: 'High', note: 'Containerization, deployment, and cloud infrastructure' },
        'System Design': { level: 'Critical', note: 'Scalable services, load balancing, and database caching' },
        'Git & GitHub': { level: 'Standard', note: 'Version control, branch workflows, and team collaboration' },
        'Embedded C / Microcontrollers': { level: 'Critical', note: 'Firmware programming, registers, and hardware communication' }
      },
      companyQuestions: {}
    };
  }

  const clean = companyName.trim().toLowerCase();
  if (COMPANY_INTERVIEW_BLUEPRINTS[clean]) {
    return COMPANY_INTERVIEW_BLUEPRINTS[clean];
  }

  // Fuzzy match
  const matchedKey = Object.keys(COMPANY_INTERVIEW_BLUEPRINTS).find(key => 
    clean.includes(key) || key.includes(clean)
  );
  if (matchedKey) return COMPANY_INTERVIEW_BLUEPRINTS[matchedKey];

  // Dynamic custom blueprint for any company
  return {
    name: companyName,
    tier: 'Target Industry Recruiter',
    logoColor: '#6366f1',
    bgTint: '#eef2ff',
    badge: 'Custom Dream Company',
    cutoffScore: 72,
    shortlistingTips: [
      `Build production-grade projects demonstrating real-world applications relevant to ${companyName}.`,
      'Practice medium-difficulty problem solving and write clean, modular, bug-free code.',
      'Prepare STAR method responses for behavioral rounds showcasing leadership and ownership.'
    ],
    interviewRounds: [
      { round: 'Round 1: Online Assessment (OA)', duration: '75-90 Mins', platform: 'HackerRank / CodeSignal', focus: 'Algorithmic coding, data structures, and fundamental role problem-solving.' },
      { round: 'Round 2: Tech Interview 1 (DSA & Core)', duration: '45-60 Mins', platform: 'Live Virtual Coding', focus: 'Live coding problem solving, time/space complexity analysis, and OOP principles.' },
      { round: 'Round 3: Framework & Architecture Deep Dive', duration: '45-60 Mins', platform: 'Video Conference', focus: 'APIs, database schemas, frameworks, and capstone project architectural decisions.' },
      { round: 'Round 4: Bar Raiser & Culture Fit', duration: '30-45 Mins', platform: 'Video Conference', focus: 'Collaboration, handling ambiguity, learning agility, and cultural alignment.' }
    ],
    skillShortlistWeight: {
      'Java': { level: 'Critical', note: 'Core OOP, collections, multithreading, and memory design' },
      'Spring Boot': { level: 'Critical', note: 'REST APIs, Spring Data JPA, and microservices architecture' },
      'Python': { level: 'Critical', note: 'Algorithmic scripting, clean syntax, and data wrangling' },
      'React.js': { level: 'High', note: 'Component lifecycle, hooks, and responsive state management' },
      'SQL & MySQL': { level: 'High', note: 'Complex queries, schema normalization, and index optimization' },
      'Data Structures & Algorithms': { level: 'Critical', note: 'Hash tables, binary trees, recursion, and search algorithms' },
      'Docker & Kubernetes': { level: 'High', note: 'Containerization, deployment, and cloud infrastructure' },
      'System Design': { level: 'Critical', note: 'Scalable services, load balancing, and database caching' },
      'Git & GitHub': { level: 'Standard', note: 'Version control, branch workflows, and team collaboration' },
      'Embedded C / Microcontrollers': { level: 'Critical', note: 'Firmware programming, registers, and hardware communication' }
    },
    companyQuestions: {
      'Java': [
        { question: `How would you architect a multithreaded task scheduler in Java for ${companyName}?`, type: 'System & Concurrency' },
        { question: 'Explain the difference between HashMap and ConcurrentHashMap internals.', type: 'Core Java' }
      ],
      'Spring Boot': [
        { question: `Design a scalable REST microservice for ${companyName} with exception handling and validation.`, type: 'Enterprise API' }
      ],
      'SQL & MySQL': [
        { question: 'Write a query using JOIN and subquery to find top metrics across multiple tables.', type: 'Query Problem' }
      ],
      'React.js': [
        { question: 'How do you optimize React component re-renders when managing real-time data feeds?', type: 'Frontend Architecture' }
      ]
    }
  };
};

const getCompanySkillWeight = (blueprint, skillName) => {
  if (!blueprint || !blueprint.skillShortlistWeight) return { level: 'Core', note: 'Essential requirement' };
  if (blueprint.skillShortlistWeight[skillName]) return blueprint.skillShortlistWeight[skillName];
  const match = Object.keys(blueprint.skillShortlistWeight).find(k => 
    skillName.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(skillName.toLowerCase())
  );
  return match ? blueprint.skillShortlistWeight[match] : { level: 'Core', note: 'Relevant skill' };
};

const getCompanySkillNote = (blueprint, skillName) => {
  const info = getCompanySkillWeight(blueprint, skillName);
  return info.note || `Tested as part of ${blueprint.name}'s technical evaluation process.`;
};

const getCompanySkillQuestions = (blueprint, skillName) => {
  if (!blueprint || !blueprint.companyQuestions) return [];
  if (blueprint.companyQuestions[skillName]) return blueprint.companyQuestions[skillName];
  const match = Object.keys(blueprint.companyQuestions).find(k => 
    skillName.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(skillName.toLowerCase())
  );
  if (match) return blueprint.companyQuestions[match];

  return [
    { question: `Explain how you would apply ${skillName} best practices in a high-reliability production environment at ${blueprint.name}.`, type: 'Engineering Best Practice' },
    { question: `What architectural trade-offs do you consider when implementing ${skillName} at scale?`, type: 'Design & Scalability' }
  ];
};

// =========================================================================
// INTERACTIVE PROBLEM SOLVER & DEEP AI SOLUTION ANALYZER (CHANGE 3)
// Real-world engineering problems with approach analysis & complexity derivation
// =========================================================================
const SKILL_PROBLEM_ANALYZER_DATA = {
  'Java': {
    title: 'Thread-Safe Lazy Singleton with Double-Checked Locking',
    conceptTested: 'Multithreading, Concurrency, volatile keyword & Memory Visibility',
    difficulty: 'Medium-Hard',
    companyTag: 'Asked in Amazon, Google, Microsoft Round 2',
    problemStatement: 'Design a thread-safe Singleton database connection pool manager in Java that initializes lazily. The implementation must avoid synchronizing the entire getInstance() method (which causes high lock contention on every read) and prevent race conditions when multiple concurrent threads call getInstance() simultaneously.',
    starterCode: `public class ConnectionPoolManager {\n    // TODO: Declare instance field with proper memory visibility modifier\n    private static ConnectionPoolManager instance;\n\n    private ConnectionPoolManager() {\n        // Simulate heavy pool initialization\n    }\n\n    public static ConnectionPoolManager getInstance() {\n        // TODO: Implement double-checked locking without global method lock\n        return instance;\n    }\n}`,
    approaches: [
      {
        id: 'a',
        label: 'Approach A: Synchronized Method on getInstance()',
        codeSnippet: `public class ConnectionPoolManager {\n    private static ConnectionPoolManager instance;\n    private ConnectionPoolManager() {}\n\n    // Synchronizes every read call - severe bottleneck!\n    public static synchronized ConnectionPoolManager getInstance() {\n        if (instance == null) {\n            instance = new ConnectionPoolManager();\n        }\n        return instance;\n    }\n}`,
        isOptimal: false,
        score: 65,
        timeComplexity: 'O(1) with 100x Lock Contention Penalty',
        spaceComplexity: 'O(1) Memory',
        verdict: 'Sub-Optimal (Thread Contention Bottleneck)',
        edgeCases: [
          { name: 'Single Thread Invocation', status: 'Passed', detail: 'Executes correctly for sequential single-threaded requests.' },
          { name: 'High-Throughput Multi-Thread Load', status: 'Warning', detail: 'Synchronizing the entire method serializes all reads, causing massive CPU wait overhead.' },
          { name: 'Memory Visibility Guarantee', status: 'Passed', detail: 'Synchronized keyword forces memory flush but at high lock cost.' }
        ],
        aiAnalysis: {
          verdictSummary: 'Functionally thread-safe, but introduces a major concurrency bottleneck in high-scale production systems.',
          whyItWorksOrFails: 'While `synchronized` guarantees that only one thread enters at a time, 99.9% of calls after the initial creation are read-only and do not need a lock. Serializing all read operations degrades throughput.',
          thoughtProcess: [
            'Step 1: Notice that synchronization is strictly needed ONLY during the initial creation of the singleton object.',
            'Step 2: Once instance != null, all subsequent threads should read the instance directly without acquiring any monitor lock.',
            'Step 3: Move the synchronized block inside an initial null check (Double-Checked Locking).'
          ],
          referenceSolution: `public class ConnectionPoolManager {\n    // 1. volatile keyword establishes a happens-before relationship\n    private static volatile ConnectionPoolManager instance;\n    private ConnectionPoolManager() {}\n\n    public static ConnectionPoolManager getInstance() {\n        if (instance == null) { // 1st check: lock-free for subsequent reads\n            synchronized (ConnectionPoolManager.class) {\n                if (instance == null) { // 2nd check: inside lock\n                    instance = new ConnectionPoolManager();\n                }\n            }\n        }\n        return instance;\n    }\n}`,
          interviewTrap: 'Forgetting the `volatile` keyword! Without `volatile`, the Java JIT compiler and CPU can reorder instructions (allocating memory pointer before invoking constructor), exposing a partially initialized object to other threads.'
        }
      },
      {
        id: 'b',
        label: 'Approach B: Double-Checked Locking with volatile (Optimal Pattern)',
        codeSnippet: `public class ConnectionPoolManager {\n    // volatile prevents CPU instruction reordering\n    private static volatile ConnectionPoolManager instance;\n    private ConnectionPoolManager() {}\n\n    public static ConnectionPoolManager getInstance() {\n        if (instance == null) { // 1st check (lock-free)\n            synchronized (ConnectionPoolManager.class) {\n                if (instance == null) { // 2nd check (thread-safe)\n                    instance = new ConnectionPoolManager();\n                }\n            }\n        }\n        return instance;\n    }\n}`,
        isOptimal: true,
        score: 98,
        timeComplexity: 'O(1) Lock-free concurrent reads',
        spaceComplexity: 'O(1) Memory',
        verdict: 'Optimal & Production Ready ⭐',
        edgeCases: [
          { name: 'Concurrent Simultaneous Initialization', status: 'Passed', detail: 'Double check ensures only the winning thread instantiates; waiting threads receive the initialized reference.' },
          { name: 'CPU Instruction Reordering Protection', status: 'Passed', detail: 'The volatile write creates a memory barrier, ensuring all constructor field initializations complete before publication.' },
          { name: 'High-Throughput Read Performance', status: 'Passed', detail: 'Zero lock contention once initialized; threads return instance immediately.' }
        ],
        aiAnalysis: {
          verdictSummary: 'Flawless enterprise implementation following standard industry best practices.',
          whyItWorksOrFails: 'Double-checked locking ensures synchronization is acquired only on the very first invocation when `instance == null`. The `volatile` keyword guarantees cross-core cache coherence and prevents compiler instruction reordering.',
          thoughtProcess: [
            'Step 1: Check if instance is null without acquiring monitor lock to keep common read path fast.',
            'Step 2: If null, acquire lock on ConnectionPoolManager.class to enter critical initialization block.',
            'Step 3: Re-verify instance is null (another thread might have finished initializing while we were waiting for the lock).',
            'Step 4: Mark reference as `volatile` to enforce memory barrier so other threads never see an incomplete object.'
          ],
          referenceSolution: `public class ConnectionPoolManager {\n    private static volatile ConnectionPoolManager instance;\n    private ConnectionPoolManager() {}\n\n    public static ConnectionPoolManager getInstance() {\n        ConnectionPoolManager result = instance;\n        if (result == null) {\n            synchronized (ConnectionPoolManager.class) {\n                result = instance;\n                if (result == null) {\n                    instance = result = new ConnectionPoolManager();\n                }\n            }\n        }\n        return result;\n    }\n}`,
          interviewTrap: 'Always make the constructor private. If client code can execute `new ConnectionPoolManager()`, the Singleton contract is broken.'
        }
      },
      {
        id: 'c',
        label: 'Approach C: Double-Checked Locking WITHOUT volatile (Famous Concurrency Bug)',
        codeSnippet: `public class ConnectionPoolManager {\n    // Missing volatile keyword! Severe race hazard\n    private static ConnectionPoolManager instance;\n    private ConnectionPoolManager() {}\n\n    public static ConnectionPoolManager getInstance() {\n        if (instance == null) {\n            synchronized (ConnectionPoolManager.class) {\n                if (instance == null) {\n                    instance = new ConnectionPoolManager();\n                }\n            }\n        }\n        return instance;\n    }\n}`,
        isOptimal: false,
        score: 42,
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)',
        verdict: 'Critical Concurrency Hazard (Race Condition)',
        edgeCases: [
          { name: 'Multi-Core CPU Cache Coherence', status: 'Failed', detail: 'Without volatile, changes on CPU Core 1 may not be immediately visible to CPU Core 2.' },
          { name: 'Out-of-Order Instruction Reordering', status: 'Failed', detail: 'JVM bytecode can reorder memory pointer assignment BEFORE constructor finishes, causing NullPointerExceptions.' }
        ],
        aiAnalysis: {
          verdictSummary: 'Classic Java concurrency trap: causes catastrophic intermittent production crashes under multi-threaded load.',
          whyItWorksOrFails: 'Creating an object involves 3 low-level steps: (1) allocate memory, (2) run constructor, (3) assign pointer to instance. Without volatile, the compiler or CPU can reorder to 1 -> 3 -> 2. Thread B sees instance != null, skips synchronization, and accesses uninitialized fields, crashing the application!',
          thoughtProcess: [
            'Step 1: Realize that compiler optimization reorders instructions if single-thread semantics are preserved.',
            'Step 2: In multi-threaded environments, instruction reordering breaks object safety unless explicit memory barriers are inserted.',
            'Step 3: Fix by adding the `volatile` modifier to the static instance variable.'
          ],
          referenceSolution: `Add 'volatile' modifier: private static volatile ConnectionPoolManager instance;`,
          interviewTrap: 'This is the #1 question FAANG interviewers use to distinguish senior Java engineers from beginners. Emphasize CPU cache line invalidation and happens-before semantics.'
        }
      }
    ]
  },

  'Spring Boot': {
    title: 'Idempotent Payment Webhook API & Transaction Consistency',
    conceptTested: 'Spring Data JPA, @Transactional, Optimistic Locking & Idempotency Keys',
    difficulty: 'Medium-Hard',
    companyTag: 'Asked in Razorpay, Amazon, Flipkart, Goldman Sachs',
    problemStatement: 'Build a production-grade Spring Boot webhook endpoint that processes customer order payments. The endpoint must guarantee idempotency (if the payment gateway sends the same payment notification multiple times due to network retries, the customer must only be charged and balance deducted ONCE). It must roll back all database updates if an external ledger call fails.',
    starterCode: `@RestController\n@RequestMapping("/api/payments")\npublic class PaymentWebhookController {\n    // TODO: Inject repositories & services\n\n    @PostMapping("/webhook")\n    public ResponseEntity<?> handlePaymentWebhook(@RequestBody PaymentNotificationRequest request) {\n        // TODO: Enforce idempotency and atomic database transactions\n        return ResponseEntity.ok("Processed");\n    }\n}`,
    approaches: [
      {
        id: 'a',
        label: 'Approach A: Direct Update without Idempotency Key or @Transactional',
        codeSnippet: `@PostMapping("/webhook")\npublic ResponseEntity<?> handlePayment(@RequestBody PaymentRequest request) {\n    Order order = orderRepo.findById(request.getOrderId()).get();\n    order.setStatus("PAID");\n    orderRepo.save(order);\n    walletService.deductFunds(order.getUserId(), order.getAmount());\n    return ResponseEntity.ok("Success");\n}`,
        isOptimal: false,
        score: 40,
        timeComplexity: 'O(1) DB calls',
        spaceComplexity: 'O(1)',
        verdict: 'Dangerous (Double Charging & Inconsistent Data)',
        edgeCases: [
          { name: 'Network Retry / Duplicate Webhook', status: 'Failed', detail: 'Duplicate requests will deduct wallet funds multiple times!' },
          { name: 'External Service Failure', status: 'Failed', detail: 'If walletService fails, order remains marked PAID without payment.' }
        ],
        aiAnalysis: {
          verdictSummary: 'Severe vulnerability: lacks transaction boundaries and idempotency protection.',
          whyItWorksOrFails: 'Payment webhooks are guaranteed to be retried by payment gateways. Without an idempotency table or unique constraint on payment_reference_id, duplicate deductions will occur. Without @Transactional, partial failures leave database in corrupted state.',
          thoughtProcess: [
            'Step 1: Check if payment_reference_id has already been processed using an IdempotencyKey table.',
            'Step 2: Wrap the operation in `@Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = Exception.class)`.',
            'Step 3: Return cached 200 OK immediately for duplicate requests.'
          ],
          referenceSolution: `@Transactional\npublic PaymentResult processPayment(PaymentRequest req) {\n    if (idempotencyRepo.existsByPaymentKey(req.getIdempotencyKey())) {\n        return idempotencyRepo.findByPaymentKey(req.getIdempotencyKey()).getCachedResult();\n    }\n    // Atomic debit & order status update\n}`,
          interviewTrap: 'Remember that unchecked exceptions trigger @Transactional rollback by default, but checked exceptions do NOT unless rollbackFor = Exception.class is specified.'
        }
      },
      {
        id: 'b',
        label: 'Approach B: Idempotency Key Check + @Transactional with Rollback (Optimal Pattern)',
        codeSnippet: `@Transactional(rollbackFor = Exception.class)\n@PostMapping("/webhook")\npublic ResponseEntity<?> handlePayment(@Valid @RequestBody PaymentWebhookDto dto) {\n    // 1. Idempotency Check with Database Unique Key\n    if (processedPaymentRepo.existsByIdempotencyKey(dto.getIdempotencyKey())) {\n        return ResponseEntity.ok(new WebhookResponse("ALREADY_PROCESSED", dto.getIdempotencyKey()));\n    }\n\n    // 2. Atomic Order & Balance Update\n    Order order = orderRepo.findByIdForUpdate(dto.getOrderId())\n        .orElseThrow(() -> new OrderNotFoundException(dto.getOrderId()));\n    \n    order.setPaymentStatus(PaymentStatus.PAID);\n    orderRepo.save(order);\n    \n    // 3. Record Idempotency Audit Log\n    processedPaymentRepo.save(new ProcessedPayment(dto.getIdempotencyKey(), dto.getOrderId(), LocalDateTime.now()));\n    return ResponseEntity.status(HttpStatus.CREATED).body(new WebhookResponse("SUCCESS", dto.getIdempotencyKey()));\n}`,
        isOptimal: true,
        score: 97,
        timeComplexity: 'O(1) Indexed Lookup & Atomic Commit',
        spaceComplexity: 'O(1)',
        verdict: 'Optimal & Production Ready ⭐',
        edgeCases: [
          { name: 'Duplicate Webhook Delivery', status: 'Passed', detail: 'Database unique key on idempotency_key prevents race condition even if duplicate calls hit separate app pods simultaneously.' },
          { name: 'Service Exception Rollback', status: 'Passed', detail: '@Transactional rolls back order status and audit log atomically if any step throws an exception.' },
          { name: 'Concurrent Balance Race Condition', status: 'Passed', detail: 'Pessimistic write lock (findByIdForUpdate) prevents lost updates on order record.' }
        ],
        aiAnalysis: {
          verdictSummary: 'Bank-grade idempotent payment handler meeting enterprise fintech security standards.',
          whyItWorksOrFails: 'Combines database unique constraints on idempotency key with Spring transaction management. Ensures ACID consistency and exactly-once execution semantics.',
          thoughtProcess: [
            'Step 1: Check idempotency table indexed on payment transaction hash.',
            'Step 2: Lock order row with pessimistic write lock during state transition to prevent race conditions.',
            'Step 3: Save idempotency record and commit transaction atomically.'
          ],
          referenceSolution: `@Transactional(rollbackFor = Exception.class)\npublic void handlePayment(PaymentDto dto) {\n    // Check & apply state transitions safely\n}`,
          interviewTrap: 'Calling a @Transactional method from another method in the SAME class bypasses Spring proxy interceptor! Always invoke transactional methods across Spring bean boundaries.'
        }
      }
    ]
  },

  'React.js': {
    title: 'Debounced Real-Time Search with Race Condition & Stale Closure Prevention',
    conceptTested: 'React Hooks, useEffect cleanup, AbortController & Debounce Timers',
    difficulty: 'Medium',
    companyTag: 'Asked in Meta, Uber, Swiggy, Microsoft',
    problemStatement: 'Implement a real-time auto-complete search component in React that debounces user keystrokes by 300ms. It must prevent network race conditions (where an earlier slow network request finishes AFTER a later fast request, overwriting fresh results with stale data) and properly clean up timers to prevent memory leaks.',
    starterCode: `export function LiveSearchBar() {\n    const [query, setQuery] = useState('');\n    const [results, setResults] = useState([]);\n\n    // TODO: Implement debounced search with AbortController\n    useEffect(() => {\n        // Fetch data\n    }, [query]);\n\n    return <input value={query} onChange={e => setQuery(e.target.value)} />;\n}`,
    approaches: [
      {
        id: 'a',
        label: 'Approach A: Direct Fetch in useEffect without AbortController or Debounce',
        codeSnippet: `useEffect(() => {\n    fetch(\`/api/search?q=\${query}\`)\n        .then(res => res.json())\n        .then(data => setResults(data));\n}, [query]);`,
        isOptimal: false,
        score: 45,
        timeComplexity: 'O(N) network requests on every keystroke',
        spaceComplexity: 'O(1)',
        verdict: 'Severe Race Hazard (Network Flooding)',
        edgeCases: [
          { name: 'Fast Typing Over Network', status: 'Failed', detail: 'Fires 10 requests when user types "javascript"; slow responses overwrite final results.' },
          { name: 'Component Unmount During Request', status: 'Failed', detail: 'Causes memory leak warning by calling setResults on an unmounted component.' }
        ],
        aiAnalysis: {
          verdictSummary: 'Suffers from classic React asynchronous race condition.',
          whyItWorksOrFails: 'Network requests complete in arbitrary order based on server latency. A query for "jav" taking 500ms will overwrite results for "java" that completed in 100ms.',
          thoughtProcess: [
            'Step 1: Introduce setTimeout to delay network dispatch until user pauses typing (Debounce).',
            'Step 2: Clean up the timer in useEffect cleanup return function.',
            'Step 3: Instantiate an AbortController to cancel pending in-flight requests when query updates.'
          ],
          referenceSolution: `useEffect(() => {\n    const controller = new AbortController();\n    const timer = setTimeout(() => {\n        fetch(\`/api/search?q=\${query}\`, { signal: controller.signal })\n            .then(res => res.json())\n            .then(data => setResults(data))\n            .catch(err => { if (err.name !== 'AbortError') console.error(err); });\n    }, 300);\n    return () => {\n        clearTimeout(timer);\n        controller.abort();\n    };\n}, [query]);`,
          interviewTrap: 'Always check `err.name !== "AbortError"` in the catch block. Aborting a fetch throws a DOMException by design; do not treat it as an application crash.'
        }
      },
      {
        id: 'b',
        label: 'Approach B: Debounce Timer + AbortController Cancellation (Optimal Pattern)',
        codeSnippet: `useEffect(() => {\n    if (!query.trim()) {\n        setResults([]);\n        return;\n    }\n    const controller = new AbortController();\n    const timer = setTimeout(async () => {\n        try {\n            const res = await fetch(\`/api/search?q=\${encodeURIComponent(query)}\`, { signal: controller.signal });\n            const data = await res.json();\n            setResults(data);\n        } catch (err) {\n            if (err.name !== 'AbortError') setError(err.message);\n        }\n    }, 300);\n\n    return () => {\n        clearTimeout(timer);\n        controller.abort(); // Cancel previous pending HTTP request\n    };\n}, [query]);`,
        isOptimal: true,
        score: 99,
        timeComplexity: 'O(1) network calls per pause, O(N) UI render',
        spaceComplexity: 'O(1) memory',
        verdict: 'Optimal & Production Ready ⭐',
        edgeCases: [
          { name: 'Rapid Keystroke Throttling', status: 'Passed', detail: 'clearTimeout cancels redundant timer schedules, reducing backend API calls by ~85%.' },
          { name: 'Out-of-Order Response Race Condition', status: 'Passed', detail: 'controller.abort() immediately terminates pending HTTP sockets before fresh dispatch.' },
          { name: 'Component Unmount Cleanup', status: 'Passed', detail: 'Cleanup function runs on unmount, preventing state updates on dead DOM nodes.' }
        ],
        aiAnalysis: {
          verdictSummary: 'State-of-the-art frontend data fetching architecture solving all asynchronous hazards.',
          whyItWorksOrFails: 'Clearing timer cancels queued requests before dispatch. AbortController cancels active socket streams if query changes mid-flight. Prevents stale closure bugs.',
          thoughtProcess: [
            'Step 1: Guard against empty strings to prevent wasteful network requests.',
            'Step 2: Buffer keystrokes with 300ms setTimeout.',
            'Step 3: Return cleanup closure that cancels timer and aborts pending fetch.',
            'Step 4: Filter out AbortError from user-facing error states.'
          ],
          referenceSolution: `Full implementation with AbortController and clearTimeout cleanup in useEffect.`,
          interviewTrap: 'Missing `encodeURIComponent(query)` exposes the API to URL syntax corruption when search terms contain characters like &, ?, or spaces.'
        }
      }
    ]
  },

  'SQL & MySQL': {
    title: 'Top N Highest Salaries per Department without Subquery Scan',
    conceptTested: 'Window Functions (DENSE_RANK), Indexing & Query Execution Plans',
    difficulty: 'Medium',
    companyTag: 'Asked in Google, Amazon, TCS, Infosys, Goldman Sachs',
    problemStatement: 'Given an Employee table (id, name, department_id, salary), write an optimal SQL query to find the 2nd highest salary in each department. If two employees share the same highest salary, the next salary must be ranked 2nd (no skipped rank numbers). The solution must scale across millions of rows without table-lock table scans.',
    starterCode: `-- Given: Employee (id INT, name VARCHAR(50), department_id INT, salary DECIMAL(10,2))\n-- Goal: Output department_id, salary for 2nd highest salary in each department\n\nSELECT department_id, salary\nFROM Employee ...`,
    approaches: [
      {
        id: 'a',
        label: 'Approach A: Correlated Subquery with WHERE (SELECT COUNT DISTINCT...)',
        codeSnippet: `SELECT department_id, salary\nFROM Employee e1\nWHERE 1 = (\n    SELECT COUNT(DISTINCT e2.salary)\n    FROM Employee e2\n    WHERE e2.department_id = e1.department_id AND e2.salary > e1.salary\n);`,
        isOptimal: false,
        score: 55,
        timeComplexity: 'O(N^2) Quadratic nested table scan',
        spaceComplexity: 'O(N) Temp tables',
        verdict: 'Sub-Optimal (Severe Performance Degradation on Scale)',
        edgeCases: [
          { name: 'Small Table (< 1,000 rows)', status: 'Passed', detail: 'Returns correct numerical results.' },
          { name: 'Million-Row Production Scale', status: 'Failed', detail: 'Executes subquery N times (once per row), leading to query timeouts.' }
        ],
        aiAnalysis: {
          verdictSummary: 'Works mathematically on small datasets, but quadratic complexity O(N^2) will crash in production.',
          whyItWorksOrFails: 'A correlated subquery executes for every single row in the outer table. For 500,000 employees, the subquery scans 500,000 * 500,000 row evaluations.',
          thoughtProcess: [
            'Step 1: Replace correlated subqueries with modern SQL Window Functions.',
            'Step 2: Use DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) to rank salaries without skipping rank numbers on ties.',
            'Step 3: Filter rank = 2 using a Common Table Expression (CTE).'
          ],
          referenceSolution: `WITH RankedSalaries AS (\n    SELECT \n        department_id, \n        salary, \n        DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) as ranking\n    FROM Employee\n)\nSELECT department_id, salary\nFROM RankedSalaries\nWHERE ranking = 2;`,
          interviewTrap: 'Using RANK() instead of DENSE_RANK()! If two employees tie for 1st place with $100k, RANK() assigns 1, 1, 3 (skipping 2!). DENSE_RANK() assigns 1, 1, 2, correctly capturing the 2nd highest salary.'
        }
      },
      {
        id: 'b',
        label: 'Approach B: Window Function DENSE_RANK() with CTE (Optimal Pattern)',
        codeSnippet: `WITH RankedSalaries AS (\n    SELECT \n        department_id,\n        salary,\n        DENSE_RANK() OVER (\n            PARTITION BY department_id \n            ORDER BY salary DESC\n        ) AS rank_num\n    FROM Employee\n)\nSELECT department_id, salary\nFROM RankedSalaries\nWHERE rank_num = 2;`,
        isOptimal: true,
        score: 98,
        timeComplexity: 'O(N log N) Single Pass Sort with Index',
        spaceComplexity: 'O(N) CTE buffer',
        verdict: 'Optimal & Production Ready ⭐',
        edgeCases: [
          { name: 'Tied Salaries (e.g. two $150k earners)', status: 'Passed', detail: 'DENSE_RANK preserves consecutive integers (1, 1, 2), finding true 2nd tier.' },
          { name: 'Composite Index Optimization', status: 'Passed', detail: 'Supported by composite index (department_id, salary DESC) avoiding full sorts.' },
          { name: 'Department with < 2 Employees', status: 'Passed', detail: 'Returns empty result for that department without errors.' }
        ],
        aiAnalysis: {
          verdictSummary: 'Standard enterprise SQL pattern utilized across top tech companies.',
          whyItWorksOrFails: 'DENSE_RANK() partitions rows by department and sorts in a single execution pass. Supported by a composite index `(department_id, salary DESC)`, query execution time is instantaneous.',
          thoughtProcess: [
            'Step 1: Partition records by department_id to isolate departments.',
            'Step 2: Order salaries descending with DENSE_RANK() to handle ties cleanly.',
            'Step 3: Select rows where rank_num = 2 via clean CTE readability.'
          ],
          referenceSolution: `CREATE INDEX idx_dept_salary ON Employee(department_id, salary DESC);\n\nWITH RankedSalaries AS (\n    SELECT department_id, salary, DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) as rnk\n    FROM Employee\n)\nSELECT department_id, salary FROM RankedSalaries WHERE rnk = 2;`,
          interviewTrap: 'Window functions cannot be placed directly inside a WHERE clause (`WHERE DENSE_RANK() = 2` is a syntax error). They must be evaluated in a CTE or subquery first.'
        }
      }
    ]
  },

  'Data Structures & Algorithms': {
    title: 'Detect Cycle in Directed Graph & Course Schedule Dependency Resolution',
    conceptTested: 'DFS Graph Traversal, 3-Coloring State Machine (Visited / Visiting / Unvisited)',
    difficulty: 'Medium',
    companyTag: 'Asked in Google, Amazon, Microsoft, Meta',
    problemStatement: 'There are N courses labeled from 0 to N-1, and an array of prerequisite pairs [a, b] indicating that you must take course b before course a. Return true if it is possible to finish all courses (no circular dependencies), or false if a cycle exists.',
    starterCode: `public boolean canFinish(int numCourses, int[][] prerequisites) {\n    // TODO: Build adjacency list & detect cycles\n    return true;\n}`,
    approaches: [
      {
        id: 'a',
        label: 'Approach A: Basic 2-State Visited Boolean Array (Buggy on Directed Graphs)',
        codeSnippet: `// boolean[] visited cannot distinguish between current DFS path and previously explored paths!\nboolean[] visited = new boolean[numCourses];\nfor (int i = 0; i < numCourses; i++) {\n    if (hasCycle(adj, visited, i)) return false;\n}`,
        isOptimal: false,
        score: 50,
        timeComplexity: 'O(V + E) or False Positive Error',
        spaceComplexity: 'O(V)',
        verdict: 'Logical Bug (False Positives on Directed DAGs)',
        edgeCases: [
          { name: 'Cross Edges in Directed Graph', status: 'Failed', detail: 'Treats cross edges as cycles when two paths merge into a shared node.' }
        ],
        aiAnalysis: {
          verdictSummary: 'A simple boolean[] array works for undirected graphs, but FAILS on directed graphs.',
          whyItWorksOrFails: 'In a directed graph, visiting a node that has already been visited does NOT mean there is a cycle (e.g. Node 1 -> Node 3 and Node 2 -> Node 3 is a DAG, not a cycle). A cycle only occurs if we visit a node currently in the CURRENT active recursion stack.',
          thoughtProcess: [
            'Step 1: Realize directed graphs require 3 states: 0 (Unvisited), 1 (Visiting / In Current DFS Path), 2 (Fully Processed).',
            'Step 2: If DFS encounters a node in state 1 (Visiting), a true circular back-edge is detected.',
            'Step 3: Alternatively, Kahn\'s Algorithm (BFS topological sort with in-degrees) can be used.'
          ],
          referenceSolution: `int[] state = new int[numCourses]; // 0=unvisited, 1=visiting, 2=visited\n// If state[neighbor] == 1 -> Cycle detected!`,
          interviewTrap: 'Always clarify if the graph is directed or undirected before choosing cycle detection logic.'
        }
      },
      {
        id: 'b',
        label: 'Approach B: 3-Coloring DFS / In-Degree Kahn\'s Algorithm (Optimal Pattern)',
        codeSnippet: `public boolean canFinish(int numCourses, int[][] prerequisites) {\n    List<List<Integer>> adj = new ArrayList<>();\n    for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());\n    for (int[] p : prerequisites) adj.get(p[1]).add(p[0]);\n\n    int[] visited = new int[numCourses]; // 0: Unvisited, 1: Visiting, 2: Processed\n    for (int i = 0; i < numCourses; i++) {\n        if (visited[i] == 0 && hasCycle(adj, visited, i)) return false;\n    }\n    return true;\n}\n\nprivate boolean hasCycle(List<List<Integer>> adj, int[] visited, int node) {\n    visited[node] = 1; // Mark as currently visiting in active stack\n    for (int next : adj.get(node)) {\n        if (visited[next] == 1) return true; // Found back-edge -> Cycle!\n        if (visited[next] == 0 && hasCycle(adj, visited, next)) return true;\n    }\n    visited[node] = 2; // Fully explored, backtrack out of recursion stack\n    return false;\n}`,
        isOptimal: true,
        score: 99,
        timeComplexity: 'O(V + E) Linear Time',
        spaceComplexity: 'O(V + E) Adjacency List & Recursion Stack',
        verdict: 'Optimal & Production Ready ⭐',
        edgeCases: [
          { name: 'Disconnected Graph Components', status: 'Passed', detail: 'Outer loop iterates all vertices 0..N-1, checking all disjoint components.' },
          { name: 'Self-Loops (Node points to itself)', status: 'Passed', detail: 'Immediately detected on first neighbor check when state == 1.' },
          { name: 'Dense Graphs with Merging Paths', status: 'Passed', detail: 'State 2 prevents re-exploring nodes already confirmed acyclic.' }
        ],
        aiAnalysis: {
          verdictSummary: 'Clean, optimal algorithmic graph solution following Cormen (CLRS) 3-coloring topological sorting.',
          whyItWorksOrFails: 'Linear time complexity O(V + E) visits every node and edge at most once. State 1 detects directed back-edges; State 2 prunes redundant traversals.',
          thoughtProcess: [
            'Step 1: Construct adjacency list from prerequisite edge pairs.',
            'Step 2: Maintain 3-state tracking: 0 = unvisited, 1 = in current call stack, 2 = fully explored.',
            'Step 3: If neighbor is in state 1, back-edge exists, return cycle found.',
            'Step 4: Transition to state 2 upon backtracking.'
          ],
          referenceSolution: `Included above in Approach B with complete helper methods.`,
          interviewTrap: 'Always check if prerequisites pair is [course, prereq] or [prereq, course]. Direction matters!'
        }
      }
    ]
  }
};

// Helper function to safely fetch problem analyzer data for any skill
const getSkillProblemAnalyzer = (skillName) => {
  if (!skillName) return SKILL_PROBLEM_ANALYZER_DATA['Java'];
  if (SKILL_PROBLEM_ANALYZER_DATA[skillName]) return SKILL_PROBLEM_ANALYZER_DATA[skillName];

  // Fuzzy match
  const matchedKey = Object.keys(SKILL_PROBLEM_ANALYZER_DATA).find(key => 
    skillName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(skillName.toLowerCase())
  );
  if (matchedKey) return SKILL_PROBLEM_ANALYZER_DATA[matchedKey];

  // Dynamic fallback problem analyzer tailored to skillName
  return {
    title: `${skillName} Enterprise Production Challenge`,
    conceptTested: `${skillName} Core Architecture, Error Handling & Performance Optimization`,
    difficulty: 'Medium',
    companyTag: 'Standard Technical Placement Interview Bar',
    problemStatement: `Design an optimal, production-grade implementation of ${skillName} that handles high data throughput, prevents memory leaks, and enforces modular error boundary checks under concurrent load.`,
    starterCode: `// ${skillName} Production Implementation\npublic class ${skillName.replace(/[^a-zA-Z]/g, '')}Solution {\n    // TODO: Implement scalable ${skillName} architecture\n}`,
    approaches: [
      {
        id: 'a',
        label: `Approach A: Naive Sequential Implementation`,
        codeSnippet: `// Naive implementation lacking error boundaries and resource cleanup\npublic void executeTask() {\n    // Raw unoptimized logic\n}`,
        isOptimal: false,
        score: 55,
        timeComplexity: 'O(N^2) or Unbounded',
        spaceComplexity: 'O(N) Uncached Memory',
        verdict: 'Sub-Optimal (Lacks Error Boundaries & Scale)',
        edgeCases: [
          { name: 'Null & Empty Edge Inputs', status: 'Warning', detail: 'Throws uncaught exceptions if input parameters are missing.' },
          { name: 'High-Throughput Concurrency', status: 'Failed', detail: 'Lacks thread synchronization and connection pooling.' }
        ],
        aiAnalysis: {
          verdictSummary: `Works for basic demonstration, but fails under production scale for ${skillName}.`,
          whyItWorksOrFails: 'Lacks modular separation of concerns, exception handling, and resource pooling.',
          thoughtProcess: [
            `Step 1: Identify resource bottlenecks in naive ${skillName} logic.`,
            `Step 2: Add validation guards and structured error handling.`,
            `Step 3: Implement caching and modular dependency injection.`
          ],
          referenceSolution: `// Use modular design with connection pooling, try-with-resources, and automated rollback.`,
          interviewTrap: `Never leave resources (DB connections, file handles, network streams) unclosed.`
        }
      },
      {
        id: 'b',
        label: `Approach B: Modular Enterprise Architecture with Error Handling (Optimal Pattern)`,
        codeSnippet: `// Optimal implementation with validation, pooling, and clean separation\npublic class Optimal${skillName.replace(/[^a-zA-Z]/g, '')}Handler {\n    public ExecutionResult executeWithGuard(InputData data) {\n        if (data == null) throw new IllegalArgumentException("Input cannot be null");\n        // Streamlined execution with telemetry and resilience\n        return new ExecutionResult("SUCCESS", System.currentTimeMillis());\n    }\n}`,
        isOptimal: true,
        score: 96,
        timeComplexity: 'O(N) Linear Time',
        spaceComplexity: 'O(1) Auxiliary Memory',
        verdict: 'Optimal & Production Ready ⭐',
        edgeCases: [
          { name: 'Null Parameter Defensive Check', status: 'Passed', detail: 'Validates inputs before processing, avoiding NullPointerExceptions.' },
          { name: 'Graceful Degradation & Timeout', status: 'Passed', detail: 'Returns predictable error structures instead of crashing the process.' },
          { name: 'Memory Cleanup & Garbage Collection', status: 'Passed', detail: 'Ensures memory references are garbage collected promptly.' }
        ],
        aiAnalysis: {
          verdictSummary: `Production-ready implementation meeting modern technical interview standards for ${skillName}.`,
          whyItWorksOrFails: `Follows clean code principles, enforces input validation, minimizes heap allocation, and handles edge conditions gracefully.`,
          thoughtProcess: [
            `Step 1: Validate input preconditions defensively.`,
            `Step 2: Execute algorithm in linear time complexity O(N).`,
            `Step 3: Return immutable result DTOs with status and timestamps.`
          ],
          referenceSolution: `Standard optimal pattern illustrated in Approach B.`,
          interviewTrap: `Always communicate your trade-offs between speed, memory, and readability to the interviewer.`
        }
      }
    ]
  };
};

// Comprehensive role-specific capstone placement assessments based on target goals & learned skills
const ROLE_FULL_ASSESSMENTS = {
  // Role 2: Full Stack Java Developer
  2: {
    title: 'Full Stack Java Developer Placement Assessment',
    description: 'Comprehensive evaluation testing end-to-end integration across Java OOP, Spring Boot 3 REST APIs, MySQL relational databases, and React.js frontend UI.',
    questions: [
      {
        question: 'In a Spring Boot & React architecture, how should a multi-step form handle real-time validation and asynchronous backend submission?',
        options: [
          'Store draft data in local React component state, validate inputs client-side, then send an HTTP POST/PUT request to a @RestController endpoint',
          'Directly execute SQL queries inside React JSX templates without a backend service',
          'Use synchronous Java main thread blocking locks on the client side',
          'Store all unvalidated user input directly in global window variables'
        ],
        answer: 0,
        explanation: 'React manages transient form state locally, performs client-side validation, and dispatches JSON to Spring Boot @RestController endpoints via fetch/axios.'
      },
      {
        question: 'Which Spring Data JPA method annotation and design pattern prevents dirty data writes during concurrent database updates in Spring Boot?',
        options: [
          '@Transactional with ACID isolation and Spring managed repository beans',
          '@Component with plain text CSV file logging',
          '@EventListener without database connections',
          '@ResponseBody with hardcoded static arrays'
        ],
        answer: 0,
        explanation: '@Transactional ensures database operations adhere to ACID properties, rolling back state automatically if an exception occurs.'
      },
      {
        question: 'What is the primary benefit of decoupling frontend (React SPA) from backend (Spring Boot 3 REST API)?',
        options: [
          'Eliminates the need for HTML and CSS completely',
          'Allows independent scaling, reusable REST API endpoints across mobile/web client apps, and clean separation of concerns',
          'Forces all database queries to run in browser memory',
          'Prevents any network HTTP traffic from taking place'
        ],
        answer: 1,
        explanation: 'Decoupled architecture enables frontends to consume standardized JSON APIs, allowing frontend and backend codebases to evolve and scale independently.'
      },
      {
        question: 'When a React frontend makes requests to a Spring Boot backend on a different origin (e.g. 5173 to 8080), how is authorization handled?',
        options: [
          'Configure CORS (Cross-Origin Resource Sharing) headers on Spring Boot and attach Bearer JWT tokens in request headers',
          'Disable browser security completely',
          'Convert all JSON data into base64 image strings',
          'Use raw TCP sockets inside standard HTML tags'
        ],
        answer: 0,
        explanation: 'CORS policies on Spring Boot allow requests from trusted frontend origins, while JWT authorization headers securely authenticate incoming REST requests.'
      },
      {
        question: 'Which SQL operation ensures referential integrity between a Student table and a Skill_Gap table?',
        options: [
          'Defining Foreign Key constraints linking Primary Keys between tables',
          'Using DROP TABLE IF EXISTS on every query',
          'Storing all data as unparsed plain text strings in a single column',
          'Writing endless nested IF statements inside frontend JavaScript'
        ],
        answer: 0,
        explanation: 'Foreign Key constraints enforce referential integrity across relational SQL tables, preventing orphaned records and maintaining database consistency.'
      }
    ]
  },

  // Role 1: AI & Machine Learning Engineer
  1: {
    title: 'AI & Machine Learning Engineer Placement Assessment',
    description: 'Evaluates practical application of Python data wrangling, machine learning pipeline training, deep neural network optimization, and algorithmic evaluation metrics.',
    questions: [
      {
        question: 'When building a machine learning classifier on an imbalanced dataset (e.g., 95% negative, 5% positive), why is Accuracy a misleading metric?',
        options: [
          'Accuracy is too slow to calculate on GPU clusters',
          'A dummy model predicting negative for all samples yields 95% accuracy while failing to detect positive cases; Precision, Recall, and ROC-AUC are required',
          'Accuracy cannot be calculated on numerical matrices',
          'Scikit-Learn does not support accuracy calculations'
        ],
        answer: 1,
        explanation: 'Class imbalance makes accuracy deceptive because predicting the majority class yields high numbers despite 0% recall on the minority class.'
      },
      {
        question: 'Which activation function is standard in deep Convolutional Neural Network (CNN) hidden layers to prevent vanishing gradients during backpropagation?',
        options: [
          'ReLU (Rectified Linear Unit)',
          'Sigmoid',
          'Linear Step Function',
          'Polynomial Kernel'
        ],
        answer: 0,
        explanation: 'ReLU f(x) = max(0, x) prevents vanishing gradients for positive inputs, enabling deep networks to converge much faster than Sigmoid or Tanh.'
      },
      {
        question: 'How do you prevent overfitting when training a complex deep learning model on a limited dataset?',
        options: [
          'Increase model parameters and training epochs indefinitely',
          'Apply Dropout layers, Data Augmentation, L2 Regularization, and Early Stopping',
          'Delete the validation dataset completely',
          'Set learning rate to zero'
        ],
        answer: 1,
        explanation: 'Regularization techniques like Dropout, Data Augmentation, and Early Stopping constrain model complexity and prevent memorization of noise.'
      },
      {
        question: 'In Python NumPy/Pandas, what is the most efficient way to perform mathematical transformations on a 1-million row matrix?',
        options: [
          'Iterate line-by-line using Python for loops',
          'Use vectorized matrix operations implemented in C under NumPy/Pandas',
          'Write data to a text file and read it back sequentially',
          'Convert all numbers into strings'
        ],
        answer: 1,
        explanation: 'Vectorized NumPy/Pandas operations execute in compiled C code, running up to 100x faster than standard Python loops.'
      },
      {
        question: 'Which algorithm is best suited for unsupervised customer segmentation when no target labels are available?',
        options: [
          'Linear Regression',
          'K-Means Clustering',
          'Binary Logistic Regression',
          'Supervised Decision Tree'
        ],
        answer: 1,
        explanation: 'K-Means is an unsupervised clustering algorithm that groups unlabeled data points into K distinct clusters based on feature distance.'
      }
    ]
  },

  // Role 4: Data Scientist & Analyst
  4: {
    title: 'Data Scientist & Analyst Placement Assessment',
    description: 'Evaluates skills in exploratory data analysis, SQL database aggregations, statistical hypothesis testing, and predictive analytics pipelines.',
    questions: [
      {
        question: 'Which SQL clause must be used when filtering results based on an aggregate calculation like COUNT() or AVG()?',
        options: [
          'WHERE',
          'HAVING',
          'ORDER BY',
          'GROUP BY'
        ],
        answer: 1,
        explanation: 'WHERE filters individual rows before aggregation, while HAVING filters aggregated group rows after GROUP BY execution.'
      },
      {
        question: 'What is the purpose of splitting data into Training and Testing sets before model training?',
        options: [
          'To evaluate how well the trained model generalizes to unseen data and prevent overfitting',
          'To make the dataset run faster in memory',
          'To remove duplicate records automatically',
          'To encrypt feature values'
        ],
        answer: 0,
        explanation: 'Testing sets act as unseen holdout data, ensuring the model generalizes well to new real-world inputs instead of memorizing training instances.'
      },
      {
        question: 'Which correlation coefficient measures linear relationships between two continuous numeric variables?',
        options: [
          'Pearson Correlation Coefficient (r)',
          'Gini Coefficient',
          'Confusion Matrix',
          'Euclidean Norm'
        ],
        answer: 0,
        explanation: 'Pearson r ranges from -1 to +1, quantifying the strength and direction of a linear relationship between two variables.'
      },
      {
        question: 'How does a Random Forest model reduce variance compared to a single Decision Tree?',
        options: [
          'By combining multiple decision trees trained on random bootstrap samples (Bagging) and averaging predictions',
          'By using a single linear equation',
          'By deleting half of the features',
          'By reducing dataset size'
        ],
        answer: 0,
        explanation: 'Random Forest uses ensemble bagging (Bootstrap Aggregating) to combine predictions from diverse trees, significantly lowering model variance.'
      },
      {
        question: 'In Pandas, which method efficiently handles missing data (NaN values) without dropping rows?',
        options: [
          'df.dropna()',
          'df.fillna(df.median()) or imputation strategies',
          'df.sort_values()',
          'df.head()'
        ],
        answer: 1,
        explanation: 'Imputation using fillna() with mean/median or domain values preserves dataset size while resolving missing values.'
      }
    ]
  },

  // Role 3: Embedded Systems & IoT Engineer
  3: {
    title: 'Embedded Systems & IoT Placement Assessment',
    description: 'Tests low-level memory control in C/C++, microcontroller register manipulation, hardware communication protocols (I2C/SPI), and firmware real-time systems.',
    questions: [
      {
        question: 'Why is the `volatile` keyword mandatory when defining memory-mapped hardware register pointers in Embedded C?',
        options: [
          'It tells the compiler that the memory location can change asynchronously outside compiler control (e.g. by hardware), preventing aggressive optimization',
          'It speeds up execution by saving variables on the stack',
          'It converts C variables into C++ classes automatically',
          'It encrypts memory bus traffic'
        ],
        answer: 0,
        explanation: '`volatile` prevents the compiler from optimizing out repeated reads from memory addresses modified by hardware peripherals or ISRs.'
      },
      {
        question: 'What is a critical rule when writing an Interrupt Service Routine (ISR) in microcontroller firmware?',
        options: [
          'Keep the ISR as fast and short as possible; never call blocking delays or heavy I/O operations inside an ISR',
          'Always insert long sleep delays inside the ISR',
          'Perform complex floating-point matrix multiplication inside the ISR',
          'Allocate dynamic heap memory repeatedly inside the ISR'
        ],
        answer: 0,
        explanation: 'ISRs interrupt normal program flow. Long operations inside an ISR block other interrupts and degrade real-time responsiveness.'
      },
      {
        question: 'Which communication protocol uses two lines (SDA and SCL) to connect multiple master and slave microcontrollers on a shared bus?',
        options: [
          'I2C (Inter-Integrated Circuit)',
          'UART',
          'SPI',
          'Ethernet'
        ],
        answer: 0,
        explanation: 'I2C uses two bidirectional lines (Serial Data SDA and Serial Clock SCL) with synchronous clocking and slave addressing.'
      },
      {
        question: 'In C++, what is a key memory management practice to prevent memory leaks in embedded applications?',
        options: [
          'Match every `new` with a `delete` or use smart pointers (`std::unique_ptr`, `std::shared_ptr`) for automatic lifetime management',
          'Never release allocated dynamic memory',
          'Use global variables for everything',
          'Reboot the hardware microcontroller every 5 seconds'
        ],
        answer: 0,
        explanation: 'Smart pointers automate RAII (Resource Acquisition Is Initialization), freeing heap memory automatically when objects go out of scope.'
      },
      {
        question: 'What component in a closed-loop robotics system provides real-time position feedback to correct motor movement errors?',
        options: [
          'Encoder / Sensor with PID Controller feedback loop',
          'Fixed Resistor',
          'Open-loop Step Delay',
          'Unfiltered DC Power Source'
        ],
        answer: 0,
        explanation: 'Encoders measure actual mechanical rotation, allowing PID feedback controllers to continuously minimize error between desired and actual positions.'
      }
    ]
  },

  // Role 5: DevOps & Cloud Engineer
  5: {
    title: 'DevOps & Cloud Engineer Placement Assessment',
    description: 'Evaluates containerization strategies, Kubernetes orchestration, CI/CD pipeline automation, and scalable cloud system design principles.',
    questions: [
      {
        question: 'What is the primary purpose of multi-stage Docker builds in production deployment?',
        options: [
          'To produce lightweight production images by separating build-time dependencies from final runtime artifacts',
          'To slow down container deployment for security testing',
          'To merge multiple Linux operating systems into one container',
          'To replace Git source control'
        ],
        answer: 0,
        explanation: 'Multi-stage builds compile artifacts in an initial build container and copy only necessary runtime binaries to a minimal production base image (e.g. Alpine).'
      },
      {
        question: 'In Kubernetes, what manifest object manages automated scaling, rolling updates, and self-healing of application pods?',
        options: [
          'Deployment',
          'ConfigMap',
          'Secret',
          'PersistentVolume'
        ],
        answer: 0,
        explanation: 'Kubernetes Deployments manage ReplicaSets to ensure the desired number of Pods remain healthy and update seamlessly during new releases.'
      },
      {
        question: 'According to the CAP Theorem in distributed cloud databases, what trade-off must be made during a network partition?',
        options: [
          'You must choose between Consistency (all nodes see same data) or Availability (every request receives a response)',
          'You can guarantee 100% of all three properties simultaneously under all conditions',
          'Network speed is reduced to zero',
          'Cloud servers automatically shut down'
        ],
        answer: 0,
        explanation: 'When network partitions (P) occur in distributed systems, architects must choose to sacrifice either Consistency (C) or Availability (A).'
      },
      {
        question: 'What is the main benefit of Infrastructure as Code (IaC) tools like Terraform or CloudFormation?',
        options: [
          'Provision, configure, and version cloud infrastructure programmatically using reproducible configuration files',
          'Manually click buttons in cloud web dashboards',
          'Replace all backend application logic',
          'Automatically write frontend React components'
        ],
        answer: 0,
        explanation: 'IaC enables teams to define cloud resources in code, enabling automated provisioning, version control, and consistent environment reproduction.'
      },
      {
        question: 'In a GitHub Actions CI/CD workflow pipeline, when should automated unit and integration tests be executed?',
        options: [
          'On every Pull Request and code push before merging into the main deployment branch',
          'Only after code has been deployed to production users',
          'Once every year during annual maintenance',
          'Never; tests are not necessary in CI/CD pipelines'
        ],
        answer: 0,
        explanation: 'Executing automated tests early in CI pipelines catches bugs before code reaches staging or production environments.'
      }
    ]
  },

  // Role 6: Civil Structural BIM & GIS Engineer
  6: {
    title: 'Civil Structural BIM & GIS Placement Assessment',
    description: 'Evaluates structural system design, GIS spatial database queries, Python engineering scripting, and BIM automation workflows.',
    questions: [
      {
        question: 'How do spatial SQL database extensions (e.g. PostGIS / Spatial MySQL) optimize structural location querying?',
        options: [
          'By indexing 2D/3D geometry columns with R-Tree indexes for fast spatial bounding box joins and proximity queries',
          'By storing coordinates as unindexed text strings',
          'By converting all spatial data into 2D JPEG images',
          'By removing primary key constraints'
        ],
        answer: 0,
        explanation: 'Spatial indexes (R-Tree) allow databases to perform fast spatial queries like ST_Contains and ST_Distance across structural and GIS data.'
      },
      {
        question: 'What is the primary advantage of Building Information Modeling (BIM) over traditional 2D CAD drafting?',
        options: [
          'BIM creates an intelligent 3D parametric data model containing physical, structural, material, and lifecycle metadata for automated clash detection',
          'BIM eliminates the need for structural calculations',
          'BIM only works on paper printouts',
          'BIM is only used for graphic design'
        ],
        answer: 0,
        explanation: 'BIM models integrate parametric engineering data across discipline models, enabling automated clash detection, cost estimation, and lifecycle management.'
      },
      {
        question: 'Why do civil engineers use Python scripting in structural and geotechnical analysis?',
        options: [
          'To automate repetitive matrix calculations, parameter optimization, and data parsing from finite element simulation software',
          'To write web browser games',
          'To replace physical concrete testing completely',
          'To disable CAD software licenses'
        ],
        answer: 0,
        explanation: 'Python scripts automate data extraction, matrix structural analysis, and repetitive design check computations.'
      },
      {
        question: 'In structural load path analysis, how are dead loads and live loads factored during limit state design?',
        options: [
          'Applied with specific safety load factors according to structural design standards (e.g. IS 456 / Eurocode)',
          'Ignored completely during calculations',
          'Multiplied by zero',
          'Set equal to wind speed only'
        ],
        answer: 0,
        explanation: 'Safety factors account for uncertainties in loading and material strength, ensuring structural safety under limit state design.'
      },
      {
        question: 'How does version control (Git) assist civil engineering teams managing complex project models?',
        options: [
          'Tracks revision histories, branch changes for design iterations, and prevents accidental overwrite of master calculation sheets',
          'Deletes previous project blueprints',
          'Replaces structural engineering software',
          'Formats PDF pages automatically'
        ],
        answer: 0,
        explanation: 'Version control ensures project calculation scripts, CAD automation routines, and datasets remain tracked, audit-ready, and backed up.'
      }
    ]
  },

  // Role 7: Smart Infrastructure & Construction Specialist
  7: {
    title: 'Smart Infrastructure & Construction Placement Assessment',
    description: 'Evaluates smart city sensor integration, asset data management, infrastructure system design, and cost estimation analytics.',
    questions: [
      {
        question: 'In a smart city IoT water monitoring network, what architecture handles real-time sensor data ingest from thousands of nodes?',
        options: [
          'IoT gateway message queues (MQTT / Kafka) feeding a centralized REST microservice and relational/time-series database',
          'Manual paper logbooks collected weekly',
          'Single static Excel file stored on a USB drive',
          'Sending direct email alerts for every raw sensor tick without filtering'
        ],
        answer: 0,
        explanation: 'Lightweight protocols like MQTT with message queues efficiently ingest telemetry data from distributed IoT sensors into backend databases.'
      },
      {
        question: 'How do SQL database aggregations assist in smart infrastructure asset management?',
        options: [
          'Aggregate queries (AVG, SUM, COUNT) compute historical maintenance costs, asset degradation rates, and replacement timelines across regions',
          'SQL databases delete asset records after 30 days',
          'SQL only stores text descriptions without numbers',
          'SQL prevents sensor data from saving'
        ],
        answer: 0,
        explanation: 'SQL aggregations provide actionable analytics on infrastructure wear, energy consumption, and lifecycle maintenance expenditure.'
      },
      {
        question: 'Why is Python analytics valuable for smart city construction cost and schedule estimation?',
        options: [
          'Predictive ML models analyze historical project datasets to forecast cost overruns and material requirement variances',
          'Python replaces construction workers on site',
          'Python prevents weather changes',
          'Python operates without computers'
        ],
        answer: 0,
        explanation: 'Machine learning algorithms trained on past project metrics identify cost driver patterns and generate accurate predictive risk estimates.'
      },
      {
        question: 'What design principle ensures smart grid infrastructure remains resilient during power or network outages?',
        options: [
          'System Redundancy, failover node architecture, and decentralized edge computing units',
          'Connecting all city sensors to a single non-backed-up server',
          'Disabling security authentication protocols',
          'Removing backup power generators'
        ],
        answer: 0,
        explanation: 'Redundant paths and edge computing allow local smart grid nodes to operate independently even if connection to central servers is temporarily lost.'
      },
      {
        question: 'How does Git version control facilitate collaboration among multi-disciplinary smart city engineering teams?',
        options: [
          'Maintains audit trails of system configuration files, API specs, and analytics scripts with branch-based code reviews',
          'Locks files so only one person can read them per week',
          'Converts all code into blueprints automatically',
          'Deletes historical commits'
        ],
        answer: 0,
        explanation: 'Git allows civil, software, and electrical engineers to collaborate on shared code repositories with clear change tracking.'
      }
    ]
  },

  // Role 8: Robotics & CAD Automation Engineer
  8: {
    title: 'Robotics & CAD Automation Placement Assessment',
    description: 'Evaluates robot kinematics math, C++ ROS middleware integration, actuator motor control loops, and microcontroller hardware programming.',
    questions: [
      {
        question: 'In industrial robotics, what is the key difference between Forward Kinematics and Inverse Kinematics?',
        options: [
          'Forward Kinematics calculates end-effector 3D position from joint angles; Inverse Kinematics calculates required joint angles to reach a target 3D position',
          'Forward Kinematics moves backward; Inverse Kinematics moves forward',
          'Kinematics only applies to stationary computers',
          'Inverse Kinematics deletes joint data'
        ],
        answer: 0,
        explanation: 'Inverse Kinematics is computationally essential for autonomous robot targeting, solving joint angles needed for the robotic arm gripper to reach a target coordinate.'
      },
      {
        question: 'Why is Robot Operating System (ROS / ROS2) used as standard middleware in modern robotics development?',
        options: [
          'Provides a publish-subscribe node architecture, hardware abstraction, package management, and standardized sensor message protocols',
          'Replaces C++ compilers completely',
          'Functions as a simple text editor',
          'Is only designed for web hosting'
        ],
        answer: 0,
        explanation: 'ROS publish-subscribe architecture allows sensor nodes, navigation algorithms, and motor controller nodes to communicate asynchronously.'
      },
      {
        question: 'In C++ robotics programming, how do you handle high-frequency sensor telemetry without blocking motor control loops?',
        options: [
          'Utilize multi-threading / asynchronous worker threads and lock-free queues or mutexes for shared state',
          'Put the main loop to sleep for 10 seconds on every frame',
          'Execute all calculations sequentially inside a single blocking function',
          'Disable sensor readings'
        ],
        answer: 0,
        explanation: 'Multi-threading isolates sensor data processing from real-time motor control loops, ensuring precise actuation timing.'
      },
      {
        question: 'What control algorithm continuously minimizes error between a target position and measured robot position using Proportional, Integral, and Derivative terms?',
        options: [
          'PID Controller',
          'Bubble Sort Algorithm',
          'Binary Search Tree',
          'Linear Regression'
        ],
        answer: 0,
        explanation: 'PID controllers adjust actuator control signals based on current error (P), accumulated past error (I), and rate of error change (D).'
      },
      {
        question: 'What is the role of Git version control in CAD automation and robotics software development?',
        options: [
          'Tracks custom Python/C++ CAD scripting macros, robot navigation code, and firmware releases with release tagging',
          'Generates physical 3D printed parts directly',
          'Erases past software versions',
          'Increases motor torque'
        ],
        answer: 0,
        explanation: 'Git manages code revisions for robot algorithms, CAD macros, and microcontroller firmware across engineering teams.'
      }
    ]
  }
};

export const PersonalizedRoadmap = ({
  targetRoleId = 2,
  acquiredSkills = [],
  onSkillCompleted,
  userTargetCompanies = [],
  onUpdateTargetCompanies
}) => {
  const authContext = useAuth();
  const user = authContext?.user;
  const updateUserTargetCompanies = onUpdateTargetCompanies || authContext?.updateUserTargetCompanies;

  // Derive target companies: from props -> user profile -> empty array
  const rawCompanies = (userTargetCompanies && userTargetCompanies.length > 0)
    ? userTargetCompanies
    : (user?.targetCompanies && user?.targetCompanies.length > 0)
    ? user.targetCompanies
    : [];

  const effectiveCompanies = Array.from(new Set(rawCompanies.map(c => (typeof c === 'string' ? c : c?.name || '').trim()))).filter(Boolean);

  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState('ALL');
  const [isAddCompanyModalOpen, setIsAddCompanyModalOpen] = useState(false);
  const [newCompanyInput, setNewCompanyInput] = useState('');
  const [roadmapViewMode, setRoadmapViewMode] = useState('chain'); // 'chain' | 'compact'

  const activeCompanyBlueprint = getCompanyBlueprint(
    selectedCompanyFilter === 'ALL'
      ? (effectiveCompanies.length > 0 ? effectiveCompanies[0] : 'ALL')
      : selectedCompanyFilter
  );

  const handleAddCompany = (compName) => {
    const trimmed = (compName || newCompanyInput).trim();
    if (!trimmed) return;
    if (!effectiveCompanies.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      const updated = [...effectiveCompanies, trimmed];
      if (updateUserTargetCompanies) {
        updateUserTargetCompanies(updated);
      }
      setSelectedCompanyFilter(trimmed);
    }
    setNewCompanyInput('');
    setIsAddCompanyModalOpen(false);
  };

  const [selectedStep, setSelectedStep] = useState(null);
  const [activeTabStage, setActiveTabStage] = useState('learn'); // 'learn' | 'practice' | 'assessment' | 'complete'
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Stage 3: Problem Solver & Deep AI Solution Analyzer State (Change 3)
  const [assessmentMode, setAssessmentMode] = useState('analyzer'); // 'analyzer' | 'quiz'
  const [selectedApproachId, setSelectedApproachId] = useState('b');
  const [studentComplexityEstimate, setStudentComplexityEstimate] = useState('O(1)');
  const [isAnalyzingSolution, setIsAnalyzingSolution] = useState(false);
  const [analyzedResult, setAnalyzedResult] = useState(null);

  // Full Capstone Role Assessment State
  const [isFullAssessmentOpen, setIsFullAssessmentOpen] = useState(false);
  const [fullQuizAnswers, setFullQuizAnswers] = useState({});
  const [fullQuizSubmitted, setFullQuizSubmitted] = useState(false);
  const [fullQuizScore, setFullQuizScore] = useState(0);
  const [fullQuizPassed, setFullQuizPassed] = useState(false);

  // Coding Practice Platform Modal State (LeetCode & HackerRank score/screenshot sharing)
  const [isPracticePlatformModalOpen, setIsPracticePlatformModalOpen] = useState(false);
  const [practicePlatformModalSkill, setPracticePlatformModalSkill] = useState('Data Structures & Algorithms');

  const roleConfig = CAREER_ROADMAPS_DATA[targetRoleId] || CAREER_ROADMAPS_DATA[2];
  const fullAssessmentData = ROLE_FULL_ASSESSMENTS[targetRoleId] || ROLE_FULL_ASSESSMENTS[2];
  const acquiredSkillNames = acquiredSkills.map(s => typeof s === 'string' ? s : s.skillName);

  // Calculate overall and company-targeted readiness
  const totalStepsCount = roleConfig.steps.length;
  const acquiredStepsCount = roleConfig.steps.filter(s => acquiredSkillNames.includes(s.skillName)).length;
  const overallReadinessScore = totalStepsCount > 0 ? Math.round((acquiredStepsCount / totalStepsCount) * 100) : 0;

  // Find the exact step that is "What should I learn first?" (the first unacquired step in sequence)
  const firstMissingIndex = roleConfig.steps.findIndex(step => !acquiredSkillNames.includes(step.skillName));
  const currentPriorityStep = firstMissingIndex !== -1 ? roleConfig.steps[firstMissingIndex] : null;

  const handleOpenStepModal = (step) => {
    setSelectedStep(step);
    setActiveTabStage('learn');
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizPassed(false);
    setQuizScore(0);
    setAssessmentMode('analyzer');
    setSelectedApproachId('b');
    setStudentComplexityEstimate('O(1)');
    setIsAnalyzingSolution(false);
    setAnalyzedResult(null);
  };

  const handleRunSolutionAnalysis = () => {
    if (!selectedStep) return;
    setIsAnalyzingSolution(true);
    setTimeout(() => {
      const analyzerData = getSkillProblemAnalyzer(selectedStep.skillName);
      const chosenApproach = analyzerData.approaches.find(a => a.id === selectedApproachId) || analyzerData.approaches[0];
      setAnalyzedResult({
        problem: analyzerData,
        approach: chosenApproach,
        studentComplexity: studentComplexityEstimate,
        timestamp: new Date().toLocaleTimeString()
      });
      setIsAnalyzingSolution(false);
    }, 600);
  };

  // Synchronous ref for full assessment answers
  const fullQuizAnswersRef = useRef(fullQuizAnswers);
  useEffect(() => {
    fullQuizAnswersRef.current = fullQuizAnswers;
  }, [fullQuizAnswers]);

  const handleVerifyFullQuiz = useCallback(() => {
    let score = 0;
    const currentAnswers = fullQuizAnswersRef.current;
    fullAssessmentData.questions.forEach((q, idx) => {
      if (currentAnswers[idx] === q.answer) score += 1;
    });
    const totalQ = fullAssessmentData.questions.length;
    const percentage = (score / totalQ) * 100;
    const passed = percentage >= 70;
    
    setFullQuizSubmitted(true);
    setFullQuizScore(score);
    setFullQuizPassed(passed);
    exitFullScreen();

    if (passed) {
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.log('Confetti triggered');
      }
    }
  }, [fullAssessmentData]);

  // Anti-Cheat Proctoring for Capstone Role Assessment
  const fullAssessmentAntiCheat = useAntiCheatAssessment({
    isActive: isFullAssessmentOpen && !fullQuizSubmitted,
    onAutoSubmit: () => {
      handleVerifyFullQuiz();
    },
    maxViolations: 3,
    assessmentTitle: `Capstone Assessment • ${roleConfig.roleName}`
  });

  const handleOpenFullAssessment = () => {
    setFullQuizAnswers({});
    setFullQuizSubmitted(false);
    setFullQuizScore(0);
    setFullQuizPassed(false);
    setIsFullAssessmentOpen(true);
    fullAssessmentAntiCheat.resetAssessment();
  };

  const handleCloseFullAssessment = () => {
    fullAssessmentAntiCheat.stopAssessment();
    setIsFullAssessmentOpen(false);
  };

  const handleFullQuizOptionSelect = (qIdx, oIdx) => {
    setFullQuizAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
  };

  // Synchronous ref for stage quiz answers
  const stageQuizAnswersRef = useRef(quizAnswers);
  useEffect(() => {
    stageQuizAnswersRef.current = quizAnswers;
  }, [quizAnswers]);

  const handleVerifyQuiz = useCallback((quizData) => {
    let score = 0;
    const currentAnswers = stageQuizAnswersRef.current;
    quizData.forEach((q, idx) => {
      if (currentAnswers[idx] === q.answer) score += 1;
    });
    setQuizSubmitted(true);
    setQuizScore(score);
    const passed = score >= Math.ceil(quizData.length * 0.66);
    setQuizPassed(passed);
    exitFullScreen();

    if (passed) {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.log('Confetti triggered');
      }
    }
  }, []);

  // Anti-Cheat Proctoring for Stage 3 Concept Quiz
  const stageQuizAntiCheat = useAntiCheatAssessment({
    isActive: Boolean(selectedStep && activeTabStage === 'assessment' && assessmentMode === 'quiz' && !quizSubmitted),
    onAutoSubmit: () => {
      if (selectedStep) {
        const quizList = getSkillStageContent(selectedStep.skillName).quiz;
        handleVerifyQuiz(quizList);
      }
    },
    maxViolations: 3,
    assessmentTitle: `Concept Quiz • ${selectedStep?.skillName || 'Skill'}`
  });

  const handleCloseStepModal = () => {
    stageQuizAntiCheat.stopAssessment();
    setSelectedStep(null);
  };

  const handleQuizOptionSelect = (qIdx, oIdx) => {
    setQuizAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
  };

  // Step & Assessment Feedback Modal State
  const [feedbackModalConfig, setFeedbackModalConfig] = useState({
    isOpen: false,
    title: '',
    type: 'ROADMAP_STEP',
    pendingSkill: null
  });

  const handleCompleteSkillStep = (skillName) => {
    setFeedbackModalConfig({
      isOpen: true,
      title: `Step: ${skillName}`,
      type: 'ROADMAP_STEP',
      pendingSkill: skillName
    });
  };

  const handleFeedbackModalSubmit = (savedFeedback) => {
    if (feedbackModalConfig.pendingSkill) {
      onSkillCompleted(feedbackModalConfig.pendingSkill);
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.log('Confetti triggered');
      }
    }
    setFeedbackModalConfig({ isOpen: false, title: '', type: 'ROADMAP_STEP', pendingSkill: null });
    setSelectedStep(null);
  };

  const handleFeedbackModalClose = () => {
    if (feedbackModalConfig.pendingSkill) {
      onSkillCompleted(feedbackModalConfig.pendingSkill);
    }
    setFeedbackModalConfig({ isOpen: false, title: '', type: 'ROADMAP_STEP', pendingSkill: null });
    setSelectedStep(null);
  };

  return (
    <div style={{
      background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
      borderRadius: '24px',
      border: '1px solid #e2e8f0',
      padding: '32px',
      boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      gap: '28px'
    }}>
      
      {/* Header Title Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '9999px', background: '#f3e8ff', border: '1px solid #d8b4fe', color: '#7c3aed', fontSize: '12px', fontWeight: 800 }}>
            <Target size={16} />
            <span>Personalized Career Roadmap</span>
          </div>
          
          <h2 style={{ fontSize: '26px', fontWeight: 900, color: '#0f172a', marginTop: '10px', letterSpacing: '-0.02em' }}>
            Your Step-by-Step Learning Sequence
          </h2>
          <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px', maxWidth: '650px' }}>
            Instead of just showing missing skills, here is your exact <strong>sequential learning path</strong> for <strong>{roleConfig.roleName}</strong>.
          </p>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#ffffff', padding: '10px 18px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#059669' }}>
            <CheckCircle2 size={16} />
            <span>Acquired</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 800, color: '#7c3aed' }}>
            <Zap size={16} fill="#7c3aed" />
            <span>Next Priority</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>
            <Lock size={14} />
            <span>Upcoming</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* COMPANY-TAILORED SHORTLISTING TRACK (CHANGE 2)            */}
      {/* ======================================================== */}
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        border: '1.5px solid #e2e8f0',
        padding: '24px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Top Header of Company Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  Target Company Shortlisting Lens
                </h3>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#7c3aed', background: '#f3e8ff', padding: '2px 8px', borderRadius: '6px' }}>
                  Hiring &amp; OA Rounds
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>
                Customize your sequential roadmap with exact interview rounds, cutoff scores, and question styles of your dream companies.
              </p>
            </div>
          </div>

          {/* Add / Switch Company Button */}
          <button
            onClick={() => setIsAddCompanyModalOpen(true)}
            style={{
              padding: '8px 16px',
              borderRadius: '12px',
              border: '1px dashed #7c3aed',
              background: '#faf5ff',
              color: '#7c3aed',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <Plus size={14} />
            <span>Add / Switch Company</span>
          </button>
        </div>

        {/* Company Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedCompanyFilter('ALL')}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              border: selectedCompanyFilter === 'ALL' ? '2px solid #7c3aed' : '1px solid #cbd5e1',
              background: selectedCompanyFilter === 'ALL' ? '#7c3aed' : '#f8fafc',
              color: selectedCompanyFilter === 'ALL' ? '#ffffff' : '#475569',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: selectedCompanyFilter === 'ALL' ? '0 4px 12px rgba(124, 58, 237, 0.25)' : 'none',
              transition: 'all 0.15s'
            }}
          >
            <Sparkles size={14} />
            <span>All Target Companies {effectiveCompanies.length > 0 ? `(${effectiveCompanies.length})` : ''}</span>
          </button>

          {effectiveCompanies.map((comp) => {
            const isSelected = selectedCompanyFilter === comp;
            const bp = getCompanyBlueprint(comp);
            return (
              <button
                key={comp}
                onClick={() => setSelectedCompanyFilter(comp)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  border: isSelected ? `2px solid ${bp.logoColor}` : '1px solid #cbd5e1',
                  background: isSelected ? bp.logoColor : '#f8fafc',
                  color: isSelected ? '#ffffff' : '#334155',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: isSelected ? `0 4px 12px ${bp.logoColor}40` : 'none',
                  transition: 'all 0.15s'
                }}
              >
                <Building2 size={13} />
                <span>{comp}</span>
                {isSelected && <Check size={13} />}
              </button>
            );
          })}

          {effectiveCompanies.length === 0 && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b', fontStyle: 'italic', padding: '6px 0' }}>
              <span>No target companies selected yet. Quick pick:</span>
              {['Google', 'Amazon', 'Microsoft', 'TCS', 'Infosys'].map(qComp => (
                <button
                  key={qComp}
                  onClick={() => handleAddCompany(qComp)}
                  style={{ padding: '4px 10px', borderRadius: '6px', background: '#f1f5f9', border: '1px solid #cbd5e1', fontSize: '11px', fontWeight: 700, color: '#334155', cursor: 'pointer' }}
                >
                  +{qComp}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Company Shortlist Intelligence Card */}
        {activeCompanyBlueprint && (
          <div style={{
            borderRadius: '16px',
            background: activeCompanyBlueprint.bgTint || '#f8fafc',
            border: `1.5px solid ${activeCompanyBlueprint.logoColor}30`,
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {/* Top row: Company Details & Readiness vs Cutoff */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>
                    {activeCompanyBlueprint.name}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', background: `${activeCompanyBlueprint.logoColor}20`, color: activeCompanyBlueprint.logoColor }}>
                    {activeCompanyBlueprint.tier}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: '#ffffff', color: '#475569', border: '1px solid #e2e8f0' }}>
                    {activeCompanyBlueprint.badge}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                  <span style={{ fontSize: '12px', color: '#475569' }}>
                    Target Role: <strong>{roleConfig.roleName}</strong>
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>•</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#047857' }}>
                    Shortlist Cutoff: {activeCompanyBlueprint.cutoffScore}%+ Readiness
                  </span>
                </div>
              </div>

              {/* Candidate Readiness Gauge */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>Your Shortlist Readiness:</span>
                  <span style={{ fontSize: '18px', fontWeight: 900, color: overallReadinessScore >= activeCompanyBlueprint.cutoffScore ? '#059669' : '#d97706' }}>
                    {overallReadinessScore}%
                  </span>
                </div>
                <div style={{ width: '180px', height: '8px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.min(100, overallReadinessScore)}%`,
                    height: '100%',
                    background: overallReadinessScore >= activeCompanyBlueprint.cutoffScore ? '#10b981' : 'linear-gradient(90deg, #f59e0b, #7c3aed)',
                    borderRadius: '9999px',
                    transition: 'width 0.4s ease'
                  }} />
                </div>
                <span style={{ fontSize: '10px', color: overallReadinessScore >= activeCompanyBlueprint.cutoffScore ? '#059669' : '#b45309', fontWeight: 700 }}>
                  {overallReadinessScore >= activeCompanyBlueprint.cutoffScore
                    ? '🎉 Meets Online Assessment (OA) Shortlisting Benchmark!'
                    : `⚠️ Need +${Math.max(0, activeCompanyBlueprint.cutoffScore - overallReadinessScore)}% to hit shortlisting cutoff`}
                </span>
              </div>
            </div>

            {/* 4-Round Company Interview Journey */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em', marginBottom: '8px' }}>
                Official 4-Round Selection Roadmap for {activeCompanyBlueprint.name}:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                {activeCompanyBlueprint.interviewRounds.map((rd, rdIdx) => (
                  <div
                    key={rdIdx}
                    style={{
                      background: '#ffffff',
                      borderRadius: '12px',
                      padding: '12px',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: activeCompanyBlueprint.logoColor }}>
                        {rd.round}
                      </span>
                      <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>
                        {rd.duration}
                      </span>
                    </div>
                    <div style={{ fontSize: '10px', color: '#7c3aed', fontWeight: 700 }}>
                      Platform: {rd.platform}
                    </div>
                    <p style={{ fontSize: '11px', color: '#334155', margin: 0, lineHeight: 1.4 }}>
                      {rd.focus}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shortlisting Recruiter Insights / Advice */}
            <div style={{ background: '#ffffff', borderRadius: '12px', padding: '12px 16px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                <Flame size={14} color="#f97316" />
                <span>How to Get Shortlisted at {activeCompanyBlueprint.name}:</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '11px', color: '#475569', lineHeight: 1.6 }}>
                {activeCompanyBlueprint.shortlistingTips.map((tip, tipIdx) => (
                  <li key={tipIdx}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* "WHAT SHOULD I LEARN FIRST?" CALLOUT BANNER */}
      {currentPriorityStep ? (
        <div style={{
          padding: '24px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #4338ca 0%, #6366f1 50%, #8b5cf6 100%)',
          color: '#ffffff',
          boxShadow: '0 12px 28px -8px rgba(99, 102, 241, 0.4)',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '9999px', background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(8px)', fontSize: '11px', fontWeight: 800, color: '#fef08a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              <Zap size={14} />
              <span>Recommended Next Priority Step</span>
            </div>
            
            <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#ffffff', margin: 0 }}>
              What Should You Learn First? → <span style={{ textDecoration: 'underline', textDecorationColor: '#fef08a' }}>{currentPriorityStep.name}</span>
            </h3>
            
            <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.9)', marginTop: '6px', lineHeight: 1.5 }}>
              Master <strong>{currentPriorityStep.skillName}</strong> next to unlock the biggest boost in your placement readiness score!
              {activeCompanyBlueprint && (
                <span style={{ display: 'block', marginTop: '4px', fontSize: '12px', color: '#fef08a' }}>
                  🎯 Fulfills a <strong>{getCompanySkillWeight(activeCompanyBlueprint, currentPriorityStep.skillName).level} Priority</strong> requirement for shortlisting at <strong>{activeCompanyBlueprint.name}</strong>.
                </span>
              )}
            </p>
          </div>

          <button
            onClick={() => handleOpenStepModal(currentPriorityStep)}
            style={{
              padding: '12px 24px',
              borderRadius: '14px',
              background: '#ffffff',
              color: '#4338ca',
              fontWeight: 900,
              fontSize: '13px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
              position: 'relative',
              zIndex: 2,
              transition: 'all 0.2s'
            }}
          >
            <BookOpen size={16} />
            <span>Start Learning {currentPriorityStep.skillName} Now →</span>
          </button>
        </div>
      ) : (
        <div style={{
          padding: '24px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #047857 100%)',
          color: '#ffffff',
          boxShadow: '0 12px 28px -8px rgba(16, 185, 129, 0.4)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{ maxWidth: '600px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '9999px', background: 'rgba(255, 255, 255, 0.2)', fontSize: '11px', fontWeight: 800, color: '#fef08a', textTransform: 'uppercase', marginBottom: '8px' }}>
              <Sparkles size={14} />
              <span>Roadmap Completed • Ready for Final Assessment</span>
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#ffffff', margin: 0 }}>
              All Sequential Steps Completed for {roleConfig.roleName}! 🏆
            </h3>
            <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.9)', marginTop: '6px' }}>
              Now verify how well you can apply your combined knowledge by taking the <strong>Full Placement Assessment</strong> for target goal <strong>{roleConfig.roleName}</strong>.
            </p>
          </div>

          <button
            onClick={handleOpenFullAssessment}
            style={{
              padding: '14px 28px',
              borderRadius: '14px',
              background: '#ffffff',
              color: '#047857',
              fontWeight: 900,
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 6px 18px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.2s'
            }}
          >
            <GraduationCap size={18} />
            <span>Take Full Role Assessment →</span>
          </button>
        </div>
      )}


      {/* ROADMAP VIEW CONTROLS & PRESENTATION MODE TOGGLE */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        background: '#ffffff',
        padding: '14px 20px',
        borderRadius: '18px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#7c3aed',
            boxShadow: '0 0 8px #7c3aed'
          }} />
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
            Roadmap Experience:
          </span>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            {roadmapViewMode === 'chain' 
              ? '⛓️ Interactive Chained Quest Path' 
              : '📋 Classic Vertical Flow'}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '4px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <button
            type="button"
            onClick={() => setRoadmapViewMode('chain')}
            style={{
              padding: '6px 14px',
              borderRadius: '9px',
              border: 'none',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              background: roadmapViewMode === 'chain' ? '#7c3aed' : 'transparent',
              color: roadmapViewMode === 'chain' ? '#ffffff' : '#64748b',
              boxShadow: roadmapViewMode === 'chain' ? '0 2px 8px rgba(124, 58, 237, 0.25)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <span>⛓️ Chained Path View</span>
          </button>

          <button
            type="button"
            onClick={() => setRoadmapViewMode('compact')}
            style={{
              padding: '6px 14px',
              borderRadius: '9px',
              border: 'none',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              background: roadmapViewMode === 'compact' ? '#7c3aed' : 'transparent',
              color: roadmapViewMode === 'compact' ? '#ffffff' : '#64748b',
              boxShadow: roadmapViewMode === 'compact' ? '0 2px 8px rgba(124, 58, 237, 0.25)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <span>📋 Compact List</span>
          </button>
        </div>
      </div>

      {/* ROADMAP PRESENTATION: CHAINED QUEST FLOW OR COMPACT LIST */}
      {roadmapViewMode === 'chain' ? (
        <ChainedRoadmapFlow
          steps={roleConfig.steps}
          roleConfig={roleConfig}
          acquiredSkillNames={acquiredSkillNames}
          currentPriorityStep={currentPriorityStep}
          activeCompanyBlueprint={activeCompanyBlueprint}
          getCompanySkillWeight={getCompanySkillWeight}
          getCompanySkillNote={getCompanySkillNote}
          onOpenStepModal={handleOpenStepModal}
          onOpenFullAssessment={handleOpenFullAssessment}
          fullAssessmentData={fullAssessmentData}
        />
      ) : (
        /* STEP-BY-STEP VERTICAL & GRAPH ROADMAP FLOW */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
          
          {roleConfig.steps.map((step, idx) => {
            const isAcquired = acquiredSkillNames.includes(step.skillName);
            const isCurrentPriority = currentPriorityStep && currentPriorityStep.id === step.id;

            return (
              <React.Fragment key={step.id}>
                
                {/* Roadmap Step Card */}
                <div 
                  onClick={() => handleOpenStepModal(step)}
                  style={{
                    padding: '20px 24px',
                    borderRadius: '20px',
                    background: isCurrentPriority 
                      ? '#ffffff' 
                      : isAcquired 
                      ? '#f0fdf4' 
                      : '#ffffff',
                    border: isCurrentPriority 
                      ? '2.5px solid #7c3aed' 
                      : isAcquired 
                      ? '1.5px solid #a7f3d0' 
                      : '1px solid #e2e8f0',
                    boxShadow: isCurrentPriority 
                      ? '0 12px 25px -5px rgba(124, 58, 237, 0.15)' 
                      : '0 2px 6px rgba(0,0,0,0.02)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  
                  {/* Left Step Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                    
                    {/* Step Number Circle */}
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '14px',
                      background: isAcquired 
                        ? '#10b981' 
                        : isCurrentPriority 
                        ? '#7c3aed' 
                        : '#f1f5f9',
                      color: (isAcquired || isCurrentPriority) ? '#ffffff' : '#64748b',
                      fontWeight: 900,
                      fontSize: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: isCurrentPriority ? '0 4px 12px rgba(124, 58, 237, 0.3)' : 'none'
                    }}>
                      {isAcquired ? <Check size={20} /> : `0${idx + 1}`}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: isCurrentPriority ? '#7c3aed' : '#64748b', letterSpacing: '0.05em' }}>
                          Step {idx + 1} • {step.category}
                        </span>

                        {isCurrentPriority && (
                          <span style={{ padding: '2px 8px', borderRadius: '6px', background: '#f3e8ff', color: '#7c3aed', fontSize: '10px', fontWeight: 800, border: '1px solid #d8b4fe' }}>
                            ⭐ LEARN FIRST
                          </span>
                        )}
                      </div>

                      <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                        {step.name}
                      </h4>
                      
                      <span style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', display: 'inline-block' }}>
                        Target Skill: <strong>{step.skillName}</strong> • Est. Duration: {step.approxWeeks}
                      </span>

                      {/* Target Company Focus Tag on Roadmap Step */}
                      {activeCompanyBlueprint && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '11px',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: '6px',
                            background: `${activeCompanyBlueprint.logoColor}15`,
                            color: activeCompanyBlueprint.logoColor,
                            border: `1px solid ${activeCompanyBlueprint.logoColor}30`
                          }}>
                            <Briefcase size={11} />
                            <span>{activeCompanyBlueprint.name}: {getCompanySkillWeight(activeCompanyBlueprint, step.skillName).level} Priority</span>
                          </span>
                          <span style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic' }}>
                            "{getCompanySkillNote(activeCompanyBlueprint, step.skillName)}"
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Status & 4-Stage Workflow Pill */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    
                    {/* 4-Stage Pill Indicator: Learn -> Practice -> Assessment -> Complete */}
                    <div style={{ display: 'none', mdDisplay: 'flex', alignItems: 'center', gap: '4px', background: '#f8fafc', padding: '6px 12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px', fontWeight: 700, color: '#64748b' }}>
                      <span style={{ color: isAcquired ? '#10b981' : '#7c3aed' }}>Learn</span>
                      <ChevronRight size={12} />
                      <span style={{ color: isAcquired ? '#10b981' : '#7c3aed' }}>Practice</span>
                      <ChevronRight size={12} />
                      <span style={{ color: isAcquired ? '#10b981' : '#7c3aed' }}>Assessment</span>
                      <ChevronRight size={12} />
                      <span style={{ color: isAcquired ? '#10b981' : '#64748b' }}>Complete</span>
                    </div>

                    {isAcquired ? (
                      <span style={{ padding: '8px 16px', borderRadius: '9999px', background: '#dcfce7', color: '#15803d', fontWeight: 800, fontSize: '12px', border: '1px solid #86efac', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle2 size={15} />
                        <span>Completed</span>
                      </span>
                    ) : isCurrentPriority ? (
                      <button style={{ padding: '8px 18px', borderRadius: '9999px', background: '#7c3aed', color: '#ffffff', fontWeight: 800, fontSize: '12px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)' }}>
                        <span>Start Step</span>
                        <ArrowRight size={14} />
                      </button>
                    ) : (
                      <span style={{ padding: '8px 14px', borderRadius: '9999px', background: '#f1f5f9', color: '#64748b', fontWeight: 700, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Lock size={13} />
                        <span>Upcoming Step</span>
                      </span>
                    )}
                  </div>

                </div>

                {/* Connecting Down Arrow between Steps */}
                {idx < roleConfig.steps.length - 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', margin: '-4px 0' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: isAcquired ? '#dcfce7' : '#f1f5f9',
                      border: isAcquired ? '1px solid #86efac' : '1px solid #cbd5e1',
                      color: isAcquired ? '#15803d' : '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 2
                    }}>
                      <ArrowDown size={16} />
                    </div>
                  </div>
                )}

              </React.Fragment>
            );
          })}
        </div>
      )}


      {/* FINAL COMPREHENSIVE ROLE CAPSTONE ASSESSMENT CARD */}
      <div style={{
        padding: '28px',
        borderRadius: '24px',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)',
        color: '#ffffff',
        boxShadow: '0 16px 36px -10px rgba(67, 56, 202, 0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        marginTop: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', maxWidth: '650px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '18px',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            color: '#a5b4fc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <GraduationCap size={30} />
          </div>

          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 10px', borderRadius: '9999px', background: 'rgba(255, 255, 255, 0.15)', fontSize: '11px', fontWeight: 800, color: '#fef08a', textTransform: 'uppercase', marginBottom: '6px' }}>
              <FileCheck size={14} />
              <span>Full Role Capstone Evaluation</span>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#ffffff', margin: 0 }}>
              {fullAssessmentData.title}
            </h3>
            <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.85)', marginTop: '4px', lineHeight: 1.5 }}>
              {fullAssessmentData.description}
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenFullAssessment}
          style={{
            padding: '14px 28px',
            borderRadius: '16px',
            background: '#7c3aed',
            color: '#ffffff',
            fontWeight: 900,
            fontSize: '14px',
            border: '1px solid rgba(255,255,255,0.3)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 6px 20px rgba(124, 58, 237, 0.4)',
            transition: 'all 0.2s'
          }}
        >
          <Award size={18} />
          <span>Take Full Role Assessment</span>
          <ArrowRight size={16} />
        </button>
      </div>


      {/* INTERACTIVE 4-STAGE LEARNING MODAL */}
      {selectedStep && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '680px',
            maxHeight: '90vh',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.4)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            
            {/* Modal Header */}
            <div style={{ padding: '24px 28px', background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#a5b4fc' }}>
                  {selectedStep.category} • Step {roleConfig.steps.findIndex(s => s.id === selectedStep.id) + 1}
                </span>
                <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#ffffff', marginTop: '2px', margin: 0 }}>
                  {selectedStep.name}
                </h3>
              </div>

              <button onClick={handleCloseStepModal} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={18} />
              </button>
            </div>

            {/* 4-Stage Tab Bar: Learn -> Practice -> Assessment -> Complete */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
              {[
                { id: 'learn', label: '1. Learn', icon: BookOpen },
                { id: 'practice', label: '2. Practice', icon: Code },
                { id: 'assessment', label: '3. Assessment', icon: HelpCircle },
                { id: 'complete', label: '4. Complete', icon: Award }
              ].map(tab => {
                const IconComp = tab.icon;
                const isActive = activeTabStage === tab.id;
                const isLocked = stageQuizAntiCheat.hasStarted && !quizSubmitted && tab.id !== 'assessment';

                return (
                  <button
                    key={tab.id}
                    disabled={isLocked}
                    onClick={() => {
                      if (isLocked) {
                        stageQuizAntiCheat.showToast('⚠️ Stage tabs are locked during active concept quiz.');
                        return;
                      }
                      setActiveTabStage(tab.id);
                    }}
                    style={{
                      flex: 1,
                      padding: '14px 10px',
                      background: isActive ? '#ffffff' : 'transparent',
                      border: 'none',
                      borderBottom: isActive ? '3px solid #7c3aed' : '3px solid transparent',
                      color: isActive ? '#7c3aed' : isLocked ? '#94a3b8' : '#64748b',
                      fontWeight: isActive ? 800 : 700,
                      fontSize: '13px',
                      cursor: isLocked ? 'not-allowed' : 'pointer',
                      opacity: isLocked ? 0.5 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <IconComp size={16} />
                    <span>{tab.label}</span>
                    {isLocked && <span style={{ fontSize: '10px' }}>🔒</span>}
                  </button>
                );
              })}
            </div>

            {/* Modal Body Content depending on Active Stage */}
            <div style={{ padding: '28px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* STAGE 1: LEARN */}
              {activeTabStage === 'learn' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ background: '#f3e8ff', padding: '16px', borderRadius: '16px', border: '1px solid #d8b4fe', color: '#5b21b6' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: 800, margin: 0 }}>📖 Step 1: Study Free Verified Learning Resources</h4>
                    <p style={{ fontSize: '12px', marginTop: '4px', color: '#6b21a8' }}>
                      Watch video lectures or read official docs for <strong>{selectedStep.skillName}</strong>.
                    </p>
                  </div>

                  {(getSkillStageContent(selectedStep.skillName).learn).map((item, idx) => (
                    <a
                      key={idx}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '16px',
                        borderRadius: '16px',
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase' }}>{item.type}</span>
                        <h5 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginTop: '2px', margin: 0 }}>{item.title}</h5>
                      </div>
                      <PlayCircle size={20} color="#7c3aed" />
                    </a>
                  ))}

                  {/* Company Study Focus */}
                  {activeCompanyBlueprint && (
                    <div style={{
                      background: activeCompanyBlueprint.bgTint || '#f8fafc',
                      padding: '16px',
                      borderRadius: '16px',
                      border: `1.5px solid ${activeCompanyBlueprint.logoColor}40`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Building2 size={16} color={activeCompanyBlueprint.logoColor} />
                          <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                            {activeCompanyBlueprint.name} Interview Study Focus for {selectedStep.skillName}
                          </span>
                        </div>
                        <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '6px', background: `${activeCompanyBlueprint.logoColor}20`, color: activeCompanyBlueprint.logoColor }}>
                          {getCompanySkillWeight(activeCompanyBlueprint, selectedStep.skillName).level} Priority
                        </span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#334155', margin: 0, lineHeight: 1.5 }}>
                        {getCompanySkillNote(activeCompanyBlueprint, selectedStep.skillName)}
                      </p>
                      <div style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', marginTop: '2px' }}>
                        💡 Recruiter Tip: Interviewers at {activeCompanyBlueprint.name} test design trade-offs, scalability, and code cleanliness on this topic.
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setActiveTabStage('practice')}
                    style={{ padding: '12px', borderRadius: '12px', background: '#7c3aed', color: '#fff', fontWeight: 800, fontSize: '13px', border: 'none', cursor: 'pointer', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <span>Proceed to Step 2: Practice →</span>
                  </button>
                </div>
              )}

              {/* STAGE 2: PRACTICE */}
              {activeTabStage === 'practice' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ background: '#ecfdf5', padding: '16px', borderRadius: '16px', border: '1px solid #a7f3d0', color: '#047857' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: 800, margin: 0 }}>💻 Step 2: Hands-on Practice &amp; Mini-Projects</h4>
                    <p style={{ fontSize: '12px', marginTop: '4px', color: '#065f46' }}>
                      Apply your knowledge by solving problems or completing hands-on tasks for <strong>{selectedStep.skillName}</strong>.
                    </p>
                  </div>

                  {(getSkillStageContent(selectedStep.skillName).practice).map((item, idx) => (
                    <div key={idx} style={{ padding: '16px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <h5 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: 0 }}>{item.title}</h5>
                      {item.task && <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>{item.task}</p>}
                      {item.link && (
                        <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#7c3aed', fontWeight: 700, textDecoration: 'underline', marginTop: '4px' }}>
                          Open Coding Platform →
                        </a>
                      )}
                    </div>
                  ))}

                  {/* Company Specific Interview Coding Challenges */}
                  {activeCompanyBlueprint && (
                    <div style={{
                      background: activeCompanyBlueprint.bgTint || '#f8fafc',
                      padding: '16px',
                      borderRadius: '16px',
                      border: `1.5px solid ${activeCompanyBlueprint.logoColor}40`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Code size={16} color={activeCompanyBlueprint.logoColor} />
                          <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                            {activeCompanyBlueprint.name} Interview Questions for {selectedStep.skillName}
                          </span>
                        </div>
                        <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>
                          Actual Company Interview Problems
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {getCompanySkillQuestions(activeCompanyBlueprint, selectedStep.skillName).map((cq, cqIdx) => (
                          <div key={cqIdx} style={{ background: '#ffffff', padding: '12px 14px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '10px', fontWeight: 800, color: activeCompanyBlueprint.logoColor, textTransform: 'uppercase' }}>
                                {cq.type}
                              </span>
                              <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                                Asked in {activeCompanyBlueprint.name} Round 2/3
                              </span>
                            </div>
                            <p style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                              {cq.question}
                            </p>
                          </div>
                        ))}
                      </div>

                      <a
                        href={`https://leetcode.com/problemset/all/?search=${encodeURIComponent(selectedStep.skillName)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '11px',
                          color: activeCompanyBlueprint.logoColor,
                          fontWeight: 800,
                          textDecoration: 'underline',
                          marginTop: '4px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <ExternalLink size={12} />
                        <span>Practice {activeCompanyBlueprint.name} Tagged Problems on LeetCode →</span>
                      </a>
                    </div>
                  )}

                  {/* Share LeetCode / HackerRank Practice Score / Screenshot Card */}
                  <div style={{
                    padding: '16px 18px',
                    borderRadius: '16px',
                    background: '#fffbeb',
                    border: '1.5px solid #fde68a',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#92400e' }}>
                          🏆 Practicing on LeetCode or HackerRank?
                        </span>
                        <span style={{ fontSize: '10px', fontWeight: 800, background: '#fef3c7', color: '#b45309', padding: '1px 6px', borderRadius: '4px', border: '1px solid #fde68a' }}>
                          Verified Proof
                        </span>
                      </div>
                      <p style={{ fontSize: '11.5px', color: '#78350f', margin: '2px 0 0 0' }}>
                        Share your score or upload a screenshot to get automated AI evaluation and verify your placement readiness!
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setPracticePlatformModalSkill(selectedStep.skillName);
                        setIsPracticePlatformModalOpen(true);
                      }}
                      style={{
                        padding: '9px 16px',
                        borderRadius: '10px',
                        background: '#d97706',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: 800,
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 8px rgba(217, 119, 6, 0.25)'
                      }}
                    >
                      <Upload size={14} />
                      <span>Share Score / Screenshot</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setActiveTabStage('assessment')}
                    style={{ padding: '12px', borderRadius: '12px', background: '#7c3aed', color: '#fff', fontWeight: 800, fontSize: '13px', border: 'none', cursor: 'pointer', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <span>Proceed to Step 3: Skill Assessment →</span>
                  </button>
                </div>
              )}

              {/* STAGE 3: ASSESSMENT & AI PROBLEM SOLVER */}
              {activeTabStage === 'assessment' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Mode Switcher Banner */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                    background: '#f8fafc',
                    padding: '10px 14px',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setAssessmentMode('analyzer')}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '12px',
                          border: 'none',
                          background: assessmentMode === 'analyzer' ? 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)' : '#e2e8f0',
                          color: assessmentMode === 'analyzer' ? '#ffffff' : '#475569',
                          fontWeight: 800,
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: assessmentMode === 'analyzer' ? '0 4px 12px rgba(124, 58, 237, 0.25)' : 'none',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Brain size={14} />
                        <span>🧠 Problem Solver & AI Analyzer</span>
                        <span style={{
                          fontSize: '9px',
                          background: assessmentMode === 'analyzer' ? '#ffffff' : '#d8b4fe',
                          color: '#7c3aed',
                          padding: '2px 6px',
                          borderRadius: '9999px',
                          fontWeight: 900
                        }}>
                          NEW
                        </span>
                      </button>

                      <button
                        onClick={() => setAssessmentMode('quiz')}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '12px',
                          border: 'none',
                          background: assessmentMode === 'quiz' ? 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)' : '#e2e8f0',
                          color: assessmentMode === 'quiz' ? '#ffffff' : '#475569',
                          fontWeight: 800,
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: assessmentMode === 'quiz' ? '0 4px 12px rgba(124, 58, 237, 0.25)' : 'none',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <span>📝 Quick Concept Quiz</span>
                      </button>
                    </div>

                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                      {assessmentMode === 'analyzer' 
                        ? 'Engineering scenario with step-by-step approach analysis & complexity derivation'
                        : '3-Question multiple choice knowledge check'}
                    </span>
                  </div>

                  {/* TAB 1: INTERACTIVE PROBLEM SOLVER & DEEP AI SOLUTION ANALYZER (CHANGE 3) */}
                  {assessmentMode === 'analyzer' && (() => {
                    const analyzerData = getSkillProblemAnalyzer(selectedStep.skillName);
                    const currentApproach = analyzerData.approaches.find(a => a.id === selectedApproachId) || analyzerData.approaches[0];

                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Problem Scenario Card */}
                        <div style={{
                          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
                          padding: '20px',
                          borderRadius: '20px',
                          color: '#ffffff',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.3)'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <span style={{
                                  fontSize: '10px',
                                  fontWeight: 800,
                                  background: '#38bdf8',
                                  color: '#0f172a',
                                  padding: '3px 8px',
                                  borderRadius: '6px',
                                  textTransform: 'uppercase'
                                }}>
                                  {selectedStep.skillName} Technical Scenario
                                </span>
                                <span style={{
                                  fontSize: '10px',
                                  fontWeight: 800,
                                  background: analyzerData.difficulty.toLowerCase().includes('hard') ? '#f43f5e' : '#f59e0b',
                                  color: '#ffffff',
                                  padding: '3px 8px',
                                  borderRadius: '6px'
                                }}>
                                  {analyzerData.difficulty}
                                </span>
                              </div>
                              <h3 style={{ fontSize: '18px', fontWeight: 900, marginTop: '8px', marginBottom: '2px', color: '#f8fafc' }}>
                                {analyzerData.title}
                              </h3>
                              <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>
                                🎯 <strong>Tested Concept:</strong> {analyzerData.conceptTested}
                              </p>
                            </div>

                            <span style={{
                              fontSize: '11px',
                              background: 'rgba(255, 255, 255, 0.1)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              color: '#cbd5e1',
                              padding: '6px 12px',
                              borderRadius: '10px',
                              fontWeight: 700
                            }}>
                              🏢 {analyzerData.companyTag}
                            </span>
                          </div>

                          <div style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            padding: '12px 14px',
                            fontSize: '13px',
                            lineHeight: 1.6,
                            color: '#e2e8f0'
                          }}>
                            <strong>Problem Scenario: </strong> {analyzerData.problemStatement}
                          </div>
                        </div>

                        {/* Interactive Approach Selection */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                              1. Select Your Candidate Approach &amp; Code Architecture:
                            </label>
                            <span style={{ fontSize: '11px', color: '#64748b' }}>
                              Choose how you would implement this in an interview
                            </span>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                            {analyzerData.approaches.map(app => {
                              const isSelected = selectedApproachId === app.id;
                              return (
                                <button
                                  key={app.id}
                                  onClick={() => {
                                    setSelectedApproachId(app.id);
                                    setAnalyzedResult(null);
                                  }}
                                  style={{
                                    padding: '14px',
                                    borderRadius: '14px',
                                    border: isSelected ? '2px solid #7c3aed' : '1px solid #e2e8f0',
                                    background: isSelected ? '#f5f3ff' : '#ffffff',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '6px',
                                    transition: 'all 0.15s ease',
                                    boxShadow: isSelected ? '0 4px 14px rgba(124, 58, 237, 0.15)' : 'none'
                                  }}
                                >
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{
                                      fontSize: '11px',
                                      fontWeight: 900,
                                      color: isSelected ? '#7c3aed' : '#64748b',
                                      textTransform: 'uppercase'
                                    }}>
                                      Approach {app.id.toUpperCase()}
                                    </span>
                                    {isSelected && (
                                      <span style={{
                                        fontSize: '10px',
                                        background: '#7c3aed',
                                        color: '#ffffff',
                                        padding: '2px 6px',
                                        borderRadius: '9999px',
                                        fontWeight: 800
                                      }}>
                                        Active
                                      </span>
                                    )}
                                  </div>
                                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', lineHeight: 1.4 }}>
                                    {app.label}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Code Implementation Preview */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Terminal size={14} color="#7c3aed" />
                              <span>Implementation Code Snippet ({currentApproach.label}):</span>
                            </span>
                            <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>
                              Production Architecture
                            </span>
                          </div>

                          <pre style={{
                            background: '#0f172a',
                            color: '#e2e8f0',
                            padding: '16px',
                            borderRadius: '14px',
                            fontSize: '12px',
                            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                            lineHeight: 1.6,
                            overflowX: 'auto',
                            border: '1px solid #1e293b',
                            margin: 0
                          }}>
                            <code>{currentApproach.codeSnippet}</code>
                          </pre>
                        </div>

                        {/* Complexity Self-Estimate & Run Action */}
                        <div style={{
                          background: '#ffffff',
                          padding: '16px',
                          borderRadius: '16px',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                            <div>
                              <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>
                                2. What is your estimated Time &amp; Space Complexity for this approach?
                              </span>
                              <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0 0' }}>
                                The AI Solution Analyzer will verify whether your asymptotic analysis holds true.
                              </p>
                            </div>

                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                              {['O(1)', 'O(log N)', 'O(N)', 'O(N log N)', 'O(V + E)'].map(cx => (
                                <button
                                  key={cx}
                                  onClick={() => setStudentComplexityEstimate(cx)}
                                  style={{
                                    padding: '6px 12px',
                                    borderRadius: '8px',
                                    border: studentComplexityEstimate === cx ? '2px solid #7c3aed' : '1px solid #cbd5e1',
                                    background: studentComplexityEstimate === cx ? '#f3e8ff' : '#f8fafc',
                                    color: studentComplexityEstimate === cx ? '#7c3aed' : '#475569',
                                    fontWeight: 800,
                                    fontSize: '11px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  {cx}
                                </button>
                              ))}
                            </div>
                          </div>

                          <button
                            onClick={handleRunSolutionAnalysis}
                            disabled={isAnalyzingSolution}
                            style={{
                              padding: '14px 20px',
                              borderRadius: '14px',
                              background: isAnalyzingSolution
                                ? '#94a3b8'
                                : 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                              color: '#ffffff',
                              fontWeight: 900,
                              fontSize: '14px',
                              border: 'none',
                              cursor: isAnalyzingSolution ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px',
                              boxShadow: '0 8px 20px -4px rgba(124, 58, 237, 0.4)',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {isAnalyzingSolution ? (
                              <>
                                <RefreshCw size={16} className="animate-spin" />
                                <span>Analyzing Approach &amp; Evaluating Edge Cases...</span>
                              </>
                            ) : (
                              <>
                                <Brain size={18} />
                                <span>⚡ Submit &amp; Run AI Solution Analysis</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* AI ANALYSIS RESULTS DASHBOARD (CHANGE 3 CORE REQUIREMENT) */}
                        {analyzedResult && (
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                            marginTop: '8px',
                            background: '#faf5ff',
                            border: '2px solid #d8b4fe',
                            borderRadius: '20px',
                            padding: '24px'
                          }}>
                            {/* Score & Verdict Banner */}
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              flexWrap: 'wrap',
                              gap: '12px',
                              paddingBottom: '16px',
                              borderBottom: '1px solid #e9d5ff'
                            }}>
                              <div>
                                <span style={{ fontSize: '11px', fontWeight: 900, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                  🧠 AI Solution Evaluation Report
                                </span>
                                <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#1e1b4b', margin: '4px 0 0 0' }}>
                                  Verdict: {analyzedResult.approach.verdict}
                                </h3>
                                <p style={{ fontSize: '12px', color: '#581c87', margin: '4px 0 0 0' }}>
                                  {analyzedResult.approach.aiAnalysis.verdictSummary}
                                </p>
                              </div>

                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                background: '#ffffff',
                                padding: '10px 18px',
                                borderRadius: '16px',
                                border: '1px solid #d8b4fe',
                                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.1)'
                              }}>
                                <div style={{ textAlign: 'right' }}>
                                  <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 700, display: 'block' }}>
                                    APPROACH SCORE
                                  </span>
                                  <span style={{
                                    fontSize: '22px',
                                    fontWeight: 900,
                                    color: analyzedResult.approach.score >= 80 ? '#059669' : analyzedResult.approach.score >= 60 ? '#d97706' : '#dc2626'
                                  }}>
                                    {analyzedResult.approach.score}
                                  </span>
                                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>/100</span>
                                </div>
                              </div>
                            </div>

                            {/* Complexity Verification Card */}
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                              gap: '10px'
                            }}>
                              <div style={{ background: '#ffffff', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>
                                  Your Complexity Estimate
                                </span>
                                <p style={{ fontSize: '14px', fontWeight: 900, color: '#7c3aed', margin: '4px 0 0 0' }}>
                                  {analyzedResult.studentComplexity}
                                </p>
                              </div>

                              <div style={{ background: '#ffffff', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>
                                  AI Derived Time Complexity
                                </span>
                                <p style={{ fontSize: '14px', fontWeight: 900, color: '#0f172a', margin: '4px 0 0 0' }}>
                                  {analyzedResult.approach.timeComplexity}
                                </p>
                              </div>

                              <div style={{ background: '#ffffff', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>
                                  AI Derived Space Complexity
                                </span>
                                <p style={{ fontSize: '14px', fontWeight: 900, color: '#0f172a', margin: '4px 0 0 0' }}>
                                  {analyzedResult.approach.spaceComplexity}
                                </p>
                              </div>
                            </div>

                            {/* Edge Case Stress-Test Matrix */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <span style={{ fontSize: '12px', fontWeight: 800, color: '#1e1b4b' }}>
                                🧪 Edge Case &amp; Concurrency Stress Test Matrix:
                              </span>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {analyzedResult.approach.edgeCases.map((ec, ecIdx) => {
                                  const isPassed = ec.status === 'Passed';
                                  const isWarning = ec.status === 'Warning';
                                  return (
                                    <div
                                      key={ecIdx}
                                      style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '10px 14px',
                                        borderRadius: '10px',
                                        background: '#ffffff',
                                        border: isPassed ? '1px solid #bbf7d0' : isWarning ? '1px solid #fde68a' : '1px solid #fecaca',
                                        gap: '12px'
                                      }}
                                    >
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {isPassed ? (
                                          <CheckCircle size={16} color="#059669" />
                                        ) : isWarning ? (
                                          <AlertTriangle size={16} color="#d97706" />
                                        ) : (
                                          <XCircle size={16} color="#dc2626" />
                                        )}
                                        <div>
                                          <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>
                                            {ec.name}
                                          </span>
                                          <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>
                                            {ec.detail}
                                          </p>
                                        </div>
                                      </div>

                                      <span style={{
                                        fontSize: '10px',
                                        fontWeight: 800,
                                        padding: '3px 8px',
                                        borderRadius: '9999px',
                                        background: isPassed ? '#dcfce7' : isWarning ? '#fef3c7' : '#fee2e2',
                                        color: isPassed ? '#15803d' : isWarning ? '#b45309' : '#b91c1c'
                                      }}>
                                        {ec.status}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Step-by-Step Approach Analysis & Thought Process (Mam's Core Requirement) */}
                            <div style={{
                              background: '#ffffff',
                              padding: '18px',
                              borderRadius: '16px',
                              border: '1px solid #e2e8f0',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '10px'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Sparkles size={16} color="#7c3aed" />
                                <span style={{ fontSize: '13px', fontWeight: 900, color: '#0f172a' }}>
                                  Step-by-Step Approach Derivation &amp; Thought Process:
                                </span>
                              </div>

                              <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                                {analyzedResult.approach.aiAnalysis.whyItWorksOrFails}
                              </p>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                                {analyzedResult.approach.aiAnalysis.thoughtProcess.map((stepDesc, sIdx) => (
                                  <div
                                    key={sIdx}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'flex-start',
                                      gap: '10px',
                                      background: '#f8fafc',
                                      padding: '10px 14px',
                                      borderRadius: '10px',
                                      borderLeft: '3px solid #7c3aed'
                                    }}
                                  >
                                    <span style={{
                                      fontSize: '11px',
                                      fontWeight: 900,
                                      background: '#7c3aed',
                                      color: '#ffffff',
                                      width: '20px',
                                      height: '20px',
                                      borderRadius: '50%',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      flexShrink: 0
                                    }}>
                                      {sIdx + 1}
                                    </span>
                                    <span style={{ fontSize: '12px', color: '#334155', fontWeight: 600, lineHeight: 1.5 }}>
                                      {stepDesc}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Reference Solution Code */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <span style={{ fontSize: '12px', fontWeight: 800, color: '#1e1b4b' }}>
                                💡 Optimal Industry Reference Implementation:
                              </span>
                              <pre style={{
                                background: '#0f172a',
                                color: '#a5f3fc',
                                padding: '14px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                                lineHeight: 1.5,
                                overflowX: 'auto',
                                margin: 0,
                                border: '1px solid #1e293b'
                              }}>
                                <code>{analyzedResult.approach.aiAnalysis.referenceSolution}</code>
                              </pre>
                            </div>

                            {/* Interview Traps & Pitfalls Alert */}
                            <div style={{
                              background: '#fff1f2',
                              border: '1px solid #fecdd3',
                              padding: '14px',
                              borderRadius: '14px',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '10px'
                            }}>
                              <AlertTriangle size={18} color="#e11d48" style={{ flexShrink: 0, marginTop: '2px' }} />
                              <div>
                                <span style={{ fontSize: '12px', fontWeight: 900, color: '#9f1239' }}>
                                  ⚠️ Critical Interview Trap to Avoid:
                                </span>
                                <p style={{ fontSize: '11px', color: '#be123c', margin: '4px 0 0 0', lineHeight: 1.5 }}>
                                  {analyzedResult.approach.aiAnalysis.interviewTrap}
                                </p>
                              </div>
                            </div>

                            {/* Proceed to Stage 4 Button */}
                            <button
                              onClick={() => setActiveTabStage('complete')}
                              style={{
                                padding: '14px',
                                borderRadius: '14px',
                                background: '#10b981',
                                color: '#ffffff',
                                fontWeight: 900,
                                fontSize: '13px',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                marginTop: '4px',
                                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
                              }}
                            >
                              <span>Ready! Proceed to Step 4: Mark Complete →</span>
                            </button>
                          </div>
                        )}

                        {!analyzedResult && (
                          <button
                            onClick={() => setActiveTabStage('complete')}
                            style={{
                              padding: '12px',
                              borderRadius: '12px',
                              background: '#f1f5f9',
                              color: '#475569',
                              fontWeight: 800,
                              fontSize: '13px',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            Skip to Step 4: Mark Complete →
                          </button>
                        )}
                      </div>
                    );
                  })()}

                  {/* TAB 2: ORIGINAL 3-QUESTION QUIZ */}
                  {assessmentMode === 'quiz' && (() => {
                    const quizList = getSkillStageContent(selectedStep.skillName).quiz;
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {!stageQuizAntiCheat.hasStarted && !quizSubmitted ? (
                          <AntiCheatStartCard
                            title={`Technical Concept Quiz • ${selectedStep.skillName}`}
                            questionCount={quizList.length}
                            timeEstimate="5 Mins"
                            onStartExam={stageQuizAntiCheat.startAssessment}
                          />
                        ) : (
                          <>
                            {!quizSubmitted && (
                              <AntiCheatLiveBanner
                                tabSwitchCount={stageQuizAntiCheat.tabSwitchCount}
                                maxViolations={stageQuizAntiCheat.maxViolations}
                                isFullscreen={stageQuizAntiCheat.isFullscreen}
                              />
                            )}

                            {quizSubmitted && (
                              <AntiCheatAuditBadge
                                violationCount={stageQuizAntiCheat.violationCount}
                                tabSwitchCount={stageQuizAntiCheat.tabSwitchCount}
                                fullscreenExitCount={stageQuizAntiCheat.fullscreenExitCount}
                                autoSubmitted={stageQuizAntiCheat.autoSubmitted}
                              />
                            )}

                            <div style={{ background: '#fef3c7', padding: '14px 16px', borderRadius: '14px', border: '1px solid #fde68a', color: '#78350f' }}>
                              <h4 style={{ fontSize: '14px', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span>📝 Quick Concept Quiz</span>
                              </h4>
                              <p style={{ fontSize: '11px', marginTop: '4px', color: '#92400e', margin: 0 }}>
                                Answer these 3 quick questions to verify your understanding of <strong>{selectedStep.skillName}</strong>.
                                {quizSubmitted && ' Check the right answers with detailed explanations below.'}
                              </p>
                            </div>

                            <div 
                              style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                gap: '16px',
                                userSelect: 'none',
                                WebkitUserSelect: 'none'
                              }}
                              onContextMenu={(e) => {
                                e.preventDefault();
                                stageQuizAntiCheat.showToast('⚠️ Right-click context menu is disabled.');
                              }}
                            >
                              {quizList.map((q, qIdx) => {
                          const selectedOpt = quizAnswers[qIdx];
                          const isAnswered = selectedOpt !== undefined;
                          const isCorrect = selectedOpt === q.answer;

                          return (
                            <div
                              key={qIdx}
                              style={{
                                padding: '18px 20px',
                                borderRadius: '16px',
                                background: '#ffffff',
                                border: quizSubmitted
                                  ? (isCorrect ? '2px solid #10b981' : '2px solid #ef4444')
                                  : '1px solid #cbd5e1',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                                boxShadow: quizSubmitted
                                  ? (isCorrect ? '0 4px 14px rgba(16, 185, 129, 0.08)' : '0 4px 14px rgba(239, 68, 68, 0.08)')
                                  : '0 2px 6px rgba(0,0,0,0.02)',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                                <h5 style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.4 }}>
                                  Q{qIdx + 1}: {q.question}
                                </h5>

                                {quizSubmitted && (
                                  <span
                                    style={{
                                      padding: '4px 10px',
                                      borderRadius: '8px',
                                      fontSize: '11px',
                                      fontWeight: 800,
                                      background: isCorrect ? '#dcfce7' : '#fee2e2',
                                      color: isCorrect ? '#15803d' : '#b91c1c',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      flexShrink: 0
                                    }}
                                  >
                                    {isCorrect ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                                    <span>{isCorrect ? 'Correct' : 'Incorrect'}</span>
                                  </span>
                                )}
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {q.options.map((opt, oIdx) => {
                                  const isSelected = selectedOpt === oIdx;
                                  const isAnswerKey = quizSubmitted && oIdx === q.answer;

                                  let btnStyle = {
                                    padding: '11px 15px',
                                    borderRadius: '11px',
                                    border: isSelected ? '2px solid #7c3aed' : '1px solid #e2e8f0',
                                    background: isSelected ? '#f3e8ff' : '#f8fafc',
                                    color: isSelected ? '#7c3aed' : '#334155',
                                    fontWeight: isSelected ? 800 : 600,
                                    fontSize: '12.5px',
                                    textAlign: 'left',
                                    cursor: quizSubmitted ? 'default' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '8px',
                                    transition: 'all 0.15s ease'
                                  };

                                  if (quizSubmitted) {
                                    if (isAnswerKey) {
                                      btnStyle.border = '2px solid #10b981';
                                      btnStyle.background = '#ecfdf5';
                                      btnStyle.color = '#047857';
                                      btnStyle.fontWeight = 800;
                                    } else if (isSelected && !isCorrect) {
                                      btnStyle.border = '2px solid #ef4444';
                                      btnStyle.background = '#fef2f2';
                                      btnStyle.color = '#b91c1c';
                                      btnStyle.fontWeight = 700;
                                    } else {
                                      btnStyle.border = '1px solid #e2e8f0';
                                      btnStyle.background = '#f8fafc';
                                      btnStyle.color = '#64748b';
                                      btnStyle.opacity = 0.75;
                                    }
                                  }

                                  return (
                                    <button
                                      key={oIdx}
                                      disabled={quizSubmitted}
                                      onClick={() => handleQuizOptionSelect(qIdx, oIdx)}
                                      style={btnStyle}
                                    >
                                      <span>{opt}</span>
                                      {quizSubmitted && isAnswerKey && (
                                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#059669', display: 'inline-flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                                          <CheckCircle2 size={15} color="#059669" />
                                          <span>Right Answer</span>
                                        </span>
                                      )}
                                      {quizSubmitted && isSelected && !isCorrect && (
                                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#dc2626', display: 'inline-flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                                          <XCircle size={15} color="#dc2626" />
                                          <span>Your Answer</span>
                                        </span>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>

                              {/* What should be the right answer with explanation */}
                              {quizSubmitted && (
                                <div
                                  style={{
                                    marginTop: '4px',
                                    padding: '14px 16px',
                                    borderRadius: '12px',
                                    background: isCorrect ? '#f0fdf4' : '#fffbeb',
                                    border: isCorrect ? '1px solid #bbf7d0' : '1px solid #fde68a',
                                    borderLeft: isCorrect ? '4px solid #10b981' : '4px solid #f59e0b',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '6px'
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 900, color: isCorrect ? '#166534' : '#92400e', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                      <Sparkles size={14} color={isCorrect ? '#166534' : '#b45309'} />
                                      <span>Right Answer &amp; Explanation:</span>
                                    </span>
                                    <span
                                      style={{
                                        fontSize: '11px',
                                        fontWeight: 800,
                                        background: isCorrect ? '#dcfce7' : '#fef3c7',
                                        color: isCorrect ? '#15803d' : '#92400e',
                                        padding: '2px 8px',
                                        borderRadius: '6px',
                                        border: isCorrect ? '1px solid #86efac' : '1px solid #fcd34d'
                                      }}
                                    >
                                      Correct Option: {q.options[q.answer]}
                                    </span>
                                  </div>

                                  <p style={{ fontSize: '12.5px', color: '#334155', margin: 0, lineHeight: 1.55 }}>
                                    {q.explanation || `The correct answer is "${q.options[q.answer]}".`}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                        </div>

                        {quizSubmitted ? (
                          <div
                            style={{
                              padding: '20px',
                              borderRadius: '16px',
                              background: quizPassed ? '#ecfdf5' : '#fef2f2',
                              border: quizPassed ? '2px solid #a7f3d0' : '2px solid #fecaca',
                              color: quizPassed ? '#047857' : '#dc2626',
                              textAlign: 'center',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '8px'
                            }}
                          >
                            <h4 style={{ fontSize: '18px', fontWeight: 900, margin: 0 }}>
                              {quizPassed
                                ? `🎉 Assessment Passed! (${quizScore}/${quizList.length} - ${Math.round((quizScore / quizList.length) * 100)}%)`
                                : `❌ Quiz Not Passed (Score: ${quizScore}/${quizList.length} - ${Math.round((quizScore / quizList.length) * 100)}%)`}
                            </h4>
                            <p style={{ fontSize: '12.5px', margin: 0, maxWidth: '520px', lineHeight: 1.5, color: quizPassed ? '#065f46' : '#991b1b' }}>
                              {quizPassed
                                ? 'Outstanding! You have cleared this skill assessment. Review the explanations above and proceed to mark this skill as completed!'
                                : 'Please review what should be the right answer with explanations shown above for each question, then retake the quiz or review the learning materials.'}
                            </p>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                              <button
                                onClick={() => {
                                  setQuizAnswers({});
                                  setQuizSubmitted(false);
                                  setQuizPassed(false);
                                  setQuizScore(0);
                                  stageQuizAntiCheat.resetAssessment();
                                }}
                                style={{
                                  padding: '10px 18px',
                                  borderRadius: '12px',
                                  background: '#ffffff',
                                  border: '1.5px solid #7c3aed',
                                  color: '#7c3aed',
                                  fontWeight: 800,
                                  fontSize: '12px',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  boxShadow: '0 2px 6px rgba(124, 58, 237, 0.1)'
                                }}
                              >
                                <RefreshCw size={14} />
                                <span>Retake Quiz</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setFeedbackModalConfig({
                                  isOpen: true,
                                  title: `${selectedStep.skillName} Quiz Assessment`,
                                  type: 'ASSESSMENT',
                                  pendingSkill: null
                                })}
                                style={{
                                  padding: '10px 16px',
                                  borderRadius: '12px',
                                  background: '#f3e8ff',
                                  border: '1px solid #d8b4fe',
                                  color: '#7c3aed',
                                  fontWeight: 800,
                                  fontSize: '12px',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}
                              >
                                <Star size={14} fill="#f59e0b" color="#f59e0b" />
                                <span>Rate Assessment &amp; Feelings</span>
                              </button>

                              {quizPassed ? (
                                <button
                                  onClick={() => setActiveTabStage('complete')}
                                  style={{
                                    padding: '10px 20px',
                                    borderRadius: '12px',
                                    background: '#10b981',
                                    color: '#ffffff',
                                    fontWeight: 800,
                                    fontSize: '12px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                                  }}
                                >
                                  <span>Proceed to Step 4: Mark Complete →</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => setActiveTabStage('complete')}
                                  style={{
                                    padding: '10px 16px',
                                    borderRadius: '12px',
                                    background: '#f1f5f9',
                                    color: '#475569',
                                    fontWeight: 800,
                                    fontSize: '12px',
                                    border: '1px solid #cbd5e1',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Skip to Step 4: Mark Complete →
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => handleVerifyQuiz(quizList)}
                              style={{
                                padding: '14px',
                                borderRadius: '14px',
                                background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
                                color: '#fff',
                                fontWeight: 800,
                                fontSize: '13px',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)'
                              }}
                            >
                              <FileCheck size={16} />
                              <span>Verify Answers &amp; Submit Assessment</span>
                            </button>

                            <button
                              onClick={() => setActiveTabStage('complete')}
                              style={{
                                padding: '12px',
                                borderRadius: '12px',
                                background: '#f1f5f9',
                                color: '#475569',
                                fontWeight: 800,
                                fontSize: '13px',
                                border: 'none',
                                cursor: 'pointer'
                              }}
                            >
                              Skip to Step 4: Mark Complete →
                            </button>
                          </>
                        )}
                          </>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* STAGE 4: COMPLETE */}
              {activeTabStage === 'complete' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #86efac' }}>
                    <Award size={32} />
                  </div>

                  <div>
                    <h4 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                      Mark {selectedStep.skillName} as Completed!
                    </h4>
                    <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', maxWidth: '450px' }}>
                      Marking this skill as completed will automatically update your acquired skills, recalculate your placement readiness score, and advance your priority to the next roadmap step.
                      {activeCompanyBlueprint && (
                        <span style={{ display: 'block', marginTop: '6px', fontSize: '12px', fontWeight: 700, color: '#059669' }}>
                          🎯 Boosts your shortlisting readiness towards {activeCompanyBlueprint.name}'s {activeCompanyBlueprint.cutoffScore}% cutoff!
                        </span>
                      )}
                    </p>
                  </div>

                  <button
                    onClick={() => handleCompleteSkillStep(selectedStep.skillName)}
                    style={{
                      padding: '14px 32px',
                      borderRadius: '16px',
                      background: '#10b981',
                      color: '#ffffff',
                      fontWeight: 900,
                      fontSize: '14px',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 6px 18px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    <CheckCircle2 size={18} />
                    <span>Confirm &amp; Complete {selectedStep.skillName}</span>
                  </button>
                </div>
              )}

            </div>

            {/* Anti-Cheat Proctoring Modals for Stage Quiz */}
            <AntiCheatModals
              warningModal={stageQuizAntiCheat.warningModal}
              toastMessage={stageQuizAntiCheat.toastMessage}
              onResumeFullScreen={stageQuizAntiCheat.resumeFullScreen}
              onDismissWarning={stageQuizAntiCheat.dismissWarningModal}
              onViewResults={() => stageQuizAntiCheat.dismissWarningModal()}
            />

          </div>
        </div>
      )}

      {/* INTERACTIVE FULL ROLE CAPSTONE ASSESSMENT MODAL */}
      {isFullAssessmentOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: fullAssessmentAntiCheat.isFullscreen ? '860px' : '750px',
            maxHeight: fullAssessmentAntiCheat.isFullscreen ? '96vh' : '92vh',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.4)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            
            {/* Modal Header */}
            <div style={{ padding: '24px 28px', background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#a5b4fc', letterSpacing: '0.05em' }}>
                  Placement Readiness Capstone • {roleConfig.roleName}
                </span>
                <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#ffffff', marginTop: '2px', margin: 0 }}>
                  {fullAssessmentData.title}
                </h3>
              </div>

              <button onClick={handleCloseFullAssessment} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={18} />
              </button>
            </div>

            {/* Modal Body Content */}
            <div style={{ padding: '28px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '22px' }}>
              {!fullAssessmentAntiCheat.hasStarted && !fullQuizSubmitted ? (
                <AntiCheatStartCard
                  title={`Placement Readiness Capstone • ${roleConfig.roleName}`}
                  questionCount={fullAssessmentData.questions.length}
                  timeEstimate="10-15 Mins"
                  onStartExam={fullAssessmentAntiCheat.startAssessment}
                />
              ) : (
                <>
                  {!fullQuizSubmitted && (
                    <AntiCheatLiveBanner
                      tabSwitchCount={fullAssessmentAntiCheat.tabSwitchCount}
                      maxViolations={fullAssessmentAntiCheat.maxViolations}
                      isFullscreen={fullAssessmentAntiCheat.isFullscreen}
                    />
                  )}

                  <div style={{ background: '#f8fafc', padding: '16px 20px', borderRadius: '16px', border: '1px solid #e2e8f0', color: '#475569', fontSize: '13px', lineHeight: 1.5 }}>
                    🎯 <strong>Assessment Objective:</strong> Test your ability to synthesize and apply all concepts learned across the sequential roadmap steps for <strong>{roleConfig.roleName}</strong>. Answer all {fullAssessmentData.questions.length} questions below to complete your capstone test.
                  </div>

                  <div 
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '20px',
                      userSelect: 'none',
                      WebkitUserSelect: 'none'
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      fullAssessmentAntiCheat.showToast('⚠️ Right-click context menu is disabled.');
                    }}
                  >
                {fullAssessmentData.questions.map((q, qIdx) => {
                  const selectedOpt = fullQuizAnswers[qIdx];
                  const isCorrect = selectedOpt === q.answer;

                  return (
                    <div key={qIdx} style={{
                      padding: '20px',
                      borderRadius: '18px',
                      background: '#ffffff',
                      border: fullQuizSubmitted 
                        ? (isCorrect ? '2px solid #10b981' : '2px solid #ef4444')
                        : '1px solid #cbd5e1',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                        <h5 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.5 }}>
                          Q{qIdx + 1}: {q.question}
                        </h5>
                        {fullQuizSubmitted && (
                          <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 800, background: isCorrect ? '#dcfce7' : '#fee2e2', color: isCorrect ? '#15803d' : '#b91c1c' }}>
                            {isCorrect ? '✓ Correct' : '✕ Incorrect'}
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {q.options.map((opt, oIdx) => {
                          const isSelected = fullQuizAnswers[qIdx] === oIdx;
                          const isAnswerKey = fullQuizSubmitted && oIdx === q.answer;

                          let btnStyle = {
                            padding: '12px 16px',
                            borderRadius: '12px',
                            border: isSelected ? '2px solid #7c3aed' : '1px solid #e2e8f0',
                            background: isSelected ? '#f3e8ff' : '#f8fafc',
                            color: isSelected ? '#7c3aed' : '#334155',
                            fontWeight: isSelected ? 800 : 600,
                            fontSize: '12.5px',
                            textAlign: 'left',
                            cursor: fullQuizSubmitted ? 'default' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.15s ease'
                          };

                          if (fullQuizSubmitted) {
                            if (isAnswerKey) {
                              btnStyle.border = '2px solid #10b981';
                              btnStyle.background = '#ecfdf5';
                              btnStyle.color = '#047857';
                              btnStyle.fontWeight = 800;
                            } else if (isSelected && !isCorrect) {
                              btnStyle.border = '2px solid #ef4444';
                              btnStyle.background = '#fef2f2';
                              btnStyle.color = '#b91c1c';
                            }
                          }

                          return (
                            <button
                              key={oIdx}
                              disabled={fullQuizSubmitted}
                              onClick={() => handleFullQuizOptionSelect(qIdx, oIdx)}
                              style={btnStyle}
                            >
                              <span>{opt}</span>
                              {fullQuizSubmitted && isAnswerKey && <CheckCircle2 size={16} color="#059669" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation box after submission */}
                      {fullQuizSubmitted && (
                        <div style={{ marginTop: '6px', padding: '12px 14px', borderRadius: '10px', background: '#f1f5f9', borderLeft: '4px solid #7c3aed', fontSize: '12px', color: '#334155', lineHeight: 1.5 }}>
                          <strong>💡 Knowledge Insight:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Submission Score Summary */}
              {fullQuizSubmitted ? (
                <div style={{
                  padding: '24px',
                  borderRadius: '20px',
                  background: fullQuizPassed ? '#ecfdf5' : '#fef2f2',
                  border: fullQuizPassed ? '2px solid #a7f3d0' : '2px solid #fecaca',
                  color: fullQuizPassed ? '#047857' : '#b91c1c',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: fullQuizPassed ? '#dcfce7' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {fullQuizPassed ? <Award size={32} color="#059669" /> : <HelpCircle size={32} color="#dc2626" />}
                  </div>

                  <div>
                    <h4 style={{ fontSize: '20px', fontWeight: 900, margin: 0 }}>
                      {fullQuizPassed ? `🎉 Assessment Passed! (${fullQuizScore}/${fullAssessmentData.questions.length} - ${Math.round((fullQuizScore / fullAssessmentData.questions.length) * 100)}%)` : `❌ Assessment Score: ${fullQuizScore}/${fullAssessmentData.questions.length} (${Math.round((fullQuizScore / fullAssessmentData.questions.length) * 100)}%)`}
                    </h4>
                    <p style={{ fontSize: '13px', marginTop: '6px', maxWidth: '500px', lineHeight: 1.5 }}>
                      {fullQuizPassed
                        ? `Outstanding work! You have demonstrated strong overall competency and practical application knowledge for ${roleConfig.roleName}. You are placement ready!`
                        : `You scored below the 70% passing threshold. Please review the knowledge insights above and retake the assessment to solidify your understanding.`}
                    </p>
                  </div>

                  <AntiCheatAuditBadge
                    violationCount={fullAssessmentAntiCheat.violationCount}
                    tabSwitchCount={fullAssessmentAntiCheat.tabSwitchCount}
                    fullscreenExitCount={fullAssessmentAntiCheat.fullscreenExitCount}
                    autoSubmitted={fullAssessmentAntiCheat.autoSubmitted}
                  />

                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button
                      onClick={handleOpenFullAssessment}
                      style={{ padding: '10px 20px', borderRadius: '12px', background: '#ffffff', color: '#0f172a', fontWeight: 800, fontSize: '13px', border: '1px solid #cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <RefreshCw size={15} />
                      <span>Retake Assessment</span>
                    </button>
                    <button
                      onClick={handleCloseFullAssessment}
                      style={{ padding: '10px 24px', borderRadius: '12px', background: '#7c3aed', color: '#ffffff', fontWeight: 800, fontSize: '13px', border: 'none', cursor: 'pointer' }}
                    >
                      Close &amp; Return to Roadmap
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  disabled={Object.keys(fullQuizAnswers).length < fullAssessmentData.questions.length}
                  onClick={handleVerifyFullQuiz}
                  style={{
                    padding: '16px',
                    borderRadius: '16px',
                    background: Object.keys(fullQuizAnswers).length < fullAssessmentData.questions.length ? '#cbd5e1' : '#7c3aed',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '15px',
                    border: 'none',
                    cursor: Object.keys(fullQuizAnswers).length < fullAssessmentData.questions.length ? 'not-allowed' : 'pointer',
                    boxShadow: Object.keys(fullQuizAnswers).length < fullAssessmentData.questions.length ? 'none' : '0 6px 20px rgba(124, 58, 237, 0.35)',
                    transition: 'all 0.2s ease',
                    marginTop: '10px'
                  }}
                >
                  {Object.keys(fullQuizAnswers).length < fullAssessmentData.questions.length
                    ? `Answer All Questions to Submit (${Object.keys(fullQuizAnswers).length}/${fullAssessmentData.questions.length})`
                    : 'Submit Capstone Assessment & Calculate Score →'}
                </button>
              )}
                </>
              )}

            </div>

            {/* Anti-Cheat Proctoring Modals for Capstone Role Assessment */}
            <AntiCheatModals
              warningModal={fullAssessmentAntiCheat.warningModal}
              toastMessage={fullAssessmentAntiCheat.toastMessage}
              onResumeFullScreen={fullAssessmentAntiCheat.resumeFullScreen}
              onDismissWarning={fullAssessmentAntiCheat.dismissWarningModal}
              onViewResults={() => {
                fullAssessmentAntiCheat.dismissWarningModal();
              }}
            />

          </div>
        </div>
      )}

      {/* ADD / SWITCH COMPANY MODAL */}
      {isAddCompanyModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '520px',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '28px',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            position: 'relative'
          }}>
            <button
              onClick={() => setIsAddCompanyModalOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748b'
              }}
            >
              <X size={16} />
            </button>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={22} color="#7c3aed" />
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Add or Switch Dream Company
                </h3>
              </div>
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                Choose companies you want to get shortlisted for. The roadmap will adapt with specific interview rounds and cutoffs.
              </p>
            </div>

            {/* Custom Input */}
            <form onSubmit={(e) => { e.preventDefault(); handleAddCompany(); }} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={newCompanyInput}
                onChange={(e) => setNewCompanyInput(e.target.value)}
                placeholder="Type company name (e.g. Netflix, Uber, Stripe)..."
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  outline: 'none',
                  backgroundColor: '#f8fafc'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '10px 18px',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#7c3aed',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Plus size={16} />
                <span>Add</span>
              </button>
            </form>

            {/* Quick Pick List */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', marginBottom: '8px' }}>
                Popular Target Companies:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['Google', 'Microsoft', 'Amazon', 'Meta', 'TCS', 'Infosys', 'Accenture', 'Flipkart', 'Qualcomm', 'Wipro'].map(cName => {
                  const isAlreadySelected = effectiveCompanies.some(c => c.toLowerCase() === cName.toLowerCase());
                  return (
                    <button
                      key={cName}
                      onClick={() => handleAddCompany(cName)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: isAlreadySelected ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                        background: isAlreadySelected ? '#ecfdf5' : '#f8fafc',
                        color: isAlreadySelected ? '#047857' : '#334155',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {isAlreadySelected ? <Check size={12} /> : <Plus size={12} />}
                      <span>{cName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Active List with Remove */}
            {effectiveCompanies.length > 0 && (
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', marginBottom: '8px' }}>
                  Your Current Target Companies ({effectiveCompanies.length}):
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {effectiveCompanies.map(cName => (
                    <span
                      key={cName}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        background: '#f3e8ff',
                        color: '#6b21a8',
                        fontSize: '11px',
                        fontWeight: 700
                      }}
                    >
                      <span>{cName}</span>
                      <button
                        onClick={() => {
                          const updated = effectiveCompanies.filter(c => c !== cName);
                          if (updateUserTargetCompanies) {
                            updateUserTargetCompanies(updated);
                          }
                          if (selectedCompanyFilter === cName) {
                            setSelectedCompanyFilter('ALL');
                          }
                        }}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#6b21a8', padding: 0 }}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setIsAddCompanyModalOpen(false)}
              style={{
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                background: '#f1f5f9',
                color: '#475569',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                marginTop: '4px'
              }}
            >
              Done &amp; View Roadmap
            </button>
          </div>
        </div>
      )}

      {/* Step Completion & Assessment Feedback Modal */}
      <FeedbackRatingModal
        isOpen={feedbackModalConfig.isOpen}
        onClose={handleFeedbackModalClose}
        onSubmit={handleFeedbackModalSubmit}
        title={feedbackModalConfig.title}
        type={feedbackModalConfig.type}
        user={user}
        skillName={feedbackModalConfig.pendingSkill || ''}
      />

      {/* Coding Practice Platforms Modal (LeetCode / HackerRank) */}
      <PracticePlatformModal
        isOpen={isPracticePlatformModalOpen}
        onClose={() => setIsPracticePlatformModalOpen(false)}
        initialSkill={practicePlatformModalSkill}
        initialPlatform="leetcode"
        user={user}
        onPracticeSubmitted={(res) => {
          if (res && res.skillName && !acquiredSkills.some(s => (typeof s === 'string' ? s : s.skillName).toLowerCase() === res.skillName.toLowerCase())) {
            const updated = [...acquiredSkills, { skillId: Date.now(), skillName: res.skillName, proficiency: 'ADVANCED', isVerified: true, verifiedScore: 92 }];
            if (updateUserSkills) {
              updateUserSkills(updated);
            }
          }
        }}
      />

    </div>
  );
};
