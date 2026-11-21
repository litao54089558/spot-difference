// Spot the Difference — the differences themselves, as data.
// One job: for every level, the ten things that changed between the two
// pictures. Each difference names a spot in scene coordinates (the same
// 604 x 560 space both panels draw in), a hit radius, and a short label
// the game shows when the player finds it. The scene modules read these
// ids to decide what to draw differently on the right panel; this file
// never draws anything.

export const LEVEL_DIFFERENCES = {
  garden: [
    { id: 'sun-rays', label: 'the sun lost its rays', x: 90, y: 70, r: 46 },
    { id: 'chimney-smoke', label: 'the chimney smoke', x: 372, y: 232, r: 30 },
    { id: 'tree-apple', label: 'an apple on the tree', x: 140, y: 280, r: 18 },
    { id: 'window-curtains', label: 'the cottage window', x: 252, y: 352, r: 30 },
    { id: 'flower-color', label: 'a tulip changed colour', x: 520, y: 520, r: 18 },
    { id: 'pond-duck', label: 'the duck on the pond', x: 470, y: 495, r: 26 },
    { id: 'butterfly', label: 'the butterfly', x: 480, y: 180, r: 22 },
    { id: 'sky-bird', label: 'a bird in the sky', x: 350, y: 130, r: 20 },
    { id: 'fence-slat', label: 'a fence slat', x: 440, y: 485, r: 18 },
    { id: 'door-window', label: 'the round window on the door', x: 305, y: 405, r: 20 },
  ],
  market: [
    { id: 'moon-phase', label: 'the moon changed phase', x: 520, y: 70, r: 34 },
    { id: 'lantern-color', label: 'a lantern changed colour', x: 180, y: 220, r: 24 },
    { id: 'string-bulb', label: 'a bulb went out', x: 503, y: 153, r: 16 },
    { id: 'market-cat', label: 'the cat on the crate', x: 500, y: 465, r: 26 },
    { id: 'fruit-count', label: 'an orange on the stall', x: 120, y: 400, r: 18 },
    { id: 'banner-symbol', label: 'the banner symbol', x: 300, y: 150, r: 22 },
    { id: 'awning-stripe', label: 'an awning stripe', x: 300, y: 308, r: 18 },
    { id: 'extra-lantern', label: 'a little hanging lantern', x: 430, y: 230, r: 20 },
    { id: 'tea-steam', label: 'the steam over the tea', x: 470, y: 380, r: 20 },
    { id: 'crate-stack', label: 'a crate in the stack', x: 70, y: 470, r: 24 },
  ],
  lighthouse: [
    { id: 'light-beam', label: 'the lighthouse beam', x: 330, y: 85, r: 40 },
    { id: 'boat-sail', label: 'the stripe on the sail', x: 150, y: 290, r: 26 },
    { id: 'gull-count', label: 'a seagull', x: 300, y: 110, r: 18 },
    { id: 'sea-buoy', label: 'the buoy', x: 280, y: 380, r: 20 },
    { id: 'tower-window', label: 'a lighthouse window', x: 420, y: 280, r: 20 },
    { id: 'jumping-fish', label: 'the jumping fish', x: 520, y: 330, r: 22 },
    { id: 'sky-star', label: 'a bright star', x: 180, y: 50, r: 16 },
    { id: 'shore-rock', label: 'a rock on the shore', x: 100, y: 520, r: 26 },
    { id: 'wave-crest', label: 'a wave crest', x: 200, y: 450, r: 24 },
    { id: 'tower-flag', label: 'the flag on the tower', x: 425, y: 42, r: 20 },
  ],
};

// Look a click up in one level's differences. The click is in scene
// coordinates; either panel maps to the same scene space. Returns the
// difference whose circle the click falls inside, or null. When circles
// overlap, the smallest one wins, so tight spots stay hittable.
export function findDifferenceAt(scene, sceneX, sceneY) {
  const diffs = LEVEL_DIFFERENCES[scene];
  if (!diffs) return null;
  let best = null;
  for (const diff of diffs) {
    const dx = sceneX - diff.x;
    const dy = sceneY - diff.y;
    if (dx * dx + dy * dy <= diff.r * diff.r) {
      if (!best || diff.r < best.r) best = diff;
    }
  }
  return best;
}

// The set of ids that the right panel draws in its changed form: all of
// them, every level. The left panel draws with an empty set.
export function allDifferenceIds(scene) {
  return LEVEL_DIFFERENCES[scene].map((diff) => diff.id);
}
