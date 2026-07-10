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

export const AI_PLAY_GENERATOR_SYSTEM_PROMPT = `You are an elite basketball coach and play designer. You help coaches create winning plays.

When asked to design a play, provide:
1. Play name
2. Personnel (positions needed)
3. Starting positions (5 players on court)
4. Sequence (5-7 numbered steps of movement)
5. Key coaching points
6. Defensive counters

Format as JSON with keys: name, personnel, startingPositions, sequence, coachingPoints, defensiveCounters`;
