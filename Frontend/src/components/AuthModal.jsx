import React, { useState, useEffect, useRef } from 'react';
import { X, AlertCircle, ArrowRight, RefreshCw, KeyRound, Sparkles, Brain, Building2, Plus, Check, Search } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';

const BRANCH_CAREER_ROLES = {
  'Computer Science & Engineering': [
    { id: '2', name: 'Full Stack Java Developer' },
    { id: '1', name: 'AI & Machine Learning Engineer' },
    { id: '4', name: 'Data Scientist & Analyst' },
    { id: '5', name: 'DevOps & Cloud Engineer' }
  ],
  'Artificial Intelligence & Data Science': [
    { id: '1', name: 'AI & Machine Learning Engineer' },
    { id: '4', name: 'Data Scientist & Analyst' },
    { id: '2', name: 'Full Stack Java Developer' },
    { id: '5', name: 'DevOps & Cloud Engineer' }
  ],
  'Electronics & Communication': [
    { id: '3', name: 'Embedded Systems & IoT Engineer' },
    { id: '1', name: 'AI & Machine Learning Engineer (Tech Hardware)' },
    { id: '5', name: 'DevOps & Cloud Engineer' },
    { id: '2', name: 'Full Stack Java Developer (Tech Transition)' }
  ],
  'Electrical & Electronics': [
    { id: '3', name: 'Embedded Systems & IoT Engineer' },
    { id: '5', name: 'DevOps & Cloud Engineer' },
    { id: '1', name: 'AI & Machine Learning Engineer' },
    { id: '2', name: 'Full Stack Java Developer (Tech Transition)' }
  ],
  'Civil Engineering': [
    { id: '6', name: 'Civil Structural BIM & GIS Engineer' },
    { id: '7', name: 'Smart Infrastructure & Construction Specialist' },
    { id: '3', name: 'Embedded Systems & IoT Engineer (Smart Infra)' },
    { id: '4', name: 'Data Scientist & Analyst (Infra Data Analytics)' }
  ],
  'Mechanical Engineering': [
    { id: '8', name: 'Robotics & CAD Automation Engineer' },
    { id: '3', name: 'Embedded Systems & IoT Engineer (Mechatronics)' },
    { id: '4', name: 'Data Scientist & Analyst (Industrial Analytics)' },
    { id: '5', name: 'DevOps & Cloud Engineer (Smart Manufacturing)' }
  ]
};

const ALL_CAREER_ROLES = [
  { id: '2', name: 'Full Stack Java Developer', category: 'Software' },
  { id: '1', name: 'AI & Machine Learning Engineer', category: 'Data & AI' },
  { id: '4', name: 'Data Scientist & Analyst', category: 'Data & AI' },
  { id: '5', name: 'DevOps & Cloud Engineer', category: 'Software & Cloud' },
  { id: '3', name: 'Embedded Systems & IoT Engineer', category: 'Hardware & IoT' },
  { id: '8', name: 'Robotics & CAD Automation Engineer', category: 'Mechanical & Robotics' },
  { id: '6', name: 'Civil Structural BIM & GIS Engineer', category: 'Civil & Infra' },
  { id: '7', name: 'Smart Infrastructure & Construction Specialist', category: 'Civil & Smart Cities' }
];

