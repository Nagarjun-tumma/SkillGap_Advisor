import React, { useState } from 'react';
import { 
  Video, Mic, ExternalLink, Sparkles, CheckCircle2, Award, 
  X, Send, Share2, ThumbsUp, Heart, Play, Film, MessageCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { virtualFeedbackService } from '../utils/virtualFeedbackService';

export const VirtualFeedbackModal = ({
  isOpen,
  onClose,
  user = null,
  onFeedbackSubmitted = null
}) => {
  const [studentName, setStudentName] = useState(user?.fullName || user?.name || '');
  const [branch, setBranch] = useState(user?.engineeringBranch || 'Computer Science & Engineering');
  const [targetRole, setTargetRole] = useState('Full Stack Java Developer');
  const [mediaType, setMediaType] = useState('VIDEO'); // 'VIDEO' | 'VOICE'
  const [platform, setPlatform] = useState('LinkedIn'); // 'LinkedIn' | 'YouTube' | 'Instagram' | 'X'
  const [postUrl, setPostUrl] = useState('');
  const [title, setTitle] = useState('');
  const [quote, setQuote] = useState('');
  const [tags, setTags] = useState('#CampusPlacements, #MGMCOENanded, #SkillGapAI');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!postUrl.trim()) {
      alert('Please enter your social media post link (LinkedIn, YouTube, or Instagram).');
      return;
    }

    setIsSubmitting(true);

    const parsedTags = tags.split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)
      .map(t => t.startsWith('#') ? t : `#${t}`);

    setTimeout(() => {
      const newEntry = virtualFeedbackService.addVirtualFeedback({
        studentName: studentName.trim() || 'Engineering Student',
        userEmail: user?.email || 'student@college.edu',
        branch: branch.trim(),
        college: "MGM's College of Engineering, Nanded",
        targetRole,
        mediaType,
        platform,
        postUrl,
        title: title.trim() || 'My Placement Journey with AI Career Advisor',
        quote: quote.trim() || 'The personalized roadmaps and diagnostic assessments took away all confusion. I knew exactly which LeetCode topics to practice each week!',
        tags: parsedTags
      });

      confetti({ particleCount: 90, spread: 65, origin: { y: 0.6 } });
      setIsSubmitting(false);
      setSubmitted(true);

      if (onFeedbackSubmitted) {
        onFeedbackSubmitted(newEntry);
      }
    }, 600);
  };

  const resetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="split-modal-overlay" style={{ zIndex: 100001 }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        maxWidth: '680px',
        width: '95%',
        maxHeight: '92vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
        border: '1.5px solid #e2e8f0',
        animation: 'fadeIn 0.25s ease'
      }}>
        
        {/* MODAL HEADER */}
        <div style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)',
          color: '#ffffff',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          position: 'relative'
        }}>
          <button
            onClick={resetAndClose}
            style={{
              position: 'absolute',
              top: '18px',
              right: '18px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              color: '#ffffff',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: '#fef08a', background: 'rgba(254, 240, 138, 0.2)', padding: '3px 10px', borderRadius: '6px', marginBottom: '8px' }}>
            <Share2 size={13} />
            <span>Campus Social Ambassador &bull; Virtual Testimonial</span>
          </div>

          <h3 style={{ fontSize: '20px', fontWeight: 900, margin: 0, color: '#ffffff' }}>
            Share Your Video or Voice Feedback
          </h3>
          <p style={{ fontSize: '12.5px', color: '#c7d2fe', marginTop: '4px', lineHeight: 1.5 }}>
            Upload a short reel, video, or voice review on social media (LinkedIn, YouTube, Instagram) and paste your link to be featured on our site!
          </p>
        </div>

        {/* MODAL BODY */}
        <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {submitted ? (
            /* SUCCESS CONFIRMATION SCREEN */
            <div style={{ textAlign: 'center', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={36} />
              </div>

              <div>
                <h4 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  Testimonial Featured Successfully! 🌟
                </h4>
                <p style={{ fontSize: '13px', color: '#64748b', marginTop: '6px', maxWidth: '440px', lineHeight: 1.5 }}>
                  Your social media review has been verified and added to the <strong>Campus Social Media Video Wall</strong>. Thank you for inspiring your juniors at MGM COE Nanded!
                </p>
              </div>

              <div style={{ padding: '12px 20px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '12px', color: '#475569' }}>
                🏅 <strong>Ambassador Badge Awarded:</strong> <em>🌟 Verified Campus Placement Ambassador</em>
              </div>

              <button
                onClick={resetAndClose}
                style={{
                  padding: '12px 28px',
                  borderRadius: '12px',
                  background: '#7c3aed',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)'
                }}
              >
                Done &amp; View Video Wall
              </button>
            </div>
          ) : (
            /* SUBMISSION FORM */
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* Media Format Picker: Video vs Voice */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '8px' }}>
                  1. Choose Feedback Format
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div
                    onClick={() => setMediaType('VIDEO')}
                    style={{
                      padding: '14px',
                      borderRadius: '14px',
                      border: mediaType === 'VIDEO' ? '2px solid #7c3aed' : '1px solid #e2e8f0',
                      background: mediaType === 'VIDEO' ? '#f5f3ff' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#7c3aed', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Video size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>Video Testimonial</div>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Reel, YouTube Short, or Post</span>
                    </div>
                  </div>

                  <div
                    onClick={() => setMediaType('VOICE')}
                    style={{
                      padding: '14px',
                      borderRadius: '14px',
                      border: mediaType === 'VOICE' ? '2px solid #059669' : '1px solid #e2e8f0',
                      background: mediaType === 'VOICE' ? '#ecfdf5' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#059669', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Mic size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>Voice / Audio Note</div>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Audio Clip or Podcast Post</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Platform Selection */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '8px' }}>
                  2. Uploaded Social Media Platform
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                  {[
                    { id: 'LinkedIn', label: 'LinkedIn', color: '#0a66c2', bg: '#eff6ff' },
                    { id: 'YouTube', label: 'YouTube / Shorts', color: '#ef4444', bg: '#fef2f2' },
                    { id: 'Instagram', label: 'Instagram Reels', color: '#ec4899', bg: '#fdf2f8' },
                    { id: 'X', label: 'X (Twitter)', color: '#0f172a', bg: '#f8fafc' },
                  ].map(p => {
                    const isSelected = platform === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setPlatform(p.id)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '12px',
                          border: isSelected ? `2px solid ${p.color}` : '1px solid #e2e8f0',
                          background: isSelected ? p.bg : '#ffffff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          fontWeight: 800,
                          fontSize: '12px',
                          color: isSelected ? p.color : '#475569',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <span>{p.label}</span>
                        {isSelected && <CheckCircle2 size={13} color={p.color} />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Social Media Post URL (Key Input) */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '6px' }}>
                  3. Social Media Video / Voice Link <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder={`Paste your ${platform} link (e.g. https://${platform.toLowerCase()}.com/...)`}
                  value={postUrl}
                  onChange={(e) => setPostUrl(e.target.value)}
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
                <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'block' }}>
                  💡 Links from LinkedIn posts, YouTube Shorts, or Instagram Reels are directly embedded on our site.
                </span>
              </div>

              {/* Student Name & Branch Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '6px' }}>
                    Student Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ishwari"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
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
                    Department &amp; College
                  </label>
                  <input
                    type="text"
                    value={`${branch} • MGM COE Nanded`}
                    onChange={(e) => setBranch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '13px',
                      background: '#f8fafc',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Headline / Title */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '6px' }}>
                  Video Headline / Placement Takeaway
                </label>
                <input
                  type="text"
                  placeholder="e.g. How AI Skill Gap Advisor helped me clear my Google OA round!"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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

              {/* Description / Feedback Text */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '6px' }}>
                  Summary of Your Experience / Placement Advice for Juniors
                </label>
                <textarea
                  rows={3}
                  placeholder="Share how the roadmap, LeetCode recommendations, or diagnostic tests helped your placement preparation..."
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    lineHeight: 1.5,
                    resize: 'none',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Hashtags */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '6px' }}>
                  Campus Hashtags
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '12.5px',
                    color: '#64748b',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={resetAndClose}
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
                  <Send size={15} />
                  <span>{isSubmitting ? 'Publishing to Showcase...' : 'Publish to Campus Video Wall'}</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};

