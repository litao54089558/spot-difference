// Spot the Difference — scene 3: "The Lighthouse at Dusk".
// One job: paint the lighthouse picture. Same contract as the other scenes:
// `changed` holds the difference ids to draw in their changed form (empty
// on the left panel, all ten on the right).

export function drawLighthouseScene(ctx, width, height, changed) {
  const changedHas = (id) => changed.has(id);

  drawLighthouseSky(ctx, width, height, changedHas);
  drawLighthouseSea(ctx, width, height, changedHas);
  drawLighthouseBoat(ctx, changedHas);
  drawLighthouseBuoy(ctx, changedHas);
  drawLighthouseTower(ctx, width, height, changedHas);
  drawLighthouseRocks(ctx, width, height, changedHas);
}

function drawLighthouseSky(ctx, width, height, changedHas) {
  const sky = ctx.createLinearGradient(0, 0, 0, 250);
  sky.addColorStop(0, '#1b2a4a');
  sky.addColorStop(0.6, '#6d597a');
  sky.addColorStop(1, '#e07a5f');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, 250);

  drawLighthouseStars(ctx, changedHas);
  drawLighthouseGull(ctx, 120, 90);
  drawLighthouseGull(ctx, 200, 70);
  if (!changedHas('gull-count')) drawLighthouseGull(ctx, 300, 110);
  drawLighthouseGull(ctx, 90, 150);
}

function drawLighthouseStars(ctx, changedHas) {
  ctx.fillStyle = '#ffffff';
  const stars = [
    [40, 40], [90, 70], [140, 30], [240, 60], [300, 30], [360, 55],
    [470, 40], [540, 60], [570, 110], [60, 120], [260, 130], [500, 130],
  ];
  for (const [x, y] of stars) {
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  if (!changedHas('sky-star')) {
    ctx.fillStyle = '#fff8d6';
    ctx.beginPath();
    ctx.arc(180, 50, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,248,214,0.7)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(180, 38);
    ctx.lineTo(180, 62);
    ctx.moveTo(168, 50);
    ctx.lineTo(192, 50);
    ctx.stroke();
  }
}

function drawLighthouseGull(ctx, x, y) {
  ctx.strokeStyle = '#f8f9fa';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 11, y);
  ctx.quadraticCurveTo(x - 4, y - 8, x, y);
  ctx.quadraticCurveTo(x + 4, y - 8, x + 11, y);
  ctx.stroke();
}

function drawLighthouseSea(ctx, width, height, changedHas) {
  const sea = ctx.createLinearGradient(0, 240, 0, 560);
  sea.addColorStop(0, '#22577a');
  sea.addColorStop(1, '#12395b');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 240, width, 320);

  // Sun-glint on the water under the horizon.
  ctx.fillStyle = 'rgba(224,122,95,0.35)';
  ctx.fillRect(340, 240, 140, 8);
  ctx.fillRect(360, 258, 100, 6);

  drawLighthouseWave(ctx, 60, 300, 90);
  drawLighthouseWave(ctx, 300, 320, 70);
  drawLighthouseWave(ctx, 480, 300, 80);
  drawLighthouseWave(ctx, 120, 400, 80);
  drawLighthouseWave(ctx, 420, 420, 90);
  drawLighthouseWave(ctx, 60, 500, 100);
  drawLighthouseWave(ctx, 330, 500, 80);
  if (!changedHas('wave-crest')) drawLighthouseWave(ctx, 200, 450, 70);
  if (!changedHas('jumping-fish')) drawLighthouseFish(ctx, 520, 330);
}

function drawLighthouseWave(ctx, x, y, w) {
  ctx.strokeStyle = 'rgba(144,224,239,0.8)';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x + w / 2, y - 12, x + w, y);
  ctx.stroke();
}

function drawLighthouseFish(ctx, x, y) {
  ctx.fillStyle = '#90e0ef';
  ctx.beginPath();
  ctx.ellipse(x, y, 14, 7, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - 12, y - 4);
  ctx.lineTo(x - 22, y - 12);
  ctx.lineTo(x - 20, y + 2);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#12395b';
  ctx.beginPath();
  ctx.arc(x + 7, y - 3, 1.8, 0, Math.PI * 2);
  ctx.fill();
}

