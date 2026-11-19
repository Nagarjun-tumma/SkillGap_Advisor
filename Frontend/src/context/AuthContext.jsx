import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const API_BASE_URL = 'http://localhost:8080/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser && token) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        // Async fetch fresh skills from backend DB
        if (parsed.id) {
          fetch(`${API_BASE_URL}/student/skills/${parsed.id}`)
            .then(res => res.ok ? res.json() : null)
            .then(dbSkills => {
              if (Array.isArray(dbSkills) && dbSkills.length > 0) {
                const updated = { ...parsed, acquiredSkills: dbSkills };
                setUser(updated);
                localStorage.setItem('user', JSON.stringify(updated));
                if (parsed.email) {
                  localStorage.setItem(`user_skills_${parsed.email.toLowerCase()}`, JSON.stringify(dbSkills));
                }
              }
            })
            .catch(err => console.warn('Could not sync skills from backend:', err));
        }
      } catch (e) {
        console.error('Failed to parse user session', e);
      }
    }
    setLoading(false);
  }, [token]);

  // Check email availability
  const checkEmail = async (email) => {
    const isValidFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test((email || '').trim());
    if (!isValidFormat) {
      return { available: false, validFormat: false, message: 'Invalid email format' };
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/check-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.warn('Backend server offline, falling back to local simulation mode.', err);
      // Fallback check
      const isTaken = email.toLowerCase() === 'registered@example.com';
      return { available: !isTaken, validFormat: true, message: isTaken ? 'Email is already registered' : 'Email is available' };
    }
  };

  // Send 6-Digit Email OTP
  const sendOtp = async (email) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send OTP');
      return data;
    } catch (err) {
      console.warn('Backend error or offline, fallback dev OTP generated', err);
      // Demo fallback OTP generator
      const mockOtp = '123456';
      return {
        success: true,
        message: `6-Digit OTP sent successfully to ${email} (Demo OTP: ${mockOtp})`,
        devOtp: mockOtp,
        email
      };
    }
  };

  // Verify OTP Code
  const verifyOtp = async (email, otpCode) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otpCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Invalid OTP code');
      return data;
    } catch (err) {
      if (otpCode === '123456' || otpCode.length === 6) {
        return { success: true, message: 'OTP verified successfully!' };
      }
      throw err;
    }
  };

  // Register User
  const register = async (registerData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      const userData = {
        id: data.userId || Date.now(),
        fullName: data.fullName,
        email: data.email,
        engineeringBranch: data.engineeringBranch,
        academicYear: data.academicYear,
        targetRoleId: Number(registerData.targetRoleId) || data.targetRoleId || 2,
        targetCompanies: data.targetCompanies || registerData.targetCompanies || [],
        acquiredSkills: data.acquiredSkills || []
      };

      setUser(userData);
      setToken(data.token || 'demo-jwt-token-xyz');
      localStorage.setItem('token', data.token || 'demo-jwt-token-xyz');
      localStorage.setItem('user', JSON.stringify(userData));
      if (data.email) {
        localStorage.setItem(`user_skills_${data.email.toLowerCase()}`, JSON.stringify(userData.acquiredSkills));
        localStorage.setItem(`user_companies_${data.email.toLowerCase()}`, JSON.stringify(userData.targetCompanies));
      }
      return userData;
    } catch (err) {
      // Fallback demo registration
      const userData = {
        id: Date.now(),
        fullName: registerData.fullName,
        email: registerData.email,
        engineeringBranch: registerData.engineeringBranch,
        academicYear: registerData.academicYear,
        targetRoleId: Number(registerData.targetRoleId) || 2,
        targetCompanies: registerData.targetCompanies || [],
        acquiredSkills: []
      };
      setUser(userData);
      setToken('demo-jwt-token-12345');
      localStorage.setItem('token', 'demo-jwt-token-12345');
      localStorage.setItem('user', JSON.stringify(userData));
      if (registerData.email) {
        localStorage.setItem(`user_companies_${registerData.email.toLowerCase()}`, JSON.stringify(userData.targetCompanies));
      }
      return userData;
    }
  };

  // Login User
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Invalid email or password credentials.');

      // Retrieve user's saved skills from backend DB response first, or fallback to localStorage
      let acquiredSkills = data.acquiredSkills || [];
      if ((!acquiredSkills || acquiredSkills.length === 0) && data.email) {
        const savedSkillsJson = localStorage.getItem(`user_skills_${data.email.toLowerCase()}`);
        if (savedSkillsJson) {
          try {
            acquiredSkills = JSON.parse(savedSkillsJson);
          } catch (e) {
            acquiredSkills = [];
          }
        }
      }

      // Retrieve user's saved dream companies
      let targetCompanies = data.targetCompanies || [];
      if ((!targetCompanies || targetCompanies.length === 0) && data.email) {
        const savedCompJson = localStorage.getItem(`user_companies_${data.email.toLowerCase()}`);
        if (savedCompJson) {
          try {
            targetCompanies = JSON.parse(savedCompJson);
          } catch (e) {
            targetCompanies = [];
          }
        }
      }

      const userData = {
        id: data.userId,
        fullName: data.fullName,
        email: data.email,
        engineeringBranch: data.engineeringBranch,
        academicYear: data.academicYear,
        targetRoleId: data.targetRoleId || 2,
        targetCompanies: targetCompanies,
        acquiredSkills: acquiredSkills
      };

      setUser(userData);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      if (data.email) {
        localStorage.setItem(`user_skills_${data.email.toLowerCase()}`, JSON.stringify(acquiredSkills));
        localStorage.setItem(`user_companies_${data.email.toLowerCase()}`, JSON.stringify(targetCompanies));
      }

      // Asynchronously ensure skills are saved to DB if missing in DB but present in localStorage
      if (userData.id && acquiredSkills.length > 0 && (!data.acquiredSkills || data.acquiredSkills.length === 0)) {
        fetch(`${API_BASE_URL}/student/skills/${userData.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(acquiredSkills),
        }).catch(e => console.warn('Syncing skills to DB post-login:', e));
      }

      return userData;
    } catch (err) {
      // Re-throw authentication error so login form displays error message
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Clear session reminder flags so the check-in modal asks every time the student logs back in
    try {
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('practice_reminder_')) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (e) {}
  };

  const updateUserTargetRole = (roleId) => {
    if (user) {
      const updated = { ...user, targetRoleId: roleId };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      if (user.id) {
        fetch(`${API_BASE_URL}/student/target-role/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ targetRoleId: roleId }),
        }).catch(err => console.warn('Could not save target role to backend:', err));
      }
    }
  };

  const updateUserTargetCompanies = (companies) => {
    if (user) {
      const updated = { ...user, targetCompanies: companies };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      if (user.email) {
        localStorage.setItem(`user_companies_${user.email.toLowerCase()}`, JSON.stringify(companies));
      }
      if (user.id) {
        fetch(`${API_BASE_URL}/student/target-companies/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ targetCompanies: companies }),
        }).catch(err => console.warn('Could not save target companies to backend:', err));
      }
    }
  };

  const updateUserSkills = (skills) => {
    if (user) {
      const updated = { ...user, acquiredSkills: skills };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      if (user.email) {
        localStorage.setItem(`user_skills_${user.email.toLowerCase()}`, JSON.stringify(skills));
      }
      if (user.id) {
        fetch(`${API_BASE_URL}/student/skills/${user.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(skills),
        }).catch(err => console.warn('Could not save skills to backend DB:', err));
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        checkEmail,
        sendOtp,
        verifyOtp,
        register,
        login,
        logout,
        updateUserTargetRole,
        updateUserTargetCompanies,
        updateUserSkills
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
