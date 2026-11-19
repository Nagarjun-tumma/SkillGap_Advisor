import React, { useState } from 'react';
import { 
  Check, Lock, Sparkles, ChevronRight, Briefcase, 
  ArrowRight, CheckCircle2, Zap, Trophy, Rocket, 
  Clock, Star, BookOpen, Code, HelpCircle, Award,
  Link2, Compass
} from 'lucide-react';

export const ChainedRoadmapFlow = ({
  steps = [],
  roleConfig,
  acquiredSkillNames = [],
  currentPriorityStep,
  activeCompanyBlueprint,
  getCompanySkillWeight,
  getCompanySkillNote,
  onOpenStepModal,
  onOpenFullAssessment,
  fullAssessmentData
}) => {
  const [hoveredStepId, setHoveredStepId] = useState(null);

  const totalSteps = steps.length;
  const acquiredCount = steps.filter(s => acquiredSkillNames.includes(s.skillName)).length;
  const progressPct = totalSteps > 0 ? Math.round((acquiredCount / totalSteps) * 100) : 0;
  const totalXP = totalSteps * 150;
  const earnedXP = acquiredCount * 150;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      position: 'relative',
      width: '100%',
      maxWidth: '1060px',
      margin: '0 auto'
    }}>

      {/* Gamified Chain Quest Header & Progress Bar */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
        borderRadius: '24px',
        padding: '24px 28px',
        color: '#ffffff',
        boxShadow: '0 16px 36px -10px rgba(15, 23, 42, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        border: '1px solid #334155'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '9999px', background: 'rgba(124, 58, 237, 0.3)', border: '1px solid rgba(167, 139, 250, 0.4)', color: '#c4b5fd', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
              <Link2 size={13} color="#a78bfa" />
              <span>Interactive Skill Chaining Engine</span>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
              Placement Mastery Chain • <span style={{ color: '#a5b4fc' }}>{roleConfig.roleName}</span>
            </h3>
            <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: '4px 0 0 0' }}>
              Step-by-step interconnected milestones. Each completed node unlocks higher campus interview competencies.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* XP Pill */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              padding: '8px 16px',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Zap size={16} color="#fef08a" />
              <div>
                <span style={{ fontSize: '10px', color: '#cbd5e1', display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>Career XP</span>
                <strong style={{ fontSize: '14px', color: '#fef08a', fontWeight: 900 }}>{earnedXP} / {totalXP} XP</strong>
              </div>
            </div>

            {/* Mastery Pill */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              padding: '8px 16px',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Trophy size={16} color="#34d399" />
              <div>
                <span style={{ fontSize: '10px', color: '#cbd5e1', display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>Chain Mastery</span>
                <strong style={{ fontSize: '14px', color: '#34d399', fontWeight: 900 }}>{acquiredCount}/{totalSteps} Milestones ({progressPct}%)</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Animated Progress Track */}
        <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.15)', borderRadius: '9999px', overflow: 'hidden', position: 'relative' }}>
          <div style={{
            height: '100%',
            width: `${progressPct}%`,
            background: 'linear-gradient(90deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%)',
            borderRadius: '9999px',
            boxShadow: '0 0 12px rgba(139, 92, 246, 0.6)',
            transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
          }} />
        </div>
      </div>

      {/* THE CHAINED ROADMAP JOURNEY */}
      <div style={{ position: 'relative', padding: '10px 0 20px 0' }}>
        
        {/* START OF JOURNEY NODE */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '8px', position: 'relative', zIndex: 3 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px',
            borderRadius: '9999px',
            background: '#ffffff',
            border: '2px solid #7c3aed',
            color: '#7c3aed',
            fontWeight: 900,
            fontSize: '12px',
            boxShadow: '0 4px 16px rgba(124, 58, 237, 0.2)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            <Rocket size={15} color="#7c3aed" />
            <span>Start Career Quest: Foundation Level</span>
          </div>

          {/* Vertical Link connecting Start Node to Step 1 */}
          <div style={{
            width: '4px',
            height: '28px',
            background: acquiredSkillNames.includes(steps[0]?.skillName) 
              ? 'linear-gradient(180deg, #7c3aed 0%, #10b981 100%)' 
              : 'linear-gradient(180deg, #7c3aed 0%, #cbd5e1 100%)',
            borderRadius: '2px',
            margin: '4px 0'
          }} />
        </div>

        {/* INTERLINKED MILESTONES CHAIN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', position: 'relative' }}>
          
          {steps.map((step, idx) => {
            const isAcquired = acquiredSkillNames.includes(step.skillName);
            const isCurrentPriority = currentPriorityStep && currentPriorityStep.id === step.id;
            const isUpcoming = !isAcquired && !isCurrentPriority;
            const isEven = idx % 2 === 0; // Even left, odd right
            const nextStep = steps[idx + 1];
            const nextAcquired = nextStep && acquiredSkillNames.includes(nextStep.skillName);
            const isHovered = hoveredStepId === step.id;

            // Company intel
            const companyWeight = activeCompanyBlueprint ? getCompanySkillWeight(activeCompanyBlueprint, step.skillName) : null;
            const companyNote = activeCompanyBlueprint ? getCompanySkillNote(activeCompanyBlueprint, step.skillName) : null;

            return (
              <div key={step.id} style={{ position: 'relative' }}>
                
                {/* 3-Column Alternating Chain Row */}
                <div 
                  className="roadmap-chain-grid"
                  onMouseEnter={() => setHoveredStepId(step.id)}
                  onMouseLeave={() => setHoveredStepId(null)}
                >
                  
                  {/* LEFT COLUMN: Card (if even) OR Milestone Intel (if odd) */}
                  <div className="chain-col-left" style={{ padding: '8px 12px', display: 'flex', justifyContent: 'flex-end' }}>
                    {isEven ? (
                      <MilestoneQuestCard
                        step={step}
                        idx={idx}
                        isAcquired={isAcquired}
                        isCurrentPriority={isCurrentPriority}
                        isUpcoming={isUpcoming}
                        isHovered={isHovered}
                        companyWeight={companyWeight}
                        companyNote={companyNote}
                        activeCompanyBlueprint={activeCompanyBlueprint}
                        onOpenModal={() => onOpenStepModal(step)}
                        side="left"
                      />
                    ) : (
                      <MilestoneIntelPill
                        step={step}
                        idx={idx}
                        isAcquired={isAcquired}
                        isCurrentPriority={isCurrentPriority}
                        companyWeight={companyWeight}
                        activeCompanyBlueprint={activeCompanyBlueprint}
                        side="left"
                      />
                    )}
                  </div>

                  {/* CENTER COLUMN: Central Chain Spine & Node Pin */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: 2,
                    height: '100%'
                  }}>
                    
                    {/* Upper Chain Connector (from previous node) */}
                    <div style={{
                      width: '4px',
                      height: '24px',
                      background: isAcquired ? '#10b981' : isCurrentPriority ? 'linear-gradient(180deg, #10b981 0%, #7c3aed 100%)' : '#cbd5e1',
                      borderRadius: '2px',
                      boxShadow: isAcquired ? '0 0 8px rgba(16, 185, 129, 0.4)' : isCurrentPriority ? '0 0 10px rgba(124, 58, 237, 0.5)' : 'none'
                    }} />

                    {/* Central Milestone Pin Orb */}
                    <div 
                      onClick={() => onOpenStepModal(step)}
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: isAcquired
                          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                          : isCurrentPriority
                            ? 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)'
                            : '#ffffff',
                        border: isAcquired
                          ? '3px solid #6ee7b7'
                          : isCurrentPriority
                            ? '3.5px solid #c4b5fd'
                            : '2.5px solid #cbd5e1',
                        color: (isAcquired || isCurrentPriority) ? '#ffffff' : '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '15px',
                        cursor: 'pointer',
                        boxShadow: isCurrentPriority
                          ? '0 0 24px rgba(124, 58, 237, 0.6), 0 8px 16px rgba(124, 58, 237, 0.3)'
                          : isAcquired
                            ? '0 0 16px rgba(16, 185, 129, 0.4)'
                            : '0 4px 10px rgba(0, 0, 0, 0.05)',
                        position: 'relative',
                        transform: isHovered ? 'scale(1.12)' : 'scale(1)',
                        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                    >
                      {/* Pulsing Beacon for current priority step */}
                      {isCurrentPriority && (
                        <div style={{
                          position: 'absolute',
                          inset: '-8px',
                          borderRadius: '50%',
                          border: '2px solid #7c3aed',
                          animation: 'radarPing 1.8s infinite',
                          pointerEvents: 'none'
                        }} />
                      )}

                      {/* Icon inside Pin */}
                      {isAcquired ? (
                        <Check size={26} strokeWidth={3} />
                      ) : isCurrentPriority ? (
                        <Sparkles size={24} color="#fef08a" />
                      ) : (
                        <span>0{idx + 1}</span>
                      )}

                      {/* Small floating lock badge for locked steps */}
                      {isUpcoming && (
                        <div style={{
                          position: 'absolute',
                          bottom: '-4px',
                          right: '-4px',
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: '#475569',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1.5px solid #ffffff'
                        }}>
                          <Lock size={10} />
                        </div>
                      )}
                    </div>

                    {/* Lower Chain Connector (to next node) */}
                    <div style={{
                      width: '4px',
                      height: '28px',
                      background: nextAcquired 
                        ? '#10b981' 
                        : isAcquired && isCurrentPriority 
                          ? 'linear-gradient(180deg, #10b981 0%, #7c3aed 100%)' 
                          : isAcquired 
                            ? 'linear-gradient(180deg, #10b981 0%, #cbd5e1 100%)' 
                            : '#cbd5e1',
                      borderRadius: '2px',
                      boxShadow: nextAcquired ? '0 0 8px rgba(16, 185, 129, 0.4)' : 'none',
                      position: 'relative'
                    }}>
                      {/* Metallic Chain Interlock Ring graphic */}
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        background: '#ffffff',
                        border: isAcquired ? '2px solid #10b981' : '2px solid #94a3b8',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }} />
                    </div>

                  </div>

                  {/* RIGHT COLUMN: Milestone Intel (if even) OR Card (if odd) */}
                  <div className="chain-col-right" style={{ padding: '8px 12px', display: 'flex', justifyContent: 'flex-start' }}>
                    {!isEven ? (
                      <MilestoneQuestCard
                        step={step}
                        idx={idx}
                        isAcquired={isAcquired}
                        isCurrentPriority={isCurrentPriority}
                        isUpcoming={isUpcoming}
                        isHovered={isHovered}
                        companyWeight={companyWeight}
                        companyNote={companyNote}
                        activeCompanyBlueprint={activeCompanyBlueprint}
                        onOpenModal={() => onOpenStepModal(step)}
                        side="right"
                      />
                    ) : (
                      <MilestoneIntelPill
                        step={step}
                        idx={idx}
                        isAcquired={isAcquired}
                        isCurrentPriority={isCurrentPriority}
                        companyWeight={companyWeight}
                        activeCompanyBlueprint={activeCompanyBlueprint}
                        side="right"
                      />
                    )}
                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {/* FINISH DESTINATION NODE: CAPSTONE PLACEMENT EXAM */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '4px', position: 'relative', zIndex: 3 }}>
          {/* Vertical Link connecting last step to Capstone Node */}
          <div style={{
            width: '4px',
            height: '32px',
            background: acquiredCount === totalSteps
              ? 'linear-gradient(180deg, #10b981 0%, #f59e0b 100%)'
              : 'linear-gradient(180deg, #cbd5e1 0%, #f59e0b 100%)',
            borderRadius: '2px',
            margin: '0 0 6px 0'
          }} />

          {/* Capstone Trophy Banner Card */}
          <div 
            onClick={onOpenFullAssessment}
            style={{
              background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)',
              border: '2px solid #fbbf24',
              borderRadius: '24px',
              padding: '24px 32px',
              color: '#ffffff',
              boxShadow: '0 16px 36px -8px rgba(245, 158, 11, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '20px',
              cursor: 'pointer',
              maxWidth: '820px',
              width: '100%',
              transition: 'all 0.25s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(245, 158, 11, 0.45)',
                flexShrink: 0
              }}>
                <Trophy size={32} />
              </div>

              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 10px', borderRadius: '9999px', background: 'rgba(254, 240, 138, 0.2)', color: '#fef08a', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '4px' }}>
                  <Star size={13} fill="#fef08a" />
                  <span>Capstone Destination • Final Chain Link</span>
                </div>
                <h4 style={{ fontSize: '19px', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                  {fullAssessmentData?.title || 'Placement Readiness Capstone Assessment'}
                </h4>
                <p style={{ fontSize: '12.5px', color: '#c7d2fe', margin: '4px 0 0 0' }}>
                  Demonstrate practical application across all sequential roadmap steps to calculate your definitive campus placement index.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenFullAssessment();
              }}
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #eab308 100%)',
                color: '#1e1b4b',
                fontWeight: 900,
                fontSize: '13px',
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 6px 18px rgba(245, 158, 11, 0.4)',
                transition: 'all 0.2s ease'
              }}
            >
              <span>Take Final Capstone Exam</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

