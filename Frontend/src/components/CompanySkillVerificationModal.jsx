import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, XCircle, ArrowRight, 
  HelpCircle, Sparkles, Building2, Award, BookOpen, RotateCcw, X, Check,
  Star, Heart, MessageSquare, Send, Brain, Lightbulb
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { feedbackService } from '../utils/feedbackService';
import { useAntiCheatAssessment, exitFullScreen } from '../utils/useAntiCheatAssessment';
import { 
  AntiCheatLiveBanner, 
  AntiCheatStartCard, 
  AntiCheatModals, 
  AntiCheatAuditBadge 
} from './AntiCheatProctor';

// Comprehensive Company Skill Benchmarks & Diagnostic Questions
export const COMPANY_SKILL_BENCHMARKS = {
  'Java': {
    skillName: 'Java',
    category: 'Programming',
    companyExpectations: {
      foundational: ['Basic syntax, loops, if-else, methods', 'Basic class and object creation', 'Array indexing & String operations'],
      enterprise: ['Core OOP (Polymorphism, Abstraction, Encapsulation, Inheritance)', 'Collections Framework (ArrayList, HashSet, HashMap)', 'Exception Handling (Checked vs Unchecked, try-with-resources)', 'Basic JDBC database connection'],
      productTier1: ['JVM Architecture, Heap vs Stack memory, Garbage Collection algorithms (G1, ZGC)', 'Collections internals (HashMap bucket collision resolution, treeify threshold)', 'Multithreading & Concurrency (volatile, synchronized, ExecutorService, race conditions)', 'Java 8+ Streams API, Lambdas, and Functional Interfaces']
    },
    diagnosticQuestions: [
      {
        id: 1,
        topic: 'Collections Internals & Hashing',
        question: 'What happens internally in a Java 8+ HashMap when two keys produce the same hash code (hash collision)?',
        options: [
          'The existing key-value pair is silently overwritten by the new one.',
          'Elements are stored in a linked list bucket; if collisions exceed 8 nodes, it transforms into a Red-Black Tree (O(log n)).',
          'A ConcurrentModificationException is thrown immediately at runtime.',
          'The entire HashMap array capacity is doubled to force a re-hash.'
        ],
        correctAnswer: 1,
        explanation: 'In Java 8+, HashMap uses linked list chaining for bucket collisions. Once the bucket exceeds the TREEIFY_THRESHOLD (8 entries) and table capacity >= 64, it converts the list to a balanced Red-Black Tree, improving lookup worst-case from O(n) to O(log n). This is a standard Amazon/Google interview question.'
      },
      {
        id: 2,
        topic: 'Multithreading & Memory Visibility',
        question: 'What does the "volatile" keyword guarantee when applied to a variable in Java?',
        options: [
          'It makes all compound operations on the variable (like count++) atomic.',
          'It guarantees visibility across threads by reading/writing directly from main memory instead of CPU cache, but does NOT guarantee atomicity.',
          'It prevents the variable from ever being serialized or garbage collected.',
          'It automatically locks the entire class for synchronized thread access.'
        ],
        correctAnswer: 1,
        explanation: 'The "volatile" keyword establishes a happens-before relationship, guaranteeing memory visibility so every reading thread sees the latest write from main memory. However, compound actions like count++ require AtomicInteger or synchronized locks to be atomic.'
      },
      {
        id: 3,
        topic: 'JVM Internals & Memory Management',
        question: 'Where are local primitive variables and object instances stored in Java JVM memory?',
        options: [
          'Local primitives on the Stack, object instances on the Heap.',
          'Both local primitives and object instances are stored on the Stack.',
          'Both are stored strictly in the Metaspace / Method Area.',
          'Primitives on the Heap, object instances on the Stack.'
        ],
        correctAnswer: 0,
        explanation: 'Local primitive variables and method call frames are allocated on the Stack (thread-specific). Object instances (and their fields) are allocated on the shared Heap and managed by the Garbage Collector.'
      }
    ]
  },

  'Python': {
    skillName: 'Python',
    category: 'Programming',
    companyExpectations: {
      foundational: ['Python syntax, indentation, lists, dicts, basic functions', 'String manipulation and formatting'],
      enterprise: ['List comprehensions, dictionary packing/unpacking (*args, **kwargs)', 'Exception handling (try-except-finally)', 'File I/O and JSON parsing'],
      productTier1: ['Global Interpreter Lock (GIL) and its impact on CPU-bound multithreading', 'Generators & lazy evaluation with yield (memory efficiency)', 'Decorators, closures, and variable scope (LEGB rule)', 'Mutable default arguments gotchas & memory references']
    },
    diagnosticQuestions: [
      {
        id: 1,
        topic: 'Mutable Default Arguments Gotcha',
        question: 'What is the output of calling append_item(1) twice for `def append_item(val, items=[]): items.append(val); return items`?',
        options: [
          'First call: [1], Second call: [1]',
          'First call: [1], Second call: [1, 1]',
          'Throws a TypeError on the second call',
          'First call: [1], Second call: []'
        ],
        correctAnswer: 1,
        explanation: 'In Python, default arguments are evaluated once at function definition time, not on each call. Because a list is mutable, successive calls without passing a new list will modify the exact same list instance in memory. Companies expect `items=None` followed by `if items is None: items = []`.'
      },
      {
        id: 2,
        topic: 'Concurrency & Global Interpreter Lock (GIL)',
        question: 'Why does Python\'s standard threading module fail to speed up CPU-bound mathematical computations on multi-core processors?',
        options: [
          'Python does not support multiple CPU cores at the OS kernel level.',
          'The Global Interpreter Lock (GIL) enforces that only one native thread executes Python bytecode at any single moment.',
          'Python threads consume all RAM and force garbage collection pauses.',
          'Threading in Python can only be used for network sockets, not functions.'
        ],
        correctAnswer: 1,
        explanation: 'The CPython GIL allows only one thread to hold the Python interpreter lock at once. For CPU-bound tasks, the multiprocessing module or C extensions must be used instead to leverage multiple CPU cores simultaneously.'
      },
      {
        id: 3,
        topic: 'Generators & Memory Optimization',
        question: 'What is the primary architectural advantage of using a generator function with `yield` over returning a standard list?',
        options: [
          'Generators run 100x faster than lists because they compile to C code.',
          'Generators evaluate lazily on-demand, holding only one element in memory at a time (O(1) space complexity).',
          'Generators can only store numerical values and disallow strings.',
          'Generators automatically save data into a SQLite database.'
        ],
        correctAnswer: 1,
        explanation: 'Generators yield items one by one when iterated over, eliminating the need to materialize massive datasets (e.g. gigabyte log files or database streams) in memory all at once.'
      }
    ]
  },

  'React.js': {
    skillName: 'React.js',
    category: 'Framework',
    companyExpectations: {
      foundational: ['JSX syntax, components, props passing', 'Basic useState for toggle and text input'],
      enterprise: ['useEffect lifecycle management and cleanups', 'Controlled forms, Axios REST API integration', 'Context API for global state (e.g., auth tokens)'],
      productTier1: ['Stale closures in Hooks and custom Hooks abstraction', 'Performance optimization (useMemo, useCallback, React.memo)', 'Virtual DOM diffing algorithm & reconciliation keys', 'State immutability and architectural state colocation']
    },
    diagnosticQuestions: [
      {
        id: 1,
        topic: 'State Immutability & Re-rendering',
        question: 'Why does executing `state.push(newItem); setState(state);` fail to trigger a component re-render in React?',
        options: [
          'React only supports primitive integers, not array mutations.',
          'React relies on Object.is reference equality checks; mutating the existing array maintains the same memory reference.',
          'push() is an invalid JavaScript array function in React.',
          'setState requires a Promise callback to update.'
        ],
        correctAnswer: 1,
        explanation: 'React compares previous and new state by reference (Object.is). If you mutate the array in-place, the memory address has not changed, so React assumes nothing updated. The correct approach is creating a new reference: `setState([...state, newItem])`.'
      },
      {
        id: 2,
        topic: 'useEffect Hook & Stale Closures',
        question: 'What is the consequence of leaving an active variable used inside `useEffect` out of its dependency array?',
        options: [
          'The application will instantly crash with a fatal React compile error.',
          'The effect captures a "stale closure" referencing outdated variable values from previous renders.',
          'The component will automatically unmount from the DOM.',
          'React will re-render in an infinite loop.'
        ],
        correctAnswer: 1,
        explanation: 'Without listing a reactive dependency, the effect function does not re-run when that variable changes, trapping old closure references and resulting in subtle synchronization bugs.'
      },
      {
        id: 3,
        topic: 'Performance Optimization & Memoization',
        question: 'What is the specific purpose of the `useCallback` hook in a React component?',
        options: [
          'It memoizes an expensive computed calculation result value.',
          'It caches a function instance across renders to prevent unnecessary re-renders of memoized child components receiving it as a prop.',
          'It replaces the standard Redux store for state management.',
          'It makes asynchronous API calls run in parallel threads.'
        ],
        correctAnswer: 1,
        explanation: 'useCallback memoizes the function definition itself between renders, preventing fresh function references from triggering child re-renders (when wrapped in React.memo).'
      }
    ]
  },

  'Spring Boot': {
    skillName: 'Spring Boot',
    category: 'Framework',
    companyExpectations: {
      foundational: ['Creating Spring initializr projects, @SpringBootApplication entry point', 'Simple @GetMapping endpoint returning a String'],
      enterprise: ['Layered architecture: @RestController, @Service, @Repository', 'Spring Data JPA CRUD repositories and MySQL integration', 'DTO pattern and @RequestBody / @PathVariable mapping', 'Global exception handling with @RestControllerAdvice'],
      productTier1: ['Inversion of Control (IoC) container & Bean scopes (Singleton vs Prototype thread safety)', 'Spring AOP and @Transactional proxy propagation & rollback rules', 'Spring Security filter chain, JWT authentication, and CORS architecture', 'Actuator metrics, health checks, and microservice config management']
    },
    diagnosticQuestions: [
      {
        id: 1,
        topic: 'Transaction Management & Proxy Behavior',
        question: 'By default, for which types of exceptions does Spring\'s `@Transactional` annotation automatically trigger a database rollback?',
        options: [
          'For all exceptions, including checked Exception and IOException.',
          'Only for unchecked exceptions (RuntimeException and subclasses) and Errors.',
          'It never rolls back unless manually invoked with TransactionAspectSupport.',
          'Only when an SQLSyntaxErrorException specifically occurs.'
        ],
        correctAnswer: 1,
        explanation: 'By default, Spring `@Transactional` rolls back only on unchecked exceptions (RuntimeException and Error). To roll back on checked exceptions, you must explicitly specify `@Transactional(rollbackFor = Exception.class)`.'
      },
      {
        id: 2,
        topic: 'Bean Scopes & Thread Safety',
        question: 'What is the default scope of a Spring Bean, and what thread safety consideration is critical for it in a web application?',
        options: [
          'Prototype scope; a new instance is created for every HTTP request.',
          'Singleton scope; a single shared instance handles concurrent requests, so it must NOT maintain mutable state in instance variables.',
          'Session scope; each user gets an independent copy in database memory.',
          'Request scope; it is destroyed immediately after method return.'
        ],
        correctAnswer: 1,
        explanation: 'Spring beans default to Singleton scope. Because multiple concurrent HTTP requests execute methods on the exact same bean instance simultaneously, maintaining mutable state in bean instance fields leads to severe race conditions.'
      },
      {
        id: 3,
        topic: 'REST API Design & HTTP Status Codes',
        question: 'According to standard REST conventions, which HTTP method and status code should be returned upon successful creation of a new database record?',
        options: [
          'GET with 200 OK',
          'POST with 201 Created (and usually a Location header)',
          'PUT with 204 No Content',
          'PATCH with 202 Accepted'
        ],
        correctAnswer: 1,
        explanation: 'POST is non-idempotent and used to create a new resource, returning HTTP 201 Created alongside the newly created payload or URI location header.'
      }
    ]
  },

  'SQL & MySQL': {
    skillName: 'SQL & MySQL',
    category: 'Database',
    companyExpectations: {
      foundational: ['Basic SELECT, INSERT, UPDATE, DELETE queries', 'WHERE filtering and basic ORDER BY'],
      enterprise: ['INNER JOIN, LEFT JOIN, and table aliases', 'Aggregations with GROUP BY and HAVING filters', 'Primary Key, Foreign Key constraints & Unique indexing'],
      productTier1: ['B-Tree Index internals and avoiding non-SARGable query patterns', 'Database Transaction Isolation Levels (Read Committed, Repeatable Read) & Phantom Reads', 'Query execution plans (EXPLAIN), table scans vs index lookups', 'Database Normalization (1NF, 2NF, 3NF, BCNF) and intentional denormalization']
    },
    diagnosticQuestions: [
      {
        id: 1,
        topic: 'Indexing & SARGable Queries',
        question: 'Why does `SELECT * FROM users WHERE YEAR(created_at) = 2024` typically prevent MySQL from using an index on the `created_at` column?',
        options: [
          'MySQL does not support indexing date or timestamp columns.',
          'Wrapping an indexed column in a function prevents index seek optimization, causing a full table scan.',
          'The YEAR() function automatically deletes the index at query time.',
          'MySQL requires created_at to be formatted as an integer.'
        ],
        correctAnswer: 1,
        explanation: 'Applying functions or arithmetic to an indexed column in the WHERE clause makes the predicate non-SARGable. MySQL cannot perform an index seek on the raw values and is forced into a full table scan. The optimized alternative is: `WHERE created_at >= \'2024-01-01\' AND created_at < \'2025-01-01\'`.'
      },
      {
        id: 2,
        topic: 'Query Filtering: WHERE vs HAVING',
        question: 'What is the fundamental difference between the WHERE clause and the HAVING clause in an SQL query?',
        options: [
          'WHERE filters rows before aggregation occurs; HAVING filters grouped rows after aggregate calculations (e.g. COUNT > 5).',
          'WHERE can only be used with numbers; HAVING can only be used with strings.',
          'HAVING executes before table joins; WHERE executes after table joins.',
          'There is no difference; they are exact aliases in MySQL.'
        ],
        correctAnswer: 0,
        explanation: 'WHERE filters individual row records prior to grouping. HAVING filters the result of group aggregations (e.g. `HAVING COUNT(order_id) > 5`) and executes after GROUP BY.'
      },
      {
        id: 3,
        topic: 'Transaction Isolation & Concurrency',
        question: 'Which phenomenon occurs when Transaction A reads a row, Transaction B updates that row and commits, and Transaction A reads the same row again getting a different value?',
        options: [
          'Dirty Read',
          'Non-Repeatable Read',
          'Phantom Read',
          'Deadlock'
        ],
        correctAnswer: 1,
        explanation: 'A Non-Repeatable Read happens when committed updates by another transaction change data read earlier in an ongoing transaction. (MySQL InnoDB prevents this in its default REPEATABLE READ isolation level via MVCC).'
      }
    ]
  },

  'Data Structures & Algorithms': {
    skillName: 'Data Structures & Algorithms',
    category: 'Programming',
    companyExpectations: {
      foundational: ['Arrays, basic loops, linear search, bubble sort'],
      enterprise: ['Stacks, Queues, Linked Lists, Binary Search (O(log n))', 'Recursion and Basic Trees (pre-order, in-order, post-order)'],
      productTier1: ['Time & Space Complexity analysis (Amortized Big-O)', 'Binary Search Trees, Heaps/Priority Queues, Hash Tables', 'Graph Traversals (BFS / DFS, Dijkstra, Topological Sort)', 'Dynamic Programming (memoization & tabulation) and Two-Pointer / Sliding Window patterns']
    },
    diagnosticQuestions: [
      {
        id: 1,
        topic: 'Amortized Complexity Analysis',
        question: 'What is the amortized time complexity of inserting an element into a dynamic array (like Java ArrayList or Python list)?',
        options: [
          'O(n) always',
          'O(1) amortized',
          'O(log n)',
          'O(n log n)'
        ],
        correctAnswer: 1,
        explanation: 'While resizing the array takes O(n) when capacity is reached, resizing happens infrequently (doubling capacity). Spreading the cost over all N insertions yields an amortized time complexity of O(1) per insertion.'
      },
      {
        id: 2,
        topic: 'Graph Algorithms & Shortest Path',
        question: 'Which algorithm is optimal for finding the shortest path from a single source node in a weighted graph with non-negative edge weights?',
        options: [
          'Breadth-First Search (BFS)',
          'Dijkstra\'s Algorithm',
          'Bellman-Ford Algorithm',
          'Depth-First Search (DFS)'
        ],
        correctAnswer: 1,
        explanation: 'Dijkstra\'s algorithm (using a Min-Heap / PriorityQueue) runs in O((V + E) log V) and is the industry gold standard for non-negative weighted graphs. BFS only guarantees shortest path on unweighted graphs.'
      },
      {
        id: 3,
        topic: 'Dynamic Programming vs Greedy',
        question: 'What two fundamental characteristics must a computational problem exhibit for Dynamic Programming to be applicable?',
        options: [
          'Linear time complexity and binary inputs',
          'Optimal substructure and overlapping subproblems',
          'Greedy choice property and cyclic dependencies',
          'Immutable variables and recursive tail calls'
        ],
        correctAnswer: 1,
        explanation: 'Dynamic Programming applies when a problem has optimal substructure (an optimal solution can be constructed from optimal solutions to its subproblems) and overlapping subproblems (the same subproblems are solved multiple times).'
      }
    ]
  }
};

