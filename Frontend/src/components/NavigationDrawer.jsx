import React from 'react';
import {
  Home, LayoutDashboard, Target, Map, Info, LogOut,
  X, User, Sparkles, BookOpen, ChevronRight, ShieldCheck, TrendingUp, Star, Code, Video
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const NavigationDrawer = ({ isOpen, onClose, activeTab, setActiveTab, openAuthModal, onOpenFeedback, onOpenPractice }) => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isOpen) return null;

  const handleNav = (tab) => {
    setActiveTab(tab);
    onClose();
  };

  const handleLogout = () => {
    logout();
    setActiveTab('landing');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      zIndex: 99999,
      display: 'flex',
      animation: 'fadeIn 0.2s ease-out'
    }}>

      {/* Sliding Drawer Container */}
      <div style={{
        width: '320px',
        maxWidth: '85vw',
        height: '100%',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '10px 0 30px rgba(0, 0, 0, 0.25)',
        animation: 'slideRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative'
      }}>

        {/* Drawer Top Header - User Profile or Guest Info */}
        <div style={{
          padding: '28px 24px 20px 24px',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          color: '#ffffff',
          position: 'relative'
        }}>

          {/* Close X Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>

          {isAuthenticated && user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
                color: '#ffffff',
                fontWeight: 900,
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)'
              }}>
                {user.fullName ? user.fullName.substring(0, 2).toUpperCase() : 'ST'}
              </div>

              <div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>
                  {user.fullName}
                </div>
                <div style={{ fontSize: '12px', color: '#a5b4fc', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.email}
                </div>
              </div>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 700, color: '#6ee7b7', background: 'rgba(110, 231, 183, 0.15)', padding: '2px 8px', borderRadius: '6px', width: 'fit-content', marginTop: '4px' }}>
                <ShieldCheck size={12} />
                <span>Verified Student</span>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
                Welcome to SkillGap AI
              </div>
              <p style={{ fontSize: '12px', color: '#a5b4fc', margin: 0 }}>
                Log in or sign up to access your live placement dashboard &amp; personalized learning roadmap.
              </p>
            </div>
          )}

        </div>

        {/* Navigation Items List */}
        <div style={{ padding: '20px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto' }}>

          {/* DASHBOARD */}
          <button
            onClick={() => {
              if (isAuthenticated) {
                handleNav('dashboard');
              } else {
                onClose();
                openAuthModal('login');
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '14px 18px',
              borderRadius: '14px',
              border: 'none',
              background: activeTab === 'dashboard' ? '#f1f5f9' : 'transparent',
              color: activeTab === 'dashboard' ? '#4338ca' : '#334155',
              fontWeight: activeTab === 'dashboard' ? 800 : 700,
              fontSize: '14px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
          >
            <LayoutDashboard size={20} color={activeTab === 'dashboard' ? '#4338ca' : '#64748b'} />
            <span style={{ letterSpacing: '0.03em' }}>DASHBOARD</span>
          </button>

          {/* MY PROGRESS */}
          <button
            onClick={() => {
              if (isAuthenticated) {
                handleNav('progress');
              } else {
                onClose();
                openAuthModal('login');
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '14px 18px',
              borderRadius: '14px',
              border: 'none',
              background: activeTab === 'progress' ? '#ecfdf5' : 'transparent',
              color: activeTab === 'progress' ? '#059669' : '#334155',
              fontWeight: activeTab === 'progress' ? 800 : 700,
              fontSize: '14px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
          >
            <TrendingUp size={20} color={activeTab === 'progress' ? '#059669' : '#64748b'} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ letterSpacing: '0.03em' }}>MY PROGRESS</span>
              <span style={{ fontSize: '10px', color: '#059669', fontWeight: 700 }}>Readiness Score &amp; Badges</span>
            </div>
          </button>

          {/* PERSONALIZED ROADMAP */}
          <button
            onClick={() => {
              if (isAuthenticated) {
                handleNav('personalized_roadmap');
              } else {
                onClose();
                openAuthModal('login');
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '14px 18px',
              borderRadius: '14px',
              border: 'none',
              background: activeTab === 'personalized_roadmap' ? '#f3e8ff' : 'transparent',
              color: activeTab === 'personalized_roadmap' ? '#7c3aed' : '#334155',
              fontWeight: activeTab === 'personalized_roadmap' ? 800 : 700,
              fontSize: '14px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
          >
            <Target size={20} color={activeTab === 'personalized_roadmap' ? '#7c3aed' : '#64748b'} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ letterSpacing: '0.03em' }}>PERSONALIZED ROADMAP</span>
              <span style={{ fontSize: '10px', color: '#7c3aed', fontWeight: 700 }}>What Should I Learn First?</span>
            </div>
          </button>



          {/* CODING PRACTICE HUB */}
          <button
            onClick={() => {
              onClose();
              if (onOpenPractice) onOpenPractice();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '14px 18px',
              borderRadius: '14px',
              border: 'none',
              background: '#ecfdf5',
              color: '#047857',
              fontWeight: 800,
              fontSize: '14px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
          >
            <Code size={20} color="#059669" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ letterSpacing: '0.03em' }}>CODING PRACTICE HUB</span>
              <span style={{ fontSize: '10px', color: '#059669', fontWeight: 700 }}>LeetCode &amp; HackerRank Prep</span>
            </div>
          </button>

          {/* STUDENT FEEDBACK & RATINGS */}
          <button
            onClick={() => {
              onClose();
              if (onOpenFeedback) onOpenFeedback();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '14px 18px',
              borderRadius: '14px',
              border: 'none',
              background: '#fefce8',
              color: '#a16207',
              fontWeight: 800,
              fontSize: '14px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
          >
            <Star size={20} fill="#f59e0b" color="#f59e0b" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ letterSpacing: '0.03em' }}>STUDENT FEEDBACK</span>
              <span style={{ fontSize: '10px', color: '#b45309', fontWeight: 700 }}>Rate Understanding &amp; Feelings</span>
            </div>
          </button>

          {/* CAMPUS VIDEO WALL */}
          <button
            onClick={() => {
              handleNav('landing');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '14px 18px',
              borderRadius: '14px',
              border: 'none',
              background: '#fdf2f8',
              color: '#db2777',
              fontWeight: 800,
              fontSize: '14px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
          >
            <Video size={20} color="#db2777" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ letterSpacing: '0.03em' }}>CAMPUS VIDEO WALL</span>
              <span style={{ fontSize: '10px', color: '#db2777', fontWeight: 700 }}>Peer Social Media Reviews</span>
            </div>
          </button>

          {/* ABOUT US */}
          <button
            onClick={() => handleNav('about')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '14px 18px',
              borderRadius: '14px',
              border: 'none',
              background: activeTab === 'about' ? '#f1f5f9' : 'transparent',
              color: activeTab === 'about' ? '#4338ca' : '#334155',
              fontWeight: activeTab === 'about' ? 800 : 700,
              fontSize: '14px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
          >
            <Info size={20} color={activeTab === 'about' ? '#4338ca' : '#64748b'} />
            <span style={{ letterSpacing: '0.03em' }}>ABOUT</span>
          </button>

          <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '12px 0' }} />

          {/* SIGN OUT / LOGIN */}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px 18px',
                borderRadius: '14px',
                border: 'none',
                background: '#fef2f2',
                color: '#dc2626',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <LogOut size={20} color="#dc2626" />
              <span style={{ letterSpacing: '0.03em' }}>SIGN OUT</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                openAuthModal('login');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px 18px',
                borderRadius: '14px',
                border: 'none',
                background: '#4338ca',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <User size={20} color="#ffffff" />
              <span style={{ letterSpacing: '0.03em' }}>LOG IN / SIGN UP</span>
            </button>
          )}

        </div>

      </div>

    </div>
  );
};
