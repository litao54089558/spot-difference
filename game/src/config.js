// Spot the Difference — game-wide constants and the level registry.
// One job: every number the rest of the game agrees on lives here, so tuning
// the feel (timers, penalties, scoring) means editing this file alone.

export const VIEW_WIDTH = 1280;
export const VIEW_HEIGHT = 720;

export const TOP_BAR_HEIGHT = 64;
export const BOTTOM_BAR_HEIGHT = 56;
export const PANEL_GAP = 24;
export const PANEL_LABEL_HEIGHT = 28;

// The two panels share one scene coordinate system: the scene is drawn
// PANEL_WIDTH x PANEL_HEIGHT and the same coordinates are used for clicks.
export const PANEL_WIDTH = 604;
export const PANEL_HEIGHT = 560;
export const PANEL_TOP = TOP_BAR_HEIGHT + PANEL_LABEL_HEIGHT + 8;

export const PANEL_X_LEFT = (VIEW_WIDTH - PANEL_WIDTH * 2 - PANEL_GAP) / 2;
export const PANEL_X_RIGHT = PANEL_X_LEFT + PANEL_WIDTH + PANEL_GAP;

export const DIFFERENCES_PER_LEVEL = 10;
export const HINTS_PER_LEVEL = 3;
export const HINT_FLASH_MS = 2600;
export const WRONG_CLICK_TIME_PENALTY_S = 5;
export const WRONG_CLICK_SCORE_PENALTY = 25;
export const FIND_SCORE = 100;
export const TIME_BONUS_PER_SECOND = 5;
export const MARKER_RADIUS = 26;

// A wrong click also shows a red X that fades away.
export const MISS_MARK_MS = 900;

export const LEVELS = [
  {
    id: 'garden',
    name: 'Morning in the Garden',
    scene: 'garden',
    timeLimitSeconds: 180,
    blurb: 'A cottage garden at sunrise. Ten small things changed between the two pictures.',
  },
  {
    id: 'market',
    name: 'Lantern Night Market',
    scene: 'market',
    timeLimitSeconds: 150,
    blurb: 'Lanterns, fruit stalls and a cat on a crate. Look twice — the market hides its changes.',
  },
  {
    id: 'lighthouse',
    name: 'The Lighthouse at Dusk',
    scene: 'lighthouse',
    timeLimitSeconds: 120,
    blurb: 'Sea, gulls and a turning beam. The hardest hunt: the dusk hides everything.',
  },
];

// Button rectangles are laid out by the renderer; the ids below are the
// names input.js asks about when a click lands inside a button.
export const BUTTON_IDS = ['start', 'hint', 'mute', 'next', 'retry', 'again', 'menu'];
