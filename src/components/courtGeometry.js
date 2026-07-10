// Pure geometry helpers for a 100 x 50 (viewBox units) top-down half/full
// basketball court, used by both halves via mirroring. Kept separate from
// the animator component so the math is easy to test and reuse.

export const COURT_WIDTH = 100;
export const COURT_HEIGHT = 50;

const mirrorX = (x, mirrored) => (mirrored ? COURT_WIDTH - x : x);

// Builds every path/shape needed to draw one basket's half of the court.
// Returns plain numbers/strings ready to drop into SVG elements.
export function buildHalfCourt(mirrored) {
  const centerY = COURT_HEIGHT / 2;
  const laneDepth = COURT_WIDTH * 0.19;
  const laneHalfWidth = COURT_HEIGHT * 0.16;

  const laneX0 = mirrorX(0, mirrored);
  const laneX1 = mirrorX(laneDepth, mirrored);
  const laneRect = {
    x: Math.min(laneX0, laneX1),
    y: centerY - laneHalfWidth,
    width: Math.abs(laneX1 - laneX0),
    height: laneHalfWidth * 2,
  };

  const hashMarks = [0.34, 0.52, 0.7, 0.86].map((f) => {
    const x = mirrorX(laneDepth * f, mirrored);
    return {
      top: { x1: x, y1: centerY - laneHalfWidth, x2: x, y2: centerY - laneHalfWidth - 1.75 },
      bottom: { x1: x, y1: centerY + laneHalfWidth, x2: x, y2: centerY + laneHalfWidth + 1.75 },
    };
  });

  const ftX = mirrorX(laneDepth, mirrored);
  const freeThrowCircle = { cx: ftX, cy: centerY, r: laneHalfWidth };
  // Solid on the half away from the baseline, dashed on the half inside the lane.
  const ftSweepSolid = mirrored ? 0 : 1;
  const ftSweepDashed = mirrored ? 1 : 0;
  const freeThrowSolidPath = `M ${ftX} ${centerY - laneHalfWidth} A ${laneHalfWidth} ${laneHalfWidth} 0 0 ${ftSweepSolid} ${ftX} ${centerY + laneHalfWidth}`;
  const freeThrowDashedPath = `M ${ftX} ${centerY - laneHalfWidth} A ${laneHalfWidth} ${laneHalfWidth} 0 0 ${ftSweepDashed} ${ftX} ${centerY + laneHalfWidth}`;

  const backboardX = mirrorX(COURT_WIDTH * 0.035, mirrored);
  const backboard = {
    x1: backboardX,
    y1: centerY - COURT_HEIGHT * 0.05,
    x2: backboardX,
    y2: centerY + COURT_HEIGHT * 0.05,
  };

  const basketX = mirrorX(COURT_WIDTH * 0.035 + COURT_WIDTH * 0.02, mirrored);
  const rim = { cx: basketX, cy: centerY, r: 1.5 };

  // Three-point line: two straight corner segments meeting a true arc,
  // built so the segments and the arc endpoints coincide exactly.
  const radius = COURT_HEIGHT * 0.44;
  const cornerYTop = COURT_HEIGHT * 0.08;
  const cornerYBottom = COURT_HEIGHT * 0.92;
  const dyTop = cornerYTop - centerY;
  const dxTop = Math.sqrt(Math.max(0, radius * radius - dyTop * dyTop));
  const localCornerX = COURT_WIDTH * 0.035 + COURT_WIDTH * 0.02 + dxTop;
  const cornerX = mirrorX(localCornerX, mirrored);
  const baselineX = mirrorX(0, mirrored);

  const arcEnd = { x: cornerX, y: cornerYBottom };
  // Large-arc-flag 0, sweep-flag depends on mirroring so the arc always
  // bulges away from the baseline (into the court).
  const sweepFlag = mirrored ? 0 : 1;
  const threePointPath = [
    `M ${baselineX} ${cornerYTop}`,
    `L ${cornerX} ${cornerYTop}`,
    `A ${radius} ${radius} 0 0 ${sweepFlag} ${arcEnd.x} ${arcEnd.y}`,
    `L ${baselineX} ${cornerYBottom}`,
  ].join(' ');

  return {
    laneRect,
    hashMarks,
    freeThrowCircle,
    freeThrowSolidPath,
    freeThrowDashedPath,
    backboard,
    rim,
    threePointPath,
    mirrored,
  };
}

export const LEFT_COURT = buildHalfCourt(false);
export const RIGHT_COURT = buildHalfCourt(true);
