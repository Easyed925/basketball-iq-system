import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

const EXAMPLE_PROMPTS = [
  'Give me a play to beat a 2-3 zone',
  'Backdoor cut for a slow-footed big',
  'Quick set to get our best shooter open off a screen',
  'Late-game inbounds play with 5 seconds left',
];

const AIPlayGenerator = ({ onPlayGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastLoaded, setLastLoaded] = useState('');

  const generate = async (text) => {
    const usePrompt = (text ?? prompt).trim();
    if (!usePrompt || loading) return;
    setLoading(true);
    setError('');
    setLastLoaded('');

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session && sessionData.session.access_token;
      if (!token) {
        setError('Please sign in again \u2014 your session may have expired.');
        return;
      }

      const res = await fetch('/api/generate-play', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ prompt: usePrompt }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong generating that play.');
        return;
      }
      onPlayGenerated(data);
      setLastLoaded(data.name || 'Your play');
    } catch (e) {
      setError('Couldn\u2019t reach the server. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '12px' }}>
      <h3 style={{ color: '#1a1a2e', marginBottom: '6px', fontWeight: '700' }}>🤖 AI Play Design Assistant</h3>
      <p style={{ fontSize: '13px', color: '#7f8c8d', marginBottom: '15px' }}>
        Describe what you need in plain language \u2014 Claude designs the play and loads it straight onto the whiteboard above.
      </p>

      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="e.g. give me a play to beat a 2-3 zone"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') generate(); }}
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
          onClick={() => generate()}
          disabled={loading || !prompt.trim()}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading || !prompt.trim() ? '#cccccc' : '#ff6b35',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: loading || !prompt.trim() ? 'not-allowed' : 'pointer',
            fontSize: '14px',
          }}
        >
          {loading ? 'Designing your play\u2026' : '\u2728 Generate Play'}
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
        {EXAMPLE_PROMPTS.map((ex) => (
          <button
            key={ex}
            onClick={() => { setPrompt(ex); generate(ex); }}
            disabled={loading}
            style={{
              padding: '6px 12px',
              backgroundColor: '#ffffff',
              color: '#1a1a2e',
              border: '1px solid #ccc',
              borderRadius: '20px',
              fontSize: '12px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {ex}
          </button>
        ))}
      </div>

      {error && (
        <div style={{ backgroundColor: '#fdecea', border: '1px solid #e74c3c', borderRadius: '8px', padding: '12px 16px', marginBottom: '10px' }}>
          <p style={{ fontSize: '13px', color: '#c0392b', margin: 0 }}>{error}</p>
        </div>
      )}

      {lastLoaded && !error && (
        <div style={{ backgroundColor: '#eafaf1', border: '1px solid #27ae60', borderRadius: '8px', padding: '12px 16px' }}>
          <p style={{ fontSize: '13px', color: '#1e8449', margin: 0, fontWeight: '600' }}>
            \u2713 "{lastLoaded}" loaded onto the whiteboard above \u2191
          </p>
        </div>
      )}
    </div>
  );
};

export default AIPlayGenerator;
