// Spot the Difference — everything the player sees.
// One job: paint one frame. It owns the layout (where the panels, the top
// bar, the buttons and the screens sit), the found markers, the hint pulse,
// the miss marks, and the menu / level-clear / game-over / complete screens.
// It never owns game logic: main.js tells it what to draw through `state`.

import {
  VIEW_WIDTH,
  VIEW_HEIGHT,
  TOP_BAR_HEIGHT,
  BOTTOM_BAR_HEIGHT,
  PANEL_WIDTH,
  PANEL_HEIGHT,
  PANEL_TOP,
  PANEL_X_LEFT,
  PANEL_X_RIGHT,
  DIFFERENCES_PER_LEVEL,
  LEVELS,
  MARKER_RADIUS,
} from './config.js';
import { LEVEL_DIFFERENCES } from './levels.js';
import { drawGardenScene } from './scene-garden.js';
import { drawMarketScene } from './scene-market.js';
import { drawLighthouseScene } from './scene-lighthouse.js';

const SCENE_DRAWERS = {
  garden: drawGardenScene,
  market: drawMarketScene,
  lighthouse: drawLighthouseScene,
};

const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

// Fit the 1280x720 view into the canvas, letterboxed, and set the backing
// store. Returns the transform input.js needs to map clicks back.
export function fitCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(1, Math.round(rect.width * dpr));
  canvas.height = Math.max(1, Math.round(rect.height * dpr));
  const scale = Math.min(canvas.width / VIEW_WIDTH, canvas.height / VIEW_HEIGHT);
  return {
    scale: scale / dpr,
    cssScale: scale,
    offsetX: (canvas.width - VIEW_WIDTH * scale) / 2 / dpr,
    offsetY: (canvas.height - VIEW_HEIGHT * scale) / 2 / dpr,
    dpr,
  };
}

// Map a client (mouse) point to view coordinates, or null outside the view.
export function clientToView(clientX, clientY, canvas, transform) {
  const rect = canvas.getBoundingClientRect();
  const x = (clientX - rect.left - transform.offsetX) / transform.scale;
  const y = (clientY - rect.top - transform.offsetY) / transform.scale;
  if (x < 0 || y < 0 || x > VIEW_WIDTH || y > VIEW_HEIGHT) return null;
  return { x, y };
}

// Which panel a view point falls in, and where in scene coordinates.
export function panelAt(viewX, viewY) {
  if (viewY < PANEL_TOP || viewY > PANEL_TOP + PANEL_HEIGHT) return null;
  if (viewX >= PANEL_X_LEFT && viewX <= PANEL_X_LEFT + PANEL_WIDTH) {
    return { panel: 'left', x: viewX - PANEL_X_LEFT, y: viewY - PANEL_TOP };
  }
  if (viewX >= PANEL_X_RIGHT && viewX <= PANEL_X_RIGHT + PANEL_WIDTH) {
    return { panel: 'right', x: viewX - PANEL_X_RIGHT, y: viewY - PANEL_TOP };
  }
  return null;
}

// The clickable buttons for the current screen, in view coordinates.
// input.js hit-tests against exactly these rects.
export function getButtonRects(state) {
  const rects = {};
  if (state.screen === 'playing') {
    rects.hint = { x: 1010, y: 12, w: 118, h: 40 };
    rects.mute = { x: 1140, y: 12, w: 64, h: 40 };
  }
  if (state.screen === 'menu') {
    rects.start = { x: 540, y: 470, w: 200, h: 56 };
  }
  if (state.screen === 'levelClear') {
    rects.next = { x: 540, y: 480, w: 200, h: 56 };
  }
  if (state.screen === 'gameOver') {
    rects.retry = { x: 470, y: 470, w: 200, h: 56 };
    rects.menu = { x: 700, y: 470, w: 140, h: 56 };
  }
  if (state.screen === 'complete') {
    rects.again = { x: 470, y: 500, w: 200, h: 56 };
    rects.menu = { x: 700, y: 500, w: 140, h: 56 };
  }
  return rects;
}

export function drawGame(ctx, state, now, transform) {
  ctx.setTransform(transform.dpr, 0, 0, transform.dpr, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.setTransform(
    transform.cssScale,
    0,
    0,
    transform.cssScale,
    transform.offsetX * transform.dpr,
    transform.offsetY * transform.dpr,
  );

  ctx.fillStyle = '#f7ede2';
  ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);

  if (state.screen === 'menu') {
    drawMenuBackdrop(ctx, now);
    drawTopBar(ctx, state, now);
    drawMenuCard(ctx, state);
    return;
  }

  drawPanels(ctx, state, now);
  drawTopBar(ctx, state, now);
  drawBottomBar(ctx, state, now);

  if (state.screen === 'levelClear') drawLevelClearCard(ctx, state);
  if (state.screen === 'gameOver') drawGameOverCard(ctx, state);
  if (state.screen === 'complete') drawCompleteCard(ctx, state);
}

