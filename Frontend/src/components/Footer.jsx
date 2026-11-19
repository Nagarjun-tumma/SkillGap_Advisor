import React from 'react';
import { Brain, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      width: '100%',
      backgroundColor: '#0f172a',
      borderTop: '1px solid #1e293b',
      color: '#94a3b8',
      fontSize: '13px',
      padding: '40px 20px 24px 20px',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>

        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          paddingBottom: '24px',
          borderBottom: '1px solid #1e293b'
        }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Brain size={20} />
            </div>
            <div>
              <span style={{ fontWeight: 800, fontSize: '16px', color: '#ffffff' }}>SkillGap AI</span>
              <p style={{ fontSize: '12px', color: '#64748b' }}>Smart Companion for Engineering Career Success</p>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '13px', fontWeight: 600 }}>
            <span style={{ color: '#cbd5e1', cursor: 'pointer' }}>Career Roadmaps</span>
            <span style={{ color: '#cbd5e1', cursor: 'pointer' }}>Placement Readiness</span>
            <span style={{ color: '#cbd5e1', cursor: 'pointer' }}>About Platform</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '12px',
          color: '#64748b'
        }}>
          <p>© {new Date().getFullYear()} SkillGap AI Advisor for Engineering Students. All rights reserved.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Empowering Future Engineers</span>
            <Heart size={14} color="#ec4899" fill="#ec4899" />
          </div>
        </div>

      </div>
    </footer>
  );
};
