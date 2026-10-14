# Jessiejames Pepito — Personal Portfolio

A responsive, original student portfolio built with React, Vite, Tailwind CSS, Poppins, and `@phosphor-icons/react`. The monochrome palette follows the supplied `Inspo.png`: near-white (`#fafaf9`), charcoal (`#1c1917`), and soft gray borders (`#e7e5e4`), with a coordinated dark theme. Poppins is bundled locally, so it needs no Google Fonts request at runtime.

Skill badges use locally bundled technology logos from `react-icons`. Their mapping lives in `src/components/TechnologyIcon.jsx`; add an entry there when adding a new technology label. Unknown labels receive a Phosphor code icon. Logos inherit the theme color and are hidden from assistive technology because the adjacent text already names each skill.

## Run locally

Use Node.js **22.12 or later** (tested with 22.20.0) and npm.

```sh
npm install
npm run dev
```

Open the Local URL printed by Vite (normally `http://127.0.0.1:5173`). Once a lockfile exists, `npm ci` reproduces the installed dependencies.

## Build for production

```sh
npm run build
npm run preview
```

Vite writes the production website to `dist/`. Serve that directory with any static web host. This project has no backend, contact form, API keys, or runtime secrets. Preview uses `http://127.0.0.1:4173` by default.

## GitHub space game

Below Contact, Contribution Invaders turns public GitHub activity into a playable monochrome space game inspired by `public/images/game.png`. It uses the profile in `contact.github`. Move with the arrow keys or A/D and fire with Space, or use the on-screen buttons. P or Escape pauses; leaving the game or switching tabs also pauses it. Resizing preserves progress and pauses play. The game starts only when Play is selected, including with reduced motion enabled.

The bundled `public/data/github-contributions.json` is a real snapshot of Jessie064's public activity. Its saved date and contribution total appear below the game. Refresh activity fetches current public data from the [GitHub Contributions API](https://github.com/grubersjoe/github-contributions-api); no token is needed, and a failed refresh keeps the saved activity playable. Refreshing changes only the current browser session. To update the bundled snapshot, replace the JSON with the same response format plus `username` and an ISO `fetchedAt` timestamp. Empty activity shows an empty state rather than fabricated contribution counts.

## Edit your content

All personal information, navigation labels, draft skills, project entries, and contact details are in **`src/data/portfolio.js`**. Presentation is in reusable components under `src/components/`; colors and responsive rules are in `src/styles.css`, which imports Tailwind CSS v4 through its Vite plugin.

- `personal`: your name, education, introduction, about paragraphs, portrait, and alternative text.
- `skills.groups`: learning areas and honest labels, without percentages or mastery ratings.
- `projects`: titles, descriptions, categories, technologies, contribution, status, learning focus, screenshots, and real URLs.
- `contact`: Facebook, email, GitHub, and LinkedIn. Each link has a matching icon. Empty or invalid values are not rendered as links. A valid email becomes a working `mailto:` link. External links open in a new tab with `noopener noreferrer`.

### Add your own images

1. Put your image files in `public/images/`. Prefer compressed WebP, AVIF, or JPEG images.
2. Set `personal.portrait` to `/images/portrait.webp` and update `portraitAlt`.
   The large, standalone hero portrait uses `personal.heroPortrait` and `heroPortraitAlt` separately; it currently displays `/images/moy.jpg`. Set `heroPortrait` to `null` to restore the JP initials composition. The original photo colors are preserved, and CSS crops it into a circle that scales down on mobile.
3. Set each project's `screenshot` to its image path, such as `/images/agrilink.webp`, and update `screenshotAlt` with a description of the actual screen.
4. Prefer square portraits and landscape project screenshots (16:10). The layout crops them with `object-fit: cover`.

The initials treatment and project symbols are **placeholders**, not actual photos or project screenshots. Project images explicitly say “Screenshot placeholder.” Replacing the image paths automatically replaces those placeholders.

### Before public submission

- Supply your own portrait, if desired, and real screenshots for each project.
- Supply your email and real Facebook, GitHub, and optional LinkedIn profile URLs.
- Confirm each listed skill and its learning label; these are editable drafts.
- Confirm project categories, current status, exact technologies, completed features, and your specific contributions, especially your role in AgriLink.
- Add real demo and source URLs only when available; there are currently no invented links.
- Review all writing and AI assistance disclosure against your actual student guide. The guide itself was not supplied, so no claim is made that its exact disclosure format has been satisfied.

## Interaction and accessibility

- Sticky navigation, scroll offsets, smooth anchors, current section indication, skip link, and back-to-top link.
- Mobile navigation uses a disclosure button with `aria-expanded`; Escape closes it, section selection transfers focus to the destination, and an outside click dismisses it.
- Theme toggle remembers explicit preference in `localStorage`, follows the system preference until a selection is made, and synchronizes across tabs. Storage access failures are handled.
- Project category filters update the visible cards and announce their count.
- Native modal `<dialog>` keeps focus inside, supports Escape and backdrop dismissal, locks background scrolling, and restores focus to the opening button.
- Visible keyboard focus, comfortable controls, explicit icon-button names, and reduced-motion support.

## Browser checks

```sh
npx playwright install chromium
npm run test:e2e
```

The suite serves the production build, checks representative mobile/tablet/desktop widths, keyboard navigation and dialogs, filtering, persisted themes, reduced motion, and automated axe accessibility rules in both themes. Run `npm run build` before tests. Test reports go in `test-results/` and `playwright-report/` (git-ignored).

Verified on October 12, 2026: production build passed; all six Playwright tests passed. Layouts were checked at 320, 375, 390, 768, 1024, 1440, and 1920 pixels in both themes with no horizontal overflow. Automated axe checks reported no WCAG A/AA violations at desktop and mobile sizes or in the project dialog. Desktop and mobile screenshots were also visually reviewed. Automated checks are scoped evidence, not a full accessibility certification.

## Design reference

The supplied reference was [shanshan.dev](https://www.shanshan.dev/). Its HTML, compiled layout/component source, and stylesheet were inspected on October 12, 2026. The web reader could not load it and no interactive browser was connected for an initial visual inspection; direct HTTP access to the site and its assets succeeded. The inspected structure informed the generous spacing, centered layout, thin borders, anchor navigation, restrained theme control, and project detail interaction. This portfolio uses original content, composition, colors, and CSS initials treatments; no reference personal content, branding, photos, project images, or code was copied into the website.