function drawLighthouseBoat(ctx, changedHas) {
  // Hull.
  ctx.fillStyle = '#7f4f24';
  ctx.beginPath();
  ctx.moveTo(110, 310);
  ctx.lineTo(190, 310);
  ctx.lineTo(175, 330);
  ctx.lineTo(125, 330);
  ctx.closePath();
  ctx.fill();
  // Mast and sail.
  ctx.strokeStyle = '#5c3a1e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(150, 310);
  ctx.lineTo(150, 250);
  ctx.stroke();
  ctx.fillStyle = '#fff3e2';
  ctx.beginPath();
  ctx.moveTo(152, 252);
  ctx.lineTo(152, 306);
  ctx.lineTo(186, 306);
  ctx.closePath();
  ctx.fill();
  if (!changedHas('boat-sail')) {
    ctx.fillStyle = '#e63946';
    ctx.beginPath();
    ctx.moveTo(152, 282);
    ctx.lineTo(170, 282);
    ctx.lineTo(170, 292);
    ctx.lineTo(152, 292);
    ctx.closePath();
    ctx.fill();
  }
  // A small flag on the mast.
  ctx.fillStyle = '#2a9d8f';
  ctx.beginPath();
  ctx.moveTo(150, 250);
  ctx.lineTo(168, 254);
  ctx.lineTo(150, 259);
  ctx.closePath();
  ctx.fill();
}

function drawLighthouseBuoy(ctx, changedHas) {
  if (changedHas('sea-buoy')) return;
  ctx.fillStyle = '#e63946';
  ctx.beginPath();
  ctx.moveTo(268, 372);
  ctx.lineTo(292, 372);
  ctx.lineTo(286, 392);
  ctx.lineTo(274, 392);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#fff3e2';
  ctx.fillRect(268, 380, 24, 6);
  ctx.strokeStyle = '#2b2d42';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(280, 372);
  ctx.lineTo(280, 360);
  ctx.stroke();
  ctx.fillStyle = '#ffd93b';
  ctx.beginPath();
  ctx.arc(280, 358, 3.5, 0, Math.PI * 2);
  ctx.fill();
}

function drawLighthouseTower(ctx, width, height, changedHas) {
  // The beam comes first so the tower paints over its near end.
  if (!changedHas('light-beam')) {
    const beam = ctx.createLinearGradient(390, 78, 90, 78);
    beam.addColorStop(0, 'rgba(255, 248, 150, 0.75)');
    beam.addColorStop(1, 'rgba(255, 248, 150, 0.02)');
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(390, 68);
    ctx.lineTo(90, 30);
    ctx.lineTo(90, 126);
    ctx.lineTo(390, 88);
    ctx.closePath();
    ctx.fill();
  }

  // Tower body, slightly tapered.
  ctx.fillStyle = '#f8f9fa';
  ctx.beginPath();
  ctx.moveTo(392, 430);
  ctx.lineTo(402, 110);
  ctx.lineTo(438, 110);
  ctx.lineTo(448, 430);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#e63946';
  ctx.fillRect(396, 200, 48, 26);
  ctx.fillRect(400, 320, 40, 26);
  ctx.strokeStyle = '#adb5bd';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(392, 430);
  ctx.lineTo(402, 110);
  ctx.moveTo(448, 430);
  ctx.lineTo(438, 110);
  ctx.stroke();

  // Windows: the upper one always lit, the lower one can go dark.
  drawLighthouseWindow(ctx, 420, 160, true);
  drawLighthouseWindow(ctx, 420, 280, !changedHas('tower-window'));

  // Light room and roof.
  ctx.fillStyle = '#2b2d42';
  ctx.fillRect(388, 78, 64, 34);
  ctx.fillStyle = '#ffd93b';
  ctx.fillRect(396, 84, 48, 22);
  ctx.fillStyle = '#e63946';
  ctx.beginPath();
  ctx.moveTo(384, 78);
  ctx.lineTo(420, 52);
  ctx.lineTo(456, 78);
  ctx.closePath();
  ctx.fill();

  // Flag on the very top.
  if (!changedHas('tower-flag')) {
    ctx.strokeStyle = '#2b2d42';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(420, 52);
    ctx.lineTo(420, 28);
    ctx.stroke();
    ctx.fillStyle = '#2a9d8f';
    ctx.beginPath();
    ctx.moveTo(420, 28);
    ctx.lineTo(444, 33);
    ctx.lineTo(420, 40);
    ctx.closePath();
    ctx.fill();
  }
}

function drawLighthouseWindow(ctx, x, y, lit) {
  ctx.fillStyle = lit ? '#ffd93b' : '#3d5a80';
  ctx.beginPath();
  ctx.arc(x, y, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#2b2d42';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, 9, 0, Math.PI * 2);
  ctx.stroke();
}

function drawLighthouseRocks(ctx, width, height, changedHas) {
  ctx.fillStyle = '#495057';
  ctx.beginPath();
  ctx.ellipse(420, 445, 90, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#6c757d';
  ctx.beginPath();
  ctx.ellipse(380, 438, 40, 18, 0, 0, Math.PI * 2);
  ctx.ellipse(465, 440, 36, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  if (!changedHas('shore-rock')) {
    ctx.fillStyle = '#495057';
    ctx.beginPath();
    ctx.ellipse(100, 520, 42, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#6c757d';
    ctx.beginPath();
    ctx.ellipse(88, 512, 18, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#495057';
  ctx.beginPath();
  ctx.ellipse(500, 530, 46, 20, 0, 0, Math.PI * 2);
  ctx.fill();
}
