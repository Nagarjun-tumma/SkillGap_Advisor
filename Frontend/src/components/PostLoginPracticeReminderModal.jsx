import React, { useState } from 'react';
import { 
  Code, CheckCircle2, Clock, ExternalLink, ArrowRight, Sparkles, 
  X, Flame, Bell, Award, Upload, HelpCircle, ThumbsUp, AlertCircle
} from 'lucide-react';
import { CODING_PLATFORMS, practicePlatformService } from '../utils/practicePlatformService';

export const PostLoginPracticeReminderModal = ({
  isOpen,
  onClose,
  user = null,
  onOpenScoreSubmission = null,
  onLaunchPlatform = null
}) => {
  const [selectedResponse, setSelectedResponse] = useState(null); // 'YES' | 'NO' | null

  if (!isOpen) return null;

  const studentName = user?.fullName || user?.name || 'Engineering Student';
  const branch = user?.engineeringBranch || 'Engineering';

  // Get platforms recommended
  const leetcode = CODING_PLATFORMS.find(p => p.id === 'leetcode') || CODING_PLATFORMS[0];
  const hackerrank = CODING_PLATFORMS.find(p => p.id === 'hackerrank') || CODING_PLATFORMS[1];

  const handleLaunchAndTrack = (platform, url) => {
    practicePlatformService.recordVisit({
      platformId: platform.id,
      platformName: platform.name,
      skillName: 'Data Structures & Algorithms',
      url,
      userEmail: user?.email || 'student@college.edu'
    });
    window.open(url, '_blank', 'noopener,noreferrer');
    if (onLaunchPlatform) onLaunchPlatform(platform);
  };

  const handleYesPracticed = () => {
    onClose();
    if (onOpenScoreSubmission) {
      onOpenScoreSubmission();
    }
  };

  return (
    <div className="split-modal-overlay" style={{ zIndex: 100000 }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        maxWidth: '620px',
        width: '95%',
        maxHeight: '92vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
        border: '1.5px solid #e2e8f0',
        animation: 'fadeIn 0.25s ease'
      }}>
        
        {/* TOP BANNER */}
        <div style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)',
          color: '#ffffff',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '18px',
              right: '18px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              color: '#ffffff',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: '#fef08a', background: 'rgba(254, 240, 138, 0.2)', padding: '3px 10px', borderRadius: '6px', marginBottom: '8px' }}>
            <Bell size={13} />
            <span>Post-Login Practice Check-in &bull; Consistency Tracker</span>
          </div>

          <h3 style={{ fontSize: '20px', fontWeight: 900, margin: 0, color: '#ffffff' }}>
            Welcome back, {studentName}! 👋
          </h3>
          <p style={{ fontSize: '13px', color: '#c7d2fe', marginTop: '4px', lineHeight: 1.5 }}>
            We provided you with dedicated coding platforms (LeetCode &amp; HackerRank) to master your technical rounds.
          </p>
        </div>

        {/* BODY */}
        <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* MAIN PROMPT QUESTION BOX */}
          <div style={{
            padding: '20px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            border: '1.5px solid #cbd5e1',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HelpCircle size={26} />
            </div>

            <h4 style={{ fontSize: '17px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
              Did you visit the platforms and complete your hands-on practice?
            </h4>
            <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0, maxWidth: '460px', lineHeight: 1.5 }}>
              If you forgot, don't worry! We are here to help you remember and build a strong daily habit for your campus placements.
            </p>
          </div>

          {/* TWO PRIMARY CHOICE CARDS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            
            {/* OPTION 1: YES, I PRACTICED */}
            <div
              onClick={() => setSelectedResponse('YES')}
              style={{
                padding: '20px',
                borderRadius: '18px',
                border: selectedResponse === 'YES' ? '2px solid #10b981' : '1.5px solid #e2e8f0',
                background: selectedResponse === 'YES' ? '#ecfdf5' : '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                transition: 'all 0.15s ease',
                boxShadow: selectedResponse === 'YES' ? '0 8px 20px -5px rgba(16, 185, 129, 0.2)' : '0 4px 10px rgba(0, 0, 0, 0.03)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '24px' }}>🎉</span>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: selectedResponse === 'YES' ? '#10b981' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {selectedResponse === 'YES' && <CheckCircle2 size={16} color="#ffffff" />}
                </div>
              </div>

              <div>
                <h5 style={{ fontSize: '15px', fontWeight: 900, color: '#065f46', margin: 0 }}>
                  Yes, I Practiced!
                </h5>
                <p style={{ fontSize: '12px', color: '#047857', marginTop: '4px', lineHeight: 1.4 }}>
                  I visited LeetCode/HackerRank and solved technical problems.
                </p>
              </div>

              <span style={{ fontSize: '11px', fontWeight: 800, color: '#059669', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: 'auto' }}>
                <Upload size={12} />
                <span>Share Score &amp; Get AI Result →</span>
              </span>
            </div>

            {/* OPTION 2: NOT YET / I FORGOT */}
            <div
              onClick={() => setSelectedResponse('NO')}
              style={{
                padding: '20px',
                borderRadius: '18px',
                border: selectedResponse === 'NO' ? '2px solid #f59e0b' : '1.5px solid #e2e8f0',
                background: selectedResponse === 'NO' ? '#fffbeb' : '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                transition: 'all 0.15s ease',
                boxShadow: selectedResponse === 'NO' ? '0 8px 20px -5px rgba(245, 158, 11, 0.2)' : '0 4px 10px rgba(0, 0, 0, 0.03)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '24px' }}>⏰</span>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: selectedResponse === 'NO' ? '#f59e0b' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {selectedResponse === 'NO' && <CheckCircle2 size={16} color="#ffffff" />}
                </div>
              </div>

              <div>
                <h5 style={{ fontSize: '15px', fontWeight: 900, color: '#92400e', margin: 0 }}>
                  I Forgot / Not Yet
                </h5>
                <p style={{ fontSize: '12px', color: '#b45309', marginTop: '4px', lineHeight: 1.4 }}>
                  I haven't practiced yet. Take me directly to the practice platform!
                </p>
              </div>

              <span style={{ fontSize: '11px', fontWeight: 800, color: '#d97706', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: 'auto' }}>
                <ExternalLink size={12} />
                <span>Open LeetCode / HackerRank →</span>
              </span>
            </div>

          </div>

          {/* DYNAMIC ACTION DRAWER BASED ON RESPONSE */}
          {selectedResponse === 'YES' && (
            <div style={{
              padding: '18px 20px',
              borderRadius: '16px',
              background: '#ecfdf5',
              border: '1.5px solid #a7f3d0',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              animation: 'fadeIn 0.2s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color="#059669" />
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#065f46' }}>
                  Awesome job staying consistent!
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#047857', margin: 0, lineHeight: 1.5 }}>
                Click below to share your score or upload a screenshot of your solved problems. Our automated AI evaluator will analyze your solution and update your skill gap score immediately!
              </p>

              <button
                onClick={handleYesPracticed}
                style={{
                  padding: '12px 20px',
                  borderRadius: '12px',
                  background: '#059669',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 900,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
                }}
              >
                <Upload size={15} />
                <span>Share My Practice Score &amp; Screenshot Now →</span>
              </button>
            </div>
          )}

          {selectedResponse === 'NO' && (
            <div style={{
              padding: '18px 20px',
              borderRadius: '16px',
              background: '#fffbeb',
              border: '1.5px solid #fde68a',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              animation: 'fadeIn 0.2s ease'
            }}>
              <div>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#92400e' }}>
                  No worries! Let's get 15 minutes of practice in right now:
                </span>
                <p style={{ fontSize: '12px', color: '#78350f', margin: '4px 0 0 0' }}>
                  Choose a platform below. We will launch the essential problem set for your branch:
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleLaunchAndTrack(leetcode, 'https://leetcode.com/studyplan/leetcode-75/')}
                  style={{
                    flex: 1,
                    padding: '11px 16px',
                    borderRadius: '12px',
                    background: '#d97706',
                    color: '#ffffff',
                    fontSize: '12.5px',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 3px 10px rgba(217, 119, 6, 0.25)'
                  }}
                >
                  <ExternalLink size={13} />
                  <span>Launch LeetCode 75 →</span>
                </button>

                <button
                  onClick={() => handleLaunchAndTrack(hackerrank, 'https://www.hackerrank.com/domains')}
                  style={{
                    flex: 1,
                    padding: '11px 16px',
                    borderRadius: '12px',
                    background: '#059669',
                    color: '#ffffff',
                    fontSize: '12.5px',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 3px 10px rgba(5, 150, 105, 0.25)'
                  }}
                >
                  <ExternalLink size={13} />
                  <span>Launch HackerRank Domains →</span>
                </button>
              </div>

              <span style={{ fontSize: '11px', color: '#b45309', fontStyle: 'italic', textAlign: 'center' }}>
                Once you solve problems, come back here to submit your score proof!
              </span>
            </div>
          )}

          {/* FOOTER ACTIONS */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
              💡 Practice reminders can also be opened anytime from the Dashboard.
            </span>

            <button
              onClick={onClose}
              style={{
                padding: '9px 18px',
                borderRadius: '10px',
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                color: '#475569',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Remind Me Later Today
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
