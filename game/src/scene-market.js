// Spot the Difference — scene 2: "Lantern Night Market".
// One job: paint the night-market picture. Like every scene, it draws the
// same picture twice; `changed` holds the difference ids to draw in their
// changed form (empty on the left panel, all ten on the right).

export function drawMarketScene(ctx, width, height, changed) {
  const changedHas = (id) => changed.has(id);

  drawMarketSky(ctx, width, height, changedHas);
  drawMarketStreet(ctx, width, height);
  drawMarketStringLights(ctx, width, height, changedHas);
  drawMarketBanner(ctx, changedHas);
  drawMarketLanternRow(ctx, changedHas);
  drawMarketStalls(ctx, width, height, changedHas);
  drawMarketGround(ctx, width, height, changedHas);
}

function drawMarketSky(ctx, width, height, changedHas) {
  const sky = ctx.createLinearGradient(0, 0, 0, 280);
  sky.addColorStop(0, '#1d1b4b');
  sky.addColorStop(0.6, '#4a2b6d');
  sky.addColorStop(1, '#b56576');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, 280);

  drawMarketStars(ctx);
  drawMarketMoon(ctx, changedHas);
}

function drawMarketStars(ctx) {
  ctx.fillStyle = '#ffffff';
  const stars = [
    [60, 40], [140, 30], [230, 55], [310, 35], [400, 45], [470, 30],
    [90, 100], [200, 110], [370, 95], [450, 115], [560, 110], [30, 150],
  ];
  for (const [x, y] of stars) {
    ctx.beginPath();
    ctx.arc(x, y, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawMarketMoon(ctx, changedHas) {
  ctx.fillStyle = '#fff8d6';
  ctx.beginPath();
  ctx.arc(520, 70, 28, 0, Math.PI * 2);
  ctx.fill();
  if (changedHas('moon-phase')) {
    // A crescent: bite a dark disc out of the full moon.
    ctx.fillStyle = '#3a2a63';
    ctx.beginPath();
    ctx.arc(532, 62, 25, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawMarketStreet(ctx, width, height) {
  // The plaza behind the stalls: dusk purple, darker toward the ground,
  // so the stalls read as standing in a street instead of floating on white.
  const street = ctx.createLinearGradient(0, 260, 0, 480);
  street.addColorStop(0, '#7a5a80');
  street.addColorStop(1, '#54426b');
  ctx.fillStyle = street;
  ctx.fillRect(0, 260, width, 220);
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.fillRect(0, 260, width, 4);
}

function drawMarketStringLights(ctx, width, height, changedHas) {
  // Two sagging wires with warm bulbs. The eighth bulb of the lower wire
  // is the one that can go out: its centre is (503, 153), clear of every
  // other difference — the middle bulb used to sit 13 px from the banner
  // and its hit circle covered the banner's centre.
  drawMarketWire(ctx, 0, 80, 604, 60, 118, -1);
  drawMarketWire(ctx, 0, 150, 604, 135, 168, changedHas('string-bulb') ? 7 : -1);
}

function drawMarketWire(ctx, x1, y1, x2, y2, sag, darkBulbIndex) {
  ctx.strokeStyle = '#2d1b4e';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.quadraticCurveTo((x1 + x2) / 2, sag, x2, y2);
  ctx.stroke();
  const bulbs = 9;
  for (let i = 0; i < bulbs; i++) {
    const t = (i + 0.5) / bulbs;
    const bx = x1 + (x2 - x1) * t;
    const by = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * sag + t * t * y2;
    const lit = i !== darkBulbIndex;
    ctx.fillStyle = lit ? '#ffd93b' : '#5b5470';
    ctx.beginPath();
    ctx.arc(bx, by + 8, 6, 0, Math.PI * 2);
    ctx.fill();
    if (lit) {
      ctx.fillStyle = 'rgba(255, 217, 59, 0.25)';
      ctx.beginPath();
      ctx.arc(bx, by + 8, 12, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawMarketBanner(ctx, changedHas) {
  ctx.fillStyle = '#e63946';
  ctx.fillRect(285, 118, 30, 66);
  ctx.beginPath();
  ctx.moveTo(285, 184);
  ctx.lineTo(300, 168);
  ctx.lineTo(315, 184);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#ffd93b';
  ctx.lineWidth = 3;
  if (changedHas('banner-symbol')) {
    ctx.beginPath();
    ctx.arc(300, 148, 9, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    drawMarketStar(ctx, 300, 148, 10);
  }
}

function drawMarketStar(ctx, x, y, r) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    const rad = i % 2 === 0 ? r : r * 0.45;
    const px = x + Math.cos(a) * rad;
    const py = y + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.stroke();
}

function drawMarketLanternRow(ctx, changedHas) {
  const lanterns = [
    { x: 60, y: 235, color: '#e63946' },
    { x: 120, y: 225, color: '#fb8500' },
    { x: 180, y: 220, color: changedHas('lantern-color') ? '#2a9d8f' : '#e63946' },
    { x: 240, y: 230, color: '#ffd93b' },
    { x: 360, y: 225, color: '#fb8500' },
    { x: 500, y: 235, color: '#e63946' },
    { x: 560, y: 228, color: '#ffd93b' },
  ];
  for (const l of lanterns) drawMarketLantern(ctx, l.x, l.y, l.color);
  if (!changedHas('extra-lantern')) drawMarketLantern(ctx, 430, 230, '#e63946');
}

function drawMarketLantern(ctx, x, y, color) {
  ctx.strokeStyle = '#2d1b4e';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y - 34);
  ctx.lineTo(x, y - 18);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, 15, 19, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x - 12, y - 8);
  ctx.lineTo(x + 12, y - 8);
  ctx.moveTo(x - 14, y);
  ctx.lineTo(x + 14, y);
  ctx.moveTo(x - 12, y + 8);
  ctx.lineTo(x + 12, y + 8);
  ctx.stroke();
  ctx.fillStyle = '#ffd93b';
  ctx.fillRect(x - 4, y - 23, 8, 5);
  ctx.fillRect(x - 4, y + 18, 8, 5);
}

function drawMarketStalls(ctx, width, height, changedHas) {
  drawMarketFruitStall(ctx, changedHas);
  drawMarketLanternStall(ctx, changedHas);
  drawMarketTeaStall(ctx, changedHas);
}

function drawMarketAwning(ctx, x, y, w, stripeA, stripeB, changedStripeIndex) {
  const stripeW = w / 6;
  for (let i = 0; i < 6; i++) {
    let color = i % 2 === 0 ? stripeA : stripeB;
    if (changedStripeIndex !== undefined && i === changedStripeIndex) color = '#2a9d8f';
    ctx.fillStyle = color;
    ctx.fillRect(x + i * stripeW, y, stripeW, 26);
  }
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.fillRect(x, y + 26, w, 5);
}

function drawMarketFruitStall(ctx, changedHas) {
  drawMarketAwning(ctx, 30, 296, 200, '#e63946', '#fff3e2');
  ctx.fillStyle = '#7f4f24';
  ctx.fillRect(40, 400, 180, 70);
  ctx.fillStyle = '#9c6644';
  ctx.fillRect(40, 400, 180, 10);
  // A pile of oranges on the counter; one can go missing.
  const oranges = [
    [70, 388], [95, 388], [120, 388], [145, 388],
    [82, 372], [107, 372], [132, 372],
    [95, 356], [120, 356],
  ];
  for (const [ox, oy] of oranges) {
    if (changedHas('fruit-count') && ox === 120 && oy === 388) continue;
    ctx.fillStyle = '#fb8500';
    ctx.beginPath();
    ctx.arc(ox, oy, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#588157';
    ctx.beginPath();
    ctx.arc(ox + 3, oy - 10, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  // A basket of green apples beside them.
  ctx.fillStyle = '#8a5a2b';
  ctx.beginPath();
  ctx.moveTo(170, 392);
  ctx.lineTo(210, 392);
  ctx.lineTo(204, 412);
  ctx.lineTo(176, 412);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#8ac926';
  ctx.beginPath();
  ctx.arc(180, 388, 7, 0, Math.PI * 2);
  ctx.arc(192, 386, 7, 0, Math.PI * 2);
  ctx.arc(202, 389, 7, 0, Math.PI * 2);
  ctx.fill();
}

function drawMarketLanternStall(ctx, changedHas) {
  drawMarketAwning(ctx, 240, 296, 140, '#fb8500', '#fff3e2', changedHas('awning-stripe') ? 2 : undefined);
  ctx.fillStyle = '#7f4f24';
  ctx.fillRect(250, 400, 120, 70);
  ctx.fillStyle = '#9c6644';
  ctx.fillRect(250, 400, 120, 10);
  drawMarketLantern(ctx, 275, 372, '#e63946');
  drawMarketLantern(ctx, 310, 366, '#ffd93b');
  drawMarketLantern(ctx, 345, 372, '#2a9d8f');
}

function drawMarketTeaStall(ctx, changedHas) {
  drawMarketAwning(ctx, 400, 296, 170, '#2a9d8f', '#fff3e2');
  ctx.fillStyle = '#7f4f24';
  ctx.fillRect(410, 400, 150, 70);
  ctx.fillStyle = '#9c6644';
  ctx.fillRect(410, 400, 150, 10);
  // Teapot.
  ctx.fillStyle = '#4361ee';
  ctx.beginPath();
  ctx.ellipse(440, 388, 18, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(436, 372, 8, 8);
  // Two cups; steam rises over the second one.
  ctx.fillStyle = '#fff3e2';
  ctx.fillRect(470, 384, 16, 12);
  ctx.fillRect(500, 384, 16, 12);
  if (!changedHas('tea-steam')) {
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(478, 378);
    ctx.quadraticCurveTo(474, 368, 478, 360);
    ctx.moveTo(486, 378);
    ctx.quadraticCurveTo(490, 368, 486, 358);
    ctx.stroke();
  }
}

function drawMarketGround(ctx, width, height, changedHas) {
  ctx.fillStyle = '#3d2c56';
  ctx.fillRect(0, 480, width, 80);
  ctx.fillStyle = '#4a3a68';
  for (let x = 0; x < width; x += 46) {
    ctx.fillRect(x + 4, 500, 38, 3);
    ctx.fillRect(x + 4, 530, 38, 3);
  }
  drawMarketCrates(ctx, changedHas);
  drawMarketCat(ctx, changedHas);
}

function drawMarketCrates(ctx, changedHas) {
  ctx.fillStyle = '#b08968';
  ctx.fillRect(30, 505, 70, 35);
  ctx.strokeStyle = '#7f4f24';
  ctx.lineWidth = 2;
  ctx.strokeRect(30, 505, 70, 35);
  ctx.beginPath();
  ctx.moveTo(30, 505);
  ctx.lineTo(100, 540);
  ctx.moveTo(100, 505);
  ctx.lineTo(30, 540);
  ctx.stroke();
  if (!changedHas('crate-stack')) {
    ctx.fillStyle = '#c69c6d';
    ctx.fillRect(40, 470, 50, 35);
    ctx.strokeRect(40, 470, 50, 35);
    ctx.beginPath();
    ctx.moveTo(40, 470);
    ctx.lineTo(90, 505);
    ctx.moveTo(90, 470);
    ctx.lineTo(40, 505);
    ctx.stroke();
  }
}

function drawMarketCat(ctx, changedHas) {
  // The crate is always there; only the cat can vanish.
  ctx.fillStyle = '#b08968';
  ctx.fillRect(470, 480, 60, 30);
  ctx.strokeStyle = '#7f4f24';
  ctx.lineWidth = 2;
  ctx.strokeRect(470, 480, 60, 30);
  if (changedHas('market-cat')) return;
  ctx.fillStyle = '#2b2d42';
  ctx.beginPath();
  ctx.ellipse(500, 468, 20, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(512, 450, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(504, 441);
  ctx.lineTo(502, 430);
  ctx.lineTo(510, 439);
  ctx.closePath();
  ctx.moveTo(518, 441);
  ctx.lineTo(520, 430);
  ctx.lineTo(522, 440);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#2b2d42';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(482, 474);
  ctx.quadraticCurveTo(468, 470, 470, 456);
  ctx.stroke();
  ctx.fillStyle = '#ffd93b';
  ctx.beginPath();
  ctx.arc(515, 448, 1.8, 0, Math.PI * 2);
  ctx.fill();
}
