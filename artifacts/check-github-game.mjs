import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { createGame, normalizeActivity } from '../src/lib/contributionGame.js';

const saved = JSON.parse(readFileSync(new URL('../public/data/github-contributions.json', import.meta.url), 'utf8').replace(/^\uFEFF/, ''));
const browser = await chromium.launch();
try {
  for (const theme of ['light', 'dark']) {
    for (const width of [1440, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 1200 }, colorScheme: theme, reducedMotion: 'reduce' });
      await page.goto('http://127.0.0.1:4173/');
      await page.evaluate(() => document.fonts.ready);
      const game = page.locator('#github-game');
      await game.getByRole('button', { name: 'Play game', exact: true }).waitFor({ state: 'visible' });
      await game.scrollIntoViewIfNeeded();
      await game.screenshot({ path: `artifacts/github-game-${theme}-${width}.png` });
      await game.getByRole('button', { name: 'Play game', exact: true }).click();
      const canvas = game.locator('canvas');
      const bounds = await canvas.boundingBox();
      const target = createGame(normalizeActivity(saved), Math.floor(bounds.width)).blocks.find((cell) => cell.health > 0);
      await canvas.click({ position: { x: target.x + target.size / 2, y: bounds.height - 55 } });
      await page.waitForFunction(() => Number(document.querySelector('.game-stats strong').textContent) > 0);
      console.log(`${theme} ${width}px: real activity playable, score ${await game.locator('.game-stats strong').first().textContent()}`);
      await page.close();
    }
  }
} finally { await browser.close(); }
