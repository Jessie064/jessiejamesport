import { chromium } from 'playwright';

const browser = await chromium.launch();
try {
  for (const [width, theme] of [[1440, 'light'], [390, 'dark']]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, colorScheme: theme });
    await page.goto('http://127.0.0.1:4173/');
    await page.evaluate(() => document.fonts.ready);
    await page.locator('#skills').screenshot({ path: `artifacts/skills-icons-${width}.png` });
    console.log(`${width}px: ${await page.locator('.skill-tags .technology-icon').count()} technology icons rendered`);
    await page.close();
  }
} finally {
  await browser.close();
}
