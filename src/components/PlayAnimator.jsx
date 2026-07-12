import React, { useState, useRef, useCallback, useEffect } from 'react';
import CourtSVG from './CourtSVG';
import { COURT_WIDTH, COURT_HEIGHT } from './courtGeometry';

const TWEEN_MS = 900;
const PAUSE_MS = 500;

const ARROW_STYLES = {
  cut: { stroke: '#1a1a2e', dash: 'none', label: 'Cut' },
  pass: { stroke: '#2980b9', dash: '2,1.5', label: 'Pass' },
  screen: { stroke: '#ff6b35', dash: 'none', label: 'Screen' },
};

const defaultPlayer = (id, team, label) => ({ id, team, label });

const makeInitialRoster = () => ([
  defaultPlayer('o1', 'offense', '1'),
  defaultPlayer('o2', 'offense', '2'),
  defaultPlayer('o3', 'offense', '3'),
  defaultPlayer('o4', 'offense', '4'),
  defaultPlayer('o5', 'offense', '5'),
]);

const makeInitialStep = (roster, positions, ball) => ({
  positions: positions || Object.fromEntries(roster.map((p, i) => [p.id, { x: 15, y: 8 + i * 8 }])),
  ball: ball || { x: 15, y: 8 },
  arrows: [],
});

const lerp = (a, b, t) => a + (b - a) * t;

