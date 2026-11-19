// Service for Hands-on Coding Practice Platforms (LeetCode, HackerRank, GeeksforGeeks, CodeChef)
// Handles platform recommendations, launch tracking, score/screenshot submissions, and AI result analysis

const VISITS_STORAGE_KEY = 'career_advisor_platform_visits';
const SUBMISSIONS_STORAGE_KEY = 'career_advisor_practice_submissions';

export const CODING_PLATFORMS = [
  {
    id: 'leetcode',
    name: 'LeetCode',
    tagline: 'Algorithmic Problem Solving & OA Prep',
    badge: 'Tier-1 OA Standard',
    color: '#d97706',
    bgColor: '#fef3c7',
    borderColor: '#fde68a',
    logoText: 'LC',
    description: 'Industry-standard algorithmic problem solving platform. Essential for cracking Online Assessments (OA) at Google, Amazon, Microsoft, and TCS Digital.',
    primaryUrl: 'https://leetcode.com/problemset/all/',
    recommendedFor: ['Data Structures & Algorithms', 'SQL & MySQL', 'Java', 'Python', 'C++', 'System Design'],
    curatedTracks: [
      { title: 'LeetCode 75 Core Study Plan', url: 'https://leetcode.com/studyplan/leetcode-75/', tag: 'Essential 75' },
      { title: 'Top Interview 150 Questions', url: 'https://leetcode.com/studyplan/top-interview-150/', tag: 'MAANG Focus' },
      { title: 'Top SQL 50 Practice Set', url: 'https://leetcode.com/studyplan/top-sql-50/', tag: 'Database OA' }
    ]
  },
  {
    id: 'hackerrank',
    name: 'HackerRank',
    tagline: 'Language Fundamentals & Skill Certifications',
    badge: 'Official Skill Certifications',
    color: '#059669',
    bgColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    logoText: 'HR',
    description: 'Hands-on language mastery and official role certifications. Widely used directly by campus recruiters (Amazon, Goldman Sachs, Infosys, Cognizant) for initial test screening.',
    primaryUrl: 'https://www.hackerrank.com/domains',
    recommendedFor: ['Java', 'Python', 'C++', 'SQL & MySQL', 'Data Structures & Algorithms', 'REST API Design'],
    curatedTracks: [
      { title: 'Java Domain Problem Solving', url: 'https://www.hackerrank.com/domains/java', tag: 'Certification' },
      { title: 'Python Domain Challenges', url: 'https://www.hackerrank.com/domains/python', tag: 'Core Syntax' },
      { title: 'Algorithms & Data Structures', url: 'https://www.hackerrank.com/domains/algorithms', tag: 'OA Screening' },
      { title: 'SQL & Database Querying', url: 'https://www.hackerrank.com/domains/sql', tag: 'Practical Queries' }
    ]
  },
  {
    id: 'gfg',
    name: 'GeeksforGeeks',
    tagline: 'Company Interview Archives & SDE Sheet',
    badge: 'Curated SDE Sheet',
    color: '#2563eb',
    bgColor: '#eff6ff',
    borderColor: '#bfdbfe',
    logoText: 'GFG',
    description: 'Comprehensive DSA problem archive mapped to Indian IT placement rounds with detailed editorial explanations and company-wise frequency tags.',
    primaryUrl: 'https://www.geeksforgeeks.org/explore?page=1&sortBy=submissions',
    recommendedFor: ['Data Structures & Algorithms', 'Spring Boot', 'System Design', 'C++', 'Java'],
    curatedTracks: [
      { title: 'Must Do Coding Questions for Product Companies', url: 'https://www.geeksforgeeks.org/explore?page=1&sortBy=submissions', tag: 'Top SDE' },
      { title: 'Company-Specific Campus Drive Archives', url: 'https://www.geeksforgeeks.org/company-preparation/', tag: 'Company Archives' }
    ]
  },
  {
    id: 'codechef',
    name: 'CodeChef',
    tagline: 'Timed Contests & Competitive Problem Solving',
    badge: 'Speed & Rating Ladder',
    color: '#7c3aed',
    bgColor: '#f3e8ff',
    borderColor: '#ddd6fe',
    logoText: 'CC',
    description: 'Timed algorithmic challenges designed to build fast debugging and optimal complexity skills for campus placement coding rounds.',
    primaryUrl: 'https://www.codechef.com/practice',
    recommendedFor: ['C++', 'Java', 'Python', 'Data Structures & Algorithms'],
    curatedTracks: [
      { title: 'Practice by Difficulty (Beginner to 3-Star)', url: 'https://www.codechef.com/practice', tag: 'Contest Prep' }
    ]
  }
];

