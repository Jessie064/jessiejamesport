import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce', colorScheme: 'light' });
  await page.goto('http://127.0.0.1:4173/');
  await page.evaluate(() => document.fonts.ready);
  const portrait = page.locator('.hero-portrait');
  await portrait.evaluate((image) => image.decode());
  for (const [theme, color] of [['light', 'rgb(0, 0, 0)'], ['dark', 'rgb(255, 255, 255)']]) {
    if (theme === 'dark') await page.getByRole('button', { name: 'Switch to dark theme' }).click();
    await page.mouse.move(0, 0);
    const bounds = await portrait.boundingBox();
    await portrait.hover();
    await page.waitForFunction((expected) => getComputedStyle(document.querySelector('.hero-profile')).borderTopColor === expected, color);
    const styles = await page.locator('.hero-profile').evaluate((element) => ({ border: getComputedStyle(element).borderTopColor, ring: getComputedStyle(element).boxShadow }));
    assert.equal(styles.border, color);
    assert.ok(styles.ring.includes(color));
    assert.deepEqual(await portrait.boundingBox(), bounds);
    await page.screenshot({ path: `artifacts/portrait-hover-${theme}.png` });
    console.log(`${theme}: ${styles.border}; portrait size unchanged`);
  }
  const aboutPortrait = page.locator('.portrait > img');
  for (const [theme, color] of [['dark', 'rgb(255, 255, 255)'], ['light', 'rgb(0, 0, 0)']]) {
    if (theme === 'light') await page.getByRole('button', { name: 'Switch to light theme' }).click();
    await aboutPortrait.scrollIntoViewIfNeeded();
    await aboutPortrait.evaluate((image) => image.decode());
    const bounds = await aboutPortrait.boundingBox();
    await aboutPortrait.hover();
    await page.waitForFunction((expected) => getComputedStyle(document.querySelector('.portrait > img')).boxShadow.includes(expected), color);
    assert.deepEqual(await aboutPortrait.boundingBox(), bounds);
    await page.screenshot({ path: `artifacts/about-portrait-hover-${theme}.png` });
    console.log(`About portrait ${theme}: ${color}; portrait size unchanged`);
  }
} finally {
  await browser.close();
}