const PlayAnimator = ({ initialPlay }) => {
  const [roster, setRoster] = useState(() => initialPlay?.roster || makeInitialRoster());
  const [steps, setSteps] = useState(() => initialPlay?.steps || [makeInitialStep(initialPlay?.roster || makeInitialRoster())]);
  const [currentStep, setCurrentStep] = useState(0);
  const [tween, setTween] = useState(null); // { from, to, t }
  const [isPlaying, setIsPlaying] = useState(false);
  const [tool, setTool] = useState('select');
  const [arrowDraft, setArrowDraft] = useState(null); // { x1, y1 }
  const [pointerPos, setPointerPos] = useState(null);
  const [savedMessage, setSavedMessage] = useState('');

  const svgRef = useRef(null);
  const draggingRef = useRef(null); // { type: 'player'|'ball', id }
  const cancelledRef = useRef(false);

  // Fallback for mobile browsers that don't fully honor touch-action on
  // SVG child elements: only block the page's own scroll while a token
  // is actively being dragged, never at any other time.
  useEffect(() => {
    const node = svgRef.current;
    if (!node) return undefined;
    const handler = (e) => {
      if (draggingRef.current) e.preventDefault();
    };
    node.addEventListener('touchmove', handler, { passive: false });
    return () => node.removeEventListener('touchmove', handler);
  }, []);

  useEffect(() => () => { cancelledRef.current = true; }, []);

  useEffect(() => {
    if (initialPlay) {
      setRoster(initialPlay.roster || makeInitialRoster());
      setSteps(initialPlay.steps || [makeInitialStep(initialPlay.roster || makeInitialRoster())]);
      setCurrentStep(0);
      setTween(null);
      setIsPlaying(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPlay]);

  const toSvgPoint = useCallback((evt) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const x = ((evt.clientX - rect.left) / rect.width) * COURT_WIDTH;
    const y = ((evt.clientY - rect.top) / rect.height) * COURT_HEIGHT;
    return {
      x: Math.max(0, Math.min(COURT_WIDTH, x)),
      y: Math.max(0, Math.min(COURT_HEIGHT, y)),
    };
  }, []);

  const updateCurrentStep = useCallback((updater) => {
    setSteps((prev) => {
      const next = [...prev];
      next[currentStep] = updater(next[currentStep]);
      return next;
    });
  }, [currentStep]);

  const handlePointerDownToken = (evt, type, id) => {
    if (tool !== 'select' || isPlaying) return;
    evt.stopPropagation();
    draggingRef.current = { type, id };
  };

  const handleCourtPointerMove = (evt) => {
    const pt = toSvgPoint(evt);
    if (draggingRef.current) {
      const { type, id } = draggingRef.current;
      updateCurrentStep((step) => {
        if (type === 'ball') return { ...step, ball: pt };
        return { ...step, positions: { ...step.positions, [id]: pt } };
      });
      return;
    }
    if (arrowDraft) setPointerPos(pt);
  };

  const handleCourtPointerUp = () => {
    draggingRef.current = null;
  };

  const handleCourtPointerDown = (evt) => {
    if (isPlaying) return;
    const pt = toSvgPoint(evt);

    if (tool === 'add-offense' || tool === 'add-defense') {
      const team = tool === 'add-offense' ? 'offense' : 'defense';
      const existingCount = roster.filter((p) => p.team === team).length;
      const id = `${team[0]}${Date.now()}`;
      const label = team === 'offense' ? String(existingCount + 1) : `X${existingCount + 1}`;
      setRoster((prev) => [...prev, defaultPlayer(id, team, label)]);
      setSteps((prev) => prev.map((step) => ({ ...step, positions: { ...step.positions, [id]: pt } })));
      setTool('select');
      return;
    }

    if (tool === 'cut' || tool === 'pass' || tool === 'screen') {
      if (!arrowDraft) {
        setArrowDraft(pt);
        setPointerPos(pt);
      } else {
        const arrow = { id: `a${Date.now()}`, x1: arrowDraft.x, y1: arrowDraft.y, x2: pt.x, y2: pt.y, type: tool };
        updateCurrentStep((step) => ({ ...step, arrows: [...step.arrows, arrow] }));
        setArrowDraft(null);
        setPointerPos(null);
      }
    }
  };

  const addStep = () => {
    setSteps((prev) => {
      const last = prev[prev.length - 1];
      return [...prev, { positions: { ...last.positions }, ball: { ...last.ball }, arrows: [] }];
    });
    setCurrentStep(steps.length);
  };

  const deleteStep = () => {
    if (steps.length <= 1) return;
    setSteps((prev) => prev.filter((_, i) => i !== currentStep));
    setCurrentStep((i) => Math.max(0, i - 1));
  };

  const resetPlay = () => {
    cancelledRef.current = true;
    setIsPlaying(false);
    setTween(null);
    setCurrentStep(0);
  };

  const clearArrows = () => {
    updateCurrentStep((step) => ({ ...step, arrows: [] }));
  };

  const play = () => {
    if (steps.length < 2 || isPlaying) return;
    cancelledRef.current = false;
    setIsPlaying(true);

    const animateFrom = (idx) => {
      if (cancelledRef.current) return;
      if (idx >= steps.length - 1) {
        setIsPlaying(false);
        setTween(null);
        return;
      }
      const start = performance.now();
      const frame = (now) => {
        if (cancelledRef.current) return;
        const t = Math.min(1, (now - start) / TWEEN_MS);
        setTween({ from: idx, to: idx + 1, t });
        if (t < 1) {
          requestAnimationFrame(frame);
        } else {
          setTween(null);
          setCurrentStep(idx + 1);
          setTimeout(() => animateFrom(idx + 1), PAUSE_MS);
        }
      };
      requestAnimationFrame(frame);
    };
    animateFrom(currentStep >= steps.length - 1 ? 0 : currentStep);
  };

  const stop = () => {
    cancelledRef.current = true;
    setIsPlaying(false);
    setTween(null);
  };

  const saveToLibrary = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('biq_saved_plays') || '[]');
      const name = window.prompt('Name this play:', 'My Custom Play');
      if (!name) return;
      saved.push({ id: `custom-${Date.now()}`, name, roster, steps, savedAt: new Date().toISOString() });
      localStorage.setItem('biq_saved_plays', JSON.stringify(saved));
      setSavedMessage('Saved to your browser\u2019s local storage.');
      setTimeout(() => setSavedMessage(''), 3000);
    } catch (e) {
      setSavedMessage('Could not save — your browser may be blocking local storage.');
    }
  };

  const step = steps[currentStep] || steps[0];
  const displayPositions = {};
  let displayBall = step.ball;
  let displayArrows = step.arrows;

  if (tween) {
    const fromStep = steps[tween.from];
    const toStep = steps[tween.to];
    roster.forEach((p) => {
      const from = fromStep.positions[p.id] || { x: 50, y: 25 };
      const to = toStep.positions[p.id] || from;
      displayPositions[p.id] = { x: lerp(from.x, to.x, tween.t), y: lerp(from.y, to.y, tween.t) };
    });
    displayBall = { x: lerp(fromStep.ball.x, toStep.ball.x, tween.t), y: lerp(fromStep.ball.y, toStep.ball.y, tween.t) };
    displayArrows = fromStep.arrows;
  } else {
    roster.forEach((p) => {
      displayPositions[p.id] = step.positions[p.id] || { x: 50, y: 25 };
    });
  }

  const toolButton = (id, label) => (
    <button
      className="pa-btn"
      onClick={() => { setTool(id); setArrowDraft(null); }}
      style={{
        padding: '8px 12px',
        backgroundColor: tool === id ? '#ff6b35' : '#ffffff',
        color: tool === id ? '#ffffff' : '#1a1a2e',
        border: '2px solid #ff6b35',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '13px',
      }}
    >
      {label}
    </button>
  );

  return (
    <div className="pa-wrapper" style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px' }}>
      <h3 style={{ color: '#1a1a2e', marginBottom: '15px', fontWeight: '700' }}>🏀 Play Design Whiteboard</h3>

      <div className="pa-toolbar" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
        {toolButton('select', '↖ Move')}
        {toolButton('add-offense', '+ Offense')}
        {toolButton('add-defense', '+ Defense')}
        {toolButton('cut', '↗ Cut')}
        {toolButton('pass', '⇢ Pass')}
        {toolButton('screen', '⊤ Screen')}
        <button className="pa-btn" onClick={clearArrows} style={{ padding: '8px 12px', backgroundColor: '#f5f5f5', color: '#1a1a2e', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>Clear Arrows</button>
      </div>

      <div className="pa-toolbar" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
        <button className="pa-btn" onClick={isPlaying ? stop : play} disabled={steps.length < 2} style={{ padding: '8px 16px', backgroundColor: steps.length < 2 ? '#cccccc' : '#1a1a2e', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: steps.length < 2 ? 'not-allowed' : 'pointer', fontWeight: '700', fontSize: '13px' }}>
          {isPlaying ? '⏸ Stop' : '▶ Play Sequence'}
        </button>
        <button className="pa-btn" onClick={resetPlay} style={{ padding: '8px 12px', backgroundColor: '#f5f5f5', color: '#1a1a2e', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>⟲ Reset</button>
        <span style={{ fontSize: '13px', color: '#7f8c8d', marginLeft: '8px' }}>Step {currentStep + 1} of {steps.length}</span>
        <button className="pa-btn" onClick={() => setCurrentStep((i) => Math.max(0, i - 1))} disabled={isPlaying || currentStep === 0} style={{ padding: '6px 10px', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer', background: '#fff' }}>‹</button>
        <button className="pa-btn" onClick={() => setCurrentStep((i) => Math.min(steps.length - 1, i + 1))} disabled={isPlaying || currentStep === steps.length - 1} style={{ padding: '6px 10px', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer', background: '#fff' }}>›</button>
        <button className="pa-btn" onClick={addStep} disabled={isPlaying} style={{ padding: '8px 12px', backgroundColor: '#2980b9', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>+ Add Step</button>
        <button className="pa-btn" onClick={deleteStep} disabled={isPlaying || steps.length <= 1} style={{ padding: '8px 12px', backgroundColor: '#f5f5f5', color: '#1a1a2e', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>Delete Step</button>
        <button className="pa-btn" onClick={saveToLibrary} style={{ padding: '8px 12px', backgroundColor: '#27ae60', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>💾 Save Play</button>
      </div>

      {savedMessage && <p style={{ fontSize: '12px', color: '#27ae60', marginBottom: '10px' }}>{savedMessage}</p>}

      {(tool === 'cut' || tool === 'pass' || tool === 'screen') && (
        <p style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '10px' }}>
          {arrowDraft ? 'Click where the movement ends.' : `Click where the ${ARROW_STYLES[tool].label.toLowerCase()} starts.`}
        </p>
      )}

      <div className="pa-court-wrap" style={{ border: '2px solid #ff6b35', borderRadius: '8px', overflow: 'hidden', maxWidth: '900px', width: '100%' }}>
        <CourtSVG
          ref={svgRef}
          onPointerDown={handleCourtPointerDown}
          onPointerMove={handleCourtPointerMove}
          onPointerUp={handleCourtPointerUp}
        >
          {displayArrows.map((arrow) => {
            const style = ARROW_STYLES[arrow.type] || ARROW_STYLES.cut;
            return (
              <g key={arrow.id}>
                <defs>
                  <marker id={`arrowhead-${arrow.id}`} markerWidth="4" markerHeight="4" refX="3" refY="2" orient="auto">
                    <path d="M0,0 L4,2 L0,4 Z" fill={style.stroke} />
                  </marker>
                </defs>
                <line
                  x1={arrow.x1} y1={arrow.y1} x2={arrow.x2} y2={arrow.y2}
                  stroke={style.stroke}
                  strokeWidth={0.4}
                  strokeDasharray={style.dash}
                  markerEnd={arrow.type !== 'screen' ? `url(#arrowhead-${arrow.id})` : undefined}
                />
                {arrow.type === 'screen' && (() => {
                  const dx = arrow.x2 - arrow.x1;
                  const dy = arrow.y2 - arrow.y1;
                  const len = Math.hypot(dx, dy) || 1;
                  const px = (-dy / len) * 1.5;
                  const py = (dx / len) * 1.5;
                  return (
                    <line x1={arrow.x2 - px} y1={arrow.y2 - py} x2={arrow.x2 + px} y2={arrow.y2 + py} stroke={style.stroke} strokeWidth={0.5} />
                  );
                })()}
              </g>
            );
          })}

          {arrowDraft && pointerPos && (
            <line x1={arrowDraft.x} y1={arrowDraft.y} x2={pointerPos.x} y2={pointerPos.y} stroke="#aaaaaa" strokeWidth={0.3} strokeDasharray="1,1" />
          )}

          <circle
            cx={displayBall.x}
            cy={displayBall.y}
            r={1.1}
            fill="#ff6b35"
            stroke="#1a1a2e"
            strokeWidth={0.15}
            onPointerDown={(e) => handlePointerDownToken(e, 'ball', 'ball')}
            style={{ cursor: tool === 'select' ? 'grab' : 'default', touchAction: tool === 'select' ? 'none' : 'auto' }}
          />

          {roster.map((p) => {
            const pos = displayPositions[p.id] || { x: 50, y: 25 };
            const isDefense = p.team === 'defense';
            return (
              <g
                key={p.id}
                onPointerDown={(e) => handlePointerDownToken(e, 'player', p.id)}
                style={{ cursor: tool === 'select' ? 'grab' : 'default', touchAction: tool === 'select' ? 'none' : 'auto' }}
              >
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={2.1}
                  fill={isDefense ? '#ffffff' : '#1a1a2e'}
                  stroke={isDefense ? '#e74c3c' : '#1a1a2e'}
                  strokeWidth={0.3}
                />
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={2}
                  fontWeight="700"
                  fill={isDefense ? '#e74c3c' : '#ffffff'}
                >
                  {p.label}
                </text>
              </g>
            );
          })}
        </CourtSVG>
      </div>

      <p style={{ fontSize: '12px', color: '#7f8c8d', marginTop: '12px' }}>
        Drag black tokens (offense) and red-outlined tokens (defense) to set up each step. Use Cut, Pass, or Screen to draw what happens next, then Add Step and repeat. Hit Play to watch the sequence.
      </p>
    </div>
  );
};

export default PlayAnimator;
