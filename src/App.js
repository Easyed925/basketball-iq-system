import React, { useState, useRef } from 'react';

export default function App() {
  const [page, setPage] = useState('landing');
  const [user, setUser] = useState(null);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const colors = { primary: '#1a1a2e', accent: '#ff6b35', light: '#f5f5f5', white: '#ffffff', text: '#2c3e50', lightText: '#7f8c8d' };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e) => {
    if (!isDrawing || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const ctx = canvasRef.current.getContext('2d');
    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = 2;
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const downloadCanvas = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.href = canvasRef.current.toDataURL('image/png');
      link.download = 'play-design.png';
      link.click();
    }
  };

  if (page === 'landing' && !user) {
    return (
      <div style={{ minHeight: '100vh', fontFamily: 'Arial, sans-serif', backgroundColor: colors.light }}>
        <div style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, #0f3460 100%)`, color: colors.white, padding: '80px 20px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '48px', fontWeight: '700', marginBottom: '20px' }}>🏀 Basketball IQ System</h1>
          <p style={{ fontSize: '18px', marginBottom: '30px', opacity: 0.9 }}>Elite coaching toolkit for championship programs</p>
          <button onClick={() => setPage('signup')} style={{ padding: '14px 32px', fontSize: '16px', fontWeight: '600', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: colors.accent, color: colors.white, marginRight: '15px' }}>Start Free Trial</button>
          <button onClick={() => setPage('login')} style={{ padding: '14px 32px', fontSize: '16px', fontWeight: '600', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: colors.white, color: colors.primary }}>Sign In</button>
        </div>

        <section style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '700', textAlign: 'center', marginBottom: '40px', color: colors.primary }}>Everything You Need</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
            {[{ icon: '📋', title: '10 Practice Plans', text: 'Game-tested structures' }, { icon: '📈', title: 'Player Development', text: '12-week progressions' }, { icon: '🧠', title: 'Mental Skills', text: '8 coaching frameworks' }, { icon: '✏️', title: 'Play Whiteboard', text: 'Design and save plays' }].map((item, i) => (
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
              <li style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>✓ Play design whiteboard</li>
              <li style={{ padding: '10px 0' }}>✓ Weekly updates</li>
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
      <div style={{ minHeight: '100vh', background: `linear-gradient(135deg, ${colors.primary} 0%, #0f3460 100%)`, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
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
      <div style={{ minHeight: '100vh', background: `linear-gradient(135deg, ${colors.primary} 0%, #0f3460 100%)`, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
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
        <div style={{ backgroundColor: colors.white, borderBottom: `2px solid ${colors.accent}`, padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '20px', fontWeight: '700', color: colors.primary }}>🏀 Basketball IQ</span>
          <button onClick={() => { setUser(null); setPage('landing'); }} style={{ padding: '8px 20px', backgroundColor: colors.accent, color: colors.white, border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Logout</button>
        </div>

        <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
          <div style={{ backgroundColor: `linear-gradient(135deg, ${colors.primary} 0%, #0f3460 100%)`, color: colors.white, padding: '40px', borderRadius: '12px', marginBottom: '40px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '10px' }}>Welcome, Coach!</h1>
            <p>You're now part of an elite network of championship programs</p>
          </div>

          <div style={{ backgroundColor: colors.white, padding: '30px', borderRadius: '12px', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: colors.primary, marginBottom: '20px' }}>✏️ Play Design Whiteboard</h2>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
              <button onClick={() => setIsDrawing(false)} style={{ padding: '8px 16px', backgroundColor: colors.accent, color: colors.white, border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>✏️ Draw</button>
              <button onClick={clearCanvas} style={{ padding: '8px 16px', backgroundColor: colors.accent, color: colors.white, border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>🔄 Clear</button>
              <button onClick={downloadCanvas} style={{ padding: '8px 16px', backgroundColor: colors.accent, color: colors.white, border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>⬇️ Download</button>
            </div>
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              style={{ border: `2px solid ${colors.accent}`, borderRadius: '8px', backgroundColor: colors.white, cursor: 'crosshair', display: 'block', width: '100%', maxWidth: '800px' }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={() => setIsDrawing(false)}
              onMouseLeave={() => setIsDrawing(false)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {[{ icon: '📋', title: 'Practice Plans', text: '10 structures' }, { icon: '📈', title: 'Player Dev', text: '12-week plans' }, { icon: '📊', title: 'Scouting', text: 'Analysis' }, { icon: '🧠', title: 'Mental Skills', text: '8 frameworks' }].map((item, i) => (
              <div key={i} style={{ backgroundColor: colors.white, padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <span style={{ fontSize: '36px', display: 'block', marginBottom: '10px' }}>{item.icon}</span>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: colors.primary, marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ color: colors.lightText, fontSize: '13px' }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