// Fallback generator for other skills
const getSkillBenchmark = (skillName) => {
  if (COMPANY_SKILL_BENCHMARKS[skillName]) {
    return COMPANY_SKILL_BENCHMARKS[skillName];
  }
  const matchedKey = Object.keys(COMPANY_SKILL_BENCHMARKS).find(k => 
    skillName.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(skillName.toLowerCase())
  );
  if (matchedKey) return COMPANY_SKILL_BENCHMARKS[matchedKey];

  // Dynamic benchmark template
  return {
    skillName: skillName,
    category: 'Core Engineering',
    companyExpectations: {
      foundational: [`Basic syntax and operations in ${skillName}`, `Standard tool installation and configuration`],
      enterprise: [`Common libraries, real-world industry usage, and error handling in ${skillName}`, `Integration with databases and standard team workflows`],
      productTier1: [`High-performance execution, memory optimization, and architecture in ${skillName}`, `Edge case resolution, scalability, and security best practices`]
    },
    diagnosticQuestions: [
      {
        id: 1,
        topic: `${skillName} Core Principles`,
        question: `In an enterprise production environment, what is the best practice when handling errors or exceptions in ${skillName}?`,
        options: [
          'Silently catch exceptions without logging to keep the server running smoothly.',
          'Log contextual error messages with stack traces and handle errors gracefully with meaningful status/fallback responses.',
          'Restart the entire server every time an error is encountered.',
          'Write all errors to a temporary text file on the local desktop.'
        ],
        correctAnswer: 1,
        explanation: `Enterprise standards require robust error handling: logging actionable diagnostics without leaking sensitive data and maintaining service reliability.`
      },
      {
        id: 2,
        topic: `${skillName} Performance & Architecture`,
        question: `How do top tech companies optimize ${skillName} for high-traffic or large-scale data workflows?`,
        options: [
          'By avoiding any modularization and keeping all code in one massive file.',
          'By profiling memory/CPU bottlenecks, leveraging asynchronous processing, and caching frequently accessed data.',
          'By turning off compiler optimizations to reduce CPU temperatures.',
          'By running code only during non-peak nighttime hours.'
        ],
        correctAnswer: 1,
        explanation: `Scalability in modern engineering hinges on asynchronous non-blocking pipelines, proactive profiling, and distributed caching layers.`
      },
      {
        id: 3,
        topic: `${skillName} Team & Code Standards`,
        question: `What is the role of automated unit testing and CI/CD pipelines when working with ${skillName}?`,
        options: [
          'They are optional and only recommended after software is deployed to customers.',
          'They catch regressions early, ensure code adheres to company contracts, and automate safe production deployments.',
          'They replace the need for software engineers to write code.',
          'They slow down delivery without providing any software quality guarantees.'
        ],
        correctAnswer: 1,
        explanation: `Automated test coverage and continuous integration are mandatory in top engineering teams to prevent regressions and validate code quality.`
      }
    ]
  };
};

