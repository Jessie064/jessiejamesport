import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const theme of ['light', 'dark']) {
  for (const width of [1440, 774, 390]) {
    test(`skeleton matches ${theme} theme at ${width}px and reveals the portfolio`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme, reducedMotion: 'no-preference' });
      let releasePortrait;
      const portraitReady = new Promise((resolve) => { releasePortrait = resolve; });
      await page.route('**/images/moy.jpg', async (route) => { await portraitReady; await route.continue(); });
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      const loader = page.getByRole('main', { name: 'Loading portfolio' });
      await expect(loader).toBeVisible();
      await expect(loader).toHaveAttribute('aria-busy', 'true');
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      await expect(loader.locator('.skeleton-bone')).toHaveCount(11);
      if (width < 768) await expect(page.getByRole('button', { name: 'Open navigation menu' })).toBeVisible();
      else await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      const portraitBounds = await loader.locator('.hero-profile').boundingBox();
      const nameBounds = await loader.locator('.hero h1').boundingBox();
      const roleBounds = await loader.locator('.hero-role').boundingBox();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.evaluate(() => document.fonts.ready);
      const a11y = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(a11y.violations).toEqual([]);
      await page.screenshot({ path: `artifacts/loading-${theme}-${width}.png` });
      releasePortrait();
      await expect(loader).toHaveCount(0);
      await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName('Jessie James Pepito.');
      await expect(page.locator('.hero-portrait')).toBeVisible();
      expect(await page.locator('.hero-profile').boundingBox()).toEqual(portraitBounds);
      expect(await page.locator('.hero h1').boundingBox()).toEqual(nameBounds);
      expect(await page.locator('.hero-role').boundingBox()).toEqual(roleBounds);
      await page.getByRole('link', { name: 'View Projects', exact: true }).click();
      await expect(page).toHaveURL(/#projects$/);
      await page.reload();
      await expect(page.getByRole('heading', { name: 'Things I’m working on.' })).toBeVisible();
      await expect.poll(() => page.locator('#projects').evaluate((element) => element.getBoundingClientRect().top)).toBeLessThan(200);
    });
  }
}

test('reduced motion uses a static skeleton and a stalled portrait cannot trap the visitor', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
  let releasePortrait;
  const portraitReady = new Promise((resolve) => { releasePortrait = resolve; });
  await page.route('**/images/moy.jpg', async (route) => { await portraitReady; await route.abort(); });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.portfolio-loading-screen')).toBeVisible();
  expect(await page.locator('.skeleton-shimmer').first().evaluate((element) => getComputedStyle(element).display)).toBe('none');
  expect(await page.locator('.loader-status-dot').evaluate((element) => getComputedStyle(element).animationName)).toBe('none');
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 5000 });
  await expect(page.locator('.portfolio-loading-screen')).toHaveCount(0);
  releasePortrait();
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName('Jessie James Pepito.');
});