export const AuthModal = ({ isOpen, onClose, initialTab = 'login', onSuccessLogin }) => {
  const { checkEmail, sendOtp, register, login } = useAuth();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [step, setStep] = useState('form');

  // Form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [engineeringBranch, setEngineeringBranch] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [targetRoleId, setTargetRoleId] = useState('');

  // Dream companies selection (1, 2 or many) - starts empty
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [customCompanyInput, setCustomCompanyInput] = useState('');

  // Available roles: branch recommended + other cross-branch tracks
  const branchRoles = engineeringBranch ? (BRANCH_CAREER_ROLES[engineeringBranch] || []) : [];
  const otherRoles = ALL_CAREER_ROLES.filter(r => !branchRoles.some(br => String(br.id) === String(r.id)));

  const handleBranchChange = (newBranch) => {
    setEngineeringBranch(newBranch);
  };

  const toggleCompany = (compName) => {
    if (selectedCompanies.includes(compName)) {
      setSelectedCompanies(selectedCompanies.filter(c => c !== compName));
    } else {
      setSelectedCompanies([...selectedCompanies, compName]);
    }
  };

  const removeCompany = (compName) => {
    setSelectedCompanies(selectedCompanies.filter(c => c !== compName));
  };

  const handleAddCustomCompany = (e) => {
    if (e) e.preventDefault();
    const trimmed = customCompanyInput.trim();
    if (!trimmed) return;
    if (!selectedCompanies.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      setSelectedCompanies([...selectedCompanies, trimmed]);
    }
    setCustomCompanyInput('');
  };

  // Statuses
  const [emailAvailable, setEmailAvailable] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [devOtpCode, setDevOtpCode] = useState('');
  const otpInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

  // Password strength helper
  const getPasswordStrength = (pass) => {
    if (!pass) return null;
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { label: 'Weak', color: '#ef4444', percent: '33%' };
    if (score <= 3) return { label: 'Moderate', color: '#f59e0b', percent: '66%' };
    return { label: 'Strong', color: '#10b981', percent: '100%' };
  };

  const isValidEmailFormat = (emailStr) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test((emailStr || '').trim());
  };

  useEffect(() => {
    setActiveTab(initialTab);
    setStep('form');
    setErrorMessage('');
  }, [initialTab, isOpen]);

  // Debounced Email check
  useEffect(() => {
    if (activeTab === 'register') {
      if (isValidEmailFormat(email)) {
        const timer = setTimeout(async () => {
          try {
            const res = await checkEmail(email);
            if (res.validFormat === false) {
              setEmailAvailable(false);
              setErrorMessage('Please enter a valid email address (e.g. student@college.edu).');
            } else {
              setEmailAvailable(res.available);
              if (!res.available) {
                setErrorMessage('This email is already registered. Please log in.');
              } else {
                setErrorMessage('');
              }
            }
          } catch (e) {
            console.error(e);
          }
        }, 400);
        return () => clearTimeout(timer);
      } else {
        setEmailAvailable(null);
      }
    } else {
      setEmailAvailable(null);
    }
  }, [email, activeTab]);

  if (!isOpen) return null;

  const handleSendOtpStep = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const nameRegex = /^[a-zA-Z][a-zA-Z\s.'-]*$/;
    if (!fullName.trim() || fullName.trim().length < 3 || !nameRegex.test(fullName.trim())) {
      setErrorMessage('Full name must start with letters and contain valid characters only (e.g. Alex Vance). Numbers like 12345 are not allowed.');
      return;
    }
    if (!isValidEmailFormat(email)) {
      setErrorMessage('Please enter a valid email address (e.g. student@college.edu).');
      return;
    }
    if (emailAvailable === false) {
      setErrorMessage('This email is already registered. Please log in.');
      return;
    }
    if (!engineeringBranch) {
      setErrorMessage('Please select your Engineering Branch.');
      return;
    }
    if (!academicYear) {
      setErrorMessage('Please select your Academic Year.');
      return;
    }
    if (!targetRoleId) {
      setErrorMessage('Please select your Target Career Track.');
      return;
    }
    if (!selectedCompanies || selectedCompanies.length === 0) {
      setErrorMessage('Please select at least 1 dream company (you can choose 1, 2, or many companies).');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const otpRes = await sendOtp(email);
      setDevOtpCode(otpRes.devOtp || '123456');
      setStep('otp');
      setCanResend(true);
      setOtpDigits(['', '', '', '', '', '']);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...otpDigits];
    updated[index] = value.slice(-1);
    setOtpDigits(updated);
    if (value && index < 5) otpInputRefs[index + 1].current?.focus();
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 6) {
      setErrorMessage('Please enter all 6 digits of the OTP code.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      await register({
        fullName,
        email,
        password,
        engineeringBranch,
        academicYear,
        targetRoleId: Number(targetRoleId),
        targetCompanies: selectedCompanies,
        otpCode: fullOtp
      });

      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      onSuccessLogin();
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter email and password.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      await login(email, password);
      onSuccessLogin();
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
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
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        maxWidth: '900px',
        maxHeight: '90vh',
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.4)',
        position: 'relative'
      }}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748b',
            zIndex: 10
          }}
        >
          <X size={20} />
        </button>

        {/* --- LEFT SIDE BANNER (PURPLE/BLUE GRADIENT) --- */}
        <div style={{
          flex: '1',
          background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
          color: '#ffffff',
          padding: '40px',
          display: window.innerWidth < 768 ? 'none' : 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Brain size={24} color="#ffffff" />
              </div>
              <span style={{ fontWeight: 800, fontSize: '22px', letterSpacing: '-0.02em' }}>SkillGap AI</span>
            </div>

            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 800, lineHeight: 1.3, color: '#ffffff' }}>
                Your Smart Companion for Engineering Career Success
              </h2>
              <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.85)', marginTop: '8px', lineHeight: 1.5 }}>
                Bridge your academic curriculum with real-world industry placement requirements.
              </p>
            </div>

            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', listStyle: 'none', padding: 0 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>✓</div>
                <span>Track placement readiness score live</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>✓</div>
                <span>6-Digit Email OTP instant security</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>✓</div>
                <span>Personalized AI study plan &amp; recommendations</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>✓</div>
                <span>Choose 1, 2 or many dream company tracks</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>✓</div>
                <span>4-Year milestone career roadmaps</span>
              </li>
            </ul>
          </div>

          <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)' }}>
            © SkillGap AI Advisor • Built for Engineering Students
          </div>
        </div>

        {/* --- RIGHT SIDE FORM (WHITE BACKGROUND) --- */}
        <div style={{
          flex: '1.2',
          padding: '40px',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflowY: 'auto'
        }}>
          
          {/* Header */}
          <div style={{ marginBottom: '24px', textAlign: 'left' }}>
            <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a' }}>
              {activeTab === 'login' ? 'Welcome back 👋' : 'Create Student Account 🎓'}
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
              {activeTab === 'login' 
                ? 'Log in to continue your placement evaluation.' 
                : 'Sign up with your engineering branch & email OTP verification.'}
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div style={{ marginBottom: '16px', padding: '12px', borderRadius: '12px', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {step === 'form' && activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu"
                  required
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '14px', color: '#0f172a', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '14px', color: '#0f172a', outline: 'none' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(139, 92, 246, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '8px'
                }}
              >
                {loading ? <RefreshCw size={16} className="animate-spin" /> : <span>Log In →</span>}
              </button>

              <div style={{ textAlign: 'center', fontSize: '13px', color: '#64748b', marginTop: '12px' }}>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setActiveTab('register'); setErrorMessage(''); }}
                  style={{ background: 'none', border: 'none', color: '#7c3aed', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Sign up
                </button>
              </div>
            </form>
          )}

          {/* REGISTER FORM */}
          {step === 'form' && activeTab === 'register' && (
            <form onSubmit={handleSendOtpStep} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Vance"
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '13px', color: '#0f172a', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Email Address (OTP Verified)</label>
                  {email && !isValidEmailFormat(email) && (
                    <span style={{ fontSize: '10px', color: '#dc2626', fontWeight: 700 }}>✕ Invalid Email Format</span>
                  )}
                  {email && isValidEmailFormat(email) && emailAvailable === true && (
                    <span style={{ fontSize: '10px', color: '#059669', fontWeight: 700 }}>✓ Email Available</span>
                  )}
                  {email && isValidEmailFormat(email) && emailAvailable === false && (
                    <span style={{ fontSize: '10px', color: '#dc2626', fontWeight: 700 }}>✕ Already Registered</span>
                  )}
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.v@engineering.edu"
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '13px', color: '#0f172a', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Branch</label>
                  <select
                    value={engineeringBranch}
                    onChange={(e) => handleBranchChange(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '12px', color: engineeringBranch ? '#0f172a' : '#64748b', outline: 'none' }}
                  >
                    <option value="" disabled>-- Select Branch --</option>
                    <option value="Computer Science & Engineering">CSE</option>
                    <option value="Artificial Intelligence & Data Science">AI & DS</option>
                    <option value="Electronics & Communication">ECE</option>
                    <option value="Electrical & Electronics">EEE</option>
                    <option value="Mechanical Engineering">MECH</option>
                    <option value="Civil Engineering">CIVIL</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Year</label>
                  <select
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '12px', color: academicYear ? '#0f172a' : '#64748b', outline: 'none' }}
                  >
                    <option value="" disabled>-- Select Year --</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Target Career Track</label>
                  {engineeringBranch && (
                    <span style={{ fontSize: '10px', color: '#7c3aed', fontWeight: 700 }}>Tailored for {engineeringBranch}</span>
                  )}
                </div>
                <select
                  value={targetRoleId}
                  onChange={(e) => setTargetRoleId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#f8fafc',
                    fontSize: '12px',
                    color: targetRoleId ? '#0f172a' : '#64748b',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="" disabled>-- Select Target Career Track --</option>
                  {engineeringBranch ? (
                    <>
                      <optgroup label={`Recommended for ${engineeringBranch}`}>
                        {branchRoles.map(role => (
                          <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                      </optgroup>
                      {otherRoles.length > 0 && (
                        <optgroup label="Other Career Tracks (Cross-Branch Transitions)">
                          {otherRoles.map(role => (
                            <option key={role.id} value={role.id}>{role.name}</option>
                          ))}
                        </optgroup>
                      )}
                    </>
                  ) : (
                    ALL_CAREER_ROLES.map(role => (
                      <option key={role.id} value={role.id}>{role.name} ({role.category})</option>
                    ))
                  )}
                </select>
              </div>

              {/* Simplified Clean Dream Companies Section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                    Dream Companies <span style={{ fontWeight: 400, color: '#64748b' }}>(Select 1, 2 or many)</span>
                  </label>
                  {selectedCompanies.length > 0 && (
                    <span style={{ fontSize: '11px', color: '#7c3aed', fontWeight: 700 }}>
                      {selectedCompanies.length} Selected
                    </span>
                  )}
                </div>

                {/* Selected Companies Chips - only shown if student selected companies */}
                {selectedCompanies.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {selectedCompanies.map(comp => (
                      <span
                        key={comp}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          background: '#f3e8ff',
                          color: '#7c3aed',
                          border: '1px solid #d8b4fe',
                          fontSize: '12px',
                          fontWeight: 700
                        }}
                      >
                        <span>{comp}</span>
                        <button
                          type="button"
                          onClick={() => removeCompany(comp)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#7c3aed',
                            display: 'flex',
                            alignItems: 'center',
                            padding: 0
                          }}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Single clean input to type or add any company */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="text"
                    value={customCompanyInput}
                    onChange={(e) => setCustomCompanyInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomCompany();
                      }
                    }}
                    placeholder="Type dream company (e.g. Google, TCS, Amazon)..."
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#f8fafc',
                      fontSize: '13px',
                      color: '#0f172a',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomCompany}
                    style={{
                      padding: '0 16px',
                      borderRadius: '12px',
                      background: '#7c3aed',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    + Add
                  </button>
                </div>

                {/* Quick Selection Pills */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '2px' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Quick pick:</span>
                  {['Google', 'Microsoft', 'Amazon', 'TCS', 'Infosys', 'Meta', 'Accenture', 'Wipro'].map(name => {
                    const isSelected = selectedCompanies.includes(name);
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => toggleCompany(name)}
                        style={{
                          padding: '3px 8px',
                          borderRadius: '8px',
                          border: isSelected ? '1px solid #7c3aed' : '1px solid #cbd5e1',
                          background: isSelected ? '#ede9fe' : '#ffffff',
                          color: isSelected ? '#6d28d9' : '#475569',
                          fontSize: '11px',
                          fontWeight: isSelected ? 700 : 500,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {isSelected ? `✓ ${name}` : `+ ${name}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '13px', color: '#0f172a', outline: 'none' }}
                />
                {password && (
                  <div style={{ marginTop: '2px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                      <span style={{ color: '#64748b' }}>Password Strength:</span>
                      <span style={{ fontWeight: 700, color: getPasswordStrength(password).color }}>
                        {getPasswordStrength(password).label}
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '5px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: getPasswordStrength(password).percent,
                          height: '100%',
                          backgroundColor: getPasswordStrength(password).color,
                          transition: 'all 0.3s ease'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '13px', color: '#0f172a', outline: 'none' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading || emailAvailable === false}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(139, 92, 246, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '6px'
                }}
              >
                {loading ? <RefreshCw size={16} className="animate-spin" /> : <span>Verify Email &amp; Get OTP →</span>}
              </button>

              <div style={{ textAlign: 'center', fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); setErrorMessage(''); }}
                  style={{ background: 'none', border: 'none', color: '#7c3aed', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Log in
                </button>
              </div>
            </form>
          )}

          {/* OTP VERIFICATION STEP */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyAndRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f3e8ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                <KeyRound size={24} />
              </div>

              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>Enter OTP Code</h3>
                <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                  6-Digit code sent to <strong style={{ color: '#7c3aed' }}>{email}</strong>
                </p>
              </div>

              {devOtpCode && (
                <div style={{
                  background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
                  border: '1.5px dashed #8b5cf6',
                  borderRadius: '14px',
                  padding: '12px 16px',
                  margin: '4px 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px'
                }}>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ color: '#6d28d9', fontWeight: 800, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>⚡ Instant Demo OTP:</span>
                      <span style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '16px', color: '#5b21b6', letterSpacing: '1px', background: '#ffffff', padding: '2px 8px', borderRadius: '6px', border: '1px solid #c4b5fd' }}>
                        {devOtpCode}
                      </span>
                    </div>
                    <span style={{ color: '#64748b', fontSize: '10.5px' }}>
                      (Provided for rapid testing &amp; campus evaluation)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const digits = String(devOtpCode).split('').slice(0, 6);
                      setOtpDigits(digits);
                    }}
                    style={{
                      background: '#7c3aed',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      fontSize: '11px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(124, 58, 237, 0.25)'
                    }}
                  >
                    Auto-Fill
                  </button>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', margin: '10px 0' }}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={otpInputRefs[idx]}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    style={{ width: '40px', height: '48px', textAlign: 'center', fontSize: '20px', fontWeight: 800, color: '#0f172a', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', outline: 'none' }}
                  />
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '12px', color: '#64748b' }}>
                <button
                  type="button"
                  disabled={loading}
                  onClick={async () => {
                    setLoading(true);
                    const res = await sendOtp(email);
                    setDevOtpCode(res.devOtp || '123456');
                    setCanResend(true);
                    setLoading(false);
                  }}
                  style={{ background: 'none', border: 'none', color: '#7c3aed', fontWeight: 700, cursor: 'pointer' }}
                >
                  Resend OTP
                </button>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  style={{ flex: 1, padding: '10px', borderRadius: '9999px', background: '#ffffff', border: '1px solid #cbd5e1', color: '#475569', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-purple-pill"
                  style={{ flex: 1.5, padding: '10px' }}
                >
                  {loading ? <RefreshCw size={16} className="animate-spin" /> : <span>Confirm &amp; Register</span>}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
