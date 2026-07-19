import React, { useState } from 'react';
import PlayAnimator from './components/PlayAnimator';
import AIPlayGenerator from './components/AIPlayGenerator';
import CoachNotes from './components/CoachNotes';
import { playLibrary, animatedPlays } from './data/playLibrary';
import { supabase } from './services/supabaseClient';
import logo from './assets/logo.png';

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

const PLAYER_DEVELOPMENT = [
  { position: 'Point Guard', summary: 'Ball handling, decision-making, pace control', phases: [
    { range: 'Weeks 1-4: Foundations', items: ['Two-ball dribbling for control under pressure', 'Change-of-pace and change-of-direction moves', 'Basic pick-and-roll reads (downhill vs. drop)', 'Court vision drills: scan-before-catch habit'] },
    { range: 'Weeks 5-8: Advanced Skills', items: ['Live 1v1 and 2v2 ball screen reps', 'Pull-up shooting off the dribble at game speed', 'Advanced passing: skip passes, pocket passes', 'Transition decision-making 3v2, 2v1'] },
    { range: 'Weeks 9-12: Game Application', items: ['Full-speed pick-and-roll vs. live defense', 'Late-clock shot creation under pressure', 'Leadership reps: calling sets, managing tempo', 'Scrimmage-based situational decision drills'] },
  ]},
  { position: 'Shooting Guard', summary: 'Shooting mechanics, off-ball movement, finishing', phases: [
    { range: 'Weeks 1-4: Foundations', items: ['Form shooting close range, focus on repeatable mechanics', 'Footwork into the catch (hop vs. 1-2 step)', 'Basic off-ball movement: relocate and space', 'Ball-handling combo moves for one-on-one scoring'] },
    { range: 'Weeks 5-8: Advanced Skills', items: ['Catch-and-shoot reps off live passes', 'Curl and fade cuts off screens', 'Pull-up jumpers off the dribble at speed', 'Finishing package: floaters, euro step, off-hand layups'] },
    { range: 'Weeks 9-12: Game Application', items: ['Game-speed shooting under fatigue', 'Reading closeouts: shoot, drive, or pass', 'Live reps navigating multiple screens', 'Competitive scoring scrimmages with defense'] },
  ]},
  { position: 'Small Forward', summary: 'Versatility, slashing, perimeter defense', phases: [
    { range: 'Weeks 1-4: Foundations', items: ['Attack closeouts one and two dribbles', 'Catch-and-shoot fundamentals from the wing', 'Defensive stance and lateral movement basics', 'Straight-line drives finishing through contact'] },
    { range: 'Weeks 5-8: Advanced Skills', items: ['Live 1v1 attacking off the catch', 'Secondary playmaking: drive-and-kick reads', 'On-ball defense vs. multiple ball-handler moves', 'Transition finishing in traffic'] },
    { range: 'Weeks 9-12: Game Application', items: ['Full-speed wing isolation reps', 'Help-defense rotations in live scrimmage', 'Two-way scrimmage focus: score then get a stop', 'Situational late-game wing decision-making'] },
  ]},
  { position: 'Power Forward', summary: 'Rebounding, mid-range skill, physicality', phases: [
    { range: 'Weeks 1-4: Foundations', items: ['Post footwork: drop steps, up-and-under', 'Box-out technique and pursuit rebounding', 'Mid-range catch-and-shoot reps', 'Screen-setting fundamentals (angle, contact, roll)'] },
    { range: 'Weeks 5-8: Advanced Skills', items: ['Pick-and-pop shooting off ball screens', 'Face-up moves vs. live post defense', 'Live rebounding drills vs. contact', 'Short-roll passing reads out of the pick-and-roll'] },
    { range: 'Weeks 9-12: Game Application', items: ['Live post scoring vs. live defense', 'Competitive rebounding scrimmage segments', 'Full-speed screen-and-roll execution', 'Stretch-four shooting reps under game pressure'] },
  ]},
  { position: 'Center', summary: 'Rim protection, finishing, screening', phases: [
    { range: 'Weeks 1-4: Foundations', items: ['Low-post footwork and finishing package', 'Verticality and rim-protection positioning', 'Screen-setting and roll timing', 'Outlet passing off the defensive rebound'] },
    { range: 'Weeks 5-8: Advanced Skills', items: ['Live post scoring vs. live post defense', 'Pick-and-roll lob and short-roll reads', 'Help-side shot-contesting drills', 'Offensive rebounding and put-back finishing'] },
    { range: 'Weeks 9-12: Game Application', items: ['Full-speed post play vs. live defense', 'Live rim-protection reps in scrimmage', 'Pick-and-roll execution under game pressure', 'Conditioning-based rebounding competitions'] },
  ]},
];