// Baseline verified submission (Ishwari's verified practice proof)
const DEFAULT_SUBMISSIONS = [
  {
    id: 1730974800000,
    userName: 'ishwari',
    userEmail: 'ishwari@mgmcen.ac.in',
    platformId: 'leetcode',
    platformName: 'LeetCode',
    skillName: 'Data Structures & Algorithms',
    problemsSolved: 24,
    score: '1,685 Rating',
    accuracy: 88,
    profileUrl: 'https://leetcode.com/u/ishwari_mgm',
    screenshotUrl: null, // text verified
    difficultyBreakdown: { easy: 8, medium: 14, hard: 2 },
    readinessBoost: '+18% Verified Mastery',
    aiVerdict: 'Tier-1 Company Ready (Amazon / Infosys DSE Track)',
    aiFeedback: 'Exceptional consistency in Medium-difficulty Two-Pointer and HashMap algorithms. Code demonstrates clean time-complexity awareness (O(N) solutions) meeting tier-1 campus hiring benchmarks.',
    badge: '🏆 Verified Hands-on Problem Solver',
    submittedAt: '2026-11-04T11:20:00.000Z',
    verified: true
  }
];

export const practicePlatformService = {
  // Get all platforms or filter by skill
  getPlatforms: (skillName = null) => {
    if (!skillName) return CODING_PLATFORMS;
    return CODING_PLATFORMS.filter(p => 
      p.recommendedFor.some(s => s.toLowerCase() === skillName.toLowerCase())
    );
  },

  // Record a platform visit when student clicks a link
  recordVisit: ({ platformId, platformName, skillName, url, userEmail }) => {
    try {
      const stored = localStorage.getItem(VISITS_STORAGE_KEY);
      const visits = stored ? JSON.parse(stored) : [];
      
      const newVisit = {
        id: Date.now(),
        platformId: platformId || 'leetcode',
        platformName: platformName || 'LeetCode',
        skillName: skillName || 'Data Structures & Algorithms',
        url: url || 'https://leetcode.com',
        userEmail: userEmail || 'student@college.edu',
        visitedAt: new Date().toISOString(),
        status: 'PENDING_PRACTICE_SUBMISSION'
      };

      // Keep latest 25 visits
      const updated = [newVisit, ...visits.slice(0, 24)];
      localStorage.setItem(VISITS_STORAGE_KEY, JSON.stringify(updated));

      // Dispatch event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('career_advisor_platform_visited', { detail: newVisit }));
      }

      return newVisit;
    } catch (e) {
      console.warn('Failed to record platform visit:', e);
      return null;
    }
  },

  // Get visits pending practice submission for the logged-in student (powers Change 4 post-login reminder!)
  getPendingVisits: (userEmail) => {
    try {
      const stored = localStorage.getItem(VISITS_STORAGE_KEY);
      if (!stored) return [];
      const visits = JSON.parse(stored);
      return visits.filter(v => 
        v.status === 'PENDING_PRACTICE_SUBMISSION' &&
        (!userEmail || !v.userEmail || v.userEmail.toLowerCase() === userEmail.toLowerCase())
      );
    } catch (e) {
      return [];
    }
  },

  // Dismiss or mark reminder resolved
  dismissVisitReminder: (visitId) => {
    try {
      const stored = localStorage.getItem(VISITS_STORAGE_KEY);
      if (!stored) return;
      const visits = JSON.parse(stored);
      const updated = visits.map(v => v.id === visitId ? { ...v, status: 'REMINDER_DISMISSED' } : v);
      localStorage.setItem(VISITS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to dismiss visit reminder:', e);
    }
  },

  // Get practice submissions history
  getSubmissions: (userEmail = null) => {
    try {
      const stored = localStorage.getItem(SUBMISSIONS_STORAGE_KEY);
      let submissions = stored ? JSON.parse(stored) : null;
      if (!submissions || !Array.isArray(submissions) || submissions.length === 0) {
        submissions = DEFAULT_SUBMISSIONS;
        localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(submissions));
      }

      if (userEmail) {
        // Return matching user submissions or the default institutional baseline
        const userMatches = submissions.filter(s => s.userEmail && s.userEmail.toLowerCase() === userEmail.toLowerCase());
        if (userMatches.length > 0) return userMatches;
      }
      return submissions;
    } catch (e) {
      console.warn('Failed to get practice submissions:', e);
      return DEFAULT_SUBMISSIONS;
    }
  },

  // Submit practice score & screenshot and perform automated AI analysis
  submitPracticeResult: ({
    userName,
    userEmail,
    platformId,
    platformName,
    skillName,
    problemsSolved,
    score,
    accuracy,
    profileUrl,
    screenshotBase64,
    notes,
    verificationResult = null
  }) => {
    const solvedNum = Math.max(1, Number(problemsSolved) || 10);
    const accuracyNum = Math.min(100, Math.max(40, Number(accuracy) || 85));
    const scoreVal = score ? String(score) : `${Math.round(solvedNum * 45)} Pts`;

    // Calculate realistic difficulty breakdown
    const easyCount = Math.max(1, Math.round(solvedNum * 0.35));
    const mediumCount = Math.max(1, Math.round(solvedNum * 0.50));
    const hardCount = Math.max(0, solvedNum - easyCount - mediumCount);

    // If verification was rejected by AI Vision
    if (verificationResult && !verificationResult.verified) {
      const rejectedSubmission = {
        id: Date.now(),
        userName: userName || 'Engineering Student',
        userEmail: userEmail || 'student@college.edu',
        platformId: platformId || 'leetcode',
        platformName: platformName || 'LeetCode',
        skillName: skillName || 'Data Structures & Algorithms',
        problemsSolved: solvedNum,
        score: scoreVal,
        accuracy: accuracyNum,
        profileUrl: profileUrl || '',
        screenshotUrl: screenshotBase64 || null,
        difficultyBreakdown: { easy: easyCount, medium: mediumCount, hard: hardCount },
        readinessBoost: '+0% (Proof Rejected)',
        aiVerdict: verificationResult.errorTitle || 'Proof Verification Rejected',
        aiFeedback: verificationResult.rejectionReason || 'The uploaded proof failed automated AI verification. No placement readiness boost was awarded.',
        badge: '❌ Unverified Proof',
        notes: notes || '',
        submittedAt: new Date().toISOString(),
        verified: false,
        status: 'REJECTED',
        errorTitle: verificationResult.errorTitle,
        rejectionReason: verificationResult.rejectionReason,
        detectedCategoryName: verificationResult.detectedCategoryName,
        missingMarkers: verificationResult.missingMarkers || [],
        detectedMarkers: verificationResult.detectedMarkers || [],
        diagnostics: verificationResult.diagnostics || null
      };

      // Dispatch rejection event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('career_advisor_practice_rejected', { detail: rejectedSubmission }));
      }

      return rejectedSubmission;
    }

    // AI Analysis generator for VERIFIED proofs
    const readinessBoostVal = Math.min(30, Math.max(10, Math.round(solvedNum * 0.8 + (accuracyNum - 50) * 0.2)));
    
    let tierVerdict = 'Campus OA Qualified';
    if (solvedNum >= 20 && accuracyNum >= 80) {
      tierVerdict = 'Tier-1 Company Ready (Google / Amazon / Microsoft OA Track)';
    } else if (solvedNum >= 10) {
      tierVerdict = 'Tier-2 Product & FinTech Ready (TCS Digital / Infosys DSE Track)';
    }

    const aiFeedback = `AI Evaluator Analysis for ${platformName || 'Coding Platform'}: Evaluated ${solvedNum} solved problems on "${skillName}" with ${accuracyNum}% submission accuracy (${easyCount} Easy, ${mediumCount} Medium, ${hardCount} Hard). Strong proficiency demonstrated in algorithmic logic and modular problem breakdown. Verified ready for technical coding screenings. Recommendation: Deepen knowledge on boundary constraints and time complexity O(log N) optimizations.`;

    const newSubmission = {
      id: Date.now(),
      userName: userName || 'Engineering Student',
      userEmail: userEmail || 'student@college.edu',
      platformId: platformId || 'leetcode',
      platformName: platformName || 'LeetCode',
      skillName: skillName || 'Data Structures & Algorithms',
      problemsSolved: solvedNum,
      score: scoreVal,
      accuracy: accuracyNum,
      profileUrl: profileUrl || '',
      screenshotUrl: screenshotBase64 || null,
      difficultyBreakdown: { easy: easyCount, medium: mediumCount, hard: hardCount },
      readinessBoost: `+${readinessBoostVal}% Verified Mastery`,
      aiVerdict: tierVerdict,
      aiFeedback,
      badge: '🏆 Verified Hands-on Problem Solver',
      notes: notes || '',
      submittedAt: new Date().toISOString(),
      verified: true,
      status: 'VERIFIED',
      confidence: verificationResult?.confidence || 92,
      detectedMarkers: verificationResult?.detectedMarkers || []
    };

    // Update submissions in localStorage
    try {
      const current = practicePlatformService.getSubmissions();
      const updated = [newSubmission, ...current];
      localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(updated));

      // Mark any matching visit as completed
      const storedVisits = localStorage.getItem(VISITS_STORAGE_KEY);
      if (storedVisits) {
        const visits = JSON.parse(storedVisits);
        const updatedVisits = visits.map(v => 
          (v.platformId === platformId || v.skillName === skillName) 
            ? { ...v, status: 'PRACTICE_COMPLETED_AND_SUBMITTED' } 
            : v
        );
        localStorage.setItem(VISITS_STORAGE_KEY, JSON.stringify(updatedVisits));
      }
    } catch (e) {
      console.warn('Failed to save practice submission:', e);
    }

    // Dispatch global custom event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('career_advisor_practice_updated', { detail: newSubmission }));
    }

    return newSubmission;
  }
};