/**
 * Rich Interactive Milestone Quest Card (Alternates on Left/Right of Chain Spine)
 */
const MilestoneQuestCard = ({
  step,
  idx,
  isAcquired,
  isCurrentPriority,
  _isUpcoming,
  isHovered,
  companyWeight,
  companyNote,
  activeCompanyBlueprint,
  onOpenModal,
  side
}) => {
  return (
    <div
      onClick={onOpenModal}
      className="roadmap-step-card-chained"
      style={{
        width: '100%',
        maxWidth: '440px',
        padding: '22px 24px',
        borderRadius: '22px',
        background: isCurrentPriority
          ? 'linear-gradient(180deg, #ffffff 0%, #faf5ff 100%)'
          : isAcquired
            ? 'linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%)'
            : '#ffffff',
        border: isCurrentPriority
          ? '2.5px solid #7c3aed'
          : isAcquired
            ? '1.5px solid #10b981'
            : '1.5px solid #e2e8f0',
        boxShadow: isHovered
          ? '0 16px 36px -6px rgba(124, 58, 237, 0.25)'
          : isCurrentPriority
            ? '0 12px 28px -6px rgba(124, 58, 237, 0.2)'
            : isAcquired
              ? '0 8px 20px -4px rgba(16, 185, 129, 0.15)'
              : '0 4px 12px rgba(0, 0, 0, 0.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        position: 'relative',
        transform: isHovered ? (side === 'left' ? 'translateX(-6px)' : 'translateX(6px)') : 'none',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Top Meta Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            fontSize: '10.5px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '3px 8px',
            borderRadius: '6px',
            background: isCurrentPriority ? '#f3e8ff' : isAcquired ? '#dcfce7' : '#f1f5f9',
            color: isCurrentPriority ? '#7c3aed' : isAcquired ? '#15803d' : '#64748b'
          }}>
            Step {idx + 1} • {step.category}
          </span>

          {isCurrentPriority && (
            <span style={{
              fontSize: '10px',
              fontWeight: 900,
              padding: '2px 8px',
              borderRadius: '6px',
              background: '#7c3aed',
              color: '#ffffff',
              boxShadow: '0 2px 8px rgba(124, 58, 237, 0.4)'
            }}>
              ⭐ ACTIVE QUEST
            </span>
          )}
        </div>

        {/* XP and Time Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: 800,
            color: '#b45309',
            background: '#fef3c7',
            padding: '2px 8px',
            borderRadius: '6px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px'
          }}>
            <Zap size={12} fill="#f59e0b" color="#f59e0b" />
            <span>+150 XP</span>
          </span>

          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#64748b',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px'
          }}>
            <Clock size={11} />
            <span>{step.approxWeeks}</span>
          </span>
        </div>
      </div>

      {/* Title & Target Skill */}
      <div>
        <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>
          {step.name}
        </h4>
        <span style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', display: 'block' }}>
          Core Competency: <strong style={{ color: '#475569' }}>{step.skillName}</strong>
        </span>
      </div>

      {/* Target Company Focus Tag */}
      {activeCompanyBlueprint && companyWeight && (
        <div style={{
          padding: '8px 12px',
          borderRadius: '10px',
          background: `${activeCompanyBlueprint.logoColor}10`,
          border: `1px solid ${activeCompanyBlueprint.logoColor}30`,
          display: 'flex',
          flexDirection: 'column',
          gap: '2px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Briefcase size={12} color={activeCompanyBlueprint.logoColor} />
            <strong style={{ fontSize: '11px', color: activeCompanyBlueprint.logoColor }}>
              {activeCompanyBlueprint.name}: {companyWeight.level} Priority
            </strong>
          </div>
          {companyNote && (
            <p style={{ fontSize: '10.5px', color: '#475569', margin: 0, fontStyle: 'italic', lineHeight: 1.4 }}>
              "{companyNote}"
            </p>
          )}
        </div>
      )}

      {/* 4-Stage Learning Path Progress Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: isAcquired ? '#ecfdf5' : '#f8fafc',
        padding: '6px 12px',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        fontSize: '10.5px',
        fontWeight: 700
      }}>
        <span style={{ color: isAcquired ? '#10b981' : '#7c3aed', display: 'flex', alignItems: 'center', gap: '3px' }}>
          <BookOpen size={11} />
          <span>1. Learn</span>
        </span>
        <ChevronRight size={11} color="#94a3b8" />
        <span style={{ color: isAcquired ? '#10b981' : '#7c3aed', display: 'flex', alignItems: 'center', gap: '3px' }}>
          <Code size={11} />
          <span>2. Practice</span>
        </span>
        <ChevronRight size={11} color="#94a3b8" />
        <span style={{ color: isAcquired ? '#10b981' : '#7c3aed', display: 'flex', alignItems: 'center', gap: '3px' }}>
          <HelpCircle size={11} />
          <span>3. Quiz</span>
        </span>
        <ChevronRight size={11} color="#94a3b8" />
        <span style={{ color: isAcquired ? '#10b981' : '#64748b', display: 'flex', alignItems: 'center', gap: '3px' }}>
          <Award size={11} />
          <span>4. Done</span>
        </span>
      </div>

      {/* Card Action Button */}
      <div style={{ marginTop: '2px' }}>
        {isAcquired ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 14px',
            borderRadius: '10px',
            background: '#dcfce7',
            color: '#15803d',
            fontWeight: 800,
            fontSize: '12px',
            border: '1px solid #86efac'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={15} />
              <span>Milestone Mastered</span>
            </span>
            <span style={{ fontSize: '11px', color: '#047857' }}>Review Topics →</span>
          </div>
        ) : isCurrentPriority ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenModal();
            }}
            style={{
              width: '100%',
              padding: '11px 16px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '12.5px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 6px 18px rgba(124, 58, 237, 0.35)'
            }}
          >
            <Sparkles size={14} />
            <span>Start Interactive Milestone Lab</span>
            <ArrowRight size={14} />
          </button>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 14px',
            borderRadius: '10px',
            background: '#f1f5f9',
            color: '#64748b',
            fontWeight: 700,
            fontSize: '11.5px'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Lock size={12} />
              <span>Upcoming Milestone</span>
            </span>
            <span>Click to Preview →</span>
          </div>
        )}
      </div>

    </div>
  );
};

