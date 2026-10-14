import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { personal, contact, validEmail, validWebUrl } from '../src/data/portfolio.js';

test('name repeats after a five-second pause without moving the layout and respects reduced motion', async ({ page }) => {
  for (const width of [1440, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'no-preference', colorScheme: 'dark' });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const name = page.getByRole('heading', { level: 1 });
    await expect(name).toHaveAccessibleName(`${personal.firstName} ${personal.lastName}.`);
    await expect(name.locator('.typing-character').first()).toHaveAttribute('data-revealed', 'true');
    expect(await name.locator('[data-revealed="false"]').count()).toBeGreaterThan(0);
    const initialBounds = await name.boundingBox();
    const initialRoleBounds = await page.locator('.hero-role').boundingBox();
    await expect(name.locator('[data-revealed="false"]')).toHaveCount(0);
    expect(await name.boundingBox()).toEqual(initialBounds);
    expect(await page.locator('.hero-role').boundingBox()).toEqual(initialRoleBounds);
    await page.locator('.hero-main').screenshot({ path: `artifacts/typing-name-${width}.png` });
    await expect(name.locator('[data-revealed="false"]')).not.toHaveCount(0, { timeout: 6500 });
    await expect(name.locator('.typing-character').first()).toHaveAttribute('data-revealed', 'true');
    expect(await name.boundingBox()).toEqual(initialBounds);
    expect(await page.locator('.hero-role').boundingBox()).toEqual(initialRoleBounds);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(name.locator('[data-revealed="false"]')).toHaveCount(0);
    expect(await name.locator('.typing-cursor').evaluate((element) => getComputedStyle(element, '::after').display)).toBe('none');
    await page.reload();
    await expect(name.locator('[data-revealed="false"]')).toHaveCount(0);
  }
});

test('desktop content, filtering, modal focus, Escape, theme persistence, and reduced motion', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(`${personal.firstName}${personal.lastName}.`);
  await expect(page.locator('.project-card')).toHaveCount(2);
  await expect(page.getByRole('heading', { name: 'AgriLink', exact: true })).toHaveCount(0);
  await expect(page.getByText(contact.pendingMessage)).toHaveCount(0);
  const contactSection = page.locator('#contact');
  for (const [label, href] of [['Facebook', contact.facebook], ['Email me', `mailto:${contact.email}`], ['GitHub', contact.github]]) {
    const link = contactSection.getByRole('link', { name: new RegExp(label) });
    await expect(link).toHaveAttribute('href', href);
    await expect(link.locator('svg').first()).toBeVisible();
    if (label !== 'Email me') {
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  }
  await expect(page.locator('a[href="mailto:null"], a[href="#"], a[href="undefined"]')).toHaveCount(0);

  await page.getByRole('button', { name: 'Practice', exact: true }).click();
  await expect(page.locator('.project-card')).toHaveCount(1);
  await expect(page.locator('.project-card')).toContainText('Computer Laboratory Monitoring System');
  await page.getByRole('button', { name: 'Client work', exact: true }).click();
  await expect(page.locator('.project-card')).toHaveCount(1);
  await expect(page.locator('.project-card')).toContainText('MoldezAI');
  await page.getByRole('button', { name: /^All projects/ }).click();

  const trigger = page.getByRole('button', { name: 'View details for Computer Laboratory Monitoring System', exact: true });
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading', { name: 'Computer Laboratory Monitoring System', exact: true })).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Close project details' })).toBeFocused();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await expect.poll(() => page.evaluate(() => !!document.activeElement?.closest('dialog'))).toBe(true);
  const dialogA11y = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(dialogA11y.violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();

  for (const title of ['Computer Laboratory Monitoring System', 'MoldezAI']) {
    await page.getByRole('button', { name: `View details for ${title}`, exact: true }).click();
    await expect(page.getByRole('dialog').getByRole('heading', { name: title, exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Close project details' }).click();
  }
  await trigger.click();
  await page.mouse.click(10, 10);
  await expect(page.getByRole('dialog')).not.toBeVisible();

  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'Switch to light theme' }).click();
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');

  await page.getByRole('link', { name: 'View Projects', exact: true }).click();
  expect(await page.locator('#projects').evaluate((element) => element.getBoundingClientRect().top)).toBeGreaterThan(88);
  await page.getByRole('link', { name: 'Back to top' }).click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(90);
  expect(errors).toEqual([]);
});

test('mobile disclosure works by keyboard, closes on selection and Escape, and responds to resizing', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Open navigation menu' });
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close navigation menu' })).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: /Home/ })).toBeFocused();
  await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: /Projects/ }).click();
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).not.toBeVisible();
  await expect(page.locator('#projects')).toBeFocused();
  expect(await page.locator('#projects').evaluate((element) => element.getBoundingClientRect().top)).toBeGreaterThan(73);
  await toggle.click();
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('layout has no horizontal overflow across mobile, tablet, and desktop in both themes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const theme of ['light', 'dark']) {
    await page.emulateMedia({ colorScheme: theme });
    for (const width of [320, 375, 390, 768, 1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      const dimensions = await page.evaluate(() => ({ viewport: innerWidth, page: document.documentElement.scrollWidth }));
      expect(dimensions.page, `${theme} at ${width}px`).toBeLessThanOrEqual(dimensions.viewport);
      await page.getByRole('button', { name: 'View details for Computer Laboratory Monitoring System', exact: true }).click();
      await expect(page.getByRole('dialog')).toBeVisible();
      const dialogFits = await page.getByRole('dialog').evaluate((element) => element.scrollWidth <= element.clientWidth + 1);
      expect(dialogFits, `modal at ${width}px`).toBe(true);
      await page.keyboard.press('Escape');
    }
  }
});

test('WCAG checks and screenshots at desktop and mobile sizes in both themes', async ({ page }) => {
  for (const theme of ['light', 'dark']) {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: width === 1440 ? 1000 : 844 });
      await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(results.violations, `${theme} at ${width}px`).toEqual([]);
      await page.screenshot({ path: `artifacts/portfolio-${theme}-${width}.png`, fullPage: true });
    }
  }
});

test('system theme and storage failures keep the portfolio usable', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage unavailable'); } });
  });
  await page.reload();
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('pending contact and project links reject invalid values', () => {
  expect(validWebUrl(null)).toBe(false);
  expect(validWebUrl('javascript:alert(1)')).toBe(false);
  expect(validWebUrl('https://github.com/')).toBe(true);
  expect(validEmail(null)).toBe(false);
  expect(validEmail('person@example.com\nBcc:bad')).toBe(false);
  expect(validEmail('person@example.com')).toBe(true);
});
