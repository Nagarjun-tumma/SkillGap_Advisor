import React, { useState } from 'react';
import { 
  Star, Heart, Sparkles, CheckCircle2, MessageSquare, X, Send, 
  Brain, Lightbulb, BookOpen, ThumbsUp, Award, Smile, Frown, Meh
} from 'lucide-react';
import { feedbackService } from '../utils/feedbackService';

export const FeedbackRatingModal = ({
  isOpen,
  onClose,
  onSubmit,
  title = 'Learning Milestone',
  type = 'ASSESSMENT', // 'ASSESSMENT' | 'ROADMAP_STEP' | 'GENERAL'
  user = null,
  score = null,
  skillName = ''
}) => {
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [understandingLevel, setUnderstandingLevel] = useState('HIGH');
  const [feeling, setFeeling] = useState('Confident 🤩');
  const [selectedTags, setSelectedTags] = useState(['Interview Relevant', 'Crystal Clear Explanations']);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const RATING_DESCRIPTIONS = {
    1: 'Needs Major Improvement 😞',
    2: 'Fair, but quite difficult 😕',
    3: 'Good & Informative 🙂',
    4: 'Very Good & Helpful 😃',
    5: 'Outstanding & Placement Ready! 🤩'
  };

  const UNDERSTANDING_OPTIONS = [
    {
      id: 'HIGH',
      label: 'Deep Understanding',
      desc: 'I fully grasp the concepts and feel ready for tech interview rounds.',
      icon: Brain,
      color: '#10b981',
      bg: '#ecfdf5',
      border: '#a7f3d0'
    },
    {
      id: 'MEDIUM',
      label: 'Moderate Grasp',
      desc: 'Understood the core principles, but need hands-on code practice.',
      icon: Lightbulb,
      color: '#f59e0b',
      bg: '#fffbeb',
      border: '#fde68a'
    },
    {
      id: 'LOW',
      label: 'Foundational / Challenging',
      desc: 'Found it difficult; I need to review prerequisite roadmap resources.',
      icon: BookOpen,
      color: '#ef4444',
      bg: '#fef2f2',
      border: '#fca5a5'
    }
  ];

  const FEELING_OPTIONS = [
    { label: 'Confident 🤩', color: '#10b981' },
    { label: 'Motivated 🚀', color: '#7c3aed' },
    { label: 'Satisfied 😊', color: '#0284c7' },
    { label: 'Needs Practice 🧐', color: '#d97706' },
    { label: 'Overwhelmed 🤯', color: '#ef4444' }
  ];

  const QUICK_TAGS = [
    'Interview Relevant',
    'Crystal Clear Explanations',
    'Challenging Scenarios',
    'Great Company Insights',
    'Helped Spot My Gap',
    'Practical & Hands-On',
    'Need More Examples'
  ];

  const handleToggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const feedbackData = {
      userName: user?.fullName || 'Engineering Student',
      userEmail: user?.email || 'student@college.edu',
      branch: user?.engineeringBranch || 'CSE',
      targetTitle: title,
      type: type,
      rating: rating,
      understandingLevel: understandingLevel,
      feeling: feeling,
      tags: selectedTags,
      comment: comment.trim()
    };

    // Save to centralized service & localStorage
    const saved = feedbackService.addFeedback(feedbackData);
    setSubmitted(true);

    if (onSubmit) {
      onSubmit(saved);
    }

    // Auto-close after brief celebration
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1600);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(7, 10, 18, 0.78)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '16px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '580px',
        maxHeight: '92vh',
        overflowY: 'auto',
        padding: '30px',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.4)',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748b',
            transition: 'all 0.2s'
          }}
        >
          <X size={16} />
        </button>

        {submitted ? (
          /* SUCCESS STATE */
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: '#ecfdf5',
              border: '2px solid #10b981',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.2)'
            }}>
              <CheckCircle2 size={40} />
            </div>

            <div>
              <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                Thank You for Your Feedback! 🎉
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '6px', maxWidth: '380px' }}>
                Your rating and feelings help our AI advisor calibrate step difficulty and track your placement readiness!
              </p>
            </div>

            <div style={{
              padding: '10px 18px',
              borderRadius: '12px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              fontSize: '12px',
              fontWeight: 700,
              color: '#334155'
            }}>
              Recorded for: <strong>{title}</strong> &bull; {feeling}
            </div>
          </div>
        ) : (
          /* FORM STATE */
          <>
            {/* Header */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '9999px', background: '#f3e8ff', color: '#7c3aed', fontSize: '11px', fontWeight: 800, marginBottom: '8px' }}>
                <Sparkles size={14} />
                <span>{type === 'ASSESSMENT' ? 'Post-Assessment Feedback' : 'Step Completion Review'}</span>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                How was your learning experience?
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                We want to understand your <strong>understanding level</strong>, <strong>feelings</strong>, and rating for <strong>{title}</strong>.
              </p>
            </div>

            {/* 1. Star Rating */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '16px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.04em' }}>
                Overall Rating &amp; Quality
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 2, 3, 4, 5].map((star) => {
                  const activeStar = hoveredRating || rating;
                  const isFilled = star <= activeStar;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        transform: (hoveredRating === star || rating === star) ? 'scale(1.2)' : 'scale(1)',
                        transition: 'transform 0.15s ease'
                      }}
                    >
                      <Star
                        size={28}
                        fill={isFilled ? '#f59e0b' : 'transparent'}
                        color={isFilled ? '#f59e0b' : '#cbd5e1'}
                      />
                    </button>
                  );
                })}
              </div>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>
                {RATING_DESCRIPTIONS[hoveredRating || rating]}
              </span>
            </div>

            {/* 2. Understanding Level Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>
                1. How well did you understand this topic? (Understanding Level)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                {UNDERSTANDING_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = understandingLevel === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setUnderstandingLevel(opt.id)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: isSelected ? `2px solid ${opt.color}` : '1px solid #e2e8f0',
                        background: isSelected ? opt.bg : '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        transition: 'all 0.15s'
                      }}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '10px',
                        background: isSelected ? opt.color : '#f1f5f9',
                        color: isSelected ? '#ffffff' : opt.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Icon size={18} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>
                          {opt.label}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          {opt.desc}
                        </div>
                      </div>
                      {isSelected && (
                        <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: opt.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <CheckCircle2 size={14} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Feelings & Emotions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>
                2. How are you feeling right now? (Student Emotion)
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {FEELING_OPTIONS.map((item) => {
                  const isSelected = feeling === item.label;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setFeeling(item.label)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '9999px',
                        border: isSelected ? `2px solid ${item.color}` : '1px solid #cbd5e1',
                        background: isSelected ? '#0f172a' : '#f8fafc',
                        color: isSelected ? '#ffffff' : '#334155',
                        fontSize: '12px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Quick Tags */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>
                3. What stood out? (Select all that apply)
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {QUICK_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleToggleTag(tag)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: isSelected ? '1px solid #7c3aed' : '1px solid #e2e8f0',
                        background: isSelected ? '#f3e8ff' : '#ffffff',
                        color: isSelected ? '#7c3aed' : '#64748b',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Optional Comments */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>
                4. Any specific feedback or questions? (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="e.g. The explanation for hash collision was super clear, or I need more practice with tree traversals..."
                rows={2}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '12px',
                  outline: 'none',
                  fontFamily: 'inherit',
                  resize: 'none'
                }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '12px 18px',
                  borderRadius: '12px',
                  background: '#f1f5f9',
                  color: '#64748b',
                  fontSize: '12px',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Skip for now
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 900,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)'
                }}
              >
                <Send size={15} />
                <span>Submit Feedback &amp; Finish</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

