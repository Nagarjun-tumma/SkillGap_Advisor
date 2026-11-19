import React, { useState } from 'react';
import { Brain, Sparkles, ArrowRight, CheckCircle2, Award, ChevronRight, Target, Rocket, ShieldCheck, BookOpen } from 'lucide-react';
import { SiteUsageAndReviewsShowcase } from './SiteUsageAndReviewsShowcase';

export const LandingPage = ({ openAuthModal, onSelectRole, setActiveTab }) => {
  const [selectedBranch, setSelectedBranch] = useState('CSE');
  const [demoSelectedSkills, setDemoSelectedSkills] = useState(['Java', 'SQL & MySQL', 'Data Structures']);

  const branches = [
    { code: 'CSE', name: 'Computer Science', icon: '💻', roles: ['Full Stack Java Dev', 'AI Engineer', 'DevOps Specialist'], avgPackage: '₹12 - 24 LPA' },
    { code: 'AIDS', name: 'AI & Data Science', icon: '🧠', roles: ['Machine Learning Engineer', 'Data Scientist', 'NLP Architect'], avgPackage: '₹14 - 28 LPA' },
    { code: 'ECE', name: 'Electronics & Comm.', icon: '⚡', roles: ['Embedded Systems Dev', 'IoT Specialist', 'VLSI Design Engineer'], avgPackage: '₹9 - 18 LPA' },
    { code: 'EEE', name: 'Electrical & Electronics', icon: '🔌', roles: ['Power Systems Analyst', 'Control Systems Engineer', 'Robotics Specialist'], avgPackage: '₹8 - 16 LPA' },
    { code: 'MECH', name: 'Mechanical', icon: '⚙️', roles: ['CAD/CAM Engineer', 'Mechatronics Dev', 'Automotive Automation'], avgPackage: '₹7 - 15 LPA' },
  ];

  const demoSkillsList = [
    'Java', 'Python', 'C++', 'React.js', 'Spring Boot', 'SQL & MySQL',
    'Machine Learning', 'Docker & Kubernetes', 'Data Structures', 'Embedded C'
  ];

  const toggleDemoSkill = (skill) => {
    if (demoSelectedSkills.includes(skill)) {
      setDemoSelectedSkills(demoSelectedSkills.filter(s => s !== skill));
    } else {
      setDemoSelectedSkills([...demoSelectedSkills, skill]);
    }
  };

  const calculateDemoScore = () => {
    const totalRequired = 5;
    const matched = demoSelectedSkills.length;
    return Math.min(100, Math.round((matched / totalRequired) * 100));
  };

  const currentBranchObj = branches.find(b => b.code === selectedBranch);

  return (
    <div>

      {/* --- HERO BANNER (VIBRANT GRADIENT - MATCHING SCREENSHOT 2) --- */}
      <section className="hero-container">
        <div className="hero-content">

          <h1 className="hero-title">
            Bridge Your Skill Gap &amp; Build Your Engineering Career
          </h1>

          <p className="hero-subtitle">
            Tell us your engineering branch, current skills, and target role — our AI builds a personalized skill gap analysis and 4-year career roadmap so you excel in campus placements.
          </p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginTop: '10px' }}>
            <button
              onClick={() => openAuthModal('register')}
              className="hero-btn-white"
            >
              <span>🤖 Evaluate Skill Gap</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className="hero-btn-glass"
            >
              <span>Explore Features</span>
            </button>
          </div>

          {/* 3 Horizontal Stat Counters Side-by-Side */}
          <div className="hero-stats-row">
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Students</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Career Roles</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">98%</div>
              <div className="stat-label">Match Rate</div>
            </div>
          </div>

        </div>
      </section>

      {/* --- WHY CHOOSE SKILLGAP AI? (WHITE BACKGROUND SECTION) --- */}
      <section className="section-wrapper">
        <div className="section-header">
          <h2 className="section-title">Why Choose SkillGap AI?</h2>
          <p className="section-subtitle">Everything you need to master your engineering campus placements</p>
        </div>

        <div className="grid grid-cols-4 gap-6">

          <div className="feature-card">
            <div className="icon-box-purple">
              <Target size={24} />
            </div>
            <h3 style={{ fontWeight: 800, fontSize: '17px', color: '#0f172a' }}>Automated Skill Gap Engine</h3>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>
              Compares your skills against tier-1 company placement requirements to highlight missing technical gaps.
            </p>
          </div>

          <div className="feature-card">
            <div className="icon-box-blue">
              <BookOpen size={24} />
            </div>
            <h3 style={{ fontWeight: 800, fontSize: '17px', color: '#0f172a' }}>4-Year Milestone Roadmaps</h3>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>
              Structured execution timelines from Year 1 fundamentals up to Year 4 placement mock interviews.
            </p>
          </div>

          <div className="feature-card">
            <div className="icon-box-emerald">
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontWeight: 800, fontSize: '17px', color: '#0f172a' }}>6-Digit Email OTP Security</h3>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>
              Authentic student verification using JavaMailSender 6-digit numeric OTP validation.
            </p>
          </div>

          <div className="feature-card">
            <div className="icon-box-amber">
              <Rocket size={24} />
            </div>
            <h3 style={{ fontWeight: 800, fontSize: '17px', color: '#0f172a' }}>Personalized Study Plan</h3>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>
              Curated course recommendations, project ideas, and certifications tailored for your missing skills.
            </p>
          </div>

        </div>
      </section>

      {/* --- SITE USAGE, PIE CHARTS, BAR GRAPHS & STUDENT REVIEWS --- */}
      <SiteUsageAndReviewsShowcase openAuthModal={openAuthModal} />

      {/* --- BRANCH EXPLORER SECTION --- */}
      <section className="section-wrapper" style={{ paddingTop: '0' }}>
        <div className="section-header">
          <h2 className="section-title">Explore Engineering Streams</h2>
          <p className="section-subtitle">In-demand placement tracks and salary benchmarks by department</p>
        </div>

        {/* Branch Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyWait: 'center', justifyContent: 'center', gap: '10px', marginBottom: '30px' }}>
          {branches.map((b) => (
            <button
              key={b.code}
              onClick={() => setSelectedBranch(b.code)}
              className={`branch-pill ${selectedBranch === b.code ? 'active' : ''}`}
            >
              <span>{b.icon}</span>
              <span style={{ marginLeft: '6px' }}>{b.name}</span>
            </button>
          ))}
        </div>

        {/* Selected Branch Box */}
        <div className="feature-card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '32px' }}>{currentBranchObj?.icon}</span>
              <div>
                <h3 style={{ fontWeight: 800, fontSize: '20px', color: '#0f172a' }}>{currentBranchObj?.name} Department</h3>
                <span style={{ fontSize: '13px', color: '#64748b' }}>Mapped career tracks &amp; skill requirements</span>
              </div>
            </div>
            <div style={{ padding: '8px 16px', borderRadius: '12px', background: '#ecfdf5', border: '1px solid #a7f3d0', textAlign: 'right' }}>
              <span style={{ fontSize: '11px', color: '#059669', fontWeight: 800, textTransform: 'uppercase', display: 'block' }}>Avg Package Range</span>
              <span style={{ fontSize: '18px', fontWeight: 900, color: '#047857' }}>{currentBranchObj?.avgPackage}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4" style={{ marginTop: '16px' }}>
            {currentBranchObj?.roles.map((roleName, idx) => (
              <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContext: 'space-between', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 10px', borderRadius: '20px', background: '#f3e8ff', color: '#7c3aed' }}>Track #{idx + 1}</span>
                  <Award size={18} color="#d97706" />
                </div>
                <h4 style={{ fontWeight: 800, fontSize: '15px', color: '#0f172a' }}>{roleName}</h4>
                <button
                  onClick={() => openAuthModal('register')}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', background: '#ffffff', border: '1px solid #cbd5e1', fontSize: '12px', fontWeight: 700, color: '#7c3aed', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <span>Check Skill Matrix</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
