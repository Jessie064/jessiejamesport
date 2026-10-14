export function normalizeActivity(payload) {
  if (!Array.isArray(payload?.contributions)) throw new Error('Activity is unavailable.');
  const dates = new Map();
  for (const day of payload.contributions) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day.date) || !Number.isInteger(day.count) || day.count < 0 || !Number.isInteger(day.level) || day.level < 0 || day.level > 4) continue;
    dates.set(day.date, { date: day.date, count: day.count, level: day.count > 0 ? Math.max(1, day.level) : 0 });
  }
  const days = [...dates.values()].sort((a, b) => a.date.localeCompare(b.date)).slice(-371);
  if (!days.length) throw new Error('No activity dates were returned.');
  return days;
}

export function createGame(days, width) {
  const columns = width < 480 ? 20 : width < 760 ? 36 : 53;
  const rows = Math.ceil(days.length / columns);
  const spacing = (width - 40) / columns;
  const size = Math.max(3, spacing - Math.max(3, spacing * .22));
  const height = Math.max(280, 36 + rows * spacing + 115);
  const blocks = days.map((day, index) => ({
    ...day, health: day.level, destroyed: false,
    x: 20 + Math.floor(index / rows) * spacing,
    y: 30 + (index % rows) * spacing, size,
  }));
  return {
    width, height, blocks, playerX: width / 2, playerY: height - 38,
    shots: [], particles: [], score: 0, remaining: blocks.filter((block) => block.health > 0).length,
    phase: 'ready', cooldown: 0,
  };
}

export function movePlayer(game, x) {
  game.playerX = Math.max(20, Math.min(game.width - 20, x));
}

export function shoot(game) {
  if (!game || game.phase !== 'running' || game.cooldown > 0) return;
  game.shots.push({ x: game.playerX, y: game.playerY - 12 });
  game.cooldown = .16;
}

export function stepGame(game, seconds, input) {
  if (game.phase !== 'running') return false;
  let changed = false;
  game.cooldown = Math.max(0, game.cooldown - seconds);
  movePlayer(game, game.playerX + ((input.right ? 1 : 0) - (input.left ? 1 : 0)) * Math.min(360, game.width * .8) * seconds);
  if (input.fire) shoot(game);
  for (const shot of game.shots) {
    const previousY = shot.y;
    shot.y -= 480 * seconds;
    // Check the swept path so even small contribution squares cannot be skipped.
    const block = game.blocks.filter((cell) => cell.health > 0 && shot.x >= cell.x - 2 && shot.x <= cell.x + cell.size + 2 && shot.y <= cell.y + cell.size && previousY >= cell.y)
      .sort((a, b) => b.y - a.y)[0];
    if (!block) continue;
    block.health -= 1;
    game.score += 10;
    shot.y = -20;
    changed = true;
    if (block.health === 0) {
      block.destroyed = true;
      game.remaining -= 1;
    }
    for (let i = 0; i < 5; i++) {
      game.particles.push({ x: block.x + block.size / 2, y: block.y + block.size / 2, vx: (i - 2) * 35, vy: -35 - (i % 3) * 20, life: .4 });
    }
  }
  game.shots = game.shots.filter((shot) => shot.y >= 0);
  for (const particle of game.particles) {
    particle.x += particle.vx * seconds;
    particle.y += particle.vy * seconds;
    particle.life -= seconds;
  }
  game.particles = game.particles.filter((particle) => particle.life > 0);
  if (game.remaining === 0) {
    game.phase = 'won';
    changed = true;
  }
  return changed;
}

const SHIP = ['.....#.....', '....###....', '....###....', '..#######..', '.#########.', '###########', '###..#..###'];

export function drawGame(context, game, palette) {
  context.clearRect(0, 0, game.width, game.height);
  for (const block of game.blocks) {
    if (block.destroyed) continue;
    context.fillStyle = palette.levels[block.health];
    context.beginPath();
    context.roundRect(block.x, block.y, block.size, block.size, Math.min(2, block.size / 4));
    context.fill();
  }
  context.fillStyle = palette.ink;
  const pixel = game.width < 480 ? 2 : 3;
  SHIP.forEach((row, y) => [...row].forEach((cell, x) => {
    if (cell === '#') context.fillRect(Math.round(game.playerX - pixel * 5.5 + x * pixel), game.playerY + y * pixel, pixel, pixel);
  }));
  for (const shot of game.shots) context.fillRect(shot.x - 1.5, shot.y, 3, 8);
  for (const particle of game.particles) {
    context.globalAlpha = Math.max(0, particle.life / .4);
    context.fillRect(particle.x, particle.y, 3, 3);
  }
  context.globalAlpha = 1;
}