const MENTAL_SKILLS = [
  { title: 'Confidence', desc: 'Build belief through preparation', keyPoints: ['Confidence comes from repetition, not talent alone', 'Track improvement to reinforce self-belief', 'Replace self-doubt with a rehearsed routine'], exercise: 'Have players write down one thing they did well after every practice — build a visible record of progress.' },
  { title: 'Focus', desc: 'Concentrate in pressure situations', keyPoints: ['Focus on the next play, not the last mistake', 'Use a consistent pre-shot or pre-possession routine', 'Narrow attention to one controllable cue at a time'], exercise: 'Practice a "reset breath" between possessions — one exhale to let go of the last play before the next one starts.' },
  { title: 'Resilience', desc: 'Bounce back from mistakes', keyPoints: ['Mistakes are data, not identity', 'Fast recovery time separates good players from great ones', 'Model calm reactions to errors as a coach'], exercise: 'After a turnover in practice, require the player to sprint back on defense with full effort — training the physical habit of moving on.' },
  { title: 'Coachability', desc: 'Accept feedback and improve', keyPoints: ['Ask clarifying questions instead of getting defensive', 'Apply feedback within the same possession when possible', 'Treat correction as investment, not criticism'], exercise: 'End each practice by asking each player to repeat back one piece of feedback they were given that day.' },
  { title: 'Leadership', desc: 'Inspire and elevate teammates', keyPoints: ['Leadership is consistent effort, not just talking', 'Communicate on both ends of the floor', 'Hold teammates accountable with respect'], exercise: 'Rotate a "captain of the possession" role in scrimmages so every player practices vocal leadership.' },
  { title: 'Clutch Performance', desc: 'Excel in high-pressure moments', keyPoints: ['Simulate pressure in practice so games feel familiar', 'Slow the moment down with a pre-decided routine', 'Focus on execution, not outcome'], exercise: 'Run end-of-game scenarios weekly (down 1, under 10 seconds) so the moment stops feeling unfamiliar on game day.' },
  { title: 'Communication', desc: 'Effective verbal expression', keyPoints: ['Call out screens, cuts, and switches early, not late', 'Use short, consistent terms the whole team knows', 'Communicate encouragement, not just corrections'], exercise: 'Require verbal calls on every defensive possession in practice — no talk, play stops and restarts.' },
  { title: 'Championship Mentality', desc: 'Commitment to excellence daily', keyPoints: ['Standards are set in practice, not just in games', 'Small daily habits compound over a season', 'Culture is what a team does when no one is watching'], exercise: 'Set one non-negotiable standard (e.g., sprint every line, box out every rep) and enforce it without exception.' },
];

