// Spot the Difference — scene 1: "Morning in the Garden".
// One job: paint the cottage-garden picture. It draws the same scene twice,
// once per panel; `changed` is the set of difference ids to draw in their
// changed form (empty for the left panel, all ten for the right one), so the
// two pictures differ only where the level says they should.

export function drawGardenScene(ctx, width, height, changed) {
  const changedHas = (id) => changed.has(id);

  drawGardenSky(ctx, width, height, changedHas);
  drawGardenHills(ctx, width, height);
  drawGardenPond(ctx, width, height, changedHas);
  drawGardenTree(ctx, width, height, changedHas);
  drawGardenCottage(ctx, width, height, changedHas);
  drawGardenFence(ctx, width, height, changedHas);
  drawGardenFlowers(ctx, width, height, changedHas);
  drawGardenPath(ctx, width, height);
}

function drawGardenSky(ctx, width, height, changedHas) {
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#7ec8f2');
  sky.addColorStop(1, '#d8f0fd');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, 300);

  drawGardenSun(ctx, changedHas);
  drawGardenCloud(ctx, 220, 60, 46);
  drawGardenCloud(ctx, 420, 92, 36);
  drawGardenCloud(ctx, 520, 48, 28);
  drawGardenBird(ctx, 150, 120);
  drawGardenBird(ctx, 250, 90);
  if (!changedHas('sky-bird')) drawGardenBird(ctx, 350, 130);
  if (!changedHas('butterfly')) drawGardenButterfly(ctx, 480, 180);
}

function drawGardenSun(ctx, changedHas) {
  ctx.fillStyle = '#ffd93b';
  ctx.beginPath();
  ctx.arc(90, 70, 34, 0, Math.PI * 2);
  ctx.fill();
  if (!changedHas('sun-rays')) {
    ctx.strokeStyle = '#ffb703';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      const x1 = 90 + Math.cos(a) * 42;
      const y1 = 70 + Math.sin(a) * 42;
      const x2 = 90 + Math.cos(a) * 56;
      const y2 = 70 + Math.sin(a) * 56;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }
}

function drawGardenCloud(ctx, x, y, r) {
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.arc(x + r * 0.9, y + 6, r * 0.7, 0, Math.PI * 2);
  ctx.arc(x - r * 0.9, y + 8, r * 0.65, 0, Math.PI * 2);
  ctx.fill();
}

function drawGardenBird(ctx, x, y) {
  ctx.strokeStyle = '#3d5a80';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 12, y);
  ctx.quadraticCurveTo(x - 5, y - 9, x, y);
  ctx.quadraticCurveTo(x + 5, y - 9, x + 12, y);
  ctx.stroke();
}

