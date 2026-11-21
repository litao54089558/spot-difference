// Spot the Difference — screenshot presets.
// One job: let the maker photograph the game in a chosen state with a URL
// parameter, so the screenshots are real renders of the same code the
// player runs. ?shot=start shows the menu, ?shot=mid a mid-hunt level 1
// with four differences already circled, ?shot=level2 the second scene,
// ?shot=level3 the third scene, ?shot=end the final results screen. No
// preset changes how the game plays.

import { LEVEL_DIFFERENCES } from './levels.js';
import { LEVELS } from './config.js';

export function readShotParams() {
  return new URLSearchParams(window.location.search);
}

function firstFoundIds(scene, count) {
  return LEVEL_DIFFERENCES[scene].slice(0, count).map((diff) => diff.id);
}

// Mutate a fresh state object into the requested shot state. Returns true
// when a preset applied, false when the game should start normally.
export function applyShotPreset(state, params) {
  const shot = params.get('shot');
  if (!shot) return false;

  if (shot === 'start') {
    state.screen = 'menu';
    return true;
  }

  if (shot === 'mid') {
    state.screen = 'playing';
    state.levelIndex = 0;
    const ids = firstFoundIds('garden', 4);
    state.found = new Set(ids);
    state.foundPop = ids.map((id) => ({ id, at: 0 }));
    state.timeLeftMs = 154000;
    state.hintsLeft = 3;
    state.score = 400;
    state.totalFound = 4;
    state.message = 'Found the cottage window — 6 to go!';
    state.messageUntil = Number.POSITIVE_INFINITY;
    return true;
  }

  if (shot === 'level2') {
    state.screen = 'playing';
    state.levelIndex = 1;
    const ids = firstFoundIds('market', 2);
    state.found = new Set(ids);
    state.foundPop = ids.map((id) => ({ id, at: 0 }));
    state.timeLeftMs = 110000;
    state.hintsLeft = 2;
    state.score = 1150;
    state.totalFound = 12;
    state.message = 'Found the moon changed phase — 8 to go!';
    state.messageUntil = Number.POSITIVE_INFINITY;
    return true;
  }

  if (shot === 'level3') {
    state.screen = 'playing';
    state.levelIndex = 2;
    const ids = firstFoundIds('lighthouse', 1);
    state.found = new Set(ids);
    state.foundPop = ids.map((id) => ({ id, at: 0 }));
    state.timeLeftMs = 100000;
    state.hintsLeft = 3;
    state.score = 2200;
    state.totalFound = 21;
    state.message = 'Found the lighthouse beam — 9 to go!';
    state.messageUntil = Number.POSITIVE_INFINITY;
    return true;
  }

  if (shot === 'end') {
    state.screen = 'complete';
    state.levelIndex = 2;
    state.found = new Set(LEVEL_DIFFERENCES.lighthouse.map((d) => d.id));
    state.score = 2850;
    state.totalFound = 30;
    state.wrongClicks = 4;
    state.hintsUsed = 2;
    state.levelStats = LEVELS.map(() => ({ timeLeftMs: 45000, score: 0 }));
    return true;
  }

  return false;
}