export const CompanySkillVerificationModal = ({ 
  skillName, 
  currentScore = 0,
  isAlreadyVerified = false,
  onClose, 
  onSaveVerification 
}) => {
  const auth = useAuth();
  const user = auth?.user;

  const benchmark = getSkillBenchmark(skillName);
  const [activeTab, setActiveTab] = useState('assessment'); // 'expectations' | 'assessment' | 'result'
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [testScore, setTestScore] = useState(0);

  // Keep a synchronous ref for selected answers so auto-submit has instant access
  const selectedAnswersRef = useRef(selectedAnswers);
  useEffect(() => {
    selectedAnswersRef.current = selectedAnswers;
  }, [selectedAnswers]);

  // Post-Assessment Feedback & Understanding State
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackUnderstanding, setFeedbackUnderstanding] = useState('HIGH');
  const [feedbackFeeling, setFeedbackFeeling] = useState('Confident 🤩');
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleSaveAssessmentFeedback = () => {
    feedbackService.addFeedback({
      userName: user?.fullName || 'Engineering Student',
      userEmail: user?.email || 'student@college.edu',
      branch: user?.engineeringBranch || 'CSE',
      targetTitle: `${skillName} Diagnostic Assessment`,
      type: 'ASSESSMENT',
      rating: feedbackRating,
      understandingLevel: feedbackUnderstanding,
      feeling: feedbackFeeling,
      tags: ['Interview Relevant', 'Company Diagnostic'],
      comment: feedbackComment
    });
    setFeedbackSubmitted(true);
  };

  const handleSelectOption = (questionId, optionIdx) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleSubmitAssessment = useCallback(() => {
    const currentAnswers = selectedAnswersRef.current;
    let correctCount = 0;
    benchmark.diagnosticQuestions.forEach(q => {
      if (currentAnswers[q.id] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const scorePct = Math.round((correctCount / benchmark.diagnosticQuestions.length) * 100);
    setTestScore(scorePct);
    setSubmitted(true);
    setActiveTab('result');
    exitFullScreen();

    // Determine verification level
    const isVerified = correctCount >= 2; // Pass threshold: at least 2 out of 3 (67%+)
    let level = 'FOUNDATIONAL';
    if (correctCount === 3) level = 'TIER_1_PRODUCT_READY';
    else if (correctCount === 2) level = 'ENTERPRISE_READY';

    // Auto-calibrate initial feedback suggestions based on diagnostic outcome
    if (scorePct === 100) {
      setFeedbackUnderstanding('HIGH');
      setFeedbackFeeling('Confident 🤩');
      setFeedbackRating(5);
    } else if (scorePct >= 67) {
      setFeedbackUnderstanding('MEDIUM');
      setFeedbackFeeling('Satisfied 😊');
      setFeedbackRating(4);
    } else {
      setFeedbackUnderstanding('LOW');
      setFeedbackFeeling('Needs Practice 🧐');
      setFeedbackRating(3);
    }

    if (onSaveVerification) {
      onSaveVerification(skillName, {
        isVerified,
        verifiedScore: scorePct,
        verifiedLevel: level,
        correctCount,
        totalQuestions: benchmark.diagnosticQuestions.length
      });
    }
  }, [benchmark, skillName, onSaveVerification]);

  // Anti-cheat proctoring hook
  const antiCheat = useAntiCheatAssessment({
    isActive: activeTab === 'assessment' && !submitted,
    onAutoSubmit: () => {
      handleSubmitAssessment();
    },
    maxViolations: 3,
    assessmentTitle: `${skillName} Diagnostic Assessment`
  });

  const handleRetake = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setTestScore(0);
    setFeedbackSubmitted(false);
    setFeedbackComment('');
    setActiveTab('assessment');
    antiCheat.resetAssessment();
  };

  const handleCloseModal = () => {
    antiCheat.stopAssessment();
    onClose();
  };

  const handleFinishAndClose = () => {
    // If user has not explicitly clicked 'Save Feedback' yet, auto-save their current rating selection
    if (!feedbackSubmitted) {
      handleSaveAssessmentFeedback();
    }
    antiCheat.stopAssessment();
    onClose();
  };

  const allAnswered = benchmark.diagnosticQuestions.every(q => selectedAnswers[q.id] !== undefined);

  return (
    <div className="split-modal-overlay">
      <div style={{
        background: '#ffffff',
        padding: antiCheat.isFullscreen ? '28px 36px' : '32px',
        borderRadius: antiCheat.isFullscreen ? '20px' : '24px',
        maxWidth: antiCheat.isFullscreen ? '840px' : '720px',
        width: '100%',
        maxHeight: antiCheat.isFullscreen ? '96vh' : '90vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)'
      }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: '#047857', background: '#ecfdf5', padding: '4px 10px', borderRadius: '8px', marginBottom: '8px', border: '1px solid #a7f3d0' }}>
              <ShieldCheck size={14} />
              <span>Industry Benchmark Verification Engine</span>
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
              Verify Knowledge: <span style={{ color: '#7c3aed' }}>{skillName}</span>
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', margin: 0 }}>
              Companies don't just look for syntax. We confirm whether you possess company-expected and required technical depth.
            </p>
          </div>
          <button 
            onClick={handleCloseModal} 
            style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('assessment')}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              background: activeTab === 'assessment' ? '#7c3aed' : '#f1f5f9',
              color: activeTab === 'assessment' ? '#ffffff' : '#475569',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <HelpCircle size={14} />
            <span>Diagnostic Verification Test ({benchmark.diagnosticQuestions.length} Questions)</span>
          </button>

          <button
            type="button"
            disabled={antiCheat.hasStarted && !submitted}
            onClick={() => {
              if (antiCheat.hasStarted && !submitted) {
                antiCheat.showToast('⚠️ Company expectations are locked during the active assessment.');
                return;
              }
              setActiveTab('expectations');
            }}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '12px',
              fontWeight: 800,
              cursor: antiCheat.hasStarted && !submitted ? 'not-allowed' : 'pointer',
              opacity: antiCheat.hasStarted && !submitted ? 0.5 : 1,
              background: activeTab === 'expectations' ? '#7c3aed' : '#f1f5f9',
              color: activeTab === 'expectations' ? '#ffffff' : '#475569',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Building2 size={14} />
            <span>What Companies Actually Expect</span>
            {antiCheat.hasStarted && !submitted && <span style={{ fontSize: '10px' }}>🔒</span>}
          </button>

          {submitted && (
            <button
              type="button"
              onClick={() => setActiveTab('result')}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                background: activeTab === 'result' ? '#059669' : '#ecfdf5',
                color: activeTab === 'result' ? '#ffffff' : '#047857',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Award size={14} />
              <span>Assessment Results ({testScore}%)</span>
            </button>
          )}
        </div>

        {/* TAB 1: COMPANY EXPECTATIONS RUBRIC */}
        {activeTab === 'expectations' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color="#7c3aed" />
                <span>The Industry Reality: Self-Claimed vs Company-Expected {skillName}</span>
              </h4>
              <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                When college students check <strong>"{skillName}"</strong>, they usually mean they have written basic loops or lab experiments. But top employers test memory management, concurrency, internal data structures, and production design.
              </p>
            </div>

            {/* Level 1: Foundational */}
            <div style={{ padding: '16px', borderRadius: '16px', background: '#fffbeb', border: '1px solid #fef3c7' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '6px', background: '#fef3c7', color: '#b45309' }}>
                  LEVEL 1: FOUNDATIONAL / ACADEMIC
                </span>
                <span style={{ fontSize: '12px', color: '#78350f', fontWeight: 700 }}>What Students Usually Know</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12px', color: '#92400e', lineHeight: 1.6 }}>
                {benchmark.companyExpectations.foundational.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Level 2: Enterprise Standards */}
            <div style={{ padding: '16px', borderRadius: '16px', background: '#eff6ff', border: '1px solid #dbeafe' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '6px', background: '#dbeafe', color: '#1d4ed8' }}>
                  LEVEL 2: ENTERPRISE STANDARD (TCS, Infosys, Accenture, Wipro)
                </span>
                <span style={{ fontSize: '12px', color: '#1e40af', fontWeight: 700 }}>Minimum Required for Campus Placement</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12px', color: '#1e3a8a', lineHeight: 1.6 }}>
                {benchmark.companyExpectations.enterprise.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Level 3: Product & Tier-1 */}
            <div style={{ padding: '16px', borderRadius: '16px', background: '#f5f3ff', border: '1px solid #ede9fe' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '6px', background: '#ede9fe', color: '#6d28d9' }}>
                  LEVEL 3: TIER-1 / PRODUCT STANDARD (Google, Amazon, Microsoft, Unicorns)
                </span>
                <span style={{ fontSize: '12px', color: '#5b21b6', fontWeight: 700 }}>High-Package Engineering Standard</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12px', color: '#4c1d95', lineHeight: 1.6 }}>
                {benchmark.companyExpectations.productTier1.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setActiveTab('assessment')}
              className="btn-purple-pill"
              style={{ padding: '12px', width: '100%', marginTop: '8px' }}
            >
              <span>Take the Diagnostic Test to Verify Your Skill</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* TAB 2: DIAGNOSTIC ASSESSMENT */}
        {activeTab === 'assessment' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {!antiCheat.hasStarted ? (
              <AntiCheatStartCard
                title={`${skillName} Diagnostic Verification`}
                questionCount={benchmark.diagnosticQuestions.length}
                timeEstimate="5 Mins"
                onStartExam={antiCheat.startAssessment}
              />
            ) : (
              <>
                <AntiCheatLiveBanner
                  tabSwitchCount={antiCheat.tabSwitchCount}
                  maxViolations={antiCheat.maxViolations}
                  isFullscreen={antiCheat.isFullscreen}
                />

                <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#475569' }}>
                    Answer these {benchmark.diagnosticQuestions.length} interview-calibrated questions to test your real depth in <strong>{skillName}</strong>.
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#7c3aed', background: '#f3e8ff', padding: '3px 8px', borderRadius: '6px' }}>
                    Pass: 2/{benchmark.diagnosticQuestions.length} (67%+)
                  </span>
                </div>

                <div 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '18px',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    msUserSelect: 'none'
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    antiCheat.showToast('⚠️ Right-click context menu is disabled.');
                  }}
                >
                  {benchmark.diagnosticQuestions.map((q, qIdx) => (
                    <div 
                      key={q.id} 
                      style={{
                        padding: '18px',
                        borderRadius: '16px',
                        border: '1px solid #e2e8f0',
                        background: '#ffffff',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#6366f1', background: '#e0e7ff', padding: '2px 8px', borderRadius: '6px' }}>
                          Question {qIdx + 1} • {q.topic}
                        </span>
                      </div>

                      <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', margin: 0, lineHeight: 1.5 }}>
                        {q.question}
                      </p>

                      {/* Options */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {q.options.map((opt, optIdx) => {
                          const isSelected = selectedAnswers[q.id] === optIdx;
                          return (
                            <div
                              key={optIdx}
                              onClick={() => handleSelectOption(q.id, optIdx)}
                              style={{
                                padding: '10px 14px',
                                borderRadius: '10px',
                                border: isSelected ? '2px solid #7c3aed' : '1px solid #cbd5e1',
                                background: isSelected ? '#f5f3ff' : '#f8fafc',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <div style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                border: isSelected ? '5px solid #7c3aed' : '2px solid #94a3b8',
                                background: '#ffffff'
                              }} />
                              <span style={{ fontSize: '12px', color: isSelected ? '#4c1d95' : '#334155', fontWeight: isSelected ? 700 : 500 }}>
                                {opt}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button
                    type="button"
                    disabled={!allAnswered}
                    onClick={handleSubmitAssessment}
                    className="btn-purple-pill"
                    style={{
                      flex: 1,
                      padding: '14px',
                      opacity: allAnswered ? 1 : 0.6,
                      cursor: allAnswered ? 'pointer' : 'not-allowed'
                    }}
                  >
                    <span>Submit &amp; Evaluate Company Readiness</span>
                    <CheckCircle2 size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 3: RESULT & DIAGNOSTIC REPORT */}
        {activeTab === 'result' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Anti-Cheat Proctoring Audit Badge */}
            <AntiCheatAuditBadge
              violationCount={antiCheat.violationCount}
              tabSwitchCount={antiCheat.tabSwitchCount}
              fullscreenExitCount={antiCheat.fullscreenExitCount}
              autoSubmitted={antiCheat.autoSubmitted}
            />

            {/* Score Banner */}
            <div style={{
              padding: '24px',
              borderRadius: '20px',
              background: testScore >= 67 
                ? 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)' 
                : 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
              border: testScore >= 67 ? '1.5px solid #10b981' : '1.5px solid #ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {testScore >= 67 ? (
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#10b981', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={18} />
                    </div>
                  ) : (
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ef4444', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <AlertTriangle size={18} />
                    </div>
                  )}
                  <h3 style={{ fontSize: '18px', fontWeight: 900, color: testScore >= 67 ? '#065f46' : '#991b1b', margin: 0 }}>
                    {testScore === 100 
                      ? 'Tier-1 & Product Company Ready! 🏆' 
                      : testScore >= 67 
                        ? 'Enterprise Placement Ready! 🛡️' 
                        : 'Foundational Knowledge Only - Skill Gap Detected ⚠️'}
                  </h3>
                </div>
                <p style={{ fontSize: '12px', color: testScore >= 67 ? '#047857' : '#b91c1c', marginTop: '6px', margin: 0 }}>
                  {testScore >= 67 
                    ? `Congratulations! You scored ${testScore}%. Your knowledge in ${skillName} matches company hiring standards.` 
                    : `You scored ${testScore}%. While you have basic familiarity, companies test deeper concurrency, memory, and internals.`}
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '32px', fontWeight: 900, color: testScore >= 67 ? '#047857' : '#dc2626' }}>
                  {testScore}%
                </span>
                <span style={{ display: 'block', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: testScore >= 67 ? '#059669' : '#b91c1c' }}>
                  {testScore >= 67 ? 'VERIFIED' : 'UNVERIFIED'}
                </span>
              </div>
            </div>

            {/* Answer Explanations */}
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
                Detailed Question &amp; Interview Concept Review:
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {benchmark.diagnosticQuestions.map((q, idx) => {
                  const userAnswer = selectedAnswers[q.id];
                  const isCorrect = userAnswer === q.correctAnswer;
                  return (
                    <div 
                      key={q.id}
                      style={{
                        padding: '16px',
                        borderRadius: '14px',
                        border: isCorrect ? '1px solid #a7f3d0' : '1px solid #fecaca',
                        background: isCorrect ? '#f0fdf4' : '#fff5f5',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: isCorrect ? '#047857' : '#b91c1c' }}>
                          Question {idx + 1}: {q.topic}
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', background: isCorrect ? '#dcfce7' : '#fee2e2', color: isCorrect ? '#15803d' : '#b91c1c' }}>
                          {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                        </span>
                      </div>

                      <p style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                        {q.question}
                      </p>

                      <div style={{ fontSize: '11px', color: '#475569' }}>
                        <div><strong>Your Answer:</strong> {userAnswer !== undefined ? q.options[userAnswer] : 'Not answered'}</div>
                        {!isCorrect && (
                          <div style={{ color: '#15803d', marginTop: '2px' }}>
                            <strong>Correct Answer:</strong> {q.options[q.correctAnswer]}
                          </div>
                        )}
                      </div>

                      <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px', color: '#334155', lineHeight: 1.5 }}>
                        <strong style={{ color: '#7c3aed' }}>💡 Company Interview Insight: </strong>
                        {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Assessment Feedback, Understanding & Feelings Survey */}
            <div style={{
              padding: '20px',
              borderRadius: '18px',
              background: feedbackSubmitted ? '#ecfdf5' : '#f8fafc',
              border: feedbackSubmitted ? '1.5px solid #10b981' : '1.5px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              transition: 'all 0.3s'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '10px',
                    background: feedbackSubmitted ? '#10b981' : '#f3e8ff',
                    color: feedbackSubmitted ? '#ffffff' : '#7c3aed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {feedbackSubmitted ? <CheckCircle2 size={18} /> : <Sparkles size={18} />}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                      {feedbackSubmitted ? 'Assessment Feedback Recorded!' : `How was your ${skillName} Assessment?`}
                    </h4>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      Share your rating, understanding level, and feelings to improve placement recommendations
                    </span>
                  </div>
                </div>
                {feedbackSubmitted && (
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#047857', background: '#dcfce7', padding: '4px 10px', borderRadius: '9999px', border: '1px solid #86efac' }}>
                    ✓ Recorded in Analytics
                  </span>
                )}
              </div>

              {feedbackSubmitted ? (
                <div style={{ fontSize: '12px', color: '#065f46', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span>Rating: <strong>{feedbackRating} / 5 Stars ⭐</strong></span>
                  <span>&bull;</span>
                  <span>Understanding: <strong>{feedbackUnderstanding === 'HIGH' ? 'Deep Understanding' : feedbackUnderstanding === 'MEDIUM' ? 'Moderate Grasp' : 'Foundational'}</strong></span>
                  <span>&bull;</span>
                  <span>Feeling: <strong>{feedbackFeeling}</strong></span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* 1. Star Rating */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#334155' }}>
                      1. Rate this assessment:
                    </span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFeedbackRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '2px',
                            transform: (hoverRating === star || feedbackRating === star) ? 'scale(1.15)' : 'scale(1)',
                            transition: 'transform 0.15s ease'
                          }}
                        >
                          <Star
                            size={22}
                            fill={(star <= (hoverRating || feedbackRating)) ? '#f59e0b' : 'transparent'}
                            color={(star <= (hoverRating || feedbackRating)) ? '#f59e0b' : '#cbd5e1'}
                          />
                        </button>
                      ))}
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>
                      ({feedbackRating === 5 ? 'Outstanding & Interview Ready' : feedbackRating === 4 ? 'Very Helpful' : feedbackRating === 3 ? 'Good' : 'Needs Work'})
                    </span>
                  </div>

                  {/* 2. Understanding Level */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#334155' }}>
                      2. Your Understanding Level:
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
                      {[
                        { id: 'HIGH', label: '🧠 High Understanding', desc: 'Interview Ready' },
                        { id: 'MEDIUM', label: '💡 Moderate Grasp', desc: 'Need Practice' },
                        { id: 'LOW', label: '📖 Foundational', desc: 'Still Difficult' }
                      ].map(u => (
                        <div
                          key={u.id}
                          onClick={() => setFeedbackUnderstanding(u.id)}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '10px',
                            border: feedbackUnderstanding === u.id ? '2px solid #7c3aed' : '1px solid #cbd5e1',
                            background: feedbackUnderstanding === u.id ? '#f3e8ff' : '#ffffff',
                            cursor: 'pointer',
                            textAlign: 'center'
                          }}
                        >
                          <div style={{ fontSize: '11.5px', fontWeight: 800, color: feedbackUnderstanding === u.id ? '#6d28d9' : '#1e293b' }}>
                            {u.label}
                          </div>
                          <div style={{ fontSize: '10px', color: '#64748b' }}>
                            {u.desc}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. Feelings */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#334155' }}>
                      3. How are you feeling right now?
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {['Confident 🤩', 'Motivated 🚀', 'Satisfied 😊', 'Needs Practice 🧐', 'Overwhelmed 🤯'].map(f => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setFeedbackFeeling(f)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '9999px',
                            border: feedbackFeeling === f ? '2px solid #2563eb' : '1px solid #cbd5e1',
                            background: feedbackFeeling === f ? '#eff6ff' : '#ffffff',
                            color: feedbackFeeling === f ? '#1d4ed8' : '#475569',
                            fontSize: '11px',
                            fontWeight: 800,
                            cursor: 'pointer'
                          }}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 4. Quick comment and submit */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      placeholder="Optional: What helped you most or what felt tricky?..."
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        fontSize: '11px',
                        outline: 'none'
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleSaveAssessmentFeedback}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: '11px',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 8px rgba(124, 58, 237, 0.25)'
                      }}
                    >
                      <Send size={12} />
                      <span>Save Feedback</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button
                type="button"
                onClick={handleRetake}
                style={{
                  padding: '12px 20px',
                  borderRadius: '12px',
                  background: '#f1f5f9',
                  color: '#475569',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <RotateCcw size={14} />
                <span>Retake Test</span>
              </button>

              <button
                type="button"
                onClick={handleFinishAndClose}
                className="btn-purple-pill"
                style={{ flex: 1, padding: '12px' }}
              >
                <span>Done &amp; Update Placement Dashboard</span>
                <Check size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Anti-Cheat Modals & Warning Overlays */}
        <AntiCheatModals
          warningModal={antiCheat.warningModal}
          toastMessage={antiCheat.toastMessage}
          onResumeFullScreen={antiCheat.resumeFullScreen}
          onDismissWarning={antiCheat.dismissWarningModal}
          onViewResults={() => {
            antiCheat.dismissWarningModal();
            setActiveTab('result');
          }}
        />

      </div>
    </div>
  );
};

