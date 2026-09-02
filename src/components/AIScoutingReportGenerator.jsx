import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

const EXAMPLE_PROMPTS = [
  'Runs ball screens for their point guard, presses full court after makes',
  'Dominant post player who struggles from the free throw line',
  'Slow-paced team that packs the paint on defense, weak on the perimeter',
  'Young, athletic team that turns the ball over under pressure',
];

const AIScoutingReportGenerator = ({ onReportGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generate = async (text) => {
    const usePrompt = (text ?? prompt).trim();
    if (!usePrompt || loading) return;
    setLoading(true);
    setError('');

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session && sessionData.session.access_token;
      if (!token) {
        setError("Please sign in again — your session may have expired.");
        return;
      }

      const res = await fetch('/api/generate-scouting-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ prompt: usePrompt }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong generating that scouting report.');
        return;
      }
      onReportGenerated(data);
      setPrompt('');
    } catch (e) {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '12px', marginBottom: '30px' }}>
      <h3 style={{ color: '#1a1a2e', marginBottom: '6px', fontWeight: '700' }}>🤖 AI Scouting Report Builder</h3>
      <p style={{ fontSize: '13px', color: '#7f8c8d', marginBottom: '15px' }}>
        Describe what you know about the opponent — Claude structures it into a full report below.
      </p>

      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="e.g. Runs ball screens for their point guard, presses full court after makes"
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
          {loading ? 'Building your scouting report…' : '✨ Generate Scouting Report'}
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: error ? '15px' : '0' }}>
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
        <div style={{ backgroundColor: '#fdecea', border: '1px solid #e74c3c', borderRadius: '8px', padding: '12px 16px' }}>
          <p style={{ fontSize: '13px', color: '#c0392b', margin: 0 }}>{error}</p>
        </div>
      )}
    </div>
  );
};

export default AIScoutingReportGenerator;
