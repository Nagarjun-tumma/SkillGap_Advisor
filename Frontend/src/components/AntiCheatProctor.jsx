import React from 'react';
import { 
  ShieldCheck, ShieldAlert, AlertTriangle, Maximize2, 
  CopySlash, CheckCircle2, XCircle, ArrowRight, Lock, Eye, AlertOctagon
} from 'lucide-react';

/**
 * Live Proctoring Status Banner displayed atop active assessments
 */
export const AntiCheatLiveBanner = ({
  tabSwitchCount = 0,
  maxViolations = 3,
  isFullscreen = true
}) => {
  const violationColor = tabSwitchCount === 0 
    ? '#059669' 
    : tabSwitchCount === 1 
      ? '#d97706' 
      : '#dc2626';

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
      color: '#ffffff',
      padding: '12px 18px',
      borderRadius: '16px',
      border: '1px solid #334155',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px',
      boxShadow: '0 8px 24px rgba(15, 23, 42, 0.35)',
      userSelect: 'none',
      marginBottom: '18px'
    }}>
      {/* Left: Active Status Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: '#10b981',
          boxShadow: '0 0 10px #10b981',
          animation: 'pulse 1.8s infinite'
        }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={16} color="#34d399" />
          <span style={{ fontSize: '12px', fontWeight: 900, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#e2e8f0' }}>
            Anti-Cheat Proctoring Active
          </span>
        </div>
      </div>

      {/* Middle & Right: Live metrics */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {/* Fullscreen Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          fontSize: '11px',
          fontWeight: 700,
          background: isFullscreen ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.2)',
          color: isFullscreen ? '#34d399' : '#f87171',
          padding: '4px 10px',
          borderRadius: '8px',
          border: isFullscreen ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.4)'
        }}>
          <Maximize2 size={12} />
          <span>{isFullscreen ? 'Full Screen Locked' : 'Full Screen Exited!'}</span>
        </div>

        {/* Tab Switch Counter Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          fontSize: '11px',
          fontWeight: 800,
          background: tabSwitchCount === 0 ? 'rgba(51, 65, 85, 0.6)' : 'rgba(239, 68, 68, 0.25)',
          color: tabSwitchCount === 0 ? '#94a3b8' : '#fca5a5',
          padding: '4px 10px',
          borderRadius: '8px',
          border: `1px solid ${violationColor}44`
        }}>
          <Eye size={12} color={violationColor} />
          <span>Tab Switches: {tabSwitchCount}/{maxViolations}</span>
        </div>

        {/* Copy/Paste Disabled Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          fontSize: '11px',
          fontWeight: 700,
          background: 'rgba(51, 65, 85, 0.6)',
          color: '#cbd5e1',
          padding: '4px 10px',
          borderRadius: '8px',
          border: '1px solid rgba(148, 163, 184, 0.2)'
        }}>
          <CopySlash size={12} color="#a78bfa" />
          <span>Copy &amp; Paste Disabled</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Pre-Assessment Proctoring Instructions & Fullscreen Launch Gate
 */
export const AntiCheatStartCard = ({
  title = 'Skill Diagnostic Assessment',
  questionCount = 3,
  timeEstimate = '5-10 Mins',
  onStartExam
}) => {
  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '20px',
      padding: '28px',
      border: '1.5px solid #e2e8f0',
      boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.05)',
      display: 'flex',
      flexDirection: 'column',
      gap: '22px'
    }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
        color: '#ffffff',
        padding: '20px 24px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '14px',
          background: 'rgba(255, 255, 255, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <ShieldCheck size={28} color="#a5b4fc" />
        </div>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#a5b4fc', letterSpacing: '0.06em' }}>
            Verified Proctoring System Active
          </span>
          <h3 style={{ fontSize: '19px', fontWeight: 900, color: '#ffffff', margin: '2px 0 0 0' }}>
            {title}
          </h3>
          <p style={{ fontSize: '12px', color: '#c7d2fe', margin: '4px 0 0 0' }}>
            Calibrated technical depth verification • {questionCount} questions • ~{timeEstimate}
          </p>
        </div>
      </div>

      {/* Proctoring Rules Box */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Lock size={15} color="#7c3aed" />
          <span>Strict Anti-Cheat Examination Protocol:</span>
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {/* Rule 1: Full-Screen */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4338ca' }}>
              <Maximize2 size={16} />
              <strong style={{ fontSize: '12px' }}>Mandatory Full Screen</strong>
            </div>
            <p style={{ fontSize: '11.5px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
              The assessment operates strictly in full-screen mode. Exiting full-screen pauses your exam and triggers an integrity violation.
            </p>
          </div>

          {/* Rule 2: Tab Switch */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b45309' }}>
              <AlertTriangle size={16} />
              <strong style={{ fontSize: '12px' }}>No Tab Switching (3 Strikes)</strong>
            </div>
            <p style={{ fontSize: '11.5px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
              Switching tabs, minimizing, or clicking outside the window logs an incident. Your test auto-submits upon the 3rd strike.
            </p>
          </div>

          {/* Rule 3: Copy / Paste */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626' }}>
              <CopySlash size={16} />
              <strong style={{ fontSize: '12px' }}>Copy-Paste Disabled</strong>
            </div>
            <p style={{ fontSize: '11.5px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
              Clipboard copying, pasting, text selection, right-click, and DevTools inspection shortcuts (F12) are completely blocked.
            </p>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <button
        type="button"
        onClick={onStartExam}
        style={{
          background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
          color: '#ffffff',
          fontWeight: 900,
          fontSize: '15px',
          padding: '16px 24px',
          borderRadius: '14px',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          boxShadow: '0 8px 24px -4px rgba(124, 58, 237, 0.45)',
          transition: 'all 0.2s ease',
          width: '100%'
        }}
      >
        <ShieldCheck size={20} />
        <span>Enter Full-Screen &amp; Start Proctored Assessment</span>
        <ArrowRight size={18} />
      </button>

      <span style={{ fontSize: '11px', color: '#64748b', textAlign: 'center', marginTop: '-10px' }}>
        🔒 By clicking above, your browser will switch to full-screen mode and anti-cheat monitoring will commence.
      </span>
    </div>
  );
};

/**
 * Anti-Cheat Modals & Warning Overlays
 */
export const AntiCheatModals = ({
  warningModal,
  toastMessage,
  onResumeFullScreen,
  onDismissWarning,
  onViewResults
}) => {
  return (
    <>
      {/* Floating Action Blocked Toast */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(8px)',
          color: '#ffffff',
          border: '1.5px solid #f59e0b',
          borderRadius: '12px',
          padding: '10px 20px',
          fontSize: '13px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 100000,
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)',
          animation: 'fadeIn 0.2s ease'
        }}>
          <ShieldAlert size={18} color="#f59e0b" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Warning Modal / Fullscreen Blocker / Auto-Submit Overlay */}
      {warningModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            maxWidth: '520px',
            width: '100%',
            padding: '32px',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '16px'
          }}>
            {/* Modal Icon */}
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: warningModal.type === 'AUTO_SUBMIT' 
                ? '#fee2e2' 
                : warningModal.type === 'FULLSCREEN_EXIT' 
                  ? '#ffedd5' 
                  : '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {warningModal.type === 'AUTO_SUBMIT' ? (
                <XCircle size={36} color="#dc2626" />
              ) : warningModal.type === 'FULLSCREEN_EXIT' ? (
                <Maximize2 size={32} color="#ea580c" />
              ) : (
                <AlertTriangle size={36} color="#d97706" />
              )}
            </div>

            {/* Title & Description */}
            <div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 900,
                color: warningModal.type === 'AUTO_SUBMIT' ? '#991b1b' : '#0f172a',
                margin: 0
              }}>
                {warningModal.title}
              </h3>
              <p style={{ fontSize: '13px', color: '#475569', marginTop: '10px', lineHeight: 1.6 }}>
                {warningModal.message}
              </p>
            </div>

            {/* Action Buttons based on type */}
            <div style={{ width: '100%', marginTop: '8px' }}>
              {warningModal.type === 'FULLSCREEN_EXIT' ? (
                <button
                  type="button"
                  onClick={onResumeFullScreen}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    borderRadius: '12px',
                    background: '#ea580c',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '14px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 16px rgba(234, 88, 12, 0.35)'
                  }}
                >
                  <Maximize2 size={16} />
                  <span>Resume Assessment in Full-Screen</span>
                </button>
              ) : warningModal.type === 'AUTO_SUBMIT' ? (
                <button
                  type="button"
                  onClick={onViewResults || onDismissWarning}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    borderRadius: '12px',
                    background: '#dc2626',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '14px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 16px rgba(220, 38, 38, 0.35)'
                  }}
                >
                  <span>View Assessment Results</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onDismissWarning}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    borderRadius: '12px',
                    background: '#7c3aed',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '14px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 16px rgba(124, 58, 237, 0.35)'
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>I Understand &amp; Return to Assessment</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/**
 * Post-Assessment Integrity Audit Badge displayed in results
 */
