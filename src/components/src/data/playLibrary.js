export const playLibrary = [
  {
    id: 'pick-roll-high',
    name: 'Pick & Roll - High',
    description: 'Classic pick and roll at the top of the key',
    difficulty: 'beginner',
    offensive: true,
    positions: ['PG', 'C'],
    tags: ['spacing', 'ball movement', 'floor spacing'],
  },
  {
    id: 'pick-roll-wing',
    name: 'Pick & Roll - Wing',
    description: 'Pick and roll action on the wing',
    difficulty: 'intermediate',
    offensive: true,
    positions: ['SG', 'PF'],
    tags: ['spacing', 'transition', 'pick and roll'],
  },
  {
    id: 'fast-break-3v2',
    name: 'Fast Break - 3v2',
    description: '3 on 2 transition opportunity',
    difficulty: 'beginner',
    offensive: true,
    positions: ['PG', 'SG', 'SF'],
    tags: ['transition', 'pace', 'spacing'],
  },
  {
    id: 'motion-offense',
    name: 'Motion Offense - Guard Swing',
    description: 'Guard to guard swing with floor spacing',
    difficulty: 'beginner',
    offensive: true,
    positions: ['PG', 'SG'],
    tags: ['motion', 'spacing', 'ball movement'],
  },
  {
    id: 'zone-defense',
    name: 'Zone Defense - 2-3',
    description: 'Traditional 2-3 zone setup',
    difficulty: 'beginner',
    offensive: false,
    positions: ['C', 'PF', 'SF'],
    tags: ['zone', 'defense', 'positioning'],
  },
  {
    id: 'man-defense',
    name: 'Man-to-Man Defense',
    description: 'Full court man-to-man pressure',
    difficulty: 'intermediate',
    offensive: false,
    positions: ['PG', 'SG', 'SF', 'PF', 'C'],
    tags: ['defense', 'pressure', 'man-to-man'],
  },
];