function drawPanels(ctx, state, now) {
  const level = LEVELS[state.levelIndex];
  const drawer = SCENE_DRAWERS[level.scene];
  const diffs = LEVEL_DIFFERENCES[level.scene];
  const changed = new Set(diffs.map((d) => d.id));

  drawPanelFrame(ctx, PANEL_X_LEFT, 'Original');
  drawPanelFrame(ctx, PANEL_X_RIGHT, 'Changed');

  drawSceneIntoPanel(ctx, drawer, PANEL_X_LEFT, new Set());
  drawSceneIntoPanel(ctx, drawer, PANEL_X_RIGHT, changed);

  for (const diff of diffs) {
    if (!state.found.has(diff.id)) continue;
    const pop = state.foundPop.find((p) => p.id === diff.id);
    const age = pop ? now - pop.at : 9999;
    const scale = age < 300 ? 1.5 - (age / 300) * 0.5 : 1;
    drawFoundMarker(ctx, PANEL_X_LEFT + diff.x, PANEL_TOP + diff.y, scale);
    drawFoundMarker(ctx, PANEL_X_RIGHT + diff.x, PANEL_TOP + diff.y, scale);
  }

  if (state.hintFlash && now < state.hintFlash.until) {
    const diff = diffs.find((d) => d.id === state.hintFlash.diffId);
    if (diff) {
      const pulse = 1 + 0.18 * Math.sin(now / 130);
      drawHintRing(ctx, PANEL_X_LEFT + diff.x, PANEL_TOP + diff.y, pulse);
      drawHintRing(ctx, PANEL_X_RIGHT + diff.x, PANEL_TOP + diff.y, pulse);
    }
  }

  for (const miss of state.missMarks) {
    if (now > miss.until) continue;
    const alpha = 1 - (now - (miss.until - 900)) / 900;
    const baseX = miss.panel === 'left' ? PANEL_X_LEFT : PANEL_X_RIGHT;
    drawMissMark(ctx, baseX + miss.x, PANEL_TOP + miss.y, Math.max(0, alpha));
  }
}

function drawPanelFrame(ctx, x, label) {
  ctx.fillStyle = '#2b2d42';
  ctx.font = `700 17px ${FONT}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(label, x, PANEL_TOP - 8);
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#2b2d42';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(x - 4, PANEL_TOP - 4, PANEL_WIDTH + 8, PANEL_HEIGHT + 8, 10);
  ctx.fill();
  ctx.stroke();
}

function drawSceneIntoPanel(ctx, drawer, panelX, changed) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(panelX, PANEL_TOP, PANEL_WIDTH, PANEL_HEIGHT);
  ctx.clip();
  ctx.translate(panelX, PANEL_TOP);
  drawer(ctx, PANEL_WIDTH, PANEL_HEIGHT, changed);
  ctx.restore();
}

function drawFoundMarker(ctx, x, y, scale) {
  const r = MARKER_RADIUS * scale;
  ctx.strokeStyle = '#2a9d8f';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(42,157,143,0.35)';
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.arc(x, y, r + 5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#2a9d8f';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 11, y);
  ctx.lineTo(x - 3, y + 9);
  ctx.lineTo(x + 12, y - 9);
  ctx.stroke();
}

function drawHintRing(ctx, x, y, scale) {
  const r = (MARKER_RADIUS + 8) * scale;
  ctx.strokeStyle = '#ffb703';
  ctx.lineWidth = 4;
  ctx.setLineDash([10, 7]);
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawMissMark(ctx, x, y, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = '#e63946';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 12, y - 12);
  ctx.lineTo(x + 12, y + 12);
  ctx.moveTo(x + 12, y - 12);
  ctx.lineTo(x - 12, y + 12);
  ctx.stroke();
  ctx.restore();
}

function drawTopBar(ctx, state, now) {
  ctx.fillStyle = '#2b2d42';
  ctx.fillRect(0, 0, VIEW_WIDTH, TOP_BAR_HEIGHT);

  ctx.fillStyle = '#ffffff';
  ctx.font = `800 24px ${FONT}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('Spot the Difference', 24, TOP_BAR_HEIGHT / 2 - 2);

  if (state.screen === 'menu') return;

  const level = LEVELS[state.levelIndex];
  ctx.fillStyle = '#ffd93b';
  ctx.font = `700 16px ${FONT}`;
  ctx.fillText(`Level ${state.levelIndex + 1} of 3 · ${level.name}`, 330, TOP_BAR_HEIGHT / 2);

  // Timer: big, and red under thirty seconds.
  const secondsLeft = Math.max(0, Math.ceil(state.timeLeftMs / 1000));
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeText = `${minutes}:${String(seconds).padStart(2, '0')}`;
  const urgent = secondsLeft <= 30 && state.screen === 'playing';
  ctx.fillStyle = urgent ? '#ff6b6b' : '#ffffff';
  ctx.font = `800 30px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.fillText(timeText, 660, TOP_BAR_HEIGHT / 2);
  ctx.textAlign = 'left';

  // Time bar under the timer.
  const total = level.timeLimitSeconds * 1000;
  const frac = Math.max(0, state.timeLeftMs / total);
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillRect(600, TOP_BAR_HEIGHT - 10, 120, 5);
  ctx.fillStyle = urgent ? '#ff6b6b' : '#2a9d8f';
  ctx.fillRect(600, TOP_BAR_HEIGHT - 10, 120 * frac, 5);

  // Found counter.
  ctx.fillStyle = '#ffffff';
  ctx.font = `800 22px ${FONT}`;
  ctx.textAlign = 'right';
  ctx.fillText(`Found ${state.found.size} / ${DIFFERENCES_PER_LEVEL}`, 990, TOP_BAR_HEIGHT / 2);
  ctx.textAlign = 'left';

  // Hint and mute buttons.
  drawButton(ctx, getButtonRects(state).hint, `Hint (${state.hintsLeft})`, '#ffb703', '#2b2d42');
  drawButton(ctx, getButtonRects(state).mute, state.muted ? 'Muted' : 'Sound', '#8d99ae', '#ffffff');
}

function drawButton(ctx, rect, label, bg, fg) {
  if (!rect) return;
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y, rect.w, rect.h, 8);
  ctx.fill();
  ctx.fillStyle = fg;
  ctx.font = `700 16px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, rect.x + rect.w / 2, rect.y + rect.h / 2 + 1);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
}

