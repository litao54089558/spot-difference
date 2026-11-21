// Spot the Difference — the game itself.
// One job: own the state machine (menu, playing, level clear, game over,
// complete), the clock, and the meaning of a click. It asks input.js what
// a click was, render.js to paint the frame, and audio.js to make the
// sounds. Nothing in here draws a scene or a button.

import {
  LEVELS,
  DIFFERENCES_PER_LEVEL,
  HINTS_PER_LEVEL,
  HINT_FLASH_MS,
  WRONG_CLICK_TIME_PENALTY_S,
  WRONG_CLICK_SCORE_PENALTY,
  FIND_SCORE,
  TIME_BONUS_PER_SECOND,
  MISS_MARK_MS,
} from './config.js';
import { LEVEL_DIFFERENCES } from './levels.js';
import { drawGame, fitCanvas } from './render.js';
import { resolveClick } from './input.js';
import {
  playFindSound,
  playMissSound,
  playHintSound,
  playLevelClearSound,
  playGameOverSound,
} from './audio.js';
import { readShotParams, applyShotPreset } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
let transform = fitCanvas(canvas);

function freshState() {
  return {
    screen: 'menu',
    levelIndex: 0,
    found: new Set(),
    foundPop: [],
    hintsLeft: HINTS_PER_LEVEL,
    hintsUsed: 0,
    timeLeftMs: LEVELS[0].timeLimitSeconds * 1000,
    score: 0,
    totalFound: 0,
    wrongClicks: 0,
    message: 'Click a difference — on either picture.',
    messageUntil: 0,
    hintFlash: null,
    missMarks: [],
    muted: false,
    levelStats: [],
  };
}

const state = freshState();
let lastTickMs = performance.now();

function startGame() {
  state.score = 0;
  state.totalFound = 0;
  state.wrongClicks = 0;
  state.hintsUsed = 0;
  state.levelStats = [];
  startLevel(0);
}

function startLevel(index) {
  const level = LEVELS[index];
  state.levelIndex = index;
  state.screen = 'playing';
  state.found = new Set();
  state.foundPop = [];
  state.hintsLeft = HINTS_PER_LEVEL;
  state.hintFlash = null;
  state.missMarks = [];
  state.timeLeftMs = level.timeLimitSeconds * 1000;
  state.message = `Level ${index + 1}: ${level.name} — find ${DIFFERENCES_PER_LEVEL} differences!`;
  state.messageUntil = performance.now() + 4000;
}

function goToMenu() {
  const muted = state.muted;
  Object.assign(state, freshState());
  state.muted = muted;
}

function onDifferenceFound(diff, now) {
  state.found.add(diff.id);
  state.foundPop.push({ id: diff.id, at: now });
  state.score += FIND_SCORE;
  state.totalFound += 1;
  const remaining = DIFFERENCES_PER_LEVEL - state.found.size;
  state.message =
    remaining === 0
      ? `Found ${diff.label} — that's all ten!`
      : `Found ${diff.label} — ${remaining} to go!`;
  state.messageUntil = now + 3500;
  playFindSound(state.muted);
  if (state.found.size === DIFFERENCES_PER_LEVEL) clearLevel(now);
}

function clearLevel(now) {
  const bonusSeconds = Math.floor(state.timeLeftMs / 1000);
  const bonus = bonusSeconds * TIME_BONUS_PER_SECOND;
  state.score += bonus;
  state.levelStats[state.levelIndex] = { timeLeftMs: state.timeLeftMs, score: state.score };
  state.screen = 'levelClear';
  playLevelClearSound(state.muted);
}

function onMiss(click, now) {
  state.timeLeftMs -= WRONG_CLICK_TIME_PENALTY_S * 1000;
  state.wrongClicks += 1;
  state.score = Math.max(0, state.score - WRONG_CLICK_SCORE_PENALTY);
  state.missMarks.push({ panel: click.panel, x: click.x, y: click.y, until: now + MISS_MARK_MS });
  state.message = `Not quite — ${WRONG_CLICK_TIME_PENALTY_S} seconds lost.`;
  state.messageUntil = now + 2500;
  playMissSound(state.muted);
  if (state.timeLeftMs <= 0) endByTimeout();
}

function endByTimeout() {
  state.timeLeftMs = 0;
  state.screen = 'gameOver';
  playGameOverSound(state.muted);
}

function useHint(now) {
  if (state.screen !== 'playing') return;
  if (state.hintsLeft <= 0) {
    state.message = 'No hints left on this level.';
    state.messageUntil = now + 2500;
    return;
  }
  const level = LEVELS[state.levelIndex];
  const remaining = LEVEL_DIFFERENCES[level.scene].filter((d) => !state.found.has(d.id));
  if (remaining.length === 0) return;
  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  state.hintsLeft -= 1;
  state.hintsUsed += 1;
  state.hintFlash = { diffId: pick.id, until: now + HINT_FLASH_MS };
  state.message = `Hint: look near "${pick.label}".`;
  state.messageUntil = now + HINT_FLASH_MS;
  playHintSound(state.muted);
}

function onButton(id, now) {
  if (id === 'start' || id === 'again') startGame();
  if (id === 'menu') goToMenu();
  if (id === 'hint') useHint(now);
  if (id === 'mute') state.muted = !state.muted;
  if (id === 'retry') startLevel(state.levelIndex);
  if (id === 'next') {
    if (state.levelIndex + 1 < LEVELS.length) startLevel(state.levelIndex + 1);
    else state.screen = 'complete';
  }
}

function onCanvasClick(event) {
  const now = performance.now();
  const result = resolveClick(state, event.clientX, event.clientY, canvas, transform);
  if (result.kind === 'button') onButton(result.id, now);
  else if (result.kind === 'found') onDifferenceFound(result.diff, now);
  else if (result.kind === 'foundAgain') {
    state.message = 'Already circled — find another one.';
    state.messageUntil = now + 2000;
  } else if (result.kind === 'miss') onMiss(result, now);
}

function onKeyDown(event) {
  const now = performance.now();
  if (event.key === 'h' || event.key === 'H') useHint(now);
  if (event.key === 'm' || event.key === 'M') state.muted = !state.muted;
  if ((event.key === 'Enter' || event.key === ' ') && state.screen === 'menu') {
    event.preventDefault();
    startGame();
  }
}

function tick(now) {
  const elapsedMs = now - lastTickMs;
  lastTickMs = now;
  if (state.screen === 'playing') {
    state.timeLeftMs -= elapsedMs;
    if (state.timeLeftMs <= 0) endByTimeout();
  }
  state.missMarks = state.missMarks.filter((mark) => now < mark.until);
  drawGame(ctx, state, now, transform);
  requestAnimationFrame(tick);
}

function boot() {
  window.addEventListener('resize', () => {
    transform = fitCanvas(canvas);
  });
  canvas.addEventListener('click', onCanvasClick);
  window.addEventListener('keydown', onKeyDown);
  applyShotPreset(state, readShotParams());
  // The shot preset may leave a stale clock behind; restart it from now.
  lastTickMs = performance.now();
  requestAnimationFrame(tick);
}

boot();