/**
 * Milestone Intel Pill rendered on the alternate side of the central chain spine
 */
const MilestoneIntelPill = ({
  step,
  idx,
  isAcquired,
  isCurrentPriority,
  companyWeight,
  activeCompanyBlueprint,
  side
}) => {
  return (
    <div style={{
      width: '100%',
      maxWidth: '380px',
      padding: '16px 20px',
      borderRadius: '18px',
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(8px)',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.02)',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      textAlign: side === 'left' ? 'right' : 'left'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: side === 'left' ? 'flex-end' : 'flex-start',
        gap: '8px'
      }}>
        <span style={{
          fontSize: '11px',
          fontWeight: 900,
          color: isAcquired ? '#10b981' : isCurrentPriority ? '#7c3aed' : '#64748b',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Milestone Node #{idx + 1}
        </span>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: isAcquired ? '#10b981' : isCurrentPriority ? '#7c3aed' : '#cbd5e1'
        }} />
      </div>

      <p style={{
        fontSize: '12px',
        color: '#475569',
        margin: 0,
        lineHeight: 1.5
      }}>
        {isAcquired ? (
          <span style={{ color: '#047857', fontWeight: 600 }}>
            ✓ Verified skill depth in <strong>{step.skillName}</strong>. Ready for technical interview screening.
          </span>
        ) : isCurrentPriority ? (
          <span style={{ color: '#6d28d9', fontWeight: 600 }}>
            ⚡ Highest impact next step. Unlocks major placement interview score gains.
          </span>
        ) : (
          <span>
            Upcoming milestone in {step.category}. Complete previous chain links to unlock.
          </span>
        )}
      </p>

      {activeCompanyBlueprint && companyWeight && (
        <div style={{
          fontSize: '11px',
          color: activeCompanyBlueprint.logoColor,
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: side === 'left' ? 'flex-end' : 'flex-start',
          gap: '4px'
        }}>
          <Compass size={12} />
          <span>{activeCompanyBlueprint.name} Target Benchmark</span>
        </div>
      )}
    </div>
  );
};
