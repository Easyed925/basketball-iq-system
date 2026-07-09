import React, { useState } from 'react';
import PlayDesignerCanvas from './components/PlayDesignerCanvas';
import AIPlayGenerator from './components/AIPlayGenerator';

export default function App() {
  const [page, setPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [dashTab, setDashTab] = useState('whiteboard');

  const colors = { primary: '#1a1a2e', accent: '#ff6b35', light: '#f5f5f5', white: '#ffffff', text: '#2c3e50', lightText: '#7f8c8d' };

  if (page === 'landing' && !user) {
    return (
      <div style={{ minHeight: '100vh', fontFamily: 'Arial, sans-serif', backgroundColor: colors.light }}>
        <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)', color: colors.white, padding: '80px 20px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '48px', fontWeight: '700', marginBottom: '20px' }}>🏀 Basketball IQ System</h1>
          <p style={{ fontSize: '18px', marginBottom: '30px', opacity: 0.9 }}>Elite coaching toolkit for championship programs</p>
          <button onClick={() => setPage('signup')} style={{ padding: '14px 32px', fontSize: '16px', fontWeight: '600', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: colors.accent, color: colors.white, marginRight: '15px' }}>Start Free Trial</button>
          <button onClick={() => setPage('login')} style={{ padding: '14px 32px', fontSize: '16px', fontWeight: '600', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: colors.white, color: colors.primary }}>Sign In</button>
        </div>

        <section style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '700', textAlign: 'center', marginBottom: '40px', color: colors.primary }}>Everything You Need</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
            {[{ icon: '📋', title: '10 Practice Plans', text: 'Game-tested structures' }, { icon: '📈', title: 'Player Development', text: '12-week progressions' }, { icon: '🧠', title: 'Mental Skills', text: '8 frameworks' }, { icon: '✏️', title: 'Enhanced Whiteboard', text: 'Save and load plays' }, { icon: '📊', title: 'Scouting Reports', text: 'Opponent analysis' }, { icon: '🤖', title: 'AI Assistant', text: 'Tactical guidance' }].map((item, i) => (
              <div key={i} style={{ backgroundColor: colors.white, padding: '30px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <span style={{ fontSize: '40px', display: 'block', marginBottom: '15px' }}>{item.icon}</span>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: colors.primary, marginBottom: '10px' }}>{item.title}</h3>
                <p style={{ color: colors.lightText, fontSize: '14px' }}>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ backgroundColor: colors.primary, color: colors.white, padding: '80px 20px', textAlign: 'center' }}>
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '20px' }}>$19/month</h2>
            <p style={{ fontSize: '16px', marginBottom: '30px' }}>Everything coaches need to win</p>
            <ul style={{ listStyle: 'none', marginBottom: '30px', textAlign: 'left' }}>
              <li style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>✓ All 10 practice plans</li>
              <li style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>✓ Player development sheets</li>
              <li style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>✓ Mental skills guides</li>
              <li style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>✓ Enhanced whiteboard</li>
              <li style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>✓ Scouting reports</li>
              <li style={{ padding: '10px 0' }}>✓ AI assistant</li>
            </ul>
            <button onClick={() => setPage('signup')} style={{ width: '100%', padding: '14px', fontSize: '16px', fontWeight: '600', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: colors.accent, color: colors.white }}>Start Free Trial</button>
            <p style={{ fontSize: '12px', marginTop: '15px', opacity: 0.8 }}>7 days free. No credit card required.</p>
          </div>
        </section>
      </div>
    );
  }

  if (page === 'login' && !user) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
        <div style={{ backgroundColor: colors.white, borderRadius: '12px', padding: '40px', width: '100%', maxWidth: '400px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: colors.primary, textAlign: 'center', marginBottom: '30px' }}>Sign In</h1>
          <form onSubmit={(e) => { e.preventDefault(); setUser({ email: 'coach@example.com' }); setPage('dashboard'); }} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="email" placeholder="Email" style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px' }} required />
            <input type="password" placeholder="Password" style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px' }} required />
            <button type="submit" style={{ padding: '12px', backgroundColor: colors.accent, color: colors.white, border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Sign In</button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}><button onClick={() => setPage('signup')} style={{ background: 'none', border: 'none', color: colors.accent, cursor: 'pointer', fontWeight: '600' }}>Create account</button></p>
          <p style={{ textAlign: 'center', fontSize: '14px' }}><button onClick={() => setPage('landing')} style={{ background: 'none', border: 'none', color: colors.accent, cursor: 'pointer', fontWeight: '600' }}>Back</button></p>
        </div>
      </div>
    );
  }

  if (page === 'signup' && !user) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
        <div style={{ backgroundColor: colors.white, borderRadius: '12px', padding: '40px', width: '100%', maxWidth: '400px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: colors.primary, textAlign: 'center', marginBottom: '30px' }}>Start Free Trial</h1>
          <form onSubmit={(e) => { e.preventDefault(); setUser({ email: 'coach@example.com' }); setPage('dashboard'); }} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="text" placeholder="Coach Name" style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px' }} required />
            <input type="email" placeholder="Email" style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px' }} required />
            <input type="text" placeholder="Team Name" style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px' }} />
            <select style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px' }} required>
              <option value="">Select age group</option>
              <option value="8-10">8-10 Year Olds</option>
              <option value="10-12">10-12 Year Olds</option>
              <option value="12-14">12-14 Year Olds</option>
              <option value="hs">High School</option>
              <option value="college">College</option>
            </select>
            <input type="password" placeholder="Password" style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px' }} required />
            <button type="submit" style={{ padding: '12px', backgroundColor: colors.accent, color: colors.white, border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Create Account</button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}><button onClick={() => setPage('login')} style={{ background: 'none', border: 'none', color: colors.accent, cursor: 'pointer', fontWeight: '600' }}>Already have account?</button></p>
          <p style={{ textAlign: 'center', fontSize: '14px' }}><button onClick={() => setPage('landing')} style={{ background: 'none', border: 'none', color: colors.accent, cursor: 'pointer', fontWeight: '600' }}>Back</button></p>
        </div>
      </div>
    );
  }

  if (page === 'dashboard' && user) {
    return (
      <div style={{ backgroundColor: colors.light, minHeight: '100vh', paddingBottom: '40px' }}>
        <div style={{ backgroundColor: colors.white, borderBottom: '2px solid ' + colors.accent, padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '20px', fontWeight: '700', color: colors.primary }}>🏀 Basketball IQ</span>
          <button onClick={() => { setUser(null); setPage('landing'); }} style={{ padding: '8px 20px', backgroundColor: colors.accent, color: colors.white, border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Logout</button>
        </div>

        <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
          <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)', color: colors.white, padding: '40px', borderRadius: '12px', marginBottom: '40px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '10px' }}>Welcome, Coach!</h1>
            <p>You're now part of an elite network of championship programs</p>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', borderBottom: '2px solid ' + colors.light, paddingBottom: '20px', flexWrap: 'wrap' }}>
            <button onClick={() => setDashTab('whiteboard')} style={{ padding: '10px 20px', backgroundColor: dashTab === 'whiteboard' ? colors.accent : colors.white, color: dashTab === 'whiteboard' ? colors.white : colors.primary, border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>✏️ Whiteboard</button>
            <button onClick={() => setDashTab('plans')} style={{ padding: '10px 20px', backgroundColor: dashTab === 'plans' ? colors.accent : colors.white, color: dashTab === 'plans' ? colors.white : colors.primary, border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>📋 Plans</button>
            <button onClick={() => setDashTab('development')} style={{ padding: '10px 20px', backgroundColor: dashTab === 'development' ? colors.accent : colors.white, color: dashTab === 'development' ? colors.white : colors.primary, border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>📈 Dev</button>
            <button onClick={() => setDashTab('scouting')} style={{ padding: '10px 20px', backgroundColor: dashTab === 'scouting' ? colors.accent : colors.white, color: dashTab === 'scouting' ? colors.white : colors.primary, border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>📊 Scout</button>
            <button onClick={() => setDashTab('mental')} style={{ padding: '10px 20px', backgroundColor: dashTab === 'mental' ? colors.accent : colors.white, color: dashTab === 'mental' ? colors.white : colors.primary, border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>🧠 Mental</button>
          </div>

          {dashTab === 'whiteboard' && (
            <div>
              <PlayDesignerCanvas width={800} height={400} />
              <div style={{ marginTop: '40px' }}>
                <AIPlayGenerator />
              </div>
            </div>
          )}

          {dashTab === 'plans' && (
            <div style={{ backgroundColor: colors.white, padding: '30px', borderRadius: '12px', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: colors.primary, marginBottom: '20px' }}>10 Elite Practice Plans</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                {[
                  { num: 1, title: 'Ball Handling & Control', focus: 'Control, pressure resistance, confidence' },
                  { num: 2, title: 'Shooting Mechanics', focus: 'Form, balance, game-speed reps' },
                  { num: 3, title: 'Finishing at the Rim', focus: 'Strength, footwork, creativity' },
                  { num: 4, title: 'Passing & Spacing', focus: 'Movement, timing, decision-making' },
                  { num: 5, title: 'Defensive Footwork', focus: 'Discipline, effort, toughness' },
                  { num: 6, title: 'Transition Offense', focus: 'Speed, decision-making, spacing' },
                  { num: 7, title: 'Rebounding & Toughness', focus: 'Physicality, effort, positioning' },
                  { num: 8, title: 'Game Situations', focus: 'Clutch performance, pressure' },
                  { num: 9, title: 'Team Offense Systems', focus: 'Installation, execution, spacing' },
                  { num: 10, title: 'Competitive Practice', focus: 'Championship mentality, culture' }
                ].map(plan => (
                  <div key={plan.num} style={{ backgroundColor: colors.light, padding: '20px', borderRadius: '8px', border: '2px solid ' + colors.accent }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: colors.primary, marginBottom: '10px' }}>Plan #{plan.num}</h3>
                    <p style={{ fontSize: '14px', color: colors.text, marginBottom: '5px', fontWeight: '600' }}>{plan.title}</p>
                    <p style={{ fontSize: '13px', color: colors.lightText }}>Focus: {plan.focus}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {dashTab === 'development' && (
            <div style={{ backgroundColor: colors.white, padding: '30px', borderRadius: '12px', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: colors.primary, marginBottom: '20px' }}>Player Development</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'].map((pos, i) => (
                  <div key={i} style={{ backgroundColor: colors.light, padding: '20px', borderRadius: '8px', border: '2px solid ' + colors.accent }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: colors.primary, marginBottom: '15px' }}>{pos}</h3>
                    <div style={{ fontSize: '13px', color: colors.text, lineHeight: '1.8' }}>
                      <p><strong>Weeks 1-4:</strong> Foundations</p>
                      <p><strong>Weeks 5-8:</strong> Advanced skills</p>
                      <p><strong>Weeks 9-12:</strong> Game application</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {dashTab === 'scouting' && (
            <div style={{ backgroundColor: colors.white, padding: '30px', borderRadius: '12px', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: colors.primary, marginBottom: '20px' }}>Scouting Reports</h2>
              <div style={{ backgroundColor: colors.light, padding: '25px', borderRadius: '8px', border: '2px solid ' + colors.accent }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: colors.primary, marginBottom: '15px' }}>Opponent Analysis Template</h3>
                <div style={{ fontSize: '14px', color: colors.text, lineHeight: '1.9' }}>
                  <p><strong>Offensive Tendencies:</strong> Pick and roll frequency, shooting range, pace preferences</p>
                  <p><strong>Defensive System:</strong> Man-to-man or zone, pressure level, rebounding strength</p>
                  <p><strong>Key Players:</strong> Star player strengths, weaknesses, foul trouble patterns</p>
                  <p><strong>Matchup Advantages:</strong> Exploitable weaknesses, personnel mismatches</p>
                  <p><strong>Game Plan:</strong> Offensive strategy, defensive adjustments</p>
                </div>
              </div>
            </div>
          )}

          {dashTab === 'mental' && (
            <div style={{ backgroundColor: colors.white, padding: '30px', borderRadius: '12px', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: colors.primary, marginBottom: '20px' }}>Mental Skills Framework</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                {[
                  { title: 'Confidence', desc: 'Build belief through preparation' },
                  { title: 'Focus', desc: 'Concentrate in pressure situations' },
                  { title: 'Resilience', desc: 'Bounce back from mistakes' },
                  { title: 'Coachability', desc: 'Accept feedback and improve' },
                  { title: 'Leadership', desc: 'Inspire and elevate teammates' },
                  { title: 'Clutch Performance', desc: 'Excel in high-pressure moments' },
                  { title: 'Communication', desc: 'Effective verbal expression' },
                  { title: 'Championship Mentality', desc: 'Commitment to excellence daily' }
                ].map((skill, i) => (
                  <div key={i} style={{ backgroundColor: colors.light, padding: '20px', borderRadius: '8px', border: '2px solid ' + colors.accent }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: colors.primary, marginBottom: '10px' }}>{skill.title}</h3>
                    <p style={{ fontSize: '14px', color: colors.lightText }}>{skill.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
