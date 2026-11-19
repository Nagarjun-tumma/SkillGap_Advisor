import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { LandingPage } from './components/LandingPage';
import { StudentDashboard } from './components/StudentDashboard';
import { AboutPage } from './components/AboutPage';
import { PersonalizedRoadmap } from './components/PersonalizedRoadmap';
import { UserProgress } from './components/UserProgress';
import { PostLoginPracticeReminderModal } from './components/PostLoginPracticeReminderModal';
import { PracticePlatformModal } from './components/PracticePlatformModal';

const MainApp = () => {
  const { user, isAuthenticated, updateUserSkills, updateUserTargetCompanies } = useAuth();
  const [activeTab, setActiveTab] = useState('landing');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState('login');

  // Change 4: Post-login practice reminder states
  const [showPracticeReminder, setShowPracticeReminder] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);

  const openAuthModal = (tab = 'login') => {
    setAuthModalInitialTab(tab);
    setAuthModalOpen(true);
  };

  const handleSuccessfulLogin = () => {
    setActiveTab('dashboard');
    // Prompt student every time after successful login
    setTimeout(() => {
      setShowPracticeReminder(true);
    }, 500);
  };

  // Trigger post-login practice check once per browser session for already-authenticated users
  useEffect(() => {
    if (isAuthenticated && user) {
      const sessionKey = `practice_reminder_shown_${user.email || 'guest'}`;
      const alreadyShown = sessionStorage.getItem(sessionKey);
      if (!alreadyShown) {
        sessionStorage.setItem(sessionKey, 'true');
        const timer = setTimeout(() => {
          setShowPracticeReminder(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, user]);

  const handleSkillCompleted = (skillName) => {
    const currentSkills = user?.acquiredSkills || [];
    const exists = currentSkills.some(s => (typeof s === 'string' ? s : s.skillName).toLowerCase() === skillName.toLowerCase());
    if (!exists) {
      const updated = [...currentSkills, { skillId: Date.now(), skillName: skillName, proficiency: 'INTERMEDIATE' }];
      updateUserSkills(updated);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#070a12] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openAuthModal={openAuthModal}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        {activeTab === 'landing' && (
          <LandingPage
            openAuthModal={openAuthModal}
            setActiveTab={setActiveTab}
            onSelectRole={() => {
              if (isAuthenticated) {
                setActiveTab('dashboard');
              } else {
                openAuthModal('register');
              }
            }}
          />
        )}

        {activeTab === 'about' && (
          <AboutPage openAuthModal={openAuthModal} />
        )}

        {activeTab === 'dashboard' && (
          isAuthenticated ? (
            <StudentDashboard 
              onNavigateRoadmap={() => setActiveTab('personalized_roadmap')} 
              onNavigateProgress={() => setActiveTab('progress')}
            />
          ) : (
            <div className="max-w-md mx-auto my-20 p-8 glass-panel text-center space-y-4">
              <h2 className="text-2xl font-bold text-white">Student Login Required</h2>
              <p className="text-xs text-slate-300">
                Please log in or create a student account with OTP email verification to access your live dashboard.
              </p>
              <button
                onClick={() => openAuthModal('login')}
                className="btn btn-glow w-full py-3 font-bold text-sm"
              >
                Log In to Access Dashboard
              </button>
            </div>
          )
        )}

        {activeTab === 'progress' && (
          isAuthenticated ? (
            <div className="max-w-6xl mx-auto my-8 px-4">
              <UserProgress
                onNavigateRoadmap={() => setActiveTab('personalized_roadmap')}
                onNavigateDashboard={() => setActiveTab('dashboard')}
              />
            </div>
          ) : (
            <div className="max-w-md mx-auto my-20 p-8 glass-panel text-center space-y-4">
              <h2 className="text-2xl font-bold text-white">Student Login Required</h2>
              <p className="text-xs text-slate-300">
                Please log in to view your detailed skill progress and placement readiness analytics.
              </p>
              <button
                onClick={() => openAuthModal('login')}
                className="btn btn-glow w-full py-3 font-bold text-sm"
              >
                Log In to View Progress
              </button>
            </div>
          )
        )}

        {activeTab === 'personalized_roadmap' && (
          isAuthenticated ? (
            <div className="max-w-6xl mx-auto my-8 px-4">
              <PersonalizedRoadmap
                targetRoleId={Number(user?.targetRoleId || 2)}
                acquiredSkills={user?.acquiredSkills || []}
                onSkillCompleted={handleSkillCompleted}
                userTargetCompanies={user?.targetCompanies || []}
                onUpdateTargetCompanies={updateUserTargetCompanies}
              />
            </div>
          ) : (
            <div className="max-w-md mx-auto my-20 p-8 glass-panel text-center space-y-4">
              <h2 className="text-2xl font-bold text-white">Student Login Required</h2>
              <p className="text-xs text-slate-300">
                Please log in to view your personalized step-by-step career learning roadmap.
              </p>
              <button
                onClick={() => openAuthModal('login')}
                className="btn btn-glow w-full py-3 font-bold text-sm"
              >
                Log In to View Roadmap
              </button>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Authentication & OTP Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authModalInitialTab}
        onSuccessLogin={handleSuccessfulLogin}
      />

      {/* Change 4: Post-Login Coding Practice Reminder Modal */}
      <PostLoginPracticeReminderModal
        isOpen={showPracticeReminder}
        onClose={() => setShowPracticeReminder(false)}
        user={user}
        onOpenScoreSubmission={() => {
          setShowPracticeReminder(false);
          setShowScoreModal(true);
        }}
      />

      {/* Practice Score & Screenshot Submission Modal */}
      <PracticePlatformModal
        isOpen={showScoreModal}
        onClose={() => setShowScoreModal(false)}
        user={user}
        onPracticeSubmitted={(res) => {
          if (res && res.skillName) {
            handleSkillCompleted(res.skillName);
          }
        }}
      />

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
