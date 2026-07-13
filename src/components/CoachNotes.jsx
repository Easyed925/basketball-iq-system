import React, { useState, useRef, useEffect, useCallback } from 'react';

const CATEGORIES = [
  { id: 'practice', label: 'Practice Outline', emoji: '📋' },
  { id: 'gameday', label: 'Game Day Prep', emoji: '🏆' },
  { id: 'scouting', label: 'Scouting Report', emoji: '🔍' },
  { id: 'general', label: 'General', emoji: '📝' },
];

const STORAGE_KEY = 'biq_coach_notes';

const loadNotes = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const emptyDraft = () => ({ id: null, title: '', category: 'practice', content: '' });

const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' \u00b7 ' +
    d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
};

const CoachNotes = () => {
  const [notes, setNotes] = useState(loadNotes);
  const [draft, setDraft] = useState(emptyDraft());
  const [isEditing, setIsEditing] = useState(false);
  const [filter, setFilter] = useState('all');
  const [isRecording, setIsRecording] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [voiceSupported, setVoiceSupported] = useState(true);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalChunk = '';
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalChunk += transcript + ' ';
        } else {
          interim += transcript;
        }
      }
      if (finalChunk) {
        setDraft((d) => ({ ...d, content: (d.content ? d.content.trim() + ' ' : '') + finalChunk.trim() }));
      }
      setInterimText(interim);
    };

    recognition.onerror = () => {
      setIsRecording(false);
      setInterimText('');
    };

    recognition.onend = () => {
      setIsRecording(false);
      setInterimText('');
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const toggleRecording = useCallback(() => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        // start() throws if already started; ignore
      }
    }
  }, [isRecording]);

  const saveNote = () => {
    if (!draft.content.trim()) return;
    const title = draft.title.trim() || draft.content.trim().slice(0, 40) + (draft.content.trim().length > 40 ? '\u2026' : '');
    const now = new Date().toISOString();

    setNotes((prev) => {
      let next;
      if (draft.id) {
        next = prev.map((n) => (n.id === draft.id ? { ...n, title, category: draft.category, content: draft.content.trim(), updatedAt: now } : n));
      } else {
        next = [{ id: `note-${Date.now()}`, title, category: draft.category, content: draft.content.trim(), createdAt: now, updatedAt: now }, ...prev];
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        // storage full or blocked; note still lives in state for this session
      }
      return next;
    });

    if (isRecording) toggleRecording();
    setDraft(emptyDraft());
    setIsEditing(false);
  };

  const editNote = (note) => {
    if (isRecording) toggleRecording();
    setDraft({ id: note.id, title: note.title, category: note.category, content: note.content });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteNote = (id) => {
    if (!window.confirm('Delete this note? This can\u2019t be undone.')) return;
    setNotes((prev) => {
      const next = prev.filter((n) => n.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        // ignore
      }
      return next;
    });
  };

  const cancelEdit = () => {
    if (isRecording) toggleRecording();
    setDraft(emptyDraft());
    setIsEditing(false);
  };

  const colors = { primary: '#1a1a2e', accent: '#ff6b35', light: '#f5f5f5', white: '#ffffff', text: '#2c3e50', lightText: '#7f8c8d' };

  const categoryMeta = (id) => CATEGORIES.find((c) => c.id === id) || CATEGORIES[3];
  const visibleNotes = filter === 'all' ? notes : notes.filter((n) => n.category === filter);

  return (
    <div style={{ backgroundColor: colors.white, padding: '30px', borderRadius: '12px', marginBottom: '40px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '700', color: colors.primary, marginBottom: '6px' }}>🎙️ Coach Notes</h2>
      <p style={{ fontSize: '13px', color: colors.lightText, marginBottom: '20px' }}>
        Dictate or type notes for practice outlines, game day prep, and scouting \u2014 saved right on this device.
      </p>

      {!voiceSupported && (
        <div style={{ backgroundColor: '#fff4e5', border: '1px solid ' + colors.accent, borderRadius: '8px', padding: '12px 16px', marginBottom: '20px' }}>
          <p style={{ fontSize: '13px', color: colors.text, margin: 0 }}>
            Voice typing isn\u2019t supported in this browser. It works best in Chrome or Edge on desktop and Android. You can still type notes normally below.
          </p>
        </div>
      )}

      {/* Editor */}
      <div style={{ backgroundColor: colors.light, padding: '20px', borderRadius: '8px', border: '2px solid ' + colors.accent, marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="Note title (optional)"
          value={draft.title}
          onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
          style={{ width: '100%', padding: '10px 12px', fontSize: '14px', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '10px', boxSizing: 'border-box' }}
        />

        <div className="pa-toolbar" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setDraft((d) => ({ ...d, category: c.id }))}
              className="pa-btn"
              style={{
                padding: '6px 12px',
                borderRadius: '20px',
                border: '2px solid ' + colors.accent,
                backgroundColor: draft.category === c.id ? colors.accent : colors.white,
                color: draft.category === c.id ? colors.white : colors.primary,
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '12px',
              }}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>

        <textarea
          placeholder="Start typing, or tap the mic to dictate\u2026"
          value={draft.content + (interimText ? (draft.content ? ' ' : '') + interimText : '')}
          onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
          rows={6}
          style={{ width: '100%', padding: '12px', fontSize: '14px', borderRadius: '6px', border: '1px solid #ddd', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
        />

        <div className="pa-toolbar" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginTop: '12px' }}>
          {voiceSupported && (
            <button
              onClick={toggleRecording}
              className="pa-btn"
              style={{
                padding: '10px 18px',
                backgroundColor: isRecording ? '#e74c3c' : colors.primary,
                color: colors.white,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '13px',
              }}
            >
              {isRecording ? '\u23f9 Stop Recording' : '\ud83c\udfa4 Start Recording'}
            </button>
          )}
          {isRecording && <span style={{ fontSize: '12px', color: '#e74c3c', fontWeight: '600' }}>\u25cf Listening\u2026</span>}
          <button onClick={saveNote} disabled={!draft.content.trim()} className="pa-btn" style={{ padding: '10px 18px', backgroundColor: draft.content.trim() ? colors.accent : '#cccccc', color: colors.white, border: 'none', borderRadius: '6px', cursor: draft.content.trim() ? 'pointer' : 'not-allowed', fontWeight: '700', fontSize: '13px' }}>
            {isEditing ? 'Save Changes' : '+ Save Note'}
          </button>
          {isEditing && (
            <button onClick={cancelEdit} className="pa-btn" style={{ padding: '10px 18px', backgroundColor: colors.white, color: colors.primary, border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Filter pills */}
      <div className="pa-toolbar" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '18px' }}>
        <button
          onClick={() => setFilter('all')}
          className="pa-btn"
          style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid #ddd', backgroundColor: filter === 'all' ? colors.primary : colors.white, color: filter === 'all' ? colors.white : colors.text, cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}
        >
          All ({notes.length})
        </button>
        {CATEGORIES.map((c) => {
          const count = notes.filter((n) => n.category === c.id).length;
          return (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className="pa-btn"
              style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid #ddd', backgroundColor: filter === c.id ? colors.primary : colors.white, color: filter === c.id ? colors.white : colors.text, cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}
            >
              {c.emoji} {c.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Notes list */}
      {visibleNotes.length === 0 ? (
        <p style={{ fontSize: '14px', color: colors.lightText, textAlign: 'center', padding: '30px 0' }}>
          No notes yet {filter !== 'all' ? `in ${categoryMeta(filter).label}` : ''} \u2014 dictate or type your first one above.
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '15px' }}>
          {visibleNotes.map((note) => {
            const cat = categoryMeta(note.category);
            return (
              <div key={note.id} style={{ backgroundColor: colors.light, padding: '16px', borderRadius: '8px', border: '2px solid ' + colors.accent, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: colors.accent, backgroundColor: '#fff4e5', padding: '3px 8px', borderRadius: '10px' }}>
                    {cat.emoji} {cat.label}
                  </span>
                  <span style={{ fontSize: '11px', color: colors.lightText }}>{formatDate(note.updatedAt)}</span>
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: colors.primary, margin: '4px 0 6px' }}>{note.title}</h3>
                <p style={{ fontSize: '13px', color: colors.text, lineHeight: '1.5', flexGrow: 1, whiteSpace: 'pre-wrap' }}>
                  {note.content.length > 220 ? note.content.slice(0, 220) + '\u2026' : note.content}
                </p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <button onClick={() => editNote(note)} className="pa-btn" style={{ padding: '6px 12px', backgroundColor: colors.white, color: colors.primary, border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}>Edit</button>
                  <button onClick={() => deleteNote(note.id)} className="pa-btn" style={{ padding: '6px 12px', backgroundColor: colors.white, color: '#e74c3c', border: '1px solid #e74c3c', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}>Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p style={{ fontSize: '11px', color: colors.lightText, marginTop: '20px' }}>
        Notes are saved in this browser only, on this device \u2014 they won\u2019t sync across devices yet.
      </p>
    </div>
  );
};

export default CoachNotes;
