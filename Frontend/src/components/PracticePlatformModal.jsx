import React, { useState, useRef } from 'react';
import { 
  Code, ExternalLink, Upload, CheckCircle2, Award, Sparkles, X, 
  TrendingUp, FileText, Check, AlertCircle, Image as ImageIcon,
  Flame, ChevronRight, BarChart2, ShieldCheck, RefreshCw, BookOpen,
  ShieldAlert, AlertTriangle, FileWarning, RotateCcw, Camera, Info
} from 'lucide-react';
import { CODING_PLATFORMS, practicePlatformService } from '../utils/practicePlatformService';
import { verifyScreenshotProof } from '../utils/screenshotVerificationService';

export const PracticePlatformModal = ({
  isOpen,
  onClose,
  initialSkill = 'Data Structures & Algorithms',
  initialPlatform = 'leetcode',
  user = null,
  onPracticeSubmitted = null
}) => {
  const [activeTab, setActiveTab] = useState('submit'); // 'platforms' | 'submit' | 'history'
  const [selectedPlatform, setSelectedPlatform] = useState(initialPlatform);
  const [selectedSkill, setSelectedSkill] = useState(initialSkill);
  const [problemsSolved, setProblemsSolved] = useState(12);
  const [score, setScore] = useState('');
  const [accuracy, setAccuracy] = useState(85);
  const [profileUrl, setProfileUrl] = useState('');
  const [screenshotData, setScreenshotData] = useState(null);
  const [screenshotName, setScreenshotName] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPrechecking, setIsPrechecking] = useState(false);
  const [precheckResult, setPrecheckResult] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [submissionsList, setSubmissionsList] = useState(practicePlatformService.getSubmissions(user?.email));

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const currentPlatformObj = CODING_PLATFORMS.find(p => p.id === selectedPlatform) || CODING_PLATFORMS[0];

  // Common technical skills available for practice mapping
  const AVAILABLE_SKILLS = [
    'Data Structures & Algorithms',
    'Java',
    'Python',
    'C++',
    'SQL & MySQL',
    'Spring Boot',
    'React.js',
    'System Design',
    'REST API Design',
    'Machine Learning',
    'Docker & Kubernetes'
  ];

  // Handle external launch and track platform visit
  const handleLaunchPlatform = (platform, trackUrl = null) => {
    const url = trackUrl || platform.primaryUrl;
    practicePlatformService.recordVisit({
      platformId: platform.id,
      platformName: platform.name,
      skillName: selectedSkill,
      url,
      userEmail: user?.email || 'student@college.edu'
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Re-run precheck when platform or URL changes if screenshot is present
  const handlePlatformChange = (newPlatformId) => {
    setSelectedPlatform(newPlatformId);
    if (screenshotData) {
      setIsPrechecking(true);
      verifyScreenshotProof(screenshotData, newPlatformId, screenshotName, profileUrl)
        .then(res => setPrecheckResult(res))
        .catch(err => console.warn('Precheck re-run error:', err))
        .finally(() => setIsPrechecking(false));
    }
  };

  const handleProfileUrlChange = (newUrl) => {
    setProfileUrl(newUrl);
    if (screenshotData) {
      verifyScreenshotProof(screenshotData, selectedPlatform, screenshotName, newUrl)
        .then(res => setPrecheckResult(res))
        .catch(err => console.warn('Precheck URL change error:', err));
    }
  };

  // Handle image upload with auto-compression via HTML Canvas & instant AI precheck
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, or WEBP).');
      return;
    }

    setScreenshotName(file.name);
    setIsPrechecking(true);
    setPrecheckResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        // Compress image using canvas to prevent exceeding localStorage quota
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1000;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);
        setScreenshotData(compressedBase64);

        // Run instant AI Vision precheck to detect documents/fake proofs
        try {
          const precheck = await verifyScreenshotProof(compressedBase64, selectedPlatform, file.name, profileUrl);
          setPrecheckResult(precheck);
        } catch (err) {
          console.warn('AI Vision precheck failed:', err);
        } finally {
          setIsPrechecking(false);
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Submit practice proof for automated AI analysis & strict verification
  const handleSubmitProof = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Run comprehensive AI Vision verification on submitted screenshot
      const verification = await verifyScreenshotProof(
        screenshotData,
        currentPlatformObj.id,
        screenshotName,
        profileUrl
      );

      const result = practicePlatformService.submitPracticeResult({
        userName: user?.name || user?.fullName || 'Engineering Student',
        userEmail: user?.email || 'student@college.edu',
        platformId: currentPlatformObj.id,
        platformName: currentPlatformObj.name,
        skillName: selectedSkill,
        problemsSolved,
        score: score || `${problemsSolved * 40} Pts`,
        accuracy,
        profileUrl,
        screenshotBase64: screenshotData,
        notes,
        verificationResult: verification
      });

      setAnalysisResult(result);
      setSubmissionsList(practicePlatformService.getSubmissions(user?.email));

      if (onPracticeSubmitted && result.verified) {
        onPracticeSubmitted(result);
      }
    } catch (err) {
      console.error('Error during proof verification & submission:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="split-modal-overlay" style={{ zIndex: 9999 }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        maxWidth: '820px',
        width: '95%',
        maxHeight: '90vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.25)',
        border: '1px solid #e2e8f0'
      }}>
        
        {/* MODAL HEADER */}
        <div style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          color: '#ffffff',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.15)', padding: '4px 10px', borderRadius: '6px', marginBottom: '6px' }}>
              <Code size={13} />
              <span>Hands-on Placement Practice Hub</span>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 900, margin: 0, color: '#ffffff' }}>
              Coding Platforms Practice &amp; Score Analysis
            </h3>
            <p style={{ fontSize: '12px', color: '#c7d2fe', margin: '4px 0 0 0' }}>
              Practice on LeetCode &amp; HackerRank, share your verified score/screenshot, and let our AI evaluate your placement readiness.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'rgba(255, 255, 255, 0.1)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', color: '#ffffff', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            ✕
          </button>
        </div>

        {/* 3 NAVIGATION TABS */}
        <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', padding: '0 28px' }}>
          {[
            { id: 'submit', label: '📤 Share Score & Screenshot', icon: Upload },
            { id: 'platforms', label: '🚀 Explore Platforms (LeetCode/HackerRank)', icon: ExternalLink },
            { id: 'history', label: `📋 Verified Submissions (${submissionsList.length})`, icon: ShieldCheck }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setAnalysisResult(null); }}
                style={{
                  padding: '14px 18px',
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? '3px solid #7c3aed' : '3px solid transparent',
                  color: isActive ? '#7c3aed' : '#64748b',
                  fontSize: '13px',
                  fontWeight: isActive ? 800 : 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* MODAL BODY */}
        <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* ============================================================== */}
          {/* TAB 1: SHARE SCORE & SCREENSHOT (CORE REQUIREMENT)              */}
          {/* ============================================================== */}
          {activeTab === 'submit' && (
            <div>
              {analysisResult ? (
                analysisResult.verified ? (
                  /* ========================================================= */
                  /* SUCCESSFUL AI RESULT BREAKDOWN SCREEN                     */
                  /* ========================================================= */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.3s ease' }}>
                    <div style={{
                      padding: '24px',
                      borderRadius: '20px',
                      background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                      border: '1.5px solid #10b981',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '18px'
                    }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: '#10b981', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Award size={32} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          AI Evaluation Completed Successfully
                        </span>
                        <h4 style={{ fontSize: '20px', fontWeight: 900, color: '#064e3b', margin: '2px 0 0 0' }}>
                          {analysisResult.aiVerdict}
                        </h4>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '6px', flexWrap: 'wrap' }}>
                          <span style={{ background: '#ffffff', color: '#059669', padding: '3px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 800, border: '1px solid #a7f3d0' }}>
                            ⚡ {analysisResult.readinessBoost}
                          </span>
                          <span style={{ background: '#ffffff', color: '#7c3aed', padding: '3px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 800, border: '1px solid #ddd6fe' }}>
                            {analysisResult.badge}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Metrics Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
                      <div style={{ padding: '16px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Platform &amp; Skill</span>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                          {analysisResult.platformName} &bull; {analysisResult.skillName}
                        </div>
                      </div>

                      <div style={{ padding: '16px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Problems Solved</span>
                        <div style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>
                          {analysisResult.problemsSolved} Problems
                        </div>
                        <div style={{ fontSize: '10.5px', color: '#059669', fontWeight: 700 }}>
                          {analysisResult.accuracy}% Accuracy Rate
                        </div>
                      </div>

                      <div style={{ padding: '16px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Difficulty Breakdown</span>
                        <div style={{ display: 'flex', gap: '6px', marginTop: '6px', fontSize: '11px', fontWeight: 800 }}>
                          <span style={{ color: '#059669', background: '#ecfdf5', padding: '2px 6px', borderRadius: '4px' }}>Easy: {analysisResult.difficultyBreakdown.easy}</span>
                          <span style={{ color: '#d97706', background: '#fffbeb', padding: '2px 6px', borderRadius: '4px' }}>Med: {analysisResult.difficultyBreakdown.medium}</span>
                          <span style={{ color: '#dc2626', background: '#fef2f2', padding: '2px 6px', borderRadius: '4px' }}>Hard: {analysisResult.difficultyBreakdown.hard}</span>
                        </div>
                      </div>
                    </div>

                    {/* AI Detailed Feedback Box */}
                    <div style={{ padding: '20px', borderRadius: '16px', background: '#faf5ff', border: '1px solid #e9d5ff' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Sparkles size={16} color="#7c3aed" />
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#6b21a8' }}>
                          Automated AI Problem-Solving Feedback
                        </span>
                      </div>
                      <p style={{ fontSize: '13px', color: '#3b0764', lineHeight: 1.6, margin: 0 }}>
                        {analysisResult.aiFeedback}
                      </p>
                    </div>

                    {/* Screenshot Preview if uploaded */}
                    {analysisResult.screenshotUrl && (
                      <div style={{ padding: '16px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b' }}>
                            Uploaded Proof Screenshot
                          </span>
                          <span style={{ fontSize: '10px', fontWeight: 800, color: '#059669', background: '#ecfdf5', padding: '2px 8px', borderRadius: '6px', border: '1px solid #a7f3d0' }}>
                            ✓ VERIFIED AUTHENTIC PROOF
                          </span>
                        </div>
                        <img 
                          src={analysisResult.screenshotUrl} 
                          alt="Submitted proof" 
                          style={{ maxWidth: '100%', maxHeight: '220px', borderRadius: '10px', objectFit: 'contain', border: '1px solid #cbd5e1' }} 
                        />
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        onClick={() => { setAnalysisResult(null); setActiveTab('history'); }}
                        style={{
                          flex: 1,
                          padding: '12px',
                          borderRadius: '12px',
                          background: '#7c3aed',
                          color: '#ffffff',
                          fontSize: '13px',
                          fontWeight: 800,
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        View All Practice History
                      </button>
                      <button
                        onClick={onClose}
                        style={{
                          padding: '12px 24px',
                          borderRadius: '12px',
                          background: '#f1f5f9',
                          color: '#475569',
                          fontSize: '13px',
                          fontWeight: 700,
                          border: '1px solid #cbd5e1',
                          cursor: 'pointer'
                        }}
                      >
                        Close &amp; Continue
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ========================================================= */
                  /* STRICT REJECTION / ERROR SCREEN                           */
                  /* (Triggered when Academic Paper / Fake proof is uploaded)  */
                  /* ========================================================= */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.3s ease' }}>
                    {/* Big Red Rejection Banner */}
                    <div style={{
                      padding: '24px',
                      borderRadius: '20px',
                      background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                      border: '1.5px solid #ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '18px'
                    }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: '#dc2626', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShieldAlert size={32} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#991b1b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          AI Proof Verification Rejected
                        </span>
                        <h4 style={{ fontSize: '20px', fontWeight: 900, color: '#7f1d1d', margin: '2px 0 0 0' }}>
                          {analysisResult.aiVerdict}
                        </h4>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '6px', flexWrap: 'wrap' }}>
                          <span style={{ background: '#ffffff', color: '#dc2626', padding: '3px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 800, border: '1px solid #fca5a5' }}>
                            ❌ 0% Placement Boost (Proof Rejected)
                          </span>
                          <span style={{ background: '#ffffff', color: '#7f1d1d', padding: '3px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 800, border: '1px solid #fecaca' }}>
                            Detected: {analysisResult.detectedCategoryName || 'Academic Document / PDF'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Diagnostic Box */}
                    <div style={{ padding: '20px', borderRadius: '16px', background: '#fff1f2', border: '1.5px solid #fecdd3' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <AlertTriangle size={17} color="#e11d48" />
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#9f1239' }}>
                          Why Was This Proof Rejected by the AI Evaluator?
                        </span>
                      </div>
                      <p style={{ fontSize: '12.5px', color: '#881337', lineHeight: 1.6, margin: '0 0 12px 0' }}>
                        {analysisResult.aiFeedback}
                      </p>

                      {/* Missing proof elements list */}
                      {analysisResult.missingMarkers && analysisResult.missingMarkers.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid #ffe4e6', paddingTop: '10px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: '#9f1239' }}>Missing Required Verification Markers:</span>
                          {analysisResult.missingMarkers.map((marker, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '11.5px', color: '#be123c' }}>
                              <span style={{ color: '#e11d48', fontWeight: 900, lineHeight: 1 }}>✕</span>
                              <span>{marker}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Detected anomalies */}
                      {analysisResult.detectedMarkers && analysisResult.detectedMarkers.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid #ffe4e6', paddingTop: '10px', marginTop: '10px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: '#9f1239' }}>Detected Discrepancies:</span>
                          {analysisResult.detectedMarkers.map((marker, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '11.5px', color: '#9f1239' }}>
                              <span style={{ color: '#d97706', fontWeight: 900, lineHeight: 1 }}>⚠️</span>
                              <span>{marker}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div style={{ marginTop: '14px', padding: '10px 12px', borderRadius: '10px', background: '#ffe4e6', border: '1px solid #fecdd3', fontSize: '11.5px', color: '#9f1239', fontWeight: 700 }}>
                        🛡️ <strong>Placement Integrity Notice:</strong> SkillGap AI only credits verified problem counts when backed by authentic coding platform screenshots. No points or badges were credited for this upload.
                      </div>
                    </div>

                    {/* Uploaded Flagged Proof Preview */}
                    {analysisResult.screenshotUrl && (
                      <div style={{ padding: '16px', borderRadius: '16px', background: '#f8fafc', border: '1.5px solid #fca5a5' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b' }}>
                            Uploaded Screenshot (Flagged by AI Vision Engine)
                          </span>
                          <span style={{ fontSize: '10px', fontWeight: 800, color: '#dc2626', background: '#fef2f2', padding: '2px 8px', borderRadius: '6px', border: '1px solid #fecaca' }}>
                            FLAGGED: INVALID PROOF
                          </span>
                        </div>
                        <img 
                          src={analysisResult.screenshotUrl} 
                          alt="Rejected proof" 
                          style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '10px', objectFit: 'contain', border: '1.5px dashed #f87171' }} 
                        />
                      </div>
                    )}

                    {/* Clear Guidance: What to upload */}
                    <div style={{ padding: '16px 20px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Camera size={16} color="#475569" />
                        <span style={{ fontSize: '12px', fontWeight: 800, color: '#1e293b' }}>
                          How to take an authentic screenshot that passes AI verification:
                        </span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px', marginTop: '10px' }}>
                        <div style={{ padding: '12px', borderRadius: '10px', background: '#ffffff', border: '1px solid #e2e8f0', fontSize: '11.5px', color: '#475569' }}>
                          <strong style={{ color: '#0f172a', display: 'block', marginBottom: '4px' }}>Option A: Profile Dashboard</strong>
                          Open <span style={{ color: '#2563eb' }}>leetcode.com/u/your_username</span>. Take a full screenshot showing your profile name and solved problems donut ring.
                        </div>
                        <div style={{ padding: '12px', borderRadius: '10px', background: '#ffffff', border: '1px solid #e2e8f0', fontSize: '11.5px', color: '#475569' }}>
                          <strong style={{ color: '#0f172a', display: 'block', marginBottom: '4px' }}>Option B: Accepted Submission</strong>
                          Open any solved problem on LeetCode/HackerRank, click the "Submissions" tab, and screenshot the green <span style={{ color: '#059669', fontWeight: 800 }}>"Accepted"</span> banner with runtime stats.
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        onClick={() => {
                          setAnalysisResult(null);
                          setScreenshotData(null);
                          setScreenshotName('');
                          setPrecheckResult(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        style={{
                          flex: 1,
                          padding: '12px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                          color: '#ffffff',
                          fontSize: '13px',
                          fontWeight: 800,
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)'
                        }}
                      >
                        <RotateCcw size={15} />
                        <span>Try Again with Authentic Screenshot</span>
                      </button>

                      <button
                        onClick={onClose}
                        style={{
                          padding: '12px 24px',
                          borderRadius: '12px',
                          background: '#f1f5f9',
                          color: '#475569',
                          fontSize: '13px',
                          fontWeight: 700,
                          border: '1px solid #cbd5e1',
                          cursor: 'pointer'
                        }}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )
              ) : (
                /* SUBMISSION FORM */
                <form onSubmit={handleSubmitProof} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Platform Picker Pills */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '8px' }}>
                      1. Select Practice Platform
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
                      {CODING_PLATFORMS.map(p => {
                        const isSelected = selectedPlatform === p.id;
                        return (
                          <div
                            key={p.id}
                            onClick={() => handlePlatformChange(p.id)}
                            style={{
                              padding: '12px 14px',
                              borderRadius: '14px',
                              border: isSelected ? `2px solid ${p.color}` : '1px solid #e2e8f0',
                              background: isSelected ? p.bgColor : '#ffffff',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: p.color, color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '11px' }}>
                                {p.logoText}
                              </div>
                              <span style={{ fontSize: '13px', fontWeight: 800, color: isSelected ? p.color : '#0f172a' }}>
                                {p.name}
                              </span>
                            </div>
                            {isSelected && <CheckCircle2 size={16} color={p.color} />}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Skill & Problems Solved Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '6px' }}>
                        2. Target Technical Skill
                      </label>
                      <select
                        value={selectedSkill}
                        onChange={(e) => setSelectedSkill(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: '12px',
                          border: '1.5px solid #cbd5e1',
                          background: '#ffffff',
                          fontSize: '13px',
                          fontWeight: 700,
                          color: '#0f172a',
                          outline: 'none'
                        }}
                      >
                        {AVAILABLE_SKILLS.map(sk => (
                          <option key={sk} value={sk}>{sk}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '6px' }}>
                        3. Problems Solved on {currentPlatformObj.name}
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="500"
                        value={problemsSolved}
                        onChange={(e) => setProblemsSolved(Number(e.target.value))}
                        required
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: '12px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '13px',
                          fontWeight: 700,
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  {/* Score & Accuracy Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '6px' }}>
                        4. Score / Contest Rating / Badges (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 1,650 Rating or 5-Star Silver Badge"
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: '12px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '13px',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '6px' }}>
                        5. Accuracy / Acceptance Rate: <strong style={{ color: '#059669' }}>{accuracy}%</strong>
                      </label>
                      <input
                        type="range"
                        min="40"
                        max="100"
                        step="5"
                        value={accuracy}
                        onChange={(e) => setAccuracy(Number(e.target.value))}
                        style={{ width: '100%', accentColor: '#10b981', marginTop: '8px' }}
                      />
                    </div>
                  </div>

                  {/* Profile / Problem URL */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '6px' }}>
                      6. Profile or Submission Link (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder={`e.g. https://${currentPlatformObj.id}.com/u/your_username`}
                      value={profileUrl}
                      onChange={(e) => handleProfileUrlChange(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '12px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {/* SCREENSHOT UPLOAD BOX (WITH LIVE AI PRE-CHECK) */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>
                        7. Upload Score Screenshot or Profile Proof (PNG, JPG, WEBP)
                      </label>
                      <span style={{ fontSize: '11px', color: '#7c3aed', fontWeight: 700 }}>
                        Strict AI Vision Verified 🛡️
                      </span>
                    </div>

                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImageUpload} 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                    />

                    {screenshotData ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{
                          padding: '16px',
                          borderRadius: '16px',
                          background: '#f8fafc',
                          border: precheckResult 
                            ? (precheckResult.verified ? '1.5px solid #10b981' : '1.5px solid #ef4444')
                            : '1.5px solid #cbd5e1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img 
                              src={screenshotData} 
                              alt="Screenshot preview" 
                              style={{ width: '64px', height: '52px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #cbd5e1' }} 
                            />
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                                {screenshotName || 'Practice_Score_Proof.png'}
                              </div>
                              <span style={{ fontSize: '11px', color: precheckResult?.verified ? '#059669' : '#dc2626', fontWeight: 700 }}>
                                {precheckResult 
                                  ? (precheckResult.verified ? '✓ AI Pre-check: Platform match verified' : '⚠️ AI Pre-check: Flagged as invalid/document proof')
                                  : '✓ Screenshot attached'}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => { 
                              setScreenshotData(null); 
                              setScreenshotName(''); 
                              setPrecheckResult(null);
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                          >
                            Remove
                          </button>
                        </div>

                        {/* LIVE PRE-CHECK SCANNING INDICATOR */}
                        {isPrechecking && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '12px', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', fontSize: '11.5px', fontWeight: 700 }}>
                            <RefreshCw size={14} className="animate-spin" />
                            <span>AI Vision Engine is inspecting pixels, document margins &amp; platform signatures...</span>
                          </div>
                        )}

                        {/* LIVE PRE-CHECK RESULT: WARNING / REJECTION ALERT */}
                        {!isPrechecking && precheckResult && !precheckResult.verified && (
                          <div style={{
                            padding: '14px 16px',
                            borderRadius: '14px',
                            background: '#fef2f2',
                            border: '1.5px solid #f87171',
                            display: 'flex',
                            gap: '12px',
                            alignItems: 'flex-start'
                          }}>
                            <ShieldAlert size={20} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#991b1b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span>⚠️ Pre-check Warning: {precheckResult.detectedCategoryName}</span>
                              </div>
                              <p style={{ margin: '4px 0 0 0', fontSize: '11.5px', color: '#7f1d1d', lineHeight: 1.45 }}>
                                {precheckResult.rejectionReason}
                              </p>
                              <div style={{ marginTop: '8px', padding: '6px 10px', borderRadius: '8px', background: '#fee2e2', fontSize: '11px', fontWeight: 700, color: '#b91c1c' }}>
                                🛑 <strong>Notice:</strong> Submitting this document will be rejected by the AI verification engine and no points will be credited.
                              </div>
                            </div>
                          </div>
                        )}

                        {/* LIVE PRE-CHECK RESULT: VERIFIED AUTHENTIC PROOF */}
                        {!isPrechecking && precheckResult && precheckResult.verified && (
                          <div style={{
                            padding: '12px 14px',
                            borderRadius: '12px',
                            background: '#ecfdf5',
                            border: '1px solid #6ee7b7',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                          }}>
                            <ShieldCheck size={18} color="#059669" />
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#065f46' }}>
                              ✓ AI Pre-check Passed: Recognized authentic {precheckResult.detectedCategoryName} ({precheckResult.confidence}% confidence match).
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          padding: '24px',
                          borderRadius: '16px',
                          border: '2px dashed #cbd5e1',
                          background: '#f8fafc',
                          textAlign: 'center',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Upload size={22} />
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b' }}>
                          Click to upload your {currentPlatformObj.name} score screenshot
                        </div>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>
                          Supports PNG, JPG, WEBP &bull; AI automatically scans solved questions and score
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Submission Action */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                    <button
                      type="button"
                      onClick={onClose}
                      style={{ padding: '12px 20px', borderRadius: '12px', background: '#f1f5f9', color: '#475569', fontSize: '13px', fontWeight: 700, border: '1px solid #cbd5e1', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      style={{
                        padding: '12px 28px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                        color: '#ffffff',
                        fontSize: '13px',
                        fontWeight: 900,
                        border: 'none',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)'
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw size={16} className="animate-spin" />
                          <span>AI Analyzing Score &amp; Screenshot...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} />
                          <span>Submit for Automated AI Analysis</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: EXPLORE PLATFORMS & LAUNCH (LEETCODE / HACKERRANK)       */}
          {/* ============================================================== */}
          {activeTab === 'platforms' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: '#eff6ff', padding: '16px', borderRadius: '16px', border: '1px solid #bfdbfe', color: '#1e40af', fontSize: '12.5px' }}>
                💡 <strong>Tip for Campus Placements:</strong> Click any platform below to start practicing. When you complete your practice session, return to this modal to upload your score or screenshot so our system analyzes your skill growth!
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                {CODING_PLATFORMS.map(platform => (
                  <div
                    key={platform.id}
                    style={{
                      padding: '20px',
                      borderRadius: '20px',
                      background: '#ffffff',
                      border: `1.5px solid ${platform.borderColor}`,
                      boxShadow: '0 8px 24px -6px rgba(0, 0, 0, 0.05)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '14px'
                    }}
                  >
                    <div>
                      {/* Top Row: Icon + Name + Badge */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: platform.color, color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '13px' }}>
                            {platform.logoText}
                          </div>
                          <div>
                            <h4 style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                              {platform.name}
                            </h4>
                            <span style={{ fontSize: '11px', color: '#64748b' }}>
                              {platform.tagline}
                            </span>
                          </div>
                        </div>

                        <span style={{ fontSize: '10px', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', background: platform.bgColor, color: platform.color, border: `1px solid ${platform.borderColor}` }}>
                          {platform.badge}
                        </span>
                      </div>

                      <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5, margin: '8px 0 12px 0' }}>
                        {platform.description}
                      </p>

                      {/* Curated Study Tracks */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a' }}>Recommended Problem Sets:</span>
                        {platform.curatedTracks.map((tr, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleLaunchPlatform(platform, tr.url)}
                            style={{
                              padding: '8px 12px',
                              borderRadius: '8px',
                              background: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              fontSize: '11.5px',
                              fontWeight: 700,
                              color: '#334155',
                              cursor: 'pointer',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <span>{tr.title}</span>
                            <span style={{ fontSize: '10px', color: platform.color, fontWeight: 800 }}>{tr.tag} →</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Launch & Submit Actions */}
                    <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                      <button
                        onClick={() => handleLaunchPlatform(platform)}
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: '10px',
                          background: platform.color,
                          color: '#ffffff',
                          fontSize: '12px',
                          fontWeight: 800,
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <ExternalLink size={13} />
                        <span>Go to {platform.name}</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedPlatform(platform.id);
                          setActiveTab('submit');
                        }}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '10px',
                          background: '#f1f5f9',
                          color: '#334155',
                          fontSize: '12px',
                          fontWeight: 700,
                          border: '1px solid #cbd5e1',
                          cursor: 'pointer'
                        }}
                      >
                        Share Score
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: VERIFIED SUBMISSIONS & AI LOG                           */}
          {/* ============================================================== */}
          {activeTab === 'history' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#64748b' }}>
                  Total Verified Practice Sessions: <strong>{submissionsList.length}</strong>
                </span>

                <button
                  onClick={() => setActiveTab('submit')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    background: '#7c3aed',
                    color: '#ffffff',
                    fontSize: '11.5px',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Upload size={12} />
                  <span>Submit New Score / Screenshot</span>
                </button>
              </div>

              {submissionsList.length === 0 ? (
                <div style={{ padding: '36px', textAlign: 'center', background: '#f8fafc', borderRadius: '16px', border: '1.5px dashed #cbd5e1', color: '#64748b' }}>
                  No practice submissions recorded yet. Launch LeetCode or HackerRank and share your first result!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {submissionsList.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        padding: '18px 20px',
                        borderRadius: '16px',
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 15px -4px rgba(0, 0, 0, 0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f3e8ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                            {item.platformName.charAt(0)}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <h5 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                                {item.platformName} &bull; {item.skillName}
                              </h5>
                              <span style={{ fontSize: '10px', fontWeight: 800, background: '#ecfdf5', color: '#047857', padding: '1px 6px', borderRadius: '4px', border: '1px solid #a7f3d0' }}>
                                ✓ Verified
                              </span>
                            </div>
                            <span style={{ fontSize: '11px', color: '#64748b' }}>
                              Submitted by {item.userName} &bull; {new Date(item.submittedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <span style={{ fontSize: '12px', fontWeight: 800, color: '#059669', background: '#ecfdf5', padding: '4px 10px', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
                          ⚡ {item.readinessBoost}
                        </span>
                      </div>

                      {/* AI Feedback quote */}
                      <p style={{ fontSize: '12px', color: '#334155', lineHeight: 1.5, background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', margin: 0, fontStyle: 'italic' }}>
                        "{item.aiFeedback}"
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', color: '#64748b' }}>
                        <span>
                          Problems Solved: <strong style={{ color: '#0f172a' }}>{item.problemsSolved}</strong> &bull; Score: <strong style={{ color: '#0f172a' }}>{item.score}</strong>
                        </span>
                        <span style={{ color: '#7c3aed', fontWeight: 700 }}>
                          {item.aiVerdict}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

