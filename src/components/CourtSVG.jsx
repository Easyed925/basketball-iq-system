import React from 'react';
import { COURT_WIDTH, COURT_HEIGHT, LEFT_COURT, RIGHT_COURT } from './courtGeometry';

const HalfCourtMarkings = ({ court }) => (
  <>
    <rect
      x={court.laneRect.x}
      y={court.laneRect.y}
      width={court.laneRect.width}
      height={court.laneRect.height}
      fill="none"
      stroke="#1a1a2e"
      strokeWidth={0.3}
    />
    {court.hashMarks.map((h, i) => (
      <React.Fragment key={i}>
        <line x1={h.top.x1} y1={h.top.y1} x2={h.top.x2} y2={h.top.y2} stroke="#1a1a2e" strokeWidth={0.2} />
        <line x1={h.bottom.x1} y1={h.bottom.y1} x2={h.bottom.x2} y2={h.bottom.y2} stroke="#1a1a2e" strokeWidth={0.2} />
      </React.Fragment>
    ))}
    <path d={court.freeThrowSolidPath} fill="none" stroke="#1a1a2e" strokeWidth={0.3} />
    <path d={court.freeThrowDashedPath} fill="none" stroke="#1a1a2e" strokeWidth={0.3} strokeDasharray="0.8,0.8" />
    <line
      x1={court.backboard.x1}
      y1={court.backboard.y1}
      x2={court.backboard.x2}
      y2={court.backboard.y2}
      stroke="#1a1a2e"
      strokeWidth={0.5}
    />
    <circle cx={court.rim.cx} cy={court.rim.cy} r={court.rim.r} fill="none" stroke="#ff6b35" strokeWidth={0.3} />
    <path d={court.threePointPath} fill="none" stroke="#1a1a2e" strokeWidth={0.25} />
  </>
);

// A reusable, read-only court background. Children (player tokens, arrows,
// the ball) are rendered on top by the caller so this stays simple.
const CourtSVG = React.forwardRef(function CourtSVG({ children, onPointerDown, onPointerMove, onPointerUp, style }, ref) {
  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${COURT_WIDTH} ${COURT_HEIGHT}`}
      style={{ width: '100%', height: 'auto', display: 'block', touchAction: 'none', ...style }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <rect x={0} y={0} width={COURT_WIDTH} height={COURT_HEIGHT} fill="#ffffff" stroke="#1a1a2e" strokeWidth={0.5} />
      <line x1={COURT_WIDTH / 2} y1={0} x2={COURT_WIDTH / 2} y2={COURT_HEIGHT} stroke="#1a1a2e" strokeWidth={0.4} />
      <circle cx={COURT_WIDTH / 2} cy={COURT_HEIGHT / 2} r={COURT_HEIGHT * 0.15} fill="none" stroke="#1a1a2e" strokeWidth={0.4} />
      <HalfCourtMarkings court={LEFT_COURT} />
      <HalfCourtMarkings court={RIGHT_COURT} />
      {children}
    </svg>
  );
});

export default CourtSVG;
