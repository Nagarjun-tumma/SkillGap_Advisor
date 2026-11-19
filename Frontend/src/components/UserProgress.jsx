import React, { useState } from 'react';
import { 
  TrendingUp, CheckCircle2, Award, Target, Sparkles, 
  BookOpen, Zap, ArrowRight, ShieldCheck, HelpCircle, 
  BarChart3, Clock, Lock, RefreshCw, Trophy, AlertCircle, ChevronRight, Flame
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CompanySkillVerificationModal } from './CompanySkillVerificationModal';

// Career roles reference data
const CAREER_ROLES = [
  { id: 1, name: 'AI & Machine Learning Engineer', category: 'Data & AI', requiredSkills: ['Python', 'Machine Learning', 'Deep Learning', 'Data Structures & Algorithms', 'SQL & MySQL', 'Git & GitHub'] },
  { id: 2, name: 'Full Stack Java Developer', category: 'Software', requiredSkills: ['Java', 'Spring Boot', 'React.js', 'SQL & MySQL', 'REST API Design', 'Git & GitHub'] },
  { id: 3, name: 'Embedded Systems & IoT Engineer', category: 'Hardware', requiredSkills: ['C++', 'Embedded C / Microcontrollers', 'Robotics & Microprocessors', 'Git & GitHub'] },
  { id: 4, name: 'Data Scientist & Analyst', category: 'Data & AI', requiredSkills: ['Python', 'SQL & MySQL', 'Machine Learning', 'Data Structures & Algorithms', 'Git & GitHub'] },
  { id: 5, name: 'DevOps & Cloud Engineer', category: 'Software', requiredSkills: ['Docker & Kubernetes', 'Python', 'Git & GitHub', 'System Design'] },
  { id: 6, name: 'Civil Structural BIM & GIS Engineer', category: 'Civil Engineering', requiredSkills: ['System Design', 'SQL & MySQL', 'Python', 'Git & GitHub'] },
  { id: 7, name: 'Smart Infrastructure & Construction Specialist', category: 'Civil & Smart Cities', requiredSkills: ['Python', 'SQL & MySQL', 'System Design', 'Git & GitHub'] },
  { id: 8, name: 'Robotics & CAD Automation Engineer', category: 'Mechanical & Robotics', requiredSkills: ['C++', 'Embedded C / Microcontrollers', 'Robotics & Microprocessors', 'Git & GitHub'] },
];