export default function App() {
  const [page, setPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dashTab, setDashTab] = useState('whiteboard');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [libraryPlay, setLibraryPlay] = useState(null);
  const [libraryLoadKey, setLibraryLoadKey] = useState(0);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupTeam, setSignupTeam] = useState('');
  const [signupAge, setSignupAge] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupError, setSignupError] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [hasAccess, setHasAccess] = useState(null); // null = checking, true/false once known
  const [accessReason, setAccessReason] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [justReturnedFromCheckout, setJustReturnedFromCheckout] = useState(
    typeof window !== 'undefined' && window.location.search.includes('checkout=success')
  );

  const checkAccess = React.useCallback(async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session && sessionData.session.access_token;
    if (!token) {
      setHasAccess(false);
      return false;
    }
    try {
      const res = await fetch('/api/check-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setHasAccess(Boolean(data.access));
      setAccessReason(data.reason || '');
      return Boolean(data.access);
    } catch (e) {
      setHasAccess(false);
      return false;
    }
  }, []);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session ? data.session.user : null);
      if (data.session) setPage('dashboard');
      setAuthLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session ? session.user : null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  React.useEffect(() => {
    if (!user) {
      setHasAccess(null);
      return;
    }
    checkAccess();
  }, [user, checkAccess]);

  // Right after returning from Stripe Checkout, the webhook may take a
  // few seconds to land. Poll briefly instead of showing "access denied"
  // for a coach who just paid.
  React.useEffect(() => {
    if (!justReturnedFromCheckout || !user) return undefined;
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts += 1;
      const granted = await checkAccess();
      if (granted || attempts >= 8) {
        clearInterval(interval);
        setJustReturnedFromCheckout(false);
        window.history.replaceState({}, '', window.location.pathname);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [justReturnedFromCheckout, user, checkAccess]);

  const startCheckout = async () => {
    setCheckoutError('');
    setCheckoutLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session && sessionData.session.access_token;
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setCheckoutError(data.error || 'Couldn\u2019t start checkout. Please try again.');
        setCheckoutLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch (e) {
      setCheckoutError('Couldn\u2019t reach the server. Check your connection and try again.');
      setCheckoutLoading(false);
    }
  };

  const colors = { primary: '#1a1a2e', accent: '#ff6b35', light: '#f5f5f5', white: '#ffffff', text: '#2c3e50', lightText: '#7f8c8d' };

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.light }}>
        <img src={logo} alt="Basketball IQ System" style={{ width: '60px', height: '60px', opacity: 0.6 }} />
      </div>
    );
  }

  if (page === 'landing' && !user) {
    return (
      <div style={{ minHeight: '100vh', fontFamily: 'Arial, sans-serif', backgroundColor: colors.light }}>
        <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)', color: colors.white, padding: '80px 20px', textAlign: 'center' }}>
          <img src={logo} alt="Basketball IQ System" style={{ width: '84px', height: '84px', marginBottom: '16px' }} />
          <h1 style={{ fontSize: '48px', fontWeight: '700', marginBottom: '20px' }}>Basketball IQ System</h1>
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
    const handleLogin = async (e) => {
      e.preventDefault();
      setLoginError('');
      setLoginLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
      setLoginLoading(false);
      if (error) {
        setLoginError(error.message);
        return;
      }
      setUser(data.user);
      setPage('dashboard');
    };

    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
        <div style={{ backgroundColor: colors.white, borderRadius: '12px', padding: '40px', width: '100%', maxWidth: '400px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: colors.primary, textAlign: 'center', marginBottom: '30px' }}>Sign In</h1>
          {loginError && (
            <div style={{ backgroundColor: '#fdecea', border: '1px solid #e74c3c', borderRadius: '8px', padding: '10px 14px', marginBottom: '15px' }}>
              <p style={{ fontSize: '13px', color: '#c0392b', margin: 0 }}>{loginError}</p>
            </div>
          )}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px' }} required />
            <input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px' }} required />
            <button type="submit" disabled={loginLoading} style={{ padding: '12px', backgroundColor: colors.accent, color: colors.white, border: 'none', borderRadius: '6px', fontWeight: '600', cursor: loginLoading ? 'not-allowed' : 'pointer' }}>
              {loginLoading ? 'Signing in\u2026' : 'Sign In'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}><button onClick={() => setPage('signup')} style={{ background: 'none', border: 'none', color: colors.accent, cursor: 'pointer', fontWeight: '600' }}>Create account</button></p>
          <p style={{ textAlign: 'center', fontSize: '14px' }}><button onClick={() => setPage('landing')} style={{ background: 'none', border: 'none', color: colors.accent, cursor: 'pointer', fontWeight: '600' }}>Back</button></p>
        </div>
      </div>
    );
  }

  if (page === 'signup' && !user) {
    const handleSignup = async (e) => {
      e.preventDefault();
      setSignupError('');
      setSignupLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: { data: { full_name: signupName, team_name: signupTeam, age_group: signupAge } },
      });
      setSignupLoading(false);
      if (error) {
        setSignupError(error.message);
        return;
      }
      if (data.session) {
        setUser(data.user);
        setPage('dashboard');
      } else {
        // Email confirmation is required before a session exists.
        setSignupSuccess(true);
      }
    };

    if (signupSuccess) {
      return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: colors.white, borderRadius: '12px', padding: '40px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: colors.primary, marginBottom: '15px' }}>Check your email</h1>
            <p style={{ fontSize: '14px', color: colors.text, marginBottom: '20px' }}>We sent a confirmation link to <strong>{signupEmail}</strong>. Click it to activate your account, then come back and sign in.</p>
            <button onClick={() => { setSignupSuccess(false); setPage('login'); }} style={{ padding: '12px 24px', backgroundColor: colors.accent, color: colors.white, border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Go to Sign In</button>
          </div>
        </div>
      );
    }

    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
        <div style={{ backgroundColor: colors.white, borderRadius: '12px', padding: '40px', width: '100%', maxWidth: '400px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: colors.primary, textAlign: 'center', marginBottom: '30px' }}>Start Free Trial</h1>
          {signupError && (
            <div style={{ backgroundColor: '#fdecea', border: '1px solid #e74c3c', borderRadius: '8px', padding: '10px 14px', marginBottom: '15px' }}>
              <p style={{ fontSize: '13px', color: '#c0392b', margin: 0 }}>{signupError}</p>
            </div>
          )}
          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="text" placeholder="Coach Name" value={signupName} onChange={(e) => setSignupName(e.target.value)} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px' }} required />
            <input type="email" placeholder="Email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px' }} required />
            <input type="text" placeholder="Team Name" value={signupTeam} onChange={(e) => setSignupTeam(e.target.value)} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px' }} />
            <select value={signupAge} onChange={(e) => setSignupAge(e.target.value)} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px' }} required>
              <option value="">Select age group</option>
              <option value="8-10">8-10 Year Olds</option>
              <option value="10-12">10-12 Year Olds</option>
              <option value="12-14">12-14 Year Olds</option>
              <option value="hs">High School</option>
              <option value="college">College</option>
            </select>
            <input type="password" placeholder="Password (min 6 characters)" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} minLength={6} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px' }} required />
            <button type="submit" disabled={signupLoading} style={{ padding: '12px', backgroundColor: colors.accent, color: colors.white, border: 'none', borderRadius: '6px', fontWeight: '600', cursor: signupLoading ? 'not-allowed' : 'pointer' }}>
              {signupLoading ? 'Creating account\u2026' : 'Create Account'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}><button onClick={() => setPage('login')} style={{ background: 'none', border: 'none', color: colors.accent, cursor: 'pointer', fontWeight: '600' }}>Already have account?</button></p>
          <p style={{ textAlign: 'center', fontSize: '14px' }}><button onClick={() => setPage('landing')} style={{ background: 'none', border: 'none', color: colors.accent, cursor: 'pointer', fontWeight: '600' }}>Back</button></p>
        </div>
      </div>
    );
  }

  if (page === 'dashboard' && user && hasAccess === null) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.light }}>
        <img src={logo} alt="Basketball IQ System" style={{ width: '60px', height: '60px', opacity: 0.6 }} />
      </div>
    );
  }

  if (page === 'dashboard' && user && hasAccess === false) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
        <div style={{ backgroundColor: colors.white, borderRadius: '12px', padding: '40px', width: '100%', maxWidth: '440px', textAlign: 'center' }}>
          <img src={logo} alt="Basketball IQ System" style={{ width: '56px', height: '56px', marginBottom: '16px' }} />
          {justReturnedFromCheckout ? (
            <>
              <h1 style={{ fontSize: '22px', fontWeight: '700', color: colors.primary, marginBottom: '12px' }}>Activating your account\u2026</h1>
              <p style={{ fontSize: '14px', color: colors.lightText }}>Payment received \u2014 this usually takes just a few seconds. This page will update automatically.</p>
            </>
          ) : (
            <>
              <h1 style={{ fontSize: '22px', fontWeight: '700', color: colors.primary, marginBottom: '8px' }}>Start Your Subscription</h1>
              <p style={{ fontSize: '14px', color: colors.lightText, marginBottom: '25px' }}>$19/month \u2014 full access to practice plans, player development, the play design whiteboard, and the AI play assistant.</p>
              {checkoutError && (
                <div style={{ backgroundColor: '#fdecea', border: '1px solid #e74c3c', borderRadius: '8px', padding: '10px 14px', marginBottom: '15px', textAlign: 'left' }}>
                  <p style={{ fontSize: '13px', color: '#c0392b', margin: 0 }}>{checkoutError}</p>
                </div>
              )}
              <button onClick={startCheckout} disabled={checkoutLoading} style={{ width: '100%', padding: '14px', backgroundColor: colors.accent, color: colors.white, border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '15px', cursor: checkoutLoading ? 'not-allowed' : 'pointer', marginBottom: '15px' }}>
                {checkoutLoading ? 'Redirecting to checkout\u2026' : 'Subscribe \u2014 $19/month'}
              </button>
              <button onClick={async () => { await supabase.auth.signOut(); setUser(null); setPage('landing'); }} style={{ background: 'none', border: 'none', color: colors.lightText, cursor: 'pointer', fontSize: '13px' }}>Sign out</button>
            </>
          )}
        </div>
      </div>
    );
  }

  if (page === 'dashboard' && user && hasAccess) {
    return (
      <div style={{ backgroundColor: colors.light, minHeight: '100vh', paddingBottom: '40px' }}>
        <div className="app-header" style={{ backgroundColor: colors.white, borderBottom: '2px solid ' + colors.accent, padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px', fontWeight: '700', color: colors.primary }}>
            <img src={logo} alt="Basketball IQ System" style={{ width: '32px', height: '32px' }} />
            Basketball IQ
            {(accessReason === 'admin' || accessReason === 'comped') && (
              <span style={{ fontSize: '11px', fontWeight: '700', color: colors.accent, backgroundColor: '#fff4e5', padding: '3px 10px', borderRadius: '10px' }}>
                {accessReason === 'admin' ? 'ADMIN ACCESS' : 'COMPED'}
              </span>
            )}
          </span>
          <button onClick={async () => { await supabase.auth.signOut(); setUser(null); setPage('landing'); }} style={{ padding: '8px 20px', backgroundColor: colors.accent, color: colors.white, border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Logout</button>
        </div>

        <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
          <div className="app-hero" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)', color: colors.white, padding: '40px', borderRadius: '12px', marginBottom: '40px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '10px' }}>Welcome, Coach!</h1>
            <p>You're now part of an elite network of championship programs</p>
          </div>

          <div className="app-tabs" style={{ display: 'flex', gap: '10px', marginBottom: '30px', borderBottom: '2px solid ' + colors.light, paddingBottom: '20px', flexWrap: 'wrap' }}>
            <button onClick={() => setDashTab('whiteboard')} style={{ padding: '10px 20px', backgroundColor: dashTab === 'whiteboard' ? colors.accent : colors.white, color: dashTab === 'whiteboard' ? colors.white : colors.primary, border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>✏️ Whiteboard</button>
            <button onClick={() => setDashTab('plans')} style={{ padding: '10px 20px', backgroundColor: dashTab === 'plans' ? colors.accent : colors.white, color: dashTab === 'plans' ? colors.white : colors.primary, border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>📋 Plans</button>
            <button onClick={() => setDashTab('development')} style={{ padding: '10px 20px', backgroundColor: dashTab === 'development' ? colors.accent : colors.white, color: dashTab === 'development' ? colors.white : colors.primary, border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>📈 Dev</button>
            <button onClick={() => setDashTab('scouting')} style={{ padding: '10px 20px', backgroundColor: dashTab === 'scouting' ? colors.accent : colors.white, color: dashTab === 'scouting' ? colors.white : colors.primary, border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>📊 Scout</button>
            <button onClick={() => setDashTab('mental')} style={{ padding: '10px 20px', backgroundColor: dashTab === 'mental' ? colors.accent : colors.white, color: dashTab === 'mental' ? colors.white : colors.primary, border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>🧠 Mental</button>
            <button onClick={() => setDashTab('notes')} style={{ padding: '10px 20px', backgroundColor: dashTab === 'notes' ? colors.accent : colors.white, color: dashTab === 'notes' ? colors.white : colors.primary, border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>🎙️ Notes</button>
          </div>

          {dashTab === 'whiteboard' && (
            <div>
              <PlayAnimator key={libraryLoadKey} initialPlay={libraryPlay} />

              <div style={{ marginTop: '40px', backgroundColor: colors.white, padding: '30px', borderRadius: '12px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: colors.primary, marginBottom: '8px' }}>📚 Load a Play</h2>
                <p style={{ fontSize: '13px', color: colors.lightText, marginBottom: '20px' }}>These load directly onto the whiteboard above, fully animated — customize them or use them as a starting point.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px' }}>
                  {animatedPlays.map(play => (
                    <div key={play.id} style={{ backgroundColor: colors.light, padding: '18px', borderRadius: '8px', border: '2px solid ' + colors.accent }}>
                      <h3 style={{ fontSize: '15px', fontWeight: '700', color: colors.primary, marginBottom: '6px' }}>{play.name}</h3>
                      <p style={{ fontSize: '13px', color: colors.text, marginBottom: '10px' }}>{play.description}</p>
                      <button
                        onClick={() => { setLibraryPlay(play); setLibraryLoadKey(k => k + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        style={{ padding: '8px 14px', backgroundColor: colors.accent, color: colors.white, border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
                      >
                        Load onto Whiteboard →
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '40px' }}>
                <AIPlayGenerator onPlayGenerated={(play) => { setLibraryPlay(play); setLibraryLoadKey(k => k + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
              </div>

              <div style={{ marginTop: '40px', backgroundColor: colors.white, padding: '30px', borderRadius: '12px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: colors.primary, marginBottom: '20px' }}>📖 Play Concepts Library</h2>
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
              {!selectedPosition ? (
                <>
                  <h2 style={{ fontSize: '20px', fontWeight: '700', color: colors.primary, marginBottom: '20px' }}>Player Development</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                    {PLAYER_DEVELOPMENT.map((pos, i) => (
                      <div key={i} onClick={() => setSelectedPosition(pos)} style={{ backgroundColor: colors.light, padding: '20px', borderRadius: '8px', border: '2px solid ' + colors.accent, cursor: 'pointer' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: colors.primary, marginBottom: '10px' }}>{pos.position}</h3>
                        <p style={{ fontSize: '13px', color: colors.lightText, marginBottom: '10px' }}>{pos.summary}</p>
                        <div style={{ fontSize: '13px', color: colors.text, lineHeight: '1.8' }}>
                          <p><strong>Weeks 1-4:</strong> Foundations</p>
                          <p><strong>Weeks 5-8:</strong> Advanced skills</p>
                          <p><strong>Weeks 9-12:</strong> Game application</p>
                        </div>
                        <p style={{ fontSize: '12px', color: colors.accent, marginTop: '10px', fontWeight: '600' }}>View full plan →</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div>
                  <button onClick={() => setSelectedPosition(null)} style={{ padding: '8px 16px', backgroundColor: colors.light, color: colors.primary, border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', marginBottom: '20px' }}>← Back to all positions</button>
                  <h2 style={{ fontSize: '22px', fontWeight: '700', color: colors.primary, marginBottom: '5px' }}>{selectedPosition.position}</h2>
                  <p style={{ fontSize: '14px', color: colors.lightText, marginBottom: '20px' }}>{selectedPosition.summary}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {selectedPosition.phases.map((phase, i) => (
                      <div key={i} style={{ backgroundColor: colors.light, padding: '20px', borderRadius: '8px', border: '2px solid ' + colors.accent }}>
                        <h3 style={{ fontSize: '15px', fontWeight: '700', color: colors.primary, marginBottom: '12px' }}>{phase.range}</h3>
                        <ul style={{ paddingLeft: '20px', margin: 0 }}>
                          {phase.items.map((item, j) => (
                            <li key={j} style={{ fontSize: '14px', color: colors.text, marginBottom: '8px', lineHeight: '1.5' }}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
              {!selectedSkill ? (
                <>
                  <h2 style={{ fontSize: '20px', fontWeight: '700', color: colors.primary, marginBottom: '20px' }}>Mental Skills Framework</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                    {MENTAL_SKILLS.map((skill, i) => (
                      <div key={i} onClick={() => setSelectedSkill(skill)} style={{ backgroundColor: colors.light, padding: '20px', borderRadius: '8px', border: '2px solid ' + colors.accent, cursor: 'pointer' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: colors.primary, marginBottom: '10px' }}>{skill.title}</h3>
                        <p style={{ fontSize: '14px', color: colors.lightText }}>{skill.desc}</p>
                        <p style={{ fontSize: '12px', color: colors.accent, marginTop: '10px', fontWeight: '600' }}>View framework →</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div>
                  <button onClick={() => setSelectedSkill(null)} style={{ padding: '8px 16px', backgroundColor: colors.light, color: colors.primary, border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', marginBottom: '20px' }}>← Back to all skills</button>
                  <h2 style={{ fontSize: '22px', fontWeight: '700', color: colors.primary, marginBottom: '5px' }}>{selectedSkill.title}</h2>
                  <p style={{ fontSize: '14px', color: colors.lightText, marginBottom: '20px' }}>{selectedSkill.desc}</p>
                  <div style={{ backgroundColor: colors.light, padding: '20px', borderRadius: '8px', border: '2px solid ' + colors.accent, marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: colors.primary, marginBottom: '12px' }}>Key Points</h3>
                    <ul style={{ paddingLeft: '20px', margin: 0 }}>
                      {selectedSkill.keyPoints.map((point, j) => (
                        <li key={j} style={{ fontSize: '14px', color: colors.text, marginBottom: '8px', lineHeight: '1.5' }}>{point}</li>
                      ))}
                    </ul>
                  </div>
                  <div style={{ backgroundColor: colors.light, padding: '20px', borderRadius: '8px', border: '2px solid ' + colors.accent }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: colors.primary, marginBottom: '12px' }}>Coaching Exercise</h3>
                    <p style={{ fontSize: '14px', color: colors.text, lineHeight: '1.6' }}>{selectedSkill.exercise}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {dashTab === 'notes' && <CoachNotes />}
        </div>
      </div>
    );
  }
}