function drawGardenButterfly(ctx, x, y) {
  ctx.fillStyle = '#ff6b9d';
  ctx.beginPath();
  ctx.ellipse(x - 9, y - 6, 9, 12, -0.5, 0, Math.PI * 2);
  ctx.ellipse(x + 9, y - 6, 9, 12, 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#9d4edd';
  ctx.beginPath();
  ctx.ellipse(x - 8, y + 8, 7, 9, 0.5, 0, Math.PI * 2);
  ctx.ellipse(x + 8, y + 8, 7, 9, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#3d348b';
  ctx.fillRect(x - 2, y - 10, 4, 22);
}

function drawGardenHills(ctx, width, height) {
  ctx.fillStyle = '#8ac926';
  ctx.beginPath();
  ctx.moveTo(0, 300);
  ctx.quadraticCurveTo(150, 250, 320, 305);
  ctx.quadraticCurveTo(470, 350, 604, 290);
  ctx.lineTo(604, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#6a994e';
  ctx.beginPath();
  ctx.moveTo(0, 330);
  ctx.quadraticCurveTo(200, 290, 420, 335);
  ctx.quadraticCurveTo(520, 355, 604, 330);
  ctx.lineTo(604, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();
}

function drawGardenPond(ctx, width, height, changedHas) {
  ctx.fillStyle = '#4cc9f0';
  ctx.beginPath();
  ctx.ellipse(480, 500, 92, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#90e0ef';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(480, 500, 70, 20, 0, 0.2, Math.PI - 0.4);
  ctx.stroke();
  if (!changedHas('pond-duck')) drawGardenDuck(ctx, 470, 495);
}

function drawGardenDuck(ctx, x, y) {
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(x, y, 16, 11, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 12, y - 9, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fb8500';
  ctx.beginPath();
  ctx.moveTo(x + 18, y - 10);
  ctx.lineTo(x + 26, y - 7);
  ctx.lineTo(x + 18, y - 5);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#22223b';
  ctx.beginPath();
  ctx.arc(x + 14, y - 11, 1.8, 0, Math.PI * 2);
  ctx.fill();
}

function drawGardenTree(ctx, width, height, changedHas) {
  ctx.fillStyle = '#7f4f24';
  ctx.fillRect(72, 320, 26, 140);
  ctx.fillStyle = '#588157';
  ctx.beginPath();
  ctx.arc(95, 255, 78, 0, Math.PI * 2);
  ctx.arc(45, 290, 48, 0, Math.PI * 2);
  ctx.arc(150, 290, 50, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#3a7d44';
  ctx.beginPath();
  ctx.arc(70, 230, 40, 0, Math.PI * 2);
  ctx.arc(130, 225, 42, 0, Math.PI * 2);
  ctx.fill();
  drawGardenApple(ctx, 60, 250);
  drawGardenApple(ctx, 110, 230);
  drawGardenApple(ctx, 75, 300);
  drawGardenApple(ctx, 120, 300);
  if (!changedHas('tree-apple')) drawGardenApple(ctx, 140, 280);
}

function drawGardenApple(ctx, x, y) {
  ctx.fillStyle = '#ef476f';
  ctx.beginPath();
  ctx.arc(x, y, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#6a994e';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y - 9);
  ctx.lineTo(x + 3, y - 14);
  ctx.stroke();
}

function drawGardenCottage(ctx, width, height, changedHas) {
  // Chimney and its smoke, behind the roof line.
  ctx.fillStyle = '#9c6644';
  ctx.fillRect(358, 252, 26, 62);
  ctx.fillStyle = '#7f4f24';
  ctx.fillRect(354, 246, 34, 10);
  if (!changedHas('chimney-smoke')) {
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.beginPath();
    ctx.arc(372, 232, 10, 0, Math.PI * 2);
    ctx.arc(380, 218, 13, 0, Math.PI * 2);
    ctx.arc(372, 202, 9, 0, Math.PI * 2);
    ctx.fill();
  }

  // Walls.
  ctx.fillStyle = '#fff3e2';
  ctx.fillRect(200, 300, 200, 160);
  ctx.strokeStyle = '#e0a458';
  ctx.lineWidth = 3;
  ctx.strokeRect(200, 300, 200, 160);

  // Roof.
  ctx.fillStyle = '#e07a5f';
  ctx.beginPath();
  ctx.moveTo(180, 302);
  ctx.lineTo(300, 228);
  ctx.lineTo(420, 302);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#c25e42';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(180, 302);
  ctx.lineTo(300, 228);
  ctx.lineTo(420, 302);
  ctx.stroke();

  // Windows: the left one has curtains that can close.
  drawGardenWindow(ctx, 228, 330, changedHas('window-curtains'));
  drawGardenWindow(ctx, 344, 330, false);

  // Door, with a round window that can vanish.
  ctx.fillStyle = '#7f4f24';
  ctx.fillRect(283, 378, 44, 82);
  ctx.fillStyle = '#5c3a1e';
  ctx.beginPath();
  ctx.arc(305, 405, 10, 0, Math.PI * 2);
  ctx.fill();
  if (!changedHas('door-window')) {
    ctx.fillStyle = '#ffd93b';
    ctx.beginPath();
    ctx.arc(305, 405, 7, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#ffd93b';
  ctx.beginPath();
  ctx.arc(318, 425, 4, 0, Math.PI * 2);
  ctx.fill();
}

function drawGardenWindow(ctx, x, y, curtainsClosed) {
  ctx.fillStyle = '#8ecae6';
  ctx.fillRect(x, y, 44, 44);
  ctx.strokeStyle = '#7f4f24';
  ctx.lineWidth = 3;
  ctx.strokeRect(x, y, 44, 44);
  ctx.beginPath();
  ctx.moveTo(x + 22, y);
  ctx.lineTo(x + 22, y + 44);
  ctx.moveTo(x, y + 22);
  ctx.lineTo(x + 44, y + 22);
  ctx.stroke();
  if (curtainsClosed) {
    ctx.fillStyle = '#e07a5f';
    ctx.fillRect(x + 3, y + 3, 16, 38);
    ctx.fillRect(x + 25, y + 3, 16, 38);
  }
}

function drawGardenFence(ctx, width, height, changedHas) {
  ctx.fillStyle = '#b08968';
  const posts = [20, 80, 140, 440, 500, 560];
  for (const x of posts) {
    if (changedHas('fence-slat') && x === 440) continue;
    ctx.fillRect(x, 470, 12, 34);
  }
  ctx.fillRect(10, 478, 584, 6);
  ctx.fillRect(10, 494, 584, 6);
}

function drawGardenFlowers(ctx, width, height, changedHas) {
  const flowers = [
    { x: 30, y: 520, color: '#ef476f' },
    { x: 90, y: 535, color: '#ffd93b' },
    { x: 160, y: 518, color: '#9d4edd' },
    { x: 230, y: 540, color: '#ef476f' },
    { x: 380, y: 522, color: '#ffd93b' },
    { x: 440, y: 538, color: '#9d4edd' },
    { x: 520, y: 520, color: changedHas('flower-color') ? '#ffd93b' : '#ef476f' },
    { x: 575, y: 535, color: '#ffd93b' },
  ];
  for (const f of flowers) {
    ctx.strokeStyle = '#588157';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(f.x, f.y + 8);
    ctx.lineTo(f.x, f.y + 22);
    ctx.stroke();
    ctx.fillStyle = f.color;
    for (let i = 0; i < 5; i++) {
      const a = (i * Math.PI * 2) / 5;
      ctx.beginPath();
      ctx.arc(f.x + Math.cos(a) * 7, f.y + Math.sin(a) * 7, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#fff3b0';
    ctx.beginPath();
    ctx.arc(f.x, f.y, 5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawGardenPath(ctx, width, height) {
  ctx.fillStyle = '#e9c46a';
  ctx.beginPath();
  ctx.moveTo(283, 460);
  ctx.lineTo(327, 460);
  ctx.lineTo(350, 560);
  ctx.lineTo(260, 560);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#d4a24e';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(300, 480);
  ctx.lineTo(300, 545);
  ctx.stroke();
}
