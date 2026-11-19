import React, { useState } from 'react';
import { Brain, LogIn, UserPlus, LogOut, Menu, X, User, Target, Flame, Star, MessageSquare, Code } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NavigationDrawer } from './NavigationDrawer';
import { FeedbackRatingModal } from './FeedbackRatingModal';
import { PracticePlatformModal } from './PracticePlatformModal';

export const Navbar = ({ activeTab, setActiveTab, openAuthModal }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isPracticeModalOpen, setIsPracticeModalOpen] = useState(false);

  const handleNavClick = (tab) => {
    setActiveTab(tab);
  };

  const handleLogout = () => {
    logout();
    setActiveTab('landing');
  };

  return (
    <header className="navbar-header">
      <div className="nav-container">

        {/* Left Section: Hamburger Menu + Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>

          {/* Hamburger Menu Button (Three lines ☰) */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            title="Open Main Menu"
            style={{
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: '12px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#0f172a',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
            }}
          >
            <Menu size={22} />
          </button>

          {/* Brand Logo */}
          <div
            onClick={() => handleNavClick('landing')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <div className="logo-box">
              <Brain size={24} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '20px', color: '#0f172a', letterSpacing: '-0.02em' }}>
              SkillGap AI
            </span>
          </div>
        </div>



        {/* Auth Buttons / Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Quick Feedback Pill */}
          <button
            onClick={() => setIsFeedbackModalOpen(true)}
            title="Give Feedback & Rate Your Learning Experience"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '9999px',
              background: '#fefce8',
              border: '1px solid #fef08a',
              color: '#a16207',
              fontSize: '11.5px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.15s ease'
            }}
          >
            <Star size={13} fill="#f59e0b" color="#f59e0b" />
            <span>Feedback</span>
          </button>

          {/* Quick Coding Practice Pill (LeetCode & HackerRank) */}
          <button
            onClick={() => setIsPracticeModalOpen(true)}
            title="Hands-on Practice on LeetCode & HackerRank"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '9999px',
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#047857',
              fontSize: '11.5px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.15s ease'
            }}
          >
            <Code size={13} color="#059669" />
            <span>Practice</span>
          </button>

          {isAuthenticated && (() => {
            let streakCount = 1;
            try {
              const saved = localStorage.getItem(`student_streak_auto_${(user?.email || 'guest').toLowerCase()}`);
              if (saved) streakCount = JSON.parse(saved).currentStreak || 1;
            } catch (e) {}

            return (
              <div
                onClick={() => handleNavClick('dashboard')}
                title="Daily Study Consistency Streak - Click to view dashboard"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
                  border: '1px solid #fed7aa',
                  color: '#ea580c',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(249, 115, 22, 0.15)',
                  transition: 'all 0.15s ease'
                }}
              >
                <Flame size={15} color="#ea580c" />
                <span>{streakCount}d Streak 🔥</span>
              </div>
            );
          })()}

          {!isAuthenticated && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => openAuthModal('login')}
                style={{ background: 'none', border: 'none', fontSize: '13px', fontWeight: 700, color: '#475569', padding: '8px 16px', cursor: 'pointer' }}
              >
                Log In
              </button>

              <button
                onClick={() => openAuthModal('register')}
                className="btn-purple-pill"
              >
                <UserPlus size={16} />
                <span>Sign Up</span>
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Slide-out Navigation Drawer (Three-line Menu ☰) */}
      <NavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openAuthModal={openAuthModal}
        onOpenFeedback={() => setIsFeedbackModalOpen(true)}
        onOpenPractice={() => setIsPracticeModalOpen(true)}
      />

      {/* Global Student Feedback & Rating Modal */}
      <FeedbackRatingModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        title="AI Career & Skill Gap Advisor Platform"
        type="GENERAL"
        user={user}
      />

      {/* Global Coding Practice Platforms Modal (LeetCode & HackerRank) */}
      <PracticePlatformModal
        isOpen={isPracticeModalOpen}
        onClose={() => setIsPracticeModalOpen(false)}
        initialSkill="Data Structures & Algorithms"
        initialPlatform="leetcode"
        user={user}
      />
    </header>
  );
};
