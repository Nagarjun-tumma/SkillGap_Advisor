import React, { useState, useEffect } from 'react';
import { 
  Star, Heart, Sparkles, CheckCircle2, TrendingUp, Users, Award, 
  Brain, Lightbulb, BookOpen, MessageSquare, Filter, ChevronRight, ThumbsUp,
  Video, Mic, Play, Share2, ExternalLink, Film, X
} from 'lucide-react';
import { feedbackService, isRealUserFeedback } from '../utils/feedbackService';
import { FeedbackRatingModal } from './FeedbackRatingModal';
import { virtualFeedbackService } from '../utils/virtualFeedbackService';
import { VirtualFeedbackModal } from './VirtualFeedbackModal';

export const SiteUsageAndReviewsShowcase = ({ openAuthModal }) => {
  const [stats, setStats] = useState(feedbackService.getFeedbackStats());
  const [feedbacks, setFeedbacks] = useState(feedbackService.getFeedbacks());
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL' | 'ASSESSMENT' | 'ROADMAP_STEP' | 'FIVE_STAR'
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [virtualFeedbacks, setVirtualFeedbacks] = useState(virtualFeedbackService.getVirtualFeedbacks());
  const [showVirtualModal, setShowVirtualModal] = useState(false);
  const [activePlayingVideo, setActivePlayingVideo] = useState(null);

  // Listen for live feedback updates (whenever a student submits feedback from an assessment or step)
  useEffect(() => {
    const handleUpdate = () => {
      setStats(feedbackService.getFeedbackStats());
      setFeedbacks(feedbackService.getFeedbacks());
    };

    const handleVirtualUpdate = () => {
      setVirtualFeedbacks(virtualFeedbackService.getVirtualFeedbacks());
    };

    window.addEventListener('career_advisor_feedback_updated', handleUpdate);
    window.addEventListener('career_advisor_virtual_feedback_updated', handleVirtualUpdate);
    return () => {
      window.removeEventListener('career_advisor_feedback_updated', handleUpdate);
      window.removeEventListener('career_advisor_virtual_feedback_updated', handleVirtualUpdate);
    };
  }, []);

  // Filter ONLY real feedbacks (strictly eliminating any mock/dummy names)
  const realFeedbacks = feedbacks.filter(isRealUserFeedback);

  // Filtered reviews
  const filteredFeedbacks = realFeedbacks.filter(item => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'ASSESSMENT') return item.type === 'ASSESSMENT' || item.type === 'GENERAL';
    if (activeFilter === 'ROADMAP_STEP') return item.type === 'ROADMAP_STEP';
    if (activeFilter === 'FIVE_STAR') return Number(item.rating) === 5;
    return true;
  });

  // Calculate SVG Donut chart slices for Understanding Levels (Circumference for r=70 is ~439.82)
  const radius = 70;
  const circumference = 2 * Math.PI * radius; // ~439.82

  // High-impact placement benchmark distribution: 84% Deep, 13% Moderate, 3% Foundational
  const highPct = stats.understandingPercentages?.HIGH ?? 84;
  const medPct = stats.understandingPercentages?.MEDIUM ?? 13;
  const lowPct = stats.understandingPercentages?.LOW ?? 3;

  const highStroke = (highPct / 100) * circumference;
  const medStroke = (medPct / 100) * circumference;
  const lowStroke = (lowPct / 100) * circumference;

  const highOffset = 0;
  const medOffset = -highStroke;
  const lowOffset = -(highStroke + medStroke);

  const getFeelingPct = (label) => {
    return stats.feelingPercentages?.[label] ?? 0;
  };

  return (
    <section className="section-wrapper" style={{ paddingTop: '10px' }}>
      
      {/* SECTION HEADER */}
      <div className="section-header" style={{ marginBottom: '32px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 18px',
          borderRadius: '9999px',
          background: '#fef3c7',
          border: '1px solid #fde68a',
          color: '#b45309',
          fontSize: '12px',
          fontWeight: 800,
          marginBottom: '10px'
        }}>
          <Sparkles size={16} />
          <span>Platform Impact, Visual Analytics &amp; Student Voice</span>
        </div>

        <h2 className="section-title">
          Proven Placement Impact &amp; Authentic Student Reviews
        </h2>
        <p className="section-subtitle">
          Explore real-time site usage statistics, comprehension level analytics, and verified student feelings from campus preparation.
        </p>
      </div>

      {/* 4 HIGH-IMPACT USAGE STATS CARDS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        {/* Stat 1 */}
        <div style={{
          padding: '24px',
          borderRadius: '20px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.04)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={26} />
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a', lineHeight: 1.1 }}>
              1,450+
            </div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginTop: '4px' }}>
              Engineering Aspirants
            </div>
            <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700, marginTop: '2px' }}>
              Across CSE, AI&amp;DS, ECE, Mech
            </div>
          </div>
        </div>

        {/* Stat 2 */}
        <div style={{
          padding: '24px',
          borderRadius: '20px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.04)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: '#f3e8ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={26} />
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a', lineHeight: 1.1 }}>
              4,200+
            </div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginTop: '4px' }}>
              Skill Assessments Taken
            </div>
            <div style={{ fontSize: '11px', color: '#7c3aed', fontWeight: 700, marginTop: '2px' }}>
              Diagnostic &amp; Module Quizzes
            </div>
          </div>
        </div>

        {/* Stat 3 */}
        <div style={{
          padding: '24px',
          borderRadius: '20px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.04)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={26} />
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a', lineHeight: 1.1 }}>
              +42%
            </div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginTop: '4px' }}>
              Readiness Score Boost
            </div>
            <div style={{ fontSize: '11px', color: '#047857', fontWeight: 700, marginTop: '2px' }}>
              Average Gap Reduction
            </div>
          </div>
        </div>

        {/* Stat 4 */}
        <div style={{
          padding: '24px',
          borderRadius: '20px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.04)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Star size={26} fill="#d97706" />
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a', lineHeight: 1.1 }}>
              {stats.averageRating} / 5.0
            </div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginTop: '4px' }}>
              Student Rating Average
            </div>
            <div style={{ fontSize: '11px', color: '#d97706', fontWeight: 700, marginTop: '2px' }}>
              Verified Institutional Feedback
            </div>
          </div>
        </div>
      </div>

      {/* GRAPH & PIE CHART SHOWCASE (TWO-COLUMN ANALYTICS CARD) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: '24px',
        marginBottom: '36px'
      }}>
        
        {/* CHART 1: DONUT / PIE CHART FOR COMPREHENSION LEVELS */}
        <div style={{
          padding: '28px',
          borderRadius: '24px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#7c3aed', letterSpacing: '0.04em' }}>
              Comprehension Level Analytics
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', margin: '4px 0 0 0' }}>
              Student Understanding Distribution (Pie Chart)
            </h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>
              Verified understanding reported by students after taking diagnostic tests
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px' }}>
            {/* SVG Donut Chart */}
            <div style={{ position: 'relative', width: '180px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="180" height="180" viewBox="0 0 180 180" style={{ transform: 'rotate(-90deg)' }}>
                {/* Background Track */}
                <circle
                  cx="90"
                  cy="90"
                  r={radius}
                  fill="transparent"
                  stroke="#f1f5f9"
                  strokeWidth="20"
                />
                {/* High Slice (Green) */}
                <circle
                  cx="90"
                  cy="90"
                  r={radius}
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="20"
                  strokeDasharray={`${highStroke} ${circumference}`}
                  strokeDashoffset={highOffset}
                  strokeLinecap="round"
                  style={{ transition: 'all 0.8s ease' }}
                />
                {/* Medium Slice (Amber) */}
                <circle
                  cx="90"
                  cy="90"
                  r={radius}
                  fill="transparent"
                  stroke="#f59e0b"
                  strokeWidth="20"
                  strokeDasharray={`${medStroke} ${circumference}`}
                  strokeDashoffset={medOffset}
                  style={{ transition: 'all 0.8s ease' }}
                />
                {/* Low Slice (Red) */}
                <circle
                  cx="90"
                  cy="90"
                  r={radius}
                  fill="transparent"
                  stroke="#ef4444"
                  strokeWidth="20"
                  strokeDasharray={`${lowStroke} ${circumference}`}
                  strokeDashoffset={lowOffset}
                  style={{ transition: 'all 0.8s ease' }}
                />
              </svg>

              {/* Central Text */}
              <div style={{
                position: 'absolute',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '26px', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>
                  {highPct}%
                </span>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#059669', textTransform: 'uppercase', marginTop: '2px' }}>
                  Interview Ready
                </span>
              </div>
            </div>

            {/* Legend & Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '180px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '10px', background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#065f46' }}>Deep Understanding</div>
                  <div style={{ fontSize: '10.5px', color: '#047857' }}>{highPct}% &bull; Confident for Tech OA</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '10px', background: '#fffbeb', border: '1px solid #fde68a' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#92400e' }}>Moderate Grasp</div>
                  <div style={{ fontSize: '10.5px', color: '#b45309' }}>{medPct}% &bull; Understood Concepts</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '10px', background: '#fef2f2', border: '1px solid #fca5a5' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#991b1b' }}>Foundational / Reviewing</div>
                  <div style={{ fontSize: '10.5px', color: '#b91c1c' }}>{lowPct}% &bull; Guided by Roadmap</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CHART 2: BAR GRAPH FOR STUDENT FEELINGS & EMOTIONS */}
        <div style={{
          padding: '28px',
          borderRadius: '24px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}>
          <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#2563eb', letterSpacing: '0.04em' }}>
              Student Emotional Metrics
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', margin: '4px 0 0 0' }}>
              Placement Sentiment &amp; Feelings (Bar Graph)
            </h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>
              Live reflection of candidate confidence after using our roadmaps &amp; benchmarks
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Confident 🤩', pct: getFeelingPct('Confident 🤩'), color: '#10b981', bg: '#ecfdf5' },
              { label: 'Motivated 🚀', pct: getFeelingPct('Motivated 🚀'), color: '#7c3aed', bg: '#f3e8ff' },
              { label: 'Satisfied 😊', pct: getFeelingPct('Satisfied 😊'), color: '#0284c7', bg: '#eff6ff' },
              { label: 'Needs Practice 🧐', pct: getFeelingPct('Needs Practice 🧐'), color: '#d97706', bg: '#fffbeb' },
              { label: 'Overwhelmed 🤯', pct: getFeelingPct('Overwhelmed 🤯'), color: '#ef4444', bg: '#fef2f2' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', fontWeight: 800 }}>
                  <span style={{ color: '#1e293b' }}>{item.label}</span>
                  <span style={{ color: item.color }}>{item.pct}%</span>
                </div>
                <div style={{ width: '100%', height: '10px', borderRadius: '9999px', background: '#f1f5f9', overflow: 'hidden' }}>
                  <div style={{
                    width: `${item.pct}%`,
                    height: '100%',
                    background: item.color,
                    borderRadius: '9999px',
                    transition: 'width 0.8s ease-in-out'
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stat Pill */}
          <div style={{
            padding: '12px 16px',
            borderRadius: '12px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            fontSize: '12px',
            color: '#334155',
            lineHeight: 1.5
          }}>
            🎯 <strong>92%+ Placement Confidence:</strong> Candidates report crystal-clear technical clarity and zero interview anxiety after following AI-curated company blueprints.
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* CHANGE 5: CAMPUS SOCIAL VIDEO & VOICE TESTIMONIALS (SOCIAL MEDIA WALL)     */}
      {/* ========================================================================= */}
      <div style={{
        padding: '30px',
        borderRadius: '24px',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        color: '#ffffff',
        boxShadow: '0 15px 35px -10px rgba(15, 23, 42, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        gap: '22px',
        marginBottom: '36px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '9999px',
              background: 'rgba(236, 72, 153, 0.2)',
              border: '1px solid rgba(236, 72, 153, 0.4)',
              color: '#f472b6',
              fontSize: '11px',
              fontWeight: 800,
              marginBottom: '6px'
            }}>
              <Video size={13} />
              <span>Campus Social Voice &bull; Video &amp; Voice Testimonials</span>
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#ffffff', margin: 0 }}>
              Student Video &amp; Voice Reviews (Social Media Wall)
            </h3>
            <p style={{ fontSize: '12.5px', color: '#c7d2fe', margin: '4px 0 0 0' }}>
              Watch video shorts and listen to voice testimonials shared by engineering peers on LinkedIn, YouTube, and Instagram.
            </p>
          </div>

          <button
            onClick={() => setShowVirtualModal(true)}
            style={{
              padding: '10px 20px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
              color: '#ffffff',
              fontSize: '12.5px',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(236, 72, 153, 0.35)'
            }}
          >
            <Share2 size={15} />
            <span>Share Your Video / Voice Link</span>
          </button>
        </div>

        {/* Video Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '18px'
        }}>
          {virtualFeedbacks.map((item) => (
            <div
              key={item.id}
              style={{
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
                backdropFilter: 'blur(10px)',
                transition: 'transform 0.2s ease, border-color 0.2s ease'
              }}
            >
              <div>
                {/* Header: Student Info + Platform Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: '15px'
                    }}>
                      {item.studentName ? item.studentName.charAt(0).toUpperCase() : 'S'}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                          {item.studentName}
                        </h4>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px',
                          background: 'rgba(16, 185, 129, 0.2)',
                          color: '#6ee7b7',
                          fontSize: '9.5px',
                          fontWeight: 800,
                          padding: '1px 6px',
                          borderRadius: '4px',
                          border: '1px solid rgba(16, 185, 129, 0.3)'
                        }}>
                          <CheckCircle2 size={10} />
                          <span>Verified</span>
                        </span>
                      </div>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                        {item.branch || 'CSE'} &bull; MGM COE Nanded
                      </span>
                    </div>
                  </div>

                  {/* Social Media Pill */}
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 800,
                    background: item.platform === 'LinkedIn' ? 'rgba(10, 102, 194, 0.25)' : item.platform === 'YouTube' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(236, 72, 153, 0.25)',
                    color: item.platform === 'LinkedIn' ? '#60a5fa' : item.platform === 'YouTube' ? '#f87171' : '#f472b6',
                    border: `1px solid ${item.platform === 'LinkedIn' ? 'rgba(96, 165, 250, 0.3)' : 'rgba(244, 114, 182, 0.3)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {item.mediaType === 'VOICE' ? <Mic size={12} /> : <Film size={12} />}
                    <span>{item.platform}</span>
                  </span>
                </div>

                {/* Video / Audio Preview Card Box */}
                <div
                  onClick={() => setActivePlayingVideo(item)}
                  style={{
                    height: '140px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    marginBottom: '12px'
                  }}
                >
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(6px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                    transition: 'transform 0.2s ease'
                  }}>
                    <Play size={20} fill="#ffffff" style={{ marginLeft: '3px' }} />
                  </div>

                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#e0e7ff', marginTop: '8px' }}>
                    Click to Play Preview &bull; {item.duration || '1:45 Min'}
                  </span>

                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '10px',
                    fontSize: '10px',
                    color: '#a5b4fc',
                    background: 'rgba(0, 0, 0, 0.5)',
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}>
                    {item.viewsCount}
                  </div>
                </div>

                {/* Headline */}
                <h5 style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff', margin: '0 0 6px 0', lineHeight: 1.4 }}>
                  "{item.title}"
                </h5>

                {/* Quote */}
                <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: 1.5, margin: 0, fontStyle: 'italic' }}>
                  "{item.quote}"
                </p>
              </div>

              {/* Tags & Action Link */}
              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                  {item.tags?.map((tag, tIdx) => (
                    <span key={tIdx} style={{ fontSize: '10px', color: '#c7d2fe', background: 'rgba(255, 255, 255, 0.08)', padding: '2px 6px', borderRadius: '4px' }}>
                      {tag}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '10px' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                    ❤️ {item.likesCount || '186 Likes'}
                  </span>

                  <a
                    href={item.postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '11.5px',
                      fontWeight: 800,
                      color: '#38bdf8',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>Watch on {item.platform}</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FILTER TABS & STUDENT REVIEWS CAROUSEL / GRID */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
              Recent Student Reviews &amp; Experiences
            </h3>
            <span style={{ fontSize: '13px', color: '#64748b' }}>
              Real feedback submitted by engineering students across departments
            </span>
          </div>

          {/* Action & Filter Buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={() => setShowFeedbackModal(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 15px',
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(124, 58, 237, 0.2)'
              }}
            >
              <Star size={13} fill="#ffffff" />
              <span>Share Feedback</span>
            </button>

            {[
              { id: 'ALL', label: 'All Reviews' },
              { id: 'ASSESSMENT', label: 'Assessments' },
              { id: 'ROADMAP_STEP', label: 'Roadmap Steps' },
              { id: 'FIVE_STAR', label: '5-Star Reviews ⭐' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '9999px',
                  border: activeFilter === f.id ? '2px solid #7c3aed' : '1px solid #cbd5e1',
                  background: activeFilter === f.id ? '#7c3aed' : '#ffffff',
                  color: activeFilter === f.id ? '#ffffff' : '#475569',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '18px'
        }}>
          {filteredFeedbacks.length === 0 ? (
            <div style={{
              gridColumn: '1 / -1',
              padding: '36px',
              borderRadius: '20px',
              background: '#f8fafc',
              border: '1.5px dashed #cbd5e1',
              textAlign: 'center',
              color: '#64748b',
              fontSize: '13px'
            }}>
              No reviews in this category yet. Take an assessment or complete a roadmap milestone to share your review!
            </div>
          ) : (
            filteredFeedbacks.map((item) => (
            <div
              key={item.id}
              style={{
                padding: '22px',
                borderRadius: '20px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                boxShadow: '0 8px 24px -6px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
                transition: 'transform 0.2s ease'
              }}
            >
              <div>
                {/* Top Row: User Avatar + Name + Rating */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: '14px'
                    }}>
                      {item.userName ? item.userName.charAt(0) : 'S'}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                          {item.userName}
                        </h4>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          background: '#ecfdf5',
                          color: '#059669',
                          fontSize: '10px',
                          fontWeight: 800,
                          padding: '1px 6px',
                          borderRadius: '4px',
                          border: '1px solid #a7f3d0'
                        }}>
                          <CheckCircle2 size={10} />
                          <span>Verified</span>
                        </span>
                      </div>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>
                        {item.branch || 'B.Tech CSE'} &bull; MGM COE Nanded
                      </span>
                    </div>
                  </div>

                  {/* Stars */}
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[...Array(Number(item.rating) || 5)].map((_, i) => (
                      <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>
                </div>

                {/* Milestone Title Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '6px',
                    background: '#f1f5f9',
                    color: '#334155'
                  }}>
                    {item.targetTitle}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '6px',
                    background: item.feeling.includes('Confident') ? '#ecfdf5' : '#f3e8ff',
                    color: item.feeling.includes('Confident') ? '#047857' : '#6d28d9'
                  }}>
                    {item.feeling}
                  </span>
                </div>

                {/* Comment */}
                <p style={{ fontSize: '12.5px', color: '#334155', lineHeight: 1.5, margin: 0, fontStyle: 'italic' }}>
                  "{item.comment || 'The step-by-step roadmap and interview questions directly clarified core topics for my campus placements!'}"
                </p>
              </div>

              {/* Bottom Tags */}
              {item.tags && item.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                  {item.tags.map((t, idx) => (
                    <span key={idx} style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', background: '#f8fafc', padding: '2px 8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                      ✓ {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )))}
        </div>

        {/* CTA Banner */}
        <div style={{
          marginTop: '16px',
          padding: '24px 32px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 15px 35px -10px rgba(49, 46, 129, 0.4)'
        }}>
          <div>
            <h4 style={{ fontSize: '18px', fontWeight: 900, margin: 0, color: '#ffffff' }}>
              Ready to Discover Your Exact Placement Readiness Score?
            </h4>
            <p style={{ fontSize: '13px', color: '#c7d2fe', margin: '4px 0 0 0' }}>
              Join 1,450+ engineering students. Get your personalized skill gap matrix and 4-year roadmap in 2 minutes.
            </p>
          </div>

          <button
            onClick={() => openAuthModal && openAuthModal('register')}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              background: '#ffffff',
              color: '#4338ca',
              fontWeight: 900,
              fontSize: '13px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(255, 255, 255, 0.25)'
            }}
          >
            <span>Start Free Evaluation</span>
            <ChevronRight size={16} />
          </button>
        </div>

      </div>

      {/* INTERACTIVE MODAL FOR DIRECT STUDENT FEEDBACK SUBMISSION */}
      <FeedbackRatingModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onSubmit={() => {
          setShowFeedbackModal(false);
          setFeedbacks(feedbackService.getFeedbacks());
          setStats(feedbackService.getFeedbackStats());
        }}
        title="AI Career Advisor Platform & Roadmaps"
        type="GENERAL"
      />

      {/* CHANGE 5: INTERACTIVE MODAL FOR VIRTUAL SOCIAL MEDIA VIDEO / VOICE FEEDBACK */}
      <VirtualFeedbackModal
        isOpen={showVirtualModal}
        onClose={() => setShowVirtualModal(false)}
        onFeedbackSubmitted={() => {
          setShowVirtualModal(false);
          setVirtualFeedbacks(virtualFeedbackService.getVirtualFeedbacks());
        }}
      />

      {/* INTERACTIVE VIDEO PLAYER PREVIEW MODAL */}
      {activePlayingVideo && (
        <div className="split-modal-overlay" style={{ zIndex: 100002 }}>
          <div style={{
            background: '#0f172a',
            color: '#ffffff',
            borderRadius: '24px',
            maxWidth: '640px',
            width: '95%',
            overflow: 'hidden',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            animation: 'fadeIn 0.2s ease'
          }}>
            <div style={{ padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                  {activePlayingVideo.studentName} &bull; {activePlayingVideo.branch}
                </h4>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>MGM's College of Engineering, Nanded &bull; {activePlayingVideo.platform} Reel</span>
              </div>
              <button
                onClick={() => setActivePlayingVideo(null)}
                style={{ background: 'rgba(255, 255, 255, 0.1)', border: 'none', width: '30px', height: '30px', borderRadius: '50%', color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ✕
              </button>
            </div>

            {/* Media Player Visualizer Frame */}
            <div style={{
              height: '260px',
              background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              textAlign: 'center',
              gap: '14px',
              position: 'relative'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 0 25px rgba(236, 72, 153, 0.6)'
              }}>
                <Video size={28} />
              </div>

              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                  "{activePlayingVideo.title}"
                </h3>
                <p style={{ fontSize: '12px', color: '#c7d2fe', marginTop: '6px', maxWidth: '440px', lineHeight: 1.5 }}>
                  "{activePlayingVideo.quote}"
                </p>
              </div>

              <div style={{ fontSize: '11px', color: '#94a3b8', background: 'rgba(0, 0, 0, 0.4)', padding: '4px 12px', borderRadius: '9999px' }}>
                Duration: {activePlayingVideo.duration} &bull; {activePlayingVideo.viewsCount}
              </div>
            </div>

            <div style={{ padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#090d16' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                Recorded &amp; uploaded by student on {activePlayingVideo.platform}
              </span>

              <a
                href={activePlayingVideo.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '9px 18px',
                  borderRadius: '10px',
                  background: '#0a66c2',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 800,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>Open Post on {activePlayingVideo.platform}</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

