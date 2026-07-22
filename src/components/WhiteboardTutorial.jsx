import React from 'react';

const STEPS = [
  {
    title: '1. Set up your players',
    body: 'Tap "+ Offense" or "+ Defense" then tap anywhere on the court to drop a player there. Black tokens are offense, red-outlined tokens are defense. Switch to "\u2196 Move" and drag any token (or the ball) to reposition it.',
  },
  {
    title: '2. Draw the movement',
    body: 'Pick Cut, Pass, or Screen, then tap where the movement starts and tap again where it ends. Cut draws a solid arrow, Pass draws a dashed arrow, and Screen draws a short bar where the pick is set.',
  },
  {
    title: '3. Build the sequence step by step',
    body: 'Each "step" is a snapshot of where everyone is. Once step 1 looks right, tap "+ Add Step" \u2014 this copies the current positions into a new step. Move players and draw new arrows to show what happens next, and repeat for as many steps as the play needs.',
  },
  {
    title: '4. Play it back',
    body: 'Hit "\u25b6 Play Sequence" to animate through every step you built, like a telestrator. Use "\u2039" and "\u203a" to step through manually, or "\u27f2 Reset" to jump back to the start.',
  },
  {
    title: '5. Save or load a play',
    body: '"\ud83d\udcbe Save Play" stores your play in this browser so you can find it again later. You can also load a ready-made play from the library below the whiteboard, or describe a play in plain language to the AI assistant and it\u2019ll build the whole sequence for you.',
  },
];

const WhiteboardTutorial = ({ onClose }) => {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(26, 26, 46, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '30px',
          width: '100%',
          maxWidth: '520px',
          maxHeight: '85vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a2e', margin: 0 }}>🏀 How to Use the Whiteboard</h2>
          <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', fontSize: '22px', lineHeight: 1, color: '#7f8c8d', cursor: 'pointer', padding: '0 0 0 10px' }}>×</button>
        </div>
        <p style={{ fontSize: '13px', color: '#7f8c8d', marginBottom: '20px' }}>A quick walkthrough for building your first animated play.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {STEPS.map((step, i) => (
            <div key={i}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a2e', marginBottom: '4px' }}>{step.title}</h3>
              <p style={{ fontSize: '14px', color: '#2c3e50', lineHeight: '1.5', margin: 0 }}>{step.body}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          style={{ marginTop: '25px', width: '100%', padding: '12px', backgroundColor: '#ff6b35', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}
        >
          Got it, let\u2019s go
        </button>
      </div>
    </div>
  );
};

export default WhiteboardTutorial;
