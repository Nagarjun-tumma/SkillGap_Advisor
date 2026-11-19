import React, { useState, useEffect } from 'react';
import { Flame, Award, ShieldCheck, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

// Milestone badges definition (7 Days, 14 Days, 30 Days)
export const CONSISTENCY_BADGES = [
  {
    id: '7_day',
    daysRequired: 7,
    title: '7-Day Streak',
    subtitle: 'Weekly Warrior',
    badgeIcon: '🥈',
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    bgLight: '#f0f9ff',
    borderColor: '#bae6fd',
    textColor: '#0369a1',
    description: 'Awarded for 7 consecutive days of active preparation. Resets if a day is missed.'
  },
  {
    id: '14_day',
    daysRequired: 14,
    title: '14-Day Streak',
    subtitle: 'Fortnight Master',
    badgeIcon: '🥇',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    bgLight: '#ecfdf5',
    borderColor: '#a7f3d0',
    textColor: '#047857',
    description: 'Awarded for 14 consecutive days of unbroken preparation. Resets if a day is missed.'
  },
  {
    id: '30_day',
    daysRequired: 30,
    title: '30-Day Streak',
    subtitle: 'Monthly Titan',
    badgeIcon: '💎',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    bgLight: '#f5f3ff',
    borderColor: '#ddd6fe',
    textColor: '#6d28d9',
    description: 'Awarded for 30 consecutive days of tier-1 consistency. Resets if a day is missed.'
  }
];

// Helper to get local date string YYYY-MM-DD
const getLocalDateStr = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Calculate difference in calendar days between two YYYY-MM-DD strings
const getDayDifference = (prevDateStr, currentDateStr) => {
  if (!prevDateStr || !currentDateStr) return 0;
  const d1 = new Date(prevDateStr + 'T00:00:00');
  const d2 = new Date(currentDateStr + 'T00:00:00');
  const diffMs = d2.getTime() - d1.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
};

export const StudentStreakCard = ({ userEmail, onStreakUpdate }) => {
  const storageKey = `student_streak_auto_${(userEmail || 'guest').toLowerCase()}`;

  const [streakInfo, setStreakInfo] = useState({
    currentStreak: 1,
    lastActiveDate: getLocalDateStr(),
    wasReset: false
  });

  // Automatic date-based tracking on mount / app usage
  useEffect(() => {
    const today = getLocalDateStr();
    let current = 1;
    let wasReset = false;

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        const lastDate = parsed.lastActiveDate;
        const storedStreak = Number(parsed.currentStreak) || 1;

        if (lastDate) {
          const diff = getDayDifference(lastDate, today);

          if (diff === 0) {
            // Already active today: keep the current streak
            current = storedStreak;
          } else if (diff === 1) {
            // Consecutive day: user was active yesterday and is here today!
            current = storedStreak + 1;
          } else if (diff > 1) {
            // Missed 1 or more full days: Streak is broken, reset to 1 and remove badges!
            current = 1;
            wasReset = true;
          }
        }
      }
    } catch (err) {
      console.warn('Streak auto-tracking calculation error', err);
    }

    const updated = {
      currentStreak: current,
      lastActiveDate: today,
      wasReset
    };

    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {}

    setStreakInfo(updated);
    if (onStreakUpdate) {
      onStreakUpdate(updated);
    }
  }, [userEmail, storageKey]);

  const currentStreak = streakInfo.currentStreak;

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '20px',
      border: '1px solid #e2e8f0',
      padding: '24px',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>

      {/* Streak Header: Clean, Simple, Automatic */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        borderBottom: '1px solid #f1f5f9',
        paddingBottom: '18px'
      }}>
        
        {/* Left: Flame & Counter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)',
            border: '2px solid #fb923c',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(249, 115, 22, 0.2)'
          }}>
            <Flame size={30} color="#ea580c" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                {currentStreak} Day Streak
              </h3>
              <span style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#16a34a',
                background: '#f0fdf4',
                padding: '2px 8px',
                borderRadius: '9999px',
                border: '1px solid #bbf7d0',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a' }}></span>
                <span>Active Today</span>
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', margin: 0 }}>
              Streak increases automatically each day you use the platform. If you miss a day, it resets to Day 1.
            </p>
          </div>
        </div>

        {/* Right: Quick Streak Status pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#f8fafc',
          padding: '8px 14px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          fontSize: '12px',
          color: '#475569'
        }}>
          <ShieldCheck size={16} color="#7c3aed" />
          <span>
            {currentStreak >= 14 
              ? '14-Day Badge Unlocked 🎉' 
              : currentStreak >= 7 
                ? '7-Day Badge Unlocked ⚡' 
                : `${7 - currentStreak} more consecutive day${7 - currentStreak > 1 ? 's' : ''} to unlock 7-Day Badge`}
          </span>
        </div>

      </div>

      {/* Streak Break Notice (Only displayed if streak was recently reset) */}
      {streakInfo.wasReset && (
        <div style={{
          padding: '10px 14px',
          borderRadius: '12px',
          background: '#fffbeb',
          border: '1px solid #fde68a',
          color: '#92400e',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <AlertCircle size={16} color="#d97706" />
          <span>
            <strong>Streak Reset:</strong> You missed a day, so your streak has restarted at Day 1 and badges have been relocked. Stay active daily to reclaim them!
          </span>
        </div>
      )}

      {/* Simple Badges Grid: 7 Days, 14 Days, 30 Days */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#334155' }}>
            Consistency Badges (Requires Active Streak)
          </span>
          <span style={{ fontSize: '11px', color: '#64748b' }}>
            {CONSISTENCY_BADGES.filter(b => currentStreak >= b.daysRequired).length} of {CONSISTENCY_BADGES.length} Unlocked
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px'
        }}>
          {CONSISTENCY_BADGES.map(badge => {
            const isUnlocked = currentStreak >= badge.daysRequired;
            const progress = Math.min(100, Math.round((currentStreak / badge.daysRequired) * 100));

            return (
              <div
                key={badge.id}
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  border: isUnlocked ? `1.5px solid ${badge.borderColor}` : '1px dashed #cbd5e1',
                  background: isUnlocked ? badge.bgLight : '#f8fafc',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Badge Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '12px',
                      background: isUnlocked ? badge.gradient : '#e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      boxShadow: isUnlocked ? '0 4px 10px rgba(0,0,0,0.12)' : 'none'
                    }}>
                      {isUnlocked ? badge.badgeIcon : <Lock size={16} color="#94a3b8" />}
                    </div>

                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: 800, color: isUnlocked ? '#0f172a' : '#64748b', margin: 0 }}>
                        {badge.title}
                      </h4>
                      <span style={{ fontSize: '11px', color: isUnlocked ? badge.textColor : '#94a3b8', fontWeight: 600 }}>
                        {badge.subtitle}
                      </span>
                    </div>
                  </div>

                  <span style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 7px',
                    borderRadius: '6px',
                    background: isUnlocked ? badge.borderColor : '#e2e8f0',
                    color: isUnlocked ? badge.textColor : '#64748b'
                  }}>
                    {badge.daysRequired} Days
                  </span>
                </div>

                {/* Progress Bar (if locked) or Unlocked Pill */}
                {isUnlocked ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#16a34a',
                    marginTop: '4px'
                  }}>
                    <CheckCircle2 size={13} />
                    <span>Unlocked &amp; Active</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                    <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ width: `${progress}%`, height: '100%', background: '#7c3aed', borderRadius: '9999px' }} />
                    </div>
                    <span style={{ fontSize: '10px', color: '#64748b', textAlign: 'right' }}>
                      Day {currentStreak} of {badge.daysRequired} ({progress}%)
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