function drawBottomBar(ctx, state, now) {
  const y = VIEW_HEIGHT - BOTTOM_BAR_HEIGHT;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, y, VIEW_WIDTH, BOTTOM_BAR_HEIGHT);
  ctx.strokeStyle = '#e0d6c3';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(VIEW_WIDTH, y);
  ctx.stroke();

  // Progress dots: one per difference, filled when found.
  const level = LEVELS[state.levelIndex];
  const diffs = LEVEL_DIFFERENCES[level.scene];
  for (let i = 0; i < diffs.length; i++) {
    const cx = 40 + i * 30;
    const cy = y + BOTTOM_BAR_HEIGHT / 2;
    ctx.fillStyle = state.found.has(diffs[i].id) ? '#2a9d8f' : '#d9d2c2';
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Message line.
  ctx.fillStyle = '#2b2d42';
  ctx.font = `600 17px ${FONT}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  const message = now < state.messageUntil ? state.message : 'Click a difference — on either picture.';
  ctx.fillText(message, 360, y + BOTTOM_BAR_HEIGHT / 2);
  ctx.textBaseline = 'alphabetic';

  // Score, right aligned.
  ctx.fillStyle = '#2b2d42';
  ctx.font = `800 20px ${FONT}`;
  ctx.textAlign = 'right';
  ctx.fillText(`Score ${state.score}`, VIEW_WIDTH - 24, y + BOTTOM_BAR_HEIGHT / 2 + 1);
  ctx.textAlign = 'left';
}

function drawMenuBackdrop(ctx, now) {
  const drawer = SCENE_DRAWERS.garden;
  ctx.save();
  ctx.globalAlpha = 0.35;
  drawSceneIntoPanel(ctx, drawer, PANEL_X_LEFT, new Set());
  drawSceneIntoPanel(ctx, drawer, PANEL_X_RIGHT, new Set(LEVEL_DIFFERENCES.garden.map((d) => d.id)));
  ctx.restore();
}

function drawMenuCard(ctx, state) {
  drawOverlay(ctx);
  const card = { x: 340, y: 120, w: 600, h: 480 };
  drawCard(ctx, card);
  ctx.fillStyle = '#2b2d42';
  ctx.textAlign = 'center';
  ctx.font = `800 44px ${FONT}`;
  ctx.fillText('Spot the Difference', 640, 195);
  ctx.font = `600 19px ${FONT}`;
  ctx.fillStyle = '#5c5c6e';
  ctx.fillText('Two pictures. Ten changes. One sharp eye.', 640, 232);

  ctx.textAlign = 'left';
  ctx.font = `600 18px ${FONT}`;
  ctx.fillStyle = '#2b2d42';
  const lines = [
    '•  Click a difference on either picture to circle it.',
    '•  A wrong click costs 5 seconds — and 25 points.',
    '•  Stuck? Hint circles one you missed (3 per level).',
    '•  Beat the clock through 3 scenes of rising difficulty:',
    '    garden, market, then the lighthouse at dusk.',
  ];
  lines.forEach((line, i) => ctx.fillText(line, 390, 285 + i * 32));

  drawButton(ctx, getButtonRects(state).start, 'Start hunting', '#2a9d8f', '#ffffff');
  ctx.fillStyle = '#8d99ae';
  ctx.font = `600 14px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.fillText('Tip: differences hide in plain sight — compare edges, counts and colours.', 640, 560);
  ctx.textAlign = 'left';
}