export const AntiCheatAuditBadge = ({
  violationCount = 0,
  tabSwitchCount = 0,
  fullscreenExitCount = 0,
  autoSubmitted = false
}) => {
  const isClean = violationCount === 0 && !autoSubmitted;

  return (
    <div style={{
      padding: '14px 18px',
      borderRadius: '14px',
      background: autoSubmitted 
        ? '#fef2f2' 
        : isClean 
          ? '#ecfdf5' 
          : '#fffbeb',
      border: `1px solid ${autoSubmitted ? '#fecaca' : isClean ? '#a7f3d0' : '#fde68a'}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '10px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {autoSubmitted ? (
          <AlertOctagon size={20} color="#dc2626" />
        ) : isClean ? (
          <ShieldCheck size={20} color="#059669" />
        ) : (
          <ShieldAlert size={20} color="#d97706" />
        )}

        <div>
          <h5 style={{
            fontSize: '13px',
            fontWeight: 800,
            margin: 0,
            color: autoSubmitted ? '#991b1b' : isClean ? '#065f46' : '#92400e'
          }}>
            {autoSubmitted 
              ? 'Proctoring Alert: Test Auto-Submitted' 
              : isClean 
                ? 'Proctoring Audit: 100% Clean Session' 
                : 'Proctoring Audit: Integrity Violations Logged'}
          </h5>
          <p style={{
            fontSize: '11px',
            margin: '2px 0 0 0',
            color: autoSubmitted ? '#b91c1c' : isClean ? '#047857' : '#78350f'
          }}>
            {autoSubmitted
              ? 'Assessment was terminated due to exceeding maximum allowed tab switches.'
              : isClean
                ? 'Full screen was maintained with zero tab switches or clipboard attempts.'
                : `${tabSwitchCount} tab switch${tabSwitchCount === 1 ? '' : 'es'} & ${fullscreenExitCount} full-screen exit${fullscreenExitCount === 1 ? '' : 's'} recorded during session.`}
          </p>
        </div>
      </div>

      <span style={{
        fontSize: '11px',
        fontWeight: 800,
        padding: '4px 10px',
        borderRadius: '8px',
        background: autoSubmitted ? '#fee2e2' : isClean ? '#d1fae5' : '#fef3c7',
        color: autoSubmitted ? '#dc2626' : isClean ? '#059669' : '#b45309'
      }}>
        {autoSubmitted ? 'Flagged Violations' : isClean ? 'Authentic Proctor Pass' : 'Caution Logged'}
      </span>
    </div>
  );
};

