// Spot the Difference — pointer input.
// One job: turn a mouse click into a game action. It maps the click to view
// coordinates, checks the buttons first, then the two picture panels, and
// hands main.js one of: a button press, a found difference, or a miss.
// It never changes game state itself.

import { clientToView, panelAt, getButtonRects } from './render.js';
import { findDifferenceAt } from './levels.js';
import { LEVELS } from './config.js';

function pointInRect(x, y, rect) {
  return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}

// Resolve one click. Returns one of:
//   { kind: 'button', id } — a HUD or screen button
//   { kind: 'found', diff } — an unfound difference, on either panel
//   { kind: 'foundAgain', diff } — a difference already circled
//   { kind: 'miss', panel, x, y } — a click on a panel that hit nothing
//   { kind: 'none' } — a click on empty chrome (the gap, the bars)
export function resolveClick(state, clientX, clientY, canvas, transform) {
  const view = clientToView(clientX, clientY, canvas, transform);
  if (!view) return { kind: 'none' };

  const rects = getButtonRects(state);
  for (const [id, rect] of Object.entries(rects)) {
    if (rect && pointInRect(view.x, view.y, rect)) return { kind: 'button', id };
  }

  if (state.screen !== 'playing') return { kind: 'none' };

  const panel = panelAt(view.x, view.y);
  if (!panel) return { kind: 'none' };

  const scene = LEVELS[state.levelIndex].scene;
  const diff = findDifferenceAt(scene, panel.x, panel.y);
  if (!diff) return { kind: 'miss', panel: panel.panel, x: panel.x, y: panel.y };
  if (state.found.has(diff.id)) return { kind: 'foundAgain', diff };
  return { kind: 'found', diff };
}
