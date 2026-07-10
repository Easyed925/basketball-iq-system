import React, { useState } from 'react';

const AIPlayGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    // Placeholder - will be connected to real AI in Phase 2
    setTimeout(() => {
      setResponse(`
AI Play Design Assistant - Coming Soon!

This feature will generate custom plays based on your coaching needs.

Try asking about:
- Pick and roll variations
- Fast break opportunities
- Zone defense setups
- Motion offense patterns
- Transition strategies

In Phase 2, this will use real AI powered by Claude to generate professional-level plays.
      `);
      setLoading(false);
    }, 500);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '12px' }}>
      <h3 style={{ color: '#1a1a2e', marginBottom: '15px', fontWeight: '700' }}>🤖 AI Play Designer (Phase 2)</h3>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Describe the play you want to design..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #ff6b35',
            borderRadius: '6px',
            fontSize: '14px',
            marginBottom: '10px',
            boxSizing: 'border-box',
          }}
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading ? '#cccccc' : '#ff6b35',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
          }}
        >
          {loading ? 'Generating...' : 'Generate Play'}
        </button>
      </div>

      {response && (
        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '20px',
            borderRadius: '8px',
            border: '2px solid #ff6b35',
            fontSize: '14px',
            color: '#2c3e50',
            lineHeight: '1.8',
            whiteSpace: 'pre-wrap',
          }}
        >
          {response}
        </div>
      )}

      <p style={{ fontSize: '12px', color: '#7f8c8d', marginTop: '15px' }}>
        💡 Full AI integration coming in Phase 2. Will generate real plays with Claude AI.
      </p>
    </div>
  );
};

export default AIPlayGenerator;
