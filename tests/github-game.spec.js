import { test, expect } from '@playwright/test';
import { createGame, normalizeActivity, movePlayer, shoot, stepGame } from '../src/lib/contributionGame.js';

test.use({ hasTouch: true });

const savedActivity = {
  username: 'Jessie064', fetchedAt: '2026-10-14T00:00:00Z',
  contributions: [
    { date: '2026-10-01', count: 0, level: 0 },
    { date: '2026-10-02', count: 8, level: 4 },
    { date: '2026-10-03', count: 0, level: 0 },
  ],
};

test('game collision, scoring, victory, movement bounds, and pause', () => {
  const game = createGame(normalizeActivity(savedActivity), 1060);
  movePlayer(game, -100);
  expect(game.playerX).toBe(20);
  movePlayer(game, 2000);
  expect(game.playerX).toBe(1040);
  shoot(game);
  expect(game.shots).toHaveLength(0);
  game.phase = 'running';
  const target = game.blocks.find((block) => block.health > 0);
  movePlayer(game, target.x + target.size / 2);
  for (let i = 0; i < 1000 && game.phase === 'running'; i++) stepGame(game, .016, { fire: true });
  expect(game.phase).toBe('won');
  expect(game.score).toBe(40);
  expect(game.remaining).toBe(0);
  expect(game.blocks.filter((block) => block.destroyed)).toHaveLength(1);
  const paused = createGame(normalizeActivity(savedActivity), 320);
  paused.phase = 'paused';
  const initialX = paused.playerX;
  stepGame(paused, 1, { right: true, fire: true });
  expect(paused.playerX).toBe(initialX);
  expect(paused.shots).toHaveLength(0);
  expect(() => normalizeActivity({ contributions: [{ date: 'bad', count: -1, level: 9 }] })).toThrow();
});

test('space game works on desktop and mobile, preserves progress on resize, and survives refresh failure', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('**/data/github-contributions.json', (route) => route.fulfill({ json: savedActivity }));
  await page.route('https://github-contributions-api.jogruber.de/**', (route) => route.abort());
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    const section = page.locator('#github-game');
    const canvas = section.locator('canvas');
    await expect(section.getByRole('link', { name: /Jessie064/ })).toHaveAttribute('href', 'https://github.com/Jessie064');
    await section.getByRole('button', { name: 'Play game', exact: true }).click();
    await expect(canvas).toBeFocused();
    let bounds = await canvas.boundingBox();
    let target = createGame(normalizeActivity(savedActivity), Math.floor(bounds.width)).blocks.find((block) => block.health > 0);
    await canvas.click({ position: { x: target.x + target.size / 2, y: bounds.height - 55 } });
    await expect(section.locator('.game-stats strong').first()).toHaveText('010');
    await section.getByRole('button', { name: 'Pause game', exact: true }).click();
    await expect(section.getByText('Flight paused.')).toBeVisible();
    await page.setViewportSize({ width: width === 1440 ? 768 : 320, height: 1000 });
    await expect(section.locator('.game-stats strong').first()).toHaveText('010');
    await section.getByRole('button', { name: 'Resume game', exact: true }).click();
    await canvas.scrollIntoViewIfNeeded();
    bounds = await canvas.boundingBox();
    target = createGame(normalizeActivity(savedActivity), Math.floor(bounds.width)).blocks.find((block) => block.health > 0);
    await page.mouse.move(bounds.x + target.x + target.size / 2, bounds.y + bounds.height - 55);
    await section.getByRole('button', { name: 'Fire laser' }).tap();
    await expect(section.locator('.game-stats strong').first()).toHaveText('020');
    await canvas.focus();
    await page.keyboard.down('Space');
    await expect(section.getByText('All clear. Nice flying!', { exact: true })).toBeVisible();
    await page.keyboard.up('Space');
    await expect(section.locator('.game-stats strong').first()).toHaveText('040');
    await section.getByRole('button', { name: 'Restart game' }).click();
    await expect(section.locator('.game-stats strong').first()).toHaveText('000');
    await section.getByRole('button', { name: 'Play game', exact: true }).click();
    const left = section.getByRole('button', { name: 'Move spaceship left' });
    await left.hover();
    await page.mouse.down();
    await expect(section.getByRole('button', { name: 'Pause game', exact: true })).toBeVisible();
    await page.mouse.up();
    await section.getByRole('button', { name: 'Restart game' }).click();
    await section.getByRole('button', { name: 'Refresh activity', exact: true }).click();
    await expect(section.getByText('Refresh unavailable. You can still play the saved activity.')).toBeVisible();
    await expect(section.getByRole('button', { name: 'Play game', exact: true })).toBeEnabled();
  }
  expect(errors).toEqual([]);
});

test('empty activity gives an honest empty state and failed initial loading can be retried', async ({ page }) => {
  await page.route('**/data/github-contributions.json', (route) => route.abort());
  await page.route('https://github-contributions-api.jogruber.de/**', (route) => route.fulfill({ json: { contributions: [{ date: '2026-10-14', count: 0, level: 0 }] } }));
  await page.goto('/');
  const section = page.locator('#github-game');
  await expect(section.getByText('Activity could not load. Try refreshing it below.')).toBeVisible();
  await expect(section.getByRole('button', { name: 'Play game', exact: true })).toBeDisabled();
  await section.getByRole('button', { name: 'Refresh activity', exact: true }).click();
  await expect(section.getByText('A quiet corner of space.')).toBeVisible();
  await expect(section.getByRole('button', { name: 'Play game', exact: true })).toBeDisabled();
});
