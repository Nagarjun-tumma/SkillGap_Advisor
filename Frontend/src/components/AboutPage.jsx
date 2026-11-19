import React from 'react';
import { 
  Brain, ShieldCheck, Code, Database, Cpu, Sparkles, 
  CheckCircle2, Rocket, Layers, Lock, Award, BookOpen, 
  Target, Terminal, Server, ArrowRight 
} from 'lucide-react';

export const AboutPage = ({ openAuthModal }) => {
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '40px'
    }}>
      
      {/* HERO HEADER */}
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 18px', borderRadius: '9999px', background: '#f3e8ff', border: '1px solid #d8b4fe', color: '#7c3aed', fontSize: '12px', fontWeight: 800, width: 'fit-content', margin: '0 auto' }}>
          <Sparkles size={16} />
          <span>System Architecture &amp; Methodology</span>
        </div>

        <h1 style={{ fontSize: '36px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', margin: 0, lineHeight: 1.2 }}>
          About AI Career &amp; Skill Gap Advisor
        </h1>

        <p style={{ fontSize: '15px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
          An intelligent placement readiness advisory platform engineered specifically for engineering students across <strong>Computer Science, AI &amp; DS, Electronics, Electrical, Mechanical, and Civil</strong> branches.
        </p>
      </div>

      {/* CORE AI CAPABILITIES GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        
        {/* Card 1: Skill Gap Engine */}
        <div style={{
          padding: '28px',
          borderRadius: '24px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#f3e8ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Brain size={24} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Automated AI Skill Gap Analysis
          </h3>
          <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
            Our core set-difference vector algorithm maps student acquired skills against tier-1 industry requirements, pinpointing exact missing competencies for high-demand engineering tracks.
          </p>
        </div>

        {/* Card 2: Next Step Priority */}
        <div style={{
          padding: '28px',
          borderRadius: '24px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Target size={24} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Sequential Learning Recommendation
          </h3>
          <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
            Answers <em>"What Should I Learn First?"</em> by placing missing skills into a directed prerequisite graph (Core Programming → Databases → Frameworks → REST APIs → Frontend UI → DevOps).
          </p>
        </div>

        {/* Card 3: OTP & Auth Security */}
        <div style={{
          padding: '28px',
          borderRadius: '24px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={24} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            6-Digit Email OTP Security
          </h3>
          <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
            Ensures authentic student accounts using real-time email existence verification and numeric 6-digit OTP validation dispatched via Spring Boot 3 JavaMailSender.
          </p>
        </div>

      </div>

      {/* TECHNICAL STACK ARCHITECTURE */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
        borderRadius: '28px',
        padding: '36px',
        color: '#ffffff',
        boxShadow: '0 20px 40px -15px rgba(67, 56, 202, 0.35)',
        display: 'flex',
        flexDirection: 'column',
        gap: '28px'
      }}>
        <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.15)', paddingBottom: '20px' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#a5b4fc', letterSpacing: '0.05em' }}>Enterprise Software Engineering</span>
          <h2 style={{ fontSize: '26px', fontWeight: 900, color: '#ffffff', marginTop: '4px', margin: 0 }}>Full Stack Architecture Overview</h2>
          <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)', marginTop: '4px', margin: 0 }}>Built using modern decoupled micro-architecture standards</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          
          {/* Frontend Box */}
          <div style={{ padding: '24px', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Code size={22} color="#a5b4fc" />
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', margin: 0 }}>Frontend Architecture</h3>
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: 0, margin: 0, listStyle: 'none', fontSize: '12px', color: 'rgba(255, 255, 255, 0.9)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="#6ee7b7" /> React 18 SPA with Vite Tooling</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="#6ee7b7" /> Lucide Icons &amp; Canvas Confetti</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="#6ee7b7" /> Glassmorphism &amp; Responsive Layout</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="#6ee7b7" /> Debounced Email &amp; OTP Timer</li>
            </ul>
          </div>

          {/* Backend Box */}
          <div style={{ padding: '24px', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Server size={22} color="#c084fc" />
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', margin: 0 }}>Java Backend Architecture</h3>
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: 0, margin: 0, listStyle: 'none', fontSize: '12px', color: 'rgba(255, 255, 255, 0.9)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="#6ee7b7" /> Java 17 + Spring Boot 3 REST APIs</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="#6ee7b7" /> Spring Security &amp; JJWT Auth Token</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="#6ee7b7" /> Spring Data JPA ORM &amp; Hibernate</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="#6ee7b7" /> JavaMailSender OTP Dispatch Engine</li>
            </ul>
          </div>

          {/* Database Box */}
          <div style={{ padding: '24px', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Database size={22} color="#6ee7b7" />
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', margin: 0 }}>MySQL Relational Schema</h3>
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: 0, margin: 0, listStyle: 'none', fontSize: '12px', color: 'rgba(255, 255, 255, 0.9)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="#6ee7b7" /> Relational DDL for Users &amp; OTP Tokens</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="#6ee7b7" /> Many-to-Many Skill Matrix Mapping</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="#6ee7b7" /> Auto Schema &amp; Seed Data Init</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="#6ee7b7" /> BCrypt Encrypted Passwords</li>
            </ul>
          </div>

        </div>
      </div>

      {/* BRANCH COVERAGE */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', margin: 0 }}>Covered Engineering Disciplines</h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Tailored skill matrix datasets for every major engineering branch</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px'
        }}>
          {[
            { code: 'CSE', name: 'Computer Science & Engineering', desc: 'Software Engineering, Algorithms, Web Stacks, Databases, System Architecture.' },
            { code: 'AIDS', name: 'AI & Data Science', desc: 'Machine Learning, Neural Networks, PyTorch, Big Data, Predictive Analytics.' },
            { code: 'ECE', name: 'Electronics & Communication', desc: 'Embedded C, Microcontrollers, Microprocessors, IoT Protocols, Hardware.' },
            { code: 'EEE', name: 'Electrical & Electronics', desc: 'Power Systems, Control Systems, Power Electronics, Firmware.' },
            { code: 'MECH', name: 'Mechanical Engineering', desc: 'CAD/CAM SolidWorks, Robotics, Mechatronics, Industrial Automation.' },
            { code: 'CIVIL', name: 'Civil Engineering', desc: 'Structural Design, BIM Modeling, Surveying, Infrastructure Automation.' }
          ].map((item, idx) => (
            <div key={idx} style={{ padding: '20px', borderRadius: '18px', background: '#ffffff', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 900, color: '#7c3aed', background: '#f3e8ff', padding: '3px 10px', borderRadius: '6px', width: 'fit-content' }}>
                {item.code}
              </span>
              <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>{item.name}</h4>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