export const UserProgress = ({ onNavigateRoadmap, onNavigateDashboard }) => {
  const { user, updateUserSkills } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [quickQuizSkill, setQuickQuizSkill] = useState(null);

  // Target role configuration
  const targetRoleId = Number(user?.targetRoleId || 2);
  const currentRole = CAREER_ROLES.find(r => r.id === targetRoleId) || CAREER_ROLES[1];

  // User acquired skills standardizing
  const acquiredSkills = user?.acquiredSkills || [];
  const acquiredSkillNames = acquiredSkills.map(s => typeof s === 'string' ? s : s.skillName);

  // Calculate metrics
  const requiredSkills = currentRole.requiredSkills;
  const matchedSkills = requiredSkills.filter(req => 
    acquiredSkillNames.some(acq => acq.toLowerCase() === req.toLowerCase())
  );
  const missingSkills = requiredSkills.filter(req => 
    !acquiredSkillNames.some(acq => acq.toLowerCase() === req.toLowerCase())
  );

  const totalRequired = requiredSkills.length;
  const matchCount = matchedSkills.length;
  const readinessPercentage = totalRequired > 0 ? Math.round((matchCount / totalRequired) * 100) : 0;

  // Determine readiness status level badge
  let readinessBadge = { text: 'Beginner Level', color: '#ef4444', bg: '#fef2f2', border: '#fca5a5' };
  if (readinessPercentage >= 80) {
    readinessBadge = { text: 'Placement Ready! 🚀', color: '#16a34a', bg: '#f0fdf4', border: '#86efac' };
  } else if (readinessPercentage >= 50) {
    readinessBadge = { text: 'Advanced Progress ⚡', color: '#7c3aed', bg: '#f3e8ff', border: '#d8b4fe' };
  } else if (readinessPercentage >= 25) {
    readinessBadge = { text: 'Intermediate Progress 📈', color: '#d97706', bg: '#fffbeb', border: '#fde68a' };
  }

  // Handle manual quick skill unlock
  const handleMarkSkillCompleted = (skillName) => {
    setQuickQuizSkill(skillName);
  };

  const handleSaveSkillVerification = (skillName, { isVerified, verifiedScore, verifiedLevel }) => {
    const updated = acquiredSkills.map(s => {
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

    const exists = acquiredSkills.some(s => (typeof s === 'string' ? s : (s.skillName || s.name || '')).toLowerCase() === skillName.toLowerCase());
    let finalSkills = updated;
    if (!exists) {
      finalSkills = [...updated, {
        skillId: Date.now(),
        skillName: skillName,
        proficiency: verifiedLevel === 'TIER_1_PRODUCT_READY' ? 'ADVANCED' : 'INTERMEDIATE',
        isVerified: isVerified,
        verifiedScore: verifiedScore,
        verifiedLevel: verifiedLevel
      }];
    }

    updateUserSkills(finalSkills);
  };

  // Read user streak data
  let userStreakCount = 1;
  try {
    const saved = localStorage.getItem(`student_streak_auto_${(user?.email || 'guest').toLowerCase()}`);
    if (saved) userStreakCount = JSON.parse(saved).currentStreak || 1;
  } catch (e) {}

  // Badges calculation
  const achievements = [
    {
      id: 'first_skill',
      title: 'First Skill Mastered',
      description: 'Acquired at least 1 technical skill',
      icon: CheckCircle2,
      unlocked: acquiredSkills.length >= 1,
      color: '#10b981'
    },
    {
      id: 'streak_7_day',
      title: '7-Day Weekly Warrior',
      description: '7 consecutive days of daily placement preparation',
      icon: Zap,
      unlocked: userStreakCount >= 7,
      color: '#0284c7'
    },
    {
      id: 'streak_14_day',
      title: '14-Day Fortnight Master',
      description: '14 consecutive days of unbroken engineering discipline',
      icon: Flame,
      unlocked: userStreakCount >= 14,
      color: '#ea580c'
    },
    {
      id: 'halfway',
      title: 'Halfway Ready',
      description: 'Achieved 50%+ match score for target role',
      icon: TrendingUp,
      unlocked: readinessPercentage >= 50,
      color: '#6366f1'
    },
    {
      id: 'backend_or_core',
      title: 'Core Technical Pro',
      description: 'Mastered 3 or more required skills',
      icon: Award,
      unlocked: matchCount >= 3,
      color: '#8b5cf6'
    },
    {
      id: 'job_ready',
      title: 'Industry Job Ready',
      description: 'Achieved 80%+ match score for target role',
      icon: Trophy,
      unlocked: readinessPercentage >= 80,
      color: '#f59e0b'
    }
  ];

  return (
    <div style={{
      maxWidth: '1150px',
      margin: '0 auto',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '28px',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>

      {/* TOP HERO BANNER: User Profile & Readiness Score */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
        borderRadius: '24px',
        padding: '32px',
        color: '#ffffff',
        boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.5)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '24px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative background glow */}
        <div style={{
          position: 'absolute',
          top: '-40%',
          right: '-10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ zIndex: 1, maxWidth: '580px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '9999px', background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.2)', fontSize: '12px', fontWeight: 800, color: '#c084fc' }}>
            <TrendingUp size={14} />
            <span>Student Career Progress Analytics</span>
          </div>

          <h1 style={{ fontSize: '28px', fontWeight: 900, marginTop: '12px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Welcome back, <span style={{ background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.fullName || 'Engineering Student'}</span>!
          </h1>
          
          <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '8px', lineHeight: '1.6' }}>
            Targeting: <strong style={{ color: '#ffffff' }}>{currentRole.name}</strong>. Below is your live skill gap breakdown, readiness trajectory, and placement milestones.
          </p>

          {/* Dream Companies Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#c084fc' }}>Target Dream Companies:</span>
            {user?.targetCompanies && user.targetCompanies.length > 0 ? (
              user.targetCompanies.map(comp => (
                <span
                  key={comp}
                  style={{
                    background: 'rgba(168, 85, 247, 0.2)',
                    border: '1px solid rgba(168, 85, 247, 0.4)',
                    color: '#e9d5ff',
                    padding: '2px 9px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: 700
                  }}
                >
                  🏢 {comp}
                </span>
              ))
            ) : (
              <span style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>None selected yet</span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
            <button
              onClick={onNavigateRoadmap}
              style={{
                background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 22px',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 8px 20px rgba(168, 85, 247, 0.35)',
                transition: 'transform 0.15s ease'
              }}
            >
              <Target size={16} />
              <span>View Personalized Step Roadmap</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={onNavigateDashboard}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '12px 18px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <BarChart3 size={16} />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>

        {/* Circular Progress Gauge */}
        <div style={{
          zIndex: 1,
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '20px',
          padding: '24px 28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '220px',
          textAlign: 'center'
        }}>
          <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* SVG Circle */}
            <svg width="120" height="120" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
              <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.1)" strokeWidth="10" fill="none" />
              <circle 
                cx="50" 
                cy="50" 
                r="42" 
                stroke="url(#progressGradient)" 
                strokeWidth="10" 
                fill="none" 
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * readinessPercentage) / 100}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 900,
              color: '#ffffff',
              pointerEvents: 'none'
            }}>
              {readinessPercentage}%
            </div>
          </div>

          <div style={{
            marginTop: '12px',
            fontSize: '11px',
            fontWeight: 800,
            padding: '4px 12px',
            borderRadius: '9999px',
            background: readinessBadge.bg,
            color: readinessBadge.color,
            border: `1px solid ${readinessBadge.border}`
          }}>
            {readinessBadge.text}
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>
            Placement Readiness Index
          </div>
        </div>

      </div>

      {/* QUICK STATS METRICS GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        {/* Stat 1 */}
        <div style={{
          background: '#ffffff',
          borderRadius: '18px',
          border: '1px solid #e2e8f0',
          padding: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justify: 'center' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a' }}>{matchCount} / {totalRequired}</div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Mastered Required Skills</div>
          </div>
        </div>

        {/* Stat 2 */}
        <div style={{
          background: '#ffffff',
          borderRadius: '18px',
          border: '1px solid #e2e8f0',
          padding: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justify: 'center' }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a' }}>{missingSkills.length} Skills</div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Skill Gap Remaining</div>
          </div>
        </div>

        {/* Stat 3 */}
        <div style={{
          background: '#ffffff',
          borderRadius: '18px',
          border: '1px solid #e2e8f0',
          padding: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#f3e8ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justify: 'center' }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a' }}>{acquiredSkills.length} Total</div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>All Student Badges</div>
          </div>
        </div>

        {/* Stat 4 */}
        <div style={{
          background: '#ffffff',
          borderRadius: '18px',
          border: '1px solid #e2e8f0',
          padding: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justify: 'center' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a' }}>{missingSkills.length * 2} Weeks</div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Est. Time to Job Ready</div>
          </div>
        </div>
      </div>

      {/* DETAILED PROGRESS BREAKDOWN */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px'
      }}>

        {/* LEFT COLUMN: Skill Gap Matrix */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          padding: '24px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target size={20} color="#4338ca" />
              <span>Target Role Skill Breakdown</span>
            </h2>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#6366f1', background: '#e0e7ff', padding: '4px 10px', borderRadius: '8px' }}>
              {currentRole.name}
            </span>
          </div>

          {/* List of Required Skills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {requiredSkills.map((skillName, idx) => {
              const matchedSkill = acquiredSkills.find(s => (typeof s === 'string' ? s : (s.skillName || s.name || '')).toLowerCase() === skillName.toLowerCase());
              const isAcquired = !!matchedSkill;
              const isVerified = matchedSkill && (matchedSkill.isVerified === true || matchedSkill.isVerified === 'true');
              const verScore = matchedSkill?.verifiedScore || 0;

              return (
                <div key={idx} style={{
                  padding: '14px 18px',
                  borderRadius: '14px',
                  border: isVerified ? '1.5px solid #86efac' : isAcquired ? '1.5px dashed #f59e0b' : '1px solid #e2e8f0',
                  background: isVerified ? '#f0fdf4' : isAcquired ? '#fffbeb' : '#f8fafc',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {isVerified ? (
                      <div style={{ color: '#16a34a', background: '#dcfce7', padding: '6px', borderRadius: '50%' }}>
                        <ShieldCheck size={18} />
                      </div>
                    ) : isAcquired ? (
                      <div style={{ color: '#d97706', background: '#fef3c7', padding: '6px', borderRadius: '50%' }}>
                        <AlertCircle size={18} />
                      </div>
                    ) : (
                      <div style={{ color: '#94a3b8', background: '#e2e8f0', padding: '6px', borderRadius: '50%' }}>
                        <Lock size={16} />
                      </div>
                    )}

                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: isVerified ? '#14532d' : isAcquired ? '#92400e' : '#334155' }}>
                        {skillName}
                      </div>
                      <div style={{ fontSize: '11px', color: isVerified ? '#16a34a' : isAcquired ? '#b45309' : '#64748b' }}>
                        {isVerified 
                          ? `Company-Verified (${verScore}%)` 
                          : isAcquired 
                            ? 'Self-Reported (Unverified for Companies)' 
                            : 'Skill Gap Remaining'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isVerified ? (
                      <button
                        onClick={() => setQuickQuizSkill(skillName)}
                        style={{
                          background: '#ecfdf5',
                          border: '1px solid #a7f3d0',
                          borderRadius: '8px',
                          padding: '5px 10px',
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#047857',
                          cursor: 'pointer'
                        }}
                      >
                        Re-test
                      </button>
                    ) : (
                      <button
                        onClick={() => setQuickQuizSkill(skillName)}
                        style={{
                          background: '#7c3aed',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '6px 12px',
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#ffffff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <span>{isAcquired ? 'Verify for Companies ⚡' : 'Test & Complete ⚡'}</span>
                        <ChevronRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Achievements & Badges */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          padding: '24px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trophy size={20} color="#d97706" />
            <span>Placement Milestones & Badges</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
            {achievements.map((ach) => {
              const IconComp = ach.icon;
              return (
                <div key={ach.id} style={{
                  padding: '16px',
                  borderRadius: '16px',
                  border: ach.unlocked ? `1px solid ${ach.color}40` : '1px dashed #cbd5e1',
                  background: ach.unlocked ? `${ach.color}0a` : '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  opacity: ach.unlocked ? 1 : 0.65
                }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: ach.unlocked ? ach.color : '#cbd5e1',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: ach.unlocked ? `0 4px 12px ${ach.color}50` : 'none'
                  }}>
                    <IconComp size={22} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{ach.title}</span>
                      {ach.unlocked && (
                        <span style={{ fontSize: '10px', fontWeight: 800, color: '#16a34a', background: '#dcfce7', padding: '2px 8px', borderRadius: '4px' }}>
                          UNLOCKED
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                      {ach.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Callout Box */}
          <div style={{
            marginTop: '8px',
            padding: '20px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #f3e8ff 0%, #e0e7ff 100%)',
            border: '1px solid #c084fc',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 800, color: '#6b21a8' }}>
              <Sparkles size={16} />
              <span>Ready for your next learning step?</span>
            </div>
            <p style={{ fontSize: '12px', color: '#4c1d95', margin: 0, lineHeight: 1.5 }}>
              Open your <strong>Personalized Career Roadmap</strong> to complete step-by-step video courses, practice problems, and diagnostic quizzes to automatically unlock badges and boost your readiness index.
            </p>
            <button
              onClick={onNavigateRoadmap}
              style={{
                marginTop: '4px',
                background: '#7c3aed',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 16px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                width: 'fit-content'
              }}
            >
              <span>Go to Learning Roadmap</span>
              <ArrowRight size={14} />
            </button>
          </div>

        </div>

      </div>

      {/* Company Skill Verification Modal */}
      {quickQuizSkill && (
        <CompanySkillVerificationModal
          skillName={quickQuizSkill}
          onClose={() => setQuickQuizSkill(null)}
          onSaveVerification={handleSaveSkillVerification}
        />
      )}

    </div>
  );
};