// Fully animated plays: real roster + step-by-step positions + arrows,
// loadable directly onto the PlayAnimator whiteboard.
export const animatedPlays = [
  {
    id: 'horns-pnr',
    name: 'Horns - Ball Screen & Roll',
    description: 'Point guard uses a ball screen from the top, big rolls to the rim.',
    roster: [
      { id: 'o1', team: 'offense', label: '1' },
      { id: 'o2', team: 'offense', label: '2' },
      { id: 'o3', team: 'offense', label: '3' },
      { id: 'o4', team: 'offense', label: '4' },
      { id: 'o5', team: 'offense', label: '5' },
    ],
    steps: [
      {
        positions: { o1: { x: 40, y: 25 }, o2: { x: 18, y: 6 }, o3: { x: 18, y: 44 }, o4: { x: 22, y: 16 }, o5: { x: 30, y: 34 } },
        ball: { x: 41, y: 25 },
        arrows: [{ id: 'h1', x1: 30, y1: 34, x2: 34, y2: 23, type: 'screen' }],
      },
      {
        positions: { o1: { x: 28, y: 14 }, o2: { x: 18, y: 6 }, o3: { x: 18, y: 44 }, o4: { x: 22, y: 16 }, o5: { x: 34, y: 23 } },
        ball: { x: 29, y: 14 },
        arrows: [{ id: 'h2', x1: 34, y1: 23, x2: 16, y2: 20, type: 'cut' }],
      },
      {
        positions: { o1: { x: 28, y: 14 }, o2: { x: 18, y: 6 }, o3: { x: 18, y: 44 }, o4: { x: 22, y: 16 }, o5: { x: 16, y: 20 } },
        ball: { x: 29, y: 14 },
        arrows: [{ id: 'h3', x1: 29, y1: 14, x2: 16, y2: 20, type: 'pass' }],
      },
      {
        positions: { o1: { x: 28, y: 14 }, o2: { x: 18, y: 6 }, o3: { x: 18, y: 44 }, o4: { x: 22, y: 16 }, o5: { x: 16, y: 20 } },
        ball: { x: 16, y: 20 },
        arrows: [],
      },
    ],
  },
  {
    id: 'motion-swing',
    name: 'Motion Offense - Guard Swing',
    description: 'Guard passes and cuts opposite for a give-and-go read.',
    roster: [
      { id: 'o1', team: 'offense', label: '1' },
      { id: 'o2', team: 'offense', label: '2' },
      { id: 'o3', team: 'offense', label: '3' },
      { id: 'o4', team: 'offense', label: '4' },
      { id: 'o5', team: 'offense', label: '5' },
    ],
    steps: [
      {
        positions: { o1: { x: 40, y: 25 }, o2: { x: 15, y: 10 }, o3: { x: 15, y: 40 }, o4: { x: 25, y: 15 }, o5: { x: 25, y: 35 } },
        ball: { x: 41, y: 25 },
        arrows: [{ id: 'm1', x1: 41, y1: 25, x2: 15, y2: 10, type: 'pass' }, { id: 'm2', x1: 40, y1: 25, x2: 32, y2: 30, type: 'cut' }],
      },
      {
        positions: { o1: { x: 32, y: 30 }, o2: { x: 15, y: 10 }, o3: { x: 15, y: 40 }, o4: { x: 25, y: 15 }, o5: { x: 25, y: 35 } },
        ball: { x: 15, y: 10 },
        arrows: [],
      },
    ],
  },
  {
    id: 'princeton-backdoor',
    name: 'Princeton - Backdoor Cut',
    description: 'When the defender overplays the passing lane, cut backdoor for the layup.',
    roster: [
      { id: 'o1', team: 'offense', label: '1' },
      { id: 'o2', team: 'offense', label: '2' },
      { id: 'o3', team: 'offense', label: '3' },
      { id: 'o4', team: 'offense', label: '4' },
      { id: 'o5', team: 'offense', label: '5' },
      { id: 'd1', team: 'defense', label: 'X3' },
    ],
    steps: [
      {
        positions: { o1: { x: 40, y: 25 }, o2: { x: 15, y: 8 }, o3: { x: 15, y: 42 }, o4: { x: 25, y: 15 }, o5: { x: 25, y: 35 }, d1: { x: 20, y: 40 } },
        ball: { x: 41, y: 25 },
        arrows: [{ id: 'p1', x1: 15, y1: 42, x2: 8, y2: 28, type: 'cut' }, { id: 'p2', x1: 41, y1: 25, x2: 8, y2: 28, type: 'pass' }],
      },
      {
        positions: { o1: { x: 40, y: 25 }, o2: { x: 15, y: 8 }, o3: { x: 8, y: 28 }, o4: { x: 25, y: 15 }, o5: { x: 25, y: 35 }, d1: { x: 20, y: 40 } },
        ball: { x: 8, y: 28 },
        arrows: [],
      },
    ],
  },
  {
    id: 'zone-attack-23',
    name: 'Attack a 2-3 Zone',
    description: 'Flash a shooter into the high-post gap, then skip the ball to the open corner.',
    roster: [
      { id: 'o1', team: 'offense', label: '1' },
      { id: 'o2', team: 'offense', label: '2' },
      { id: 'o3', team: 'offense', label: '3' },
      { id: 'o4', team: 'offense', label: '4' },
      { id: 'o5', team: 'offense', label: '5' },
      { id: 'd1', team: 'defense', label: 'X1' },
      { id: 'd2', team: 'defense', label: 'X2' },
      { id: 'd3', team: 'defense', label: 'X3' },
      { id: 'd4', team: 'defense', label: 'X4' },
      { id: 'd5', team: 'defense', label: 'X5' },
    ],
    steps: [
      {
        positions: {
          o1: { x: 40, y: 25 }, o2: { x: 20, y: 5 }, o3: { x: 20, y: 45 }, o4: { x: 30, y: 15 }, o5: { x: 15, y: 25 },
          d1: { x: 25, y: 15 }, d2: { x: 25, y: 35 }, d3: { x: 12, y: 10 }, d4: { x: 10, y: 25 }, d5: { x: 12, y: 40 },
        },
        ball: { x: 41, y: 25 },
        arrows: [{ id: 'z1', x1: 41, y1: 25, x2: 15, y2: 25, type: 'pass' }],
      },
      {
        positions: {
          o1: { x: 35, y: 20 }, o2: { x: 20, y: 5 }, o3: { x: 20, y: 45 }, o4: { x: 30, y: 15 }, o5: { x: 15, y: 25 },
          d1: { x: 25, y: 15 }, d2: { x: 25, y: 35 }, d3: { x: 12, y: 10 }, d4: { x: 10, y: 25 }, d5: { x: 12, y: 40 },
        },
        ball: { x: 15, y: 25 },
        arrows: [{ id: 'z2', x1: 15, y1: 25, x2: 20, y2: 5, type: 'pass' }],
      },
      {
        positions: {
          o1: { x: 35, y: 20 }, o2: { x: 20, y: 5 }, o3: { x: 20, y: 45 }, o4: { x: 30, y: 15 }, o5: { x: 15, y: 25 },
          d1: { x: 25, y: 15 }, d2: { x: 25, y: 35 }, d3: { x: 12, y: 10 }, d4: { x: 10, y: 25 }, d5: { x: 12, y: 40 },
        },
        ball: { x: 20, y: 5 },
        arrows: [],
      },
    ],
  },
];

export const AI_PLAY_GENERATOR_SYSTEM_PROMPT = `You are an elite basketball coach and play designer. A coach will describe what they need in plain language (for example: "give me a play to beat a 2-3 zone" or "backdoor cut for a slow big").

Respond with ONLY valid JSON, no prose before or after, matching exactly this shape:
{
  "name": "string",
  "description": "one sentence description",
  "roster": [{ "id": "o1", "team": "offense", "label": "1" }, ...],
  "steps": [
    {
      "positions": { "o1": { "x": 0-100, "y": 0-50 }, ... },
      "ball": { "x": 0-100, "y": 0-50 },
      "arrows": [{ "id": "a1", "x1": 0, "y1": 0, "x2": 0, "y2": 0, "type": "cut" | "pass" | "screen" }]
    }
  ]
}

Coordinate system: the court is 100 units wide by 50 units tall. The offensive basket is near x=8, y=25 (left side). Half court is x=50. Keep all player and ball coordinates within 0-100 and 0-50. Use 3-5 offense players (ids o1-o5) and, if the play is against a specific defense, 3-5 defense players (ids d1-d5). Produce 2-4 steps showing the full sequence. Every arrow belongs to the step it starts from and represents the movement that happens between that step and the next one.`;
