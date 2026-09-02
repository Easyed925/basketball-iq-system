import React, { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';

const EXAMPLE_PROMPTS = [
  '60-minute practice, U14, working on defensive rotations',
  '90 minutes, varsity, installing our zone offense',
  'Quick 45-minute practice, ball handling for 8th graders',
  '2-hour pre-season practice, conditioning and fundamentals',
];

const AIPracticePlanGenerator = ({ onPlanGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [isRecording, setIsRecording] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [voiceSupported, setVoiceSupported] = useState(true);

  const recognitionRef = useRef(null);
  const shouldRecordRef = useRef(false);
  const pendingFinalRef = useRef(null); // a final result not yet confirmed settled
  const restartTimeoutRef = useRef(null); // pending auto-restart, so Stop can cancel it

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    const commitPending = () => {
      if (pendingFinalRef.current && pendingFinalRef.current.text) {
        const text = pendingFinalRef.current.text;
        setPrompt((p) => (p ? p.trim() + ' ' : '') + text);
      }
      pendingFinalRef.current = null;
    };

    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript.trim();
        if (result.isFinal) {
          if (pendingFinalRef.current && pendingFinalRef.current.index === i) {
            pendingFinalRef.current.text = transcript;
          } else {
            commitPending();
            pendingFinalRef.current = { index: i, text: transcript };
          }
        } else {
          interim += transcript;
        }
      }
      setInterimText(interim);
    };

    recognition.onerror = (event) => {
      if (event.error === 'no-speech' || event.error === 'aborted') return;
      commitPending();
      shouldRecordRef.current = false;
      setIsRecording(false);
      setInterimText('');
    };

    recognition.onend = () => {
      commitPending();
      setInterimText('');
      if (shouldRecordRef.current) {
        restartTimeoutRef.current = setTimeout(() => {
          restartTimeoutRef.current = null;
          if (!shouldRecordRef.current) return;
          try {
            recognition.start();
          } catch (e) {
            // already starting; ignore
          }
        }, 250);
      } else {
        setIsRecording(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      shouldRecordRef.current = false;
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = null;
      }
      try {
        recognition.stop();
      } catch (e) {
        // ignore
      }
    };
  }, []);

  const toggleRecording = useCallback(() => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      shouldRecordRef.current = false;
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = null;
      }
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore — may already be stopped
      }
      setIsRecording(false);
      setInterimText('');
    } else {
      try {
        pendingFinalRef.current = null;
        shouldRecordRef.current = true;
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        // start() throws if already started; ignore
      }
    }
  }, [isRecording]);


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

      const res = await fetch('/api/generate-practice-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ prompt: usePrompt }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong generating that practice plan.');
        return;
      }
      onPlanGenerated(data);
      setPrompt('');
    } catch (e) {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '12px', marginBottom: '30px' }}>
      <h3 style={{ color: '#1a1a2e', marginBottom: '6px', fontWeight: '700' }}>🤖 AI Practice Plan Builder</h3>
      <p style={{ fontSize: '13px', color: '#7f8c8d', marginBottom: '15px' }}>
        Describe the practice in plain language — Claude builds the drill sequence and opens it below.
      </p>

      <div style={{ marginBottom: '15px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="e.g. 60-minute practice, U14, working on defensive rotations"
            value={prompt + (interimText ? (prompt ? ' ' : '') + interimText : '')}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') generate(); }}
            style={{
              flex: 1,
              minWidth: 0,
              padding: '12px',
              border: '2px solid #ff6b35',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
          {voiceSupported && (
            <button
              type="button"
              onClick={toggleRecording}
              title={isRecording ? 'Stop dictating' : 'Dictate with your voice'}
              style={{
                padding: '0 16px',
                backgroundColor: isRecording ? '#e74c3c' : '#1a1a2e',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                flexShrink: 0,
              }}
            >
              {isRecording ? '⏹' : '🎤'}
            </button>
          )}
        </div>
        {isRecording && (
          <p style={{ fontSize: '12px', color: '#e74c3c', fontWeight: '600', margin: '-4px 0 10px' }}>● Listening…</p>
        )}
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
          {loading ? 'Building your practice plan…' : '✨ Generate Practice Plan'}
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

export default AIPracticePlanGenerator;
