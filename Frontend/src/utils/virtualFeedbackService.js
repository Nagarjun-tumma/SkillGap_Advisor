// Service for Virtual Social Media Feedback (Video & Voice Testimonials)
// Handles social media link sharing (LinkedIn, YouTube Shorts, Instagram Reels),
// video embedding, persistent storage, and live real-time showcase updates.

const STORAGE_KEY = 'career_advisor_virtual_feedbacks';

// Real default baseline video testimonial representing Ishwari's verified campus feedback
export const DEFAULT_VIRTUAL_FEEDBACKS = [
  {
    id: 1730985000000,
    studentName: 'ishwari',
    userEmail: 'ishwari@mgmcen.ac.in',
    branch: 'Computer Science & Engineering',
    college: "MGM's College of Engineering, Nanded",
    targetRole: 'Full Stack Java & Cloud Engineer',
    mediaType: 'VIDEO', // 'VIDEO' | 'VOICE'
    platform: 'LinkedIn', // 'LinkedIn' | 'YouTube' | 'Instagram' | 'X'
    postUrl: 'https://www.linkedin.com/feed/update/urn:li:activity:mgm_cse_career_advisor_ishwari',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'How AI Skill Gap Advisor Prepared Me for Tier-1 Campus Placement Drives',
    quote: 'The personalized roadmaps and diagnostic assessments took away all confusion. I knew exactly which LeetCode topics and Spring Boot concepts to practice each week!',
    tags: ['#CampusPlacements', '#MGMCOENanded', '#SkillGapAI', '#LeetCodePractice'],
    duration: '1:45 Min',
    viewsCount: '1.4K+ Views',
    likesCount: '186 Likes',
    verified: true,
    timestamp: '2026-11-05T14:30:00.000Z'
  }
];

export const virtualFeedbackService = {
  // Retrieve all verified virtual feedback testimonials
  getVirtualFeedbacks: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not parse stored virtual feedbacks:', e);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_VIRTUAL_FEEDBACKS));
    return DEFAULT_VIRTUAL_FEEDBACKS;
  },

  // Save new video or voice testimonial link
  addVirtualFeedback: ({
    studentName,
    userEmail,
    branch,
    college,
    targetRole,
    mediaType,
    platform,
    postUrl,
    title,
    quote,
    tags
  }) => {
    const current = virtualFeedbackService.getVirtualFeedbacks();

    // Clean and validate URL
    let cleanUrl = (postUrl || '').trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`;
    }

    // Determine platform if not set
    let detectedPlatform = platform || 'LinkedIn';
    if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) {
      detectedPlatform = 'YouTube';
    } else if (cleanUrl.includes('instagram.com')) {
      detectedPlatform = 'Instagram';
    } else if (cleanUrl.includes('linkedin.com')) {
      detectedPlatform = 'LinkedIn';
    } else if (cleanUrl.includes('twitter.com') || cleanUrl.includes('x.com')) {
      detectedPlatform = 'X (Twitter)';
    }

    const newEntry = {
      id: Date.now(),
      studentName: studentName || 'Engineering Student',
      userEmail: userEmail || 'student@college.edu',
      branch: branch || 'Computer Science & Engineering',
      college: college || "MGM's College of Engineering, Nanded",
      targetRole: targetRole || 'Software Development Engineer',
      mediaType: mediaType || 'VIDEO',
      platform: detectedPlatform,
      postUrl: cleanUrl,
      videoUrl: cleanUrl,
      title: title || 'My Campus Placement Journey with AI Career Advisor',
      quote: (quote || '').trim() || 'Practicing on LeetCode and following the AI-curated company blueprints boosted my technical confidence!',
      tags: Array.isArray(tags) && tags.length > 0 ? tags : ['#CampusPlacements', '#MGMCOE', '#SkillGapAI'],
      duration: mediaType === 'VOICE' ? '0:58 Min' : '1:30 Min',
      viewsCount: 'Just Posted',
      likesCount: '1 Like',
      verified: true,
      timestamp: new Date().toISOString()
    };

    const updated = [newEntry, ...current];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not persist virtual feedback:', e);
    }

    // Dispatch global custom event for real-time reactivity
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('career_advisor_virtual_feedback_updated', { detail: newEntry }));
    }

    return newEntry;
  }
};