function drawLevelClearCard(ctx, state) {
  drawOverlay(ctx);
  const card = { x: 390, y: 150, w: 500, h: 380 };
  drawCard(ctx, card);
  const level = LEVELS[state.levelIndex];
  const stats = state.levelStats[state.levelIndex] || { timeLeftMs: 0, score: 0 };
  const bonus = Math.floor(stats.timeLeftMs / 1000) * 5;
  ctx.fillStyle = '#2a9d8f';
  ctx.textAlign = 'center';
  ctx.font = `800 38px ${FONT}`;
  ctx.fillText('Level complete!', 640, 225);
  ctx.fillStyle = '#2b2d42';
  ctx.font = `600 20px ${FONT}`;
  ctx.fillText(`${level.name} — all 10 differences found`, 640, 268);
  ctx.fillText(`Time bonus: +${bonus} points`, 640, 312);
  ctx.fillText(`Score so far: ${state.score}`, 640, 348);
  drawButton(ctx, getButtonRects(state).next, state.levelIndex + 1 < LEVELS.length ? 'Next level' : 'See results', '#2a9d8f', '#ffffff');
  ctx.textAlign = 'left';
}

function drawGameOverCard(ctx, state) {
  drawOverlay(ctx);
  const card = { x: 390, y: 150, w: 500, h: 380 };
  drawCard(ctx, card);
  const level = LEVELS[state.levelIndex];
  ctx.fillStyle = '#e63946';
  ctx.textAlign = 'center';
  ctx.font = `800 38px ${FONT}`;
  ctx.fillText("Time's up!", 640, 225);
  ctx.fillStyle = '#2b2d42';
  ctx.font = `600 20px ${FONT}`;
  ctx.fillText(`${level.name} — you found ${state.found.size} of 10 differences`, 640, 268);
  ctx.fillText(`${DIFFERENCES_PER_LEVEL - state.found.size} were still hiding.`, 640, 312);
  ctx.fillText('Try this level again — the clock restarts.', 640, 348);
  drawButton(ctx, getButtonRects(state).retry, 'Retry level', '#e63946', '#ffffff');
  drawButton(ctx, getButtonRects(state).menu, 'Menu', '#8d99ae', '#ffffff');
  ctx.textAlign = 'left';
}

function drawCompleteCard(ctx, state) {
  drawOverlay(ctx);
  const card = { x: 360, y: 110, w: 560, h: 470 };
  drawCard(ctx, card);
  ctx.fillStyle = '#2a9d8f';
  ctx.textAlign = 'center';
  ctx.font = `800 38px ${FONT}`;
  ctx.fillText('You found them all!', 640, 185);
  ctx.fillStyle = '#2b2d42';
  ctx.font = `600 20px ${FONT}`;
  const totalClicks = state.totalFound + state.wrongClicks;
  const accuracy = totalClicks === 0 ? 100 : Math.round((state.totalFound / totalClicks) * 100);
  ctx.fillText(`30 differences across 3 scenes`, 640, 232);
  ctx.fillText(`Final score: ${state.score}`, 640, 268);
  ctx.fillText(`Accuracy: ${accuracy}% (${state.totalFound} finds, ${state.wrongClicks} misses)`, 640, 304);
  ctx.fillText(`Hints used: ${state.hintsUsed} of 9`, 640, 340);
  const verdict =
    accuracy >= 90 ? 'Eagle eye — barely a wrong click!' :
    accuracy >= 70 ? 'Sharp eyes — a fine hunt.' :
    'A good hunt — the garden will test you again.';
  ctx.fillStyle = '#5c5c6e';
  ctx.font = `600 18px ${FONT}`;
  ctx.fillText(verdict, 640, 386);
  drawButton(ctx, getButtonRects(state).again, 'Play again', '#2a9d8f', '#ffffff');
  drawButton(ctx, getButtonRects(state).menu, 'Menu', '#8d99ae', '#ffffff');
  ctx.textAlign = 'left';
}

function drawOverlay(ctx) {
  ctx.fillStyle = 'rgba(43,45,66,0.45)';
  ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
}

function drawCard(ctx, card) {
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#2b2d42';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(card.x, card.y, card.w, card.h, 16);
  ctx.fill();
  ctx.stroke();
}
