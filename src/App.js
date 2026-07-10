import React, { useState } from 'react';
import PlayDesignerCanvas from './components/PlayDesignerCanvas';
import AIPlayGenerator from './components/AIPlayGenerator';
import { playLibrary } from './data/playLibrary';

const PRACTICE_PLANS = [
  { num: 1, title: 'Ball Handling & Control', focus: 'Control, pressure resistance, confidence', duration: '90 min', drills: ['Stationary dribble series (10 min)', 'Two-ball dribbling (10 min)', 'Cone weave under pressure (15 min)', 'Live 1v1 dribble moves (20 min)', 'Small-sided scrimmage applying moves (25 min)'] },
  { num: 2, title: 'Shooting Mechanics', focus: 'Form, balance, game-speed reps', duration: '90 min', drills: ['Form shooting close range (15 min)', 'Footwork into catch-and-shoot (15 min)', 'Off-the-dribble pull-ups (20 min)', 'Game-speed shooting under fatigue (20 min)', 'Competitive shooting games (20 min)'] },
  { num: 3, title: 'Finishing at the Rim', focus: 'Strength, footwork, creativity', duration: '90 min', drills: ['Layup package both hands (15 min)', 'Contact finishes vs pads (15 min)', 'Euro step / floater work (20 min)', 'Live finishing 2v1, 3v2 (20 min)', 'Scrimmage emphasis on finishing (20 min)'] },
  { num: 4, title: 'Passing & Spacing', focus: 'Movement, timing, decision-making', duration: '90 min', drills: ['Partner passing series (15 min)', '4-corner passing (15 min)', 'Spacing shell drill (20 min)', 'Read-and-react passing under pressure (20 min)', 'Scrimmage with pass-count minimums (20 min)'] },
  { num: 5, title: 'Defensive Footwork', focus: 'Discipline, effort, toughness', duration: '90 min', drills: ['Defensive slide series (15 min)', 'Closeout technique (15 min)', 'On-ball 1v1 containment (20 min)', 'Help & recover rotations (20 min)', 'Live defense-only scrimmage (20 min)'] },
  { num: 6, title: 'Transition Offense', focus: 'Speed, decision-making, spacing', duration: '90 min', drills: ['Outlet and sprint lanes (15 min)', '3v2, 2v1 transition (20 min)', 'Trailer/rim-runner reads (15 min)', 'Full-court transition scrimmage (25 min)', 'Conditioning finish (15 min)'] },
  { num: 7, title: 'Rebounding & Toughness', focus: 'Physicality, effort, positioning', duration: '90 min', drills: ['Box-out technique (15 min)', 'Rebound and outlet (15 min)', 'Live rebounding war drill (20 min)', 'Second-chance scoring (20 min)', 'Competitive scrimmage with rebound scoring (20 min)'] },
  { num: 8, title: 'Game Situations', focus: 'Clutch performance, pressure', duration: '90 min', drills: ['End-of-quarter scenarios (20 min)', 'Late-clock shot creation (20 min)', 'Inbounds/BLOB-SLOB sets (20 min)', 'Free-throw pressure reps (10 min)', 'Simulated close-game scrimmage (20 min)'] },
  { num: 9, title: 'Team Offense Systems', focus: 'Installation, execution, spacing', duration: '90 min', drills: ['Walk-through core sets (20 min)', 'Half-speed execution (20 min)', 'Live reps vs scout defense (25 min)', 'Counters off primary action (15 min)', 'Scrimmage running system only (10 min)'] },
  { num: 10, title: 'Competitive Practice', focus: 'Championship mentality, culture', duration: '90 min', drills: ['Competitive shooting contest (15 min)', 'Small-sided competitive games (25 min)', 'Full scrimmage with stakes (35 min)', 'Free throw pressure finish (15 min)'] },
];

export default function App() {
  const [page, setPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [dashTab, setDashTab] = useState('whiteboard');
  const [selectedPlan, setSelectedPlan] = useState(null);

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
              <div style={{ marginTop: '40px', backgroundColor: colors.white, padding: '30px', borderRadius: '12px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: colors.primary, marginBottom: '20px' }}>📚 Play Library</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px' }}>
                  {playLibrary.map(play => (
                    <div key={play.id} style={{ backgroundColor: colors.light, padding: '18px', borderRadius: '8px', border: '2px solid ' + colors.accent }}>
                      <h3 style={{ fontSize: '15px', fontWeight: '700', color: colors.primary, marginBottom: '6px' }}>{play.name}</h3>
                      <p style={{ fontSize: '13px', color: colors.text, marginBottom: '8px' }}>{play.description}</p>
                      <p style={{ fontSize: '12px', color: colors.lightText, marginBottom: '4px' }}>Difficulty: {play.difficulty} · {play.offensive ? 'Offense' : 'Defense'}</p>
                      <p style={{ fontSize: '12px', color: colors.lightText }}>Positions: {play.positions.join(', ')}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {dashTab === 'plans' && (
            <div style={{ backgroundColor: colors.white, padding: '30px', borderRadius: '12px', marginBottom: '40px' }}>
              {!selectedPlan ? (
                <>
                  <h2 style={{ fontSize: '20px', fontWeight: '700', color: colors.primary, marginBottom: '20px' }}>10 Elite Practice Plans</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                    {PRACTICE_PLANS.map(plan => (
                      <div key={plan.num} onClick={() => setSelectedPlan(plan)} style={{ backgroundColor: colors.light, padding: '20px', borderRadius: '8px', border: '2px solid ' + colors.accent, cursor: 'pointer' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: colors.primary, marginBottom: '10px' }}>Plan #{plan.num}</h3>
                        <p style={{ fontSize: '14px', color: colors.text, marginBottom: '5px', fontWeight: '600' }}>{plan.title}</p>
                        <p style={{ fontSize: '13px', color: colors.lightText }}>Focus: {plan.focus}</p>
                        <p style={{ fontSize: '12px', color: colors.accent, marginTop: '10px', fontWeight: '600' }}>View plan →</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div>
                  <button onClick={() => setSelectedPlan(null)} style={{ padding: '8px 16px', backgroundColor: colors.light, color: colors.primary, border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', marginBottom: '20px' }}>← Back to all plans</button>
                  <h2 style={{ fontSize: '22px', fontWeight: '700', color: colors.primary, marginBottom: '5px' }}>Plan #{selectedPlan.num}: {selectedPlan.title}</h2>
                  <p style={{ fontSize: '14px', color: colors.lightText, marginBottom: '4px' }}>Focus: {selectedPlan.focus}</p>
                  <p style={{ fontSize: '14px', color: colors.lightText, marginBottom: '20px' }}>Total time: {selectedPlan.duration}</p>
                  <div style={{ backgroundColor: colors.light, padding: '20px', borderRadius: '8px', border: '2px solid ' + colors.accent }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: colors.primary, marginBottom: '12px' }}>Drill Sequence</h3>
                    <ol style={{ paddingLeft: '20px', margin: 0 }}>
                      {selectedPlan.drills.map((drill, i) => (
                        <li key={i} style={{ fontSize: '14px', color: colors.text, marginBottom: '10px', lineHeight: '1.5' }}>{drill}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
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
