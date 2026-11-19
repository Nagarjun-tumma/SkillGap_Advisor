import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Building2, MapPin, Calendar, ExternalLink, 
  CheckCircle2, AlertTriangle, Sparkles, ChevronDown, ChevronUp, 
  Zap, Award, FileText, Search, Star, RefreshCw
} from 'lucide-react';

export const LinkedInJobSkillsCard = ({ roleId, roleName, userSkills = [], onAddSkillsToRoadmap }) => {
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [customJobUrl, setCustomJobUrl] = useState('');
  const [customText, setCustomText] = useState('');
  const [isExtractingCustom, setIsExtractingCustom] = useState(false);
  const [showExtractInput, setShowExtractInput] = useState(false);

  // Fallback catalog matching Backend LinkedInJobService
  const fallbackJobs = {
    1: {
      roleId: 1,
      roleName: 'AI & Machine Learning Engineer',
      jobTitle: 'Senior AI / Machine Learning Engineer (Generative AI)',
      company: 'NVIDIA',
      companyLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg',
      location: 'Bengaluru, Karnataka, India (Hybrid)',
      postedDate: '2 days ago',
      linkedInUrl: 'https://www.linkedin.com/jobs/view/3892018491',
      jobType: 'Full-Time',
      experienceLevel: 'Mid-Senior level (3-5 yrs)',
      salaryRange: '₹16 - ₹24 LPA',
      fullDescription: `About the job:\nNVIDIA is looking for a passionate AI & Machine Learning Engineer to design, scale, and optimize next-generation deep learning architectures and LLM pipelines. You will work on high-throughput model inference, distributed training, and dataset engineering.\n\nBasic Qualifications / Required Skills:\n- Strong hands-on proficiency in Python and C++ for model development & performance optimization.\n- Deep understanding of Machine Learning fundamentals, neural network architectures, Transformers, and gradient descent.\n- Experience with Deep Learning frameworks such as PyTorch or TensorFlow for training and fine-tuning models.\n- Solid foundation in Data Structures & Algorithms for efficient memory allocation.\n- Proficiency in SQL & MySQL for querying large datasets and feature stores.\n\nPreferred Qualifications / Bonus Skills:\n- Experience with Docker & Kubernetes for model deployment and microservice orchestration.\n- Knowledge of Git & GitHub for collaborative code reviews.`,
      requiredSkills: [
        { name: 'Python', category: 'Programming Core', skillType: 'REQUIRED', importance: 'MUST_HAVE', contextSnippet: 'Strong hands-on proficiency in Python for model development & performance optimization.' },
        { name: 'Machine Learning', category: 'Data & AI', skillType: 'REQUIRED', importance: 'CRITICAL', contextSnippet: 'Deep understanding of Machine Learning fundamentals, neural network architectures, and Transformers.' },
        { name: 'Deep Learning', category: 'Data & AI', skillType: 'REQUIRED', importance: 'CRITICAL', contextSnippet: 'Experience with Deep Learning frameworks such as PyTorch or TensorFlow for training and fine-tuning models.' },
        { name: 'Data Structures & Algorithms', category: 'Computer Science', skillType: 'REQUIRED', importance: 'MUST_HAVE', contextSnippet: 'Solid foundation in Data Structures & Algorithms for efficient memory allocation.' },
        { name: 'SQL & MySQL', category: 'Database', skillType: 'REQUIRED', importance: 'MUST_HAVE', contextSnippet: 'Proficiency in SQL & MySQL for querying large datasets and feature stores.' }
      ],
      preferredSkills: [
        { name: 'Docker & Kubernetes', category: 'DevOps & Cloud', skillType: 'PREFERRED', importance: 'NICE_TO_HAVE', contextSnippet: 'Experience with Docker & Kubernetes for model deployment and microservice orchestration.' },
        { name: 'Git & GitHub', category: 'Tools & Version Control', skillType: 'PREFERRED', importance: 'NICE_TO_HAVE', contextSnippet: 'Knowledge of Git & GitHub for collaborative code reviews.' }
      ]
    },
    2: {
      roleId: 2,
      roleName: 'Full Stack Java Developer',
      jobTitle: 'Senior Full Stack Java Engineer (Spring Boot & React)',
      company: 'Microsoft',
      companyLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
      location: 'Hyderabad, Telangana, India (On-site)',
      postedDate: '1 day ago',
      linkedInUrl: 'https://www.linkedin.com/jobs/view/3892018492',
      jobType: 'Full-Time',
      experienceLevel: 'Mid-Senior level (2-4 yrs)',
      salaryRange: '₹12 - ₹18 LPA',
      fullDescription: `About the job:\nMicrosoft Cloud & Enterprise team is hiring a Full Stack Java Developer. You will architect enterprise-grade microservices, develop clean React interfaces, and maintain highly secure cloud backends.\n\nBasic Qualifications / Required Skills:\n- Core expertise in Java (Java 17/21), Object-Oriented Programming, Multithreading, and Collections.\n- Hands-on experience with Spring Boot, Spring Security, JPA Hibernate, and Dependency Injection.\n- Strong frontend skills in React.js, JSX, Hooks, State Management, and modern JavaScript.\n- Relational database proficiency in SQL & MySQL schema design and complex queries.\n- Production experience with REST API Design, OpenAPI/Swagger, and JSON API standards.\n- Version control proficiency using Git & GitHub for feature branching.\n\nPreferred Qualifications / Bonus Skills:\n- Exposure to Docker & Kubernetes for containerized microservices deployment.\n- Experience with System Design, distributed caching (Redis), and message queues.`,
      requiredSkills: [
        { name: 'Java', category: 'Programming Core', skillType: 'REQUIRED', importance: 'CRITICAL', contextSnippet: 'Core expertise in Java (Java 17/21), Object-Oriented Programming, Multithreading.' },
        { name: 'Spring Boot', category: 'Framework', skillType: 'REQUIRED', importance: 'CRITICAL', contextSnippet: 'Hands-on experience with Spring Boot, Spring Security, JPA Hibernate.' },
        { name: 'React.js', category: 'Frontend UI', skillType: 'REQUIRED', importance: 'MUST_HAVE', contextSnippet: 'Strong frontend skills in React.js, JSX, Hooks, State Management.' },
        { name: 'SQL & MySQL', category: 'Database', skillType: 'REQUIRED', importance: 'MUST_HAVE', contextSnippet: 'Relational database proficiency in SQL & MySQL schema design and complex queries.' },
        { name: 'REST API Design', category: 'API Architecture', skillType: 'REQUIRED', importance: 'MUST_HAVE', contextSnippet: 'Production experience with REST API Design, OpenAPI/Swagger, and JSON API standards.' },
        { name: 'Git & GitHub', category: 'DevOps & Tools', skillType: 'REQUIRED', importance: 'MUST_HAVE', contextSnippet: 'Version control proficiency using Git & GitHub for feature branching.' }
      ],
      preferredSkills: [
        { name: 'Docker & Kubernetes', category: 'DevOps & Cloud', skillType: 'PREFERRED', importance: 'NICE_TO_HAVE', contextSnippet: 'Exposure to Docker & Kubernetes for containerized microservices deployment.' },
        { name: 'System Design', category: 'Core Architecture', skillType: 'PREFERRED', importance: 'BONUS', contextSnippet: 'Experience with System Design, distributed caching (Redis), and message queues.' }
      ]
    }
  };

  useEffect(() => {
    fetchLinkedInJob();
  }, [roleId, roleName]);

  const fetchLinkedInJob = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:8080/api/jobs/linkedin/';
      if (roleId) {
        url += roleId;
      } else if (roleName) {
        url = `http://localhost:8080/api/jobs/linkedin/role?name=${encodeURIComponent(roleName)}`;
      } else {
        url += '2';
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setJobData(data);
      } else {
        const fallback = fallbackJobs[roleId] || fallbackJobs[2];
        setJobData(fallback);
      }
    } catch (err) {
      const fallback = fallbackJobs[roleId] || fallbackJobs[2];
      setJobData(fallback);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomExtraction = async (e) => {
    e.preventDefault();
    if (!customText.trim() && !customJobUrl.trim()) return;

    setIsExtractingCustom(true);
    try {
      const res = await fetch('http://localhost:8080/api/jobs/extract-skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobUrl: customJobUrl,
          jobDescriptionText: customText
        })
      });

      if (res.ok) {
        const extracted = await res.json();
        setJobData(extracted);
        setShowExtractInput(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsExtractingCustom(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        background: '#0f172a',
        borderRadius: '20px',
        border: '1px solid #1e293b',
        padding: '32px',
        textAlign: 'center',
        color: '#94a3b8'
      }}>
        <p style={{ margin: 0, fontWeight: 600 }}>Loading LinkedIn Job Description & Skills...</p>
      </div>
    );
  }

  if (!jobData) return null;

  const normalizedUserSkillNames = new Set(
    userSkills.map(s => (typeof s === 'string' ? s : s.skillName || s.name || '').toLowerCase())
  );

  const requiredSkills = jobData.requiredSkills || [];
  const preferredSkills = jobData.preferredSkills || [];
  const acquiredRequiredCount = requiredSkills.filter(s => normalizedUserSkillNames.has(s.name.toLowerCase())).length;
  const totalRequiredCount = requiredSkills.length;
  const matchPercentage = totalRequiredCount > 0 ? Math.round((acquiredRequiredCount / totalRequiredCount) * 100) : 0;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      borderRadius: '24px',
      border: '1px solid #334155',
      padding: '28px',
      color: '#ffffff',
      boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.5)',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      boxSizing: 'border-box',
      width: '100%',
      overflow: 'hidden'
    }}>
      {/* Top Header Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '20px',
        paddingBottom: '20px',
        borderBottom: '1px solid #334155'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: '280px' }}>
          {/* Constrained Company Logo Container */}
          <div style={{
            width: '56px',
            height: '56px',
            minWidth: '56px',
            minHeight: '56px',
            borderRadius: '16px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            padding: '6px',
            boxSizing: 'border-box'
          }}>
            <img 
              src={jobData.companyLogoUrl || 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png'} 
              alt={jobData.company} 
              style={{
                maxWidth: '44px',
                maxHeight: '44px',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain'
              }}
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png'; }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
              <span style={{
                background: 'rgba(59, 130, 246, 0.15)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                color: '#60a5fa',
                fontSize: '11px',
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: '9999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Briefcase size={12} />
                <span>LinkedIn Job Posting</span>
              </span>
              <span style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#34d399',
                fontSize: '11px',
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: '9999px'
              }}>
                {jobData.jobType || 'Full-Time'}
              </span>
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.01em' }}>
              {jobData.jobTitle}
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#94a3b8', fontSize: '13px', marginTop: '4px', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 700, color: '#e2e8f0' }}>{jobData.company}</span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={13} /> {jobData.location}</span>
              {jobData.salaryRange && (
                <>
                  <span>•</span>
                  <span style={{ color: '#34d399', fontWeight: 700 }}>{jobData.salaryRange}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            onClick={() => setShowExtractInput(!showExtractInput)}
            style={{
              background: '#1e293b',
              border: '1px solid #475569',
              color: '#e2e8f0',
              padding: '8px 14px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Search size={14} color="#60a5fa" />
            <span>Parse Custom Posting</span>
          </button>
          
          <a 
            href={jobData.linkedInUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              background: '#2563eb',
              color: '#ffffff',
              padding: '8px 16px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
            }}
          >
            <span>View on LinkedIn</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Custom URL / Text Parser Drawer */}
      {showExtractInput && (
        <div style={{
          background: '#090d16',
          border: '1px solid #3b82f6',
          borderRadius: '16px',
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} color="#60a5fa" /> Paste LinkedIn Job URL or Raw Job Posting Text
            </span>
            <button onClick={() => setShowExtractInput(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '12px' }}>Close</button>
          </div>
          <form onSubmit={handleCustomExtraction} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input 
              type="text" 
              placeholder="LinkedIn Job URL (e.g. https://www.linkedin.com/jobs/view/...)" 
              value={customJobUrl}
              onChange={(e) => setCustomJobUrl(e.target.value)}
              style={{
                width: '100%',
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '12px',
                color: '#ffffff',
                boxSizing: 'border-box'
              }}
            />
            <textarea 
              rows={3}
              placeholder="Paste job description text here..."
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              style={{
                width: '100%',
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '12px',
                color: '#ffffff',
                boxSizing: 'border-box'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                type="submit" 
                disabled={isExtractingCustom}
                style={{
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {isExtractingCustom ? <RefreshCw size={14} className="animate-spin" /> : <Zap size={14} />}
                <span>Extract Required & Preferred Skills</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Match Score & Skill Gap Summary Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px'
      }}>
        <div style={{
          background: '#090d16',
          border: '1px solid #1e293b',
          borderRadius: '16px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Required Skill Match Rate</div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff', marginTop: '2px' }}>
              {matchPercentage}%
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#94a3b8', marginLeft: '6px' }}>({acquiredRequiredCount}/{totalRequiredCount} Skills)</span>
            </div>
          </div>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: matchPercentage >= 80 ? 'rgba(16, 185, 129, 0.2)' : matchPercentage >= 50 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            border: `1px solid ${matchPercentage >= 80 ? '#10b981' : matchPercentage >= 50 ? '#f59e0b' : '#ef4444'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '14px',
            color: matchPercentage >= 80 ? '#34d399' : matchPercentage >= 50 ? '#fbbf24' : '#f87171'
          }}>
            {matchPercentage}%
          </div>
        </div>

        <div style={{
          background: '#090d16',
          border: '1px solid #1e293b',
          borderRadius: '16px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Extracted Required Skills</div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: '#60a5fa', marginTop: '2px' }}>{requiredSkills.length} Core Skills</div>
          </div>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#60a5fa'
          }}>
            <Zap size={20} />
          </div>
        </div>

        <div style={{
          background: '#090d16',
          border: '1px solid #1e293b',
          borderRadius: '16px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Extracted Preferred Skills</div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: '#fbbf24', marginTop: '2px' }}>{preferredSkills.length} Nice-to-Have</div>
          </div>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fbbf24'
          }}>
            <Star size={20} />
          </div>
        </div>
      </div>

      {/* Extracted Skills Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Required Skills Grid */}
        <div>
          <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🎯 Extracted Required Skills</span>
            <span style={{ fontSize: '12px', fontWeight: 500, color: '#94a3b8' }}>({requiredSkills.length} Must-Have Skills in Job Posting)</span>
          </h4>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '12px'
          }}>
            {requiredSkills.map((skill, idx) => {
              const isAcquired = normalizedUserSkillNames.has(skill.name.toLowerCase());
              return (
                <div 
                  key={idx}
                  style={{
                    background: isAcquired ? 'rgba(6, 78, 59, 0.25)' : '#090d16',
                    border: `1px solid ${isAcquired ? 'rgba(16, 185, 129, 0.35)' : '#1e293b'}`,
                    borderRadius: '14px',
                    padding: '14px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justify: 'space-between', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        background: isAcquired ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isAcquired ? '#34d399' : '#fbbf24',
                        flexShrink: 0
                      }}>
                        {isAcquired ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>{skill.name}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>{skill.category}</div>
                      </div>
                    </div>

                    <span style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      background: isAcquired ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      border: `1px solid ${isAcquired ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                      color: isAcquired ? '#34d399' : '#fbbf24'
                    }}>
                      {isAcquired ? 'Acquired' : 'Skill Gap'}
                    </span>
                  </div>

                  {skill.contextSnippet && (
                    <div style={{ fontSize: '12px', color: '#cbd5e1', fontStyle: 'italic', borderLeft: '2px solid #475569', paddingLeft: '8px', marginTop: '4px' }}>
                      "{skill.contextSnippet}"
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Preferred Skills Grid */}
        {preferredSkills.length > 0 && (
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff', margin: '12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Star size={16} color="#fbbf24" />
              <span>⭐ Extracted Preferred & Bonus Skills</span>
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#94a3b8' }}>({preferredSkills.length} Nice-to-Have Skills)</span>
            </h4>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '12px'
            }}>
              {preferredSkills.map((skill, idx) => {
                const isAcquired = normalizedUserSkillNames.has(skill.name.toLowerCase());
                return (
                  <div 
                    key={idx}
                    style={{
                      background: '#090d16',
                      border: '1px solid #1e293b',
                      borderRadius: '14px',
                      padding: '14px 16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justify: 'space-between', width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          background: isAcquired ? 'rgba(16, 185, 129, 0.2)' : '#1e293b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isAcquired ? '#34d399' : '#94a3b8',
                          flexShrink: 0
                        }}>
                          {isAcquired ? <CheckCircle2 size={16} /> : <Star size={16} />}
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>{skill.name}</div>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>{skill.category}</div>
                        </div>
                      </div>

                      <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '3px 8px',
                        borderRadius: '9999px',
                        background: '#1e293b',
                        border: '1px solid #334155',
                        color: isAcquired ? '#34d399' : '#cbd5e1'
                      }}>
                        {isAcquired ? 'Acquired' : 'Preferred'}
                      </span>
                    </div>

                    {skill.contextSnippet && (
                      <div style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic', borderLeft: '2px solid #334155', paddingLeft: '8px', marginTop: '4px' }}>
                        "{skill.contextSnippet}"
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Raw Description Accordion View */}
      {jobData.fullDescription && (
        <div style={{ borderTop: '1px solid #334155', paddingTop: '14px', marginTop: '8px' }}>
          <button 
            onClick={() => setShowFullDescription(!showFullDescription)}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={15} color="#60a5fa" />
              {showFullDescription ? 'Hide Original LinkedIn Job Posting Text' : 'View Full LinkedIn Job Description Text'}
            </span>
            {showFullDescription ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showFullDescription && (
            <div style={{
              marginTop: '12px',
              padding: '16px',
              background: '#090d16',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              fontSize: '12px',
              color: '#cbd5e1',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              lineHeight: 1.6,
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
              {jobData.fullDescription}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
