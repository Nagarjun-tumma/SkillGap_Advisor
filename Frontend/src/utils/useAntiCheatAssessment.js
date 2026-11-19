import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Cross-browser Fullscreen Helpers
 */
export const requestFullScreen = async (element = document.documentElement) => {
  try {
    if (element.requestFullscreen) {
      await element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      await element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      await element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
      await element.msRequestFullscreen();
    }
    return true;
  } catch (err) {
    console.warn('Fullscreen request failed or was rejected:', err);
    return false;
  }
};

export const exitFullScreen = async () => {
  try {
    const isFS = Boolean(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
    if (isFS) {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }
    }
    return true;
  } catch (err) {
    console.warn('Exit fullscreen failed:', err);
    return false;
  }
};

export const isDocumentFullScreen = () => {
  return Boolean(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );
};

/**
 * Hook to enforce anti-cheat proctoring:
 * - Fullscreen mode enforcement & exit detection
 * - Tab switch & window blur detection with maximum violation limit
 * - Auto-submit on exceeding violation limit
 * - Block copy, cut, paste, right-click context menu, selection, and devtools shortcuts
 * - Live anti-cheat metrics & violation auditing
 */
export const useAntiCheatAssessment = ({
  isActive = false,         // Assessment is currently underway (not completed/submitted)
  onAutoSubmit = null,      // Callback when max violations reached
  maxViolations = 3,        // Maximum allowed violations before auto-submit
  _assessmentTitle = 'Assessment'
} = {}) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [fullscreenExitCount, setFullscreenExitCount] = useState(0);
  const [violationsList, setViolationsList] = useState([]);
  
  // Modals & alerts
  const [warningModal, setWarningModal] = useState(null); 
  // { type: 'TAB_SWITCH' | 'FULLSCREEN_EXIT' | 'AUTO_SUBMIT', title: string, message: string, count: number }
  const [toastMessage, setToastMessage] = useState(null);
  const [autoSubmitted, setAutoSubmitted] = useState(false);

  const lastViolationTimeRef = useRef(0);
  const toastTimeoutRef = useRef(null);
  const autoSubmitTriggeredRef = useRef(false);

  // Helper to trigger temporary toast notification
  const showToast = useCallback((msg) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  }, []);

  // Internal violation handler with debounce to avoid double counting blur + visibilitychange
  const recordViolation = useCallback((type, description) => {
    if (!hasStarted || !isActive || autoSubmitTriggeredRef.current) return;

    const now = Date.now();
    // Throttle duplicate violations within 1200ms
    if (now - lastViolationTimeRef.current < 1200) {
      return;
    }
    lastViolationTimeRef.current = now;

    setViolationsList(prev => [
      ...prev,
      { id: now, type, description, timestamp: new Date().toLocaleTimeString() }
    ]);

    if (type === 'TAB_SWITCH' || type === 'WINDOW_BLUR') {
      setTabSwitchCount(prev => prev + 1);
    } else if (type === 'FULLSCREEN_EXIT') {
      setFullscreenExitCount(prev => prev + 1);
    }

    setViolationCount(prevCount => {
      const nextCount = prevCount + 1;
      
      if (nextCount >= maxViolations) {
        // Exceeded allowed violations -> auto-submit!
        autoSubmitTriggeredRef.current = true;
        setAutoSubmitted(true);
        setWarningModal({
          type: 'AUTO_SUBMIT',
          title: '🚫 Assessment Auto-Submitted',
          message: `You have exceeded the maximum allowed integrity violations (${nextCount}/${maxViolations}) due to tab switching or leaving full-screen. Your assessment has been automatically submitted.`,
          count: nextCount
        });

        exitFullScreen();

        if (typeof onAutoSubmit === 'function') {
          try {
            onAutoSubmit('Exceeded maximum anti-cheating violation threshold');
          } catch (e) {
            console.error('Error in onAutoSubmit callback:', e);
          }
        }
      } else {
        // Warning modal
        const remaining = maxViolations - nextCount;
        if (type === 'FULLSCREEN_EXIT') {
          setWarningModal({
            type: 'FULLSCREEN_EXIT',
            title: '🚨 Full-Screen Mode Exited!',
            message: `You exited full-screen mode. Full-screen is required to prevent unauthorized secondary applications. This has been logged as violation ${nextCount} of ${maxViolations} (${remaining} warning${remaining === 1 ? '' : 's'} remaining).`,
            count: nextCount
          });
        } else {
          setWarningModal({
            type: 'TAB_SWITCH',
            title: '⚠️ Integrity Alert: Tab Switch Detected!',
            message: `Navigating away from the assessment window is strictly prohibited. This incident has been logged as violation ${nextCount} of ${maxViolations}. You have ${remaining} warning${remaining === 1 ? '' : 's'} remaining before your assessment is automatically submitted.`,
            count: nextCount
          });
        }
      }

      return nextCount;
    });
  }, [hasStarted, isActive, maxViolations, onAutoSubmit]);

  // Start exam & request fullscreen
  const startAssessment = useCallback(async () => {
    const success = await requestFullScreen();
    setIsFullscreen(isDocumentFullScreen());
    setHasStarted(true);
    setViolationCount(0);
    setTabSwitchCount(0);
    setFullscreenExitCount(0);
    setViolationsList([]);
    setWarningModal(null);
    setAutoSubmitted(false);
    autoSubmitTriggeredRef.current = false;
    showToast('🔒 Anti-Cheat Proctoring Activated: Fullscreen locked, tab switches monitored.');
    return success;
  }, [showToast]);

  // Re-enter full-screen mode from warning modal
  const resumeFullScreen = useCallback(async () => {
    await requestFullScreen();
    setIsFullscreen(isDocumentFullScreen());
    if (warningModal?.type === 'FULLSCREEN_EXIT') {
      setWarningModal(null);
    }
  }, [warningModal]);

  // Dismiss modal
  const dismissWarningModal = useCallback(() => {
    setWarningModal(null);
    if (!isDocumentFullScreen() && hasStarted && isActive && !autoSubmitted) {
      requestFullScreen();
    }
  }, [hasStarted, isActive, autoSubmitted]);

  // Clean stop / reset
  const stopAssessment = useCallback(() => {
    setHasStarted(false);
    setWarningModal(null);
    setToastMessage(null);
    exitFullScreen();
  }, []);

  const resetAssessment = useCallback(() => {
    setHasStarted(false);
    setViolationCount(0);
    setTabSwitchCount(0);
    setFullscreenExitCount(0);
    setViolationsList([]);
    setWarningModal(null);
    setToastMessage(null);
    setAutoSubmitted(false);
    autoSubmitTriggeredRef.current = false;
    exitFullScreen();
  }, []);

  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      const fs = isDocumentFullScreen();
      setIsFullscreen(fs);

      if (!fs && hasStarted && isActive && !autoSubmitted && !autoSubmitTriggeredRef.current) {
        recordViolation('FULLSCREEN_EXIT', 'Exited full-screen display mode');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [hasStarted, isActive, autoSubmitted, recordViolation]);

  // Listen for tab switch & window blur
  useEffect(() => {
    if (!hasStarted || !isActive || autoSubmitted) return;

    const handleVisibilityChange = () => {
      if (document.hidden || document.visibilityState === 'hidden') {
        recordViolation('TAB_SWITCH', 'Switched browser tabs or minimized window');
      }
    };

    const handleWindowBlur = () => {
      recordViolation('WINDOW_BLUR', 'Switched focus away from assessment window');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [hasStarted, isActive, autoSubmitted, recordViolation]);

  // Prevent copy, cut, paste, context menu, text selection, and shortcut keys
  useEffect(() => {
    if (!hasStarted || !isActive || autoSubmitted) return;

    const handleCopy = (e) => {
      e.preventDefault();
      e.stopPropagation();
      showToast('⚠️ Copying is strictly disabled during the assessment.');
    };

    const handleCut = (e) => {
      e.preventDefault();
      e.stopPropagation();
      showToast('⚠️ Cutting text is disabled during the assessment.');
    };

    const handlePaste = (e) => {
      e.preventDefault();
      e.stopPropagation();
      showToast('⚠️ Pasting content is strictly disabled during the assessment.');
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      e.stopPropagation();
      showToast('⚠️ Right-click context menu is disabled to prevent cheating.');
    };

    const handleSelectStart = (e) => {
      // Allow selecting radio button inputs, but block general text selection
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON')) {
        return;
      }
      e.preventDefault();
    };

    const handleKeyDown = (e) => {
      const key = e.key ? e.key.toLowerCase() : '';
      const isCtrlOrMeta = e.ctrlKey || e.metaKey;

      // Block Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+A, Ctrl+U, Ctrl+S, Ctrl+P
      if (isCtrlOrMeta && ['c', 'v', 'x', 'a', 'u', 's', 'p'].includes(key)) {
        e.preventDefault();
        e.stopPropagation();
        showToast(`⚠️ Shortcut (Ctrl+${key.toUpperCase()}) is disabled.`);
        return false;
      }

      // Block F12 (Inspect Element / DevTools)
      if (e.key === 'F12') {
        e.preventDefault();
        e.stopPropagation();
        showToast('⚠️ Developer tools (F12) are disabled during assessment.');
        return false;
      }

      // Block Ctrl+Shift+I / J / C (DevTools)
      if (isCtrlOrMeta && e.shiftKey && ['i', 'j', 'c'].includes(key)) {
        e.preventDefault();
        e.stopPropagation();
        showToast('⚠️ Developer tools shortcuts are disabled during assessment.');
        return false;
      }
    };

    window.addEventListener('copy', handleCopy, true);
    window.addEventListener('cut', handleCut, true);
    window.addEventListener('paste', handlePaste, true);
    window.addEventListener('contextmenu', handleContextMenu, true);
    window.addEventListener('selectstart', handleSelectStart, true);
    window.addEventListener('keydown', handleKeyDown, true);

    return () => {
      window.removeEventListener('copy', handleCopy, true);
      window.removeEventListener('cut', handleCut, true);
      window.removeEventListener('paste', handlePaste, true);
      window.removeEventListener('contextmenu', handleContextMenu, true);
      window.removeEventListener('selectstart', handleSelectStart, true);
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [hasStarted, isActive, autoSubmitted, showToast]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      exitFullScreen();
    };
  }, []);

  return {
    hasStarted,
    isFullscreen,
    violationCount,
    tabSwitchCount,
    fullscreenExitCount,
    violationsList,
    maxViolations,
    warningModal,
    toastMessage,
    autoSubmitted,
    startAssessment,
    resumeFullScreen,
    dismissWarningModal,
    stopAssessment,
    resetAssessment,
    showToast
  };
};

