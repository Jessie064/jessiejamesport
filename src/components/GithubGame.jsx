import { useEffect, useRef, useState } from 'react';
import { GithubLogoIcon, ArrowUpRightIcon, PlayIcon, PauseIcon, ArrowClockwiseIcon, ArrowLeftIcon, ArrowRightIcon, CrosshairIcon } from '@phosphor-icons/react';
import { contact, validWebUrl } from '../data/portfolio';
import { createGame, drawGame, movePlayer, normalizeActivity, shoot, stepGame } from '../lib/contributionGame';
import SectionHeading from './SectionHeading';

const EMPTY_INPUT = () => ({ left: false, right: false, fire: false });

export default function GithubGame() {
  const username = validWebUrl(contact.github) ? new URL(contact.github).pathname.split('/').filter(Boolean)[0] : null;
  const canvas = useRef(null);
  const board = useRef(null);
  const engine = useRef(null);
  const input = useRef(EMPTY_INPUT());
  const paint = useRef(() => {});
  const refreshController = useRef(null);
  const [activity, setActivity] = useState(null);
  const [loadState, setLoadState] = useState('loading');
  const [message, setMessage] = useState('Loading GitHub activity…');
  const [hud, setHud] = useState({ phase: 'ready', score: 0, remaining: 0 });

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch('/data/github-contributions.json', { signal: controller.signal });
        if (!response.ok) throw new Error('Activity is unavailable.');
        const saved = await response.json();
        if (saved.username !== username) throw new Error('Activity does not match this profile.');
        setActivity({ days: normalizeActivity(saved), savedAt: saved.fetchedAt });
        setLoadState('ready');
        setMessage('');
      } catch {
        if (!controller.signal.aborted) {
          setLoadState('error');
          setMessage('Activity could not load. Try refreshing it below.');
        }
      }
    }
    if (username) load();
    return () => { controller.abort(); refreshController.current?.abort(); };
  }, [username]);

  function syncHud() {
    const game = engine.current;
    if (game) setHud({ phase: game.phase, score: game.score, remaining: game.remaining });
  }

  useEffect(() => {
    if (!activity || !board.current || !canvas.current) return;
    const element = canvas.current;
    const context = element.getContext('2d');
    let frame;
    let previousTime;
    let palette;

    function readPalette() {
      const styles = getComputedStyle(board.current);
      palette = { ink: styles.getPropertyValue('--ink').trim(), levels: Array.from({ length: 5 }, (_, index) => styles.getPropertyValue(`--game-level-${index}`).trim()) };
    }
    function draw() { if (engine.current) drawGame(context, engine.current, palette); }
    function tick(time) {
      const game = engine.current;
      const delta = previousTime === undefined ? 0 : Math.min((time - previousTime) / 1000, .04);
      previousTime = time;
      if (stepGame(game, delta, input.current)) syncHud();
      draw();
      if (game.phase === 'running') frame = requestAnimationFrame(tick);
    }
    function begin() {
      cancelAnimationFrame(frame);
      previousTime = undefined;
      draw();
      if (engine.current?.phase === 'running') frame = requestAnimationFrame(tick);
    }
    paint.current = begin;

    function resize() {
      const width = Math.floor(board.current.clientWidth);
      if (!width || engine.current?.width === width) return;
      const old = engine.current;
      const next = createGame(activity.days, width);
      // Preserve cleared squares and score when a phone rotates or the window resizes.
      if (old) {
        next.blocks.forEach((block, index) => { block.health = old.blocks[index].health; block.destroyed = old.blocks[index].destroyed; });
        next.score = old.score;
        next.remaining = old.remaining;
        next.phase = old.phase === 'running' ? 'paused' : old.phase;
        movePlayer(next, old.playerX / old.width * width);
      }
      engine.current = next;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      element.width = Math.round(width * ratio);
      element.height = Math.round(next.height * ratio);
      element.style.height = `${next.height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.imageSmoothingEnabled = false;
      input.current = EMPTY_INPUT();
      syncHud();
      begin();
    }
    engine.current = null;
    readPalette();
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(board.current);
    const themeObserver = new MutationObserver(() => { readPalette(); draw(); });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    const releaseInput = () => { input.current = EMPTY_INPUT(); };
    const pauseWhenHidden = () => {
      releaseInput();
      if (engine.current?.phase === 'running') {
        engine.current.phase = 'paused';
        syncHud();
        begin();
      }
    };
    const visibility = () => { if (document.hidden) pauseWhenHidden(); };
    const visibilityObserver = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) pauseWhenHidden(); });
    visibilityObserver.observe(board.current);
    window.addEventListener('blur', pauseWhenHidden);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      themeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener('blur', pauseWhenHidden);
      document.removeEventListener('visibilitychange', visibility);
      paint.current = () => {};
      engine.current = null;
    };
  }, [activity]);

  async function refreshActivity() {
    if (!username || loadState === 'refreshing') return;
    const controller = new AbortController();
    refreshController.current?.abort();
    refreshController.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 10000);
    setLoadState('refreshing');
    setMessage('Refreshing GitHub activity…');
    try {
      const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`, { signal: controller.signal });
      if (!response.ok) throw new Error('Activity is unavailable.');
      setActivity({ days: normalizeActivity(await response.json()), savedAt: new Date().toISOString() });
      setLoadState('ready');
      setMessage('Activity updated. Ready to play.');
    } catch {
      setLoadState(activity ? 'ready' : 'error');
      setMessage(activity ? 'Refresh unavailable. You can still play the saved activity.' : 'GitHub activity is unavailable right now. Please try again later.');
    } finally { window.clearTimeout(timeout); }
  }

  function togglePlay() {
    const game = engine.current;
    if (!game || !game.remaining || loadState === 'refreshing') return;
    game.phase = game.phase === 'running' ? 'paused' : 'running';
    input.current = EMPTY_INPUT();
    syncHud();
    paint.current();
    if (game.phase === 'running') canvas.current.focus({ preventScroll: true });
  }
  function restart() {
    if (!engine.current) return;
    engine.current = createGame(activity.days, engine.current.width);
    input.current = EMPTY_INPUT();
    syncHud();
    paint.current();
  }
  function handleKey(event, pressed) {
    const action = { ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right', ' ': 'fire' }[event.key];
    if (action) {
      event.preventDefault();
      input.current[action] = pressed;
      if (action === 'fire' && pressed) shoot(engine.current);
    } else if (pressed && !event.repeat && ['p', 'P', 'Escape'].includes(event.key)) {
      event.preventDefault();
      if (engine.current?.phase === 'running' || event.key !== 'Escape') togglePlay();
    }
  }
  function touchProps(action) {
    return {
      onPointerDown: (event) => { event.currentTarget.setPointerCapture(event.pointerId); input.current[action] = true; },
      onPointerUp: () => { input.current[action] = false; },
      onPointerCancel: () => { input.current[action] = false; },
      onLostPointerCapture: () => { input.current[action] = false; },
      onClick: () => {
        const game = engine.current;
        if (game?.phase !== 'running') return;
        if (action === 'fire') shoot(game);
        else movePlayer(game, game.playerX + (action === 'left' ? -1 : 1) * game.width * .08);
      },
      onKeyDown: (event) => { if ([' ', 'Enter'].includes(event.key)) { event.preventDefault(); input.current[action] = true; } },
      onKeyUp: () => { input.current[action] = false; },
      onBlur: () => { input.current[action] = false; },
    };
  }

  if (!username) return null;
  const total = activity?.days.reduce((sum, day) => sum + day.count, 0) || 0;
  const playing = hud.phase === 'running';
  return (
    <section id="github-game" className="github-game-section section-anchor" aria-labelledby="github-game-title" tabIndex={-1} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget) && engine.current?.phase === 'running') {
        input.current = EMPTY_INPUT();
        engine.current.phase = 'paused';
        syncHud();
        paint.current();
      }
    }}>
      <SectionHeading number="05" eyebrow="Code, with a little play" title={<span id="github-game-title">A little space for GitHub.</span>}>
        <a className="text-link github-profile-link" href={contact.github} target="_blank" rel="noopener noreferrer"><GithubLogoIcon size={19} aria-hidden="true" />@{username}<ArrowUpRightIcon size={16} aria-hidden="true" /><span className="sr-only"> on GitHub (opens in a new tab)</span></a>
      </SectionHeading>
      <div className="github-game-panel">
        <div className="game-toolbar">
          <div><p className="game-label">CONTRIBUTION INVADERS</p><p className="game-subtitle">My GitHub activity. Your next high score.</p></div>
          <div className="game-stats"><span>Score <strong>{hud.score.toString().padStart(3, '0')}</strong></span><span>Targets <strong>{hud.remaining.toString().padStart(2, '0')}</strong></span></div>
        </div>
        <div className="game-board" ref={board}>
          {activity ? <>
            <canvas ref={canvas} tabIndex={0} aria-label="Contribution Invaders space game" aria-describedby="game-instructions" onKeyDown={(event) => handleKey(event, true)} onKeyUp={(event) => handleKey(event, false)} onBlur={() => { input.current = EMPTY_INPUT(); }} onPointerMove={(event) => { if (engine.current?.phase === 'running' && event.pointerType !== 'touch') { const bounds = event.currentTarget.getBoundingClientRect(); movePlayer(engine.current, (event.clientX - bounds.left) * engine.current.width / bounds.width); } }} onClick={() => { if (engine.current?.phase === 'running') { canvas.current.focus({ preventScroll: true }); shoot(engine.current); } }}>Use the buttons below to move and fire at the contribution squares.</canvas>
            {hud.phase === 'paused' && <div className="game-overlay"><span>Flight paused.</span><small>Resume whenever you’re ready.</small></div>}
            {hud.phase === 'won' && <div className="game-overlay"><span>All clear. Nice flying!</span><small>Final score: {hud.score}</small></div>}
            {hud.phase === 'ready' && hud.remaining === 0 && <div className="game-overlay"><span>A quiet corner of space.</span><small>No active days in this activity snapshot yet.</small></div>}
          </> : <p className="game-loading" role="status">{message}</p>}
        </div>
        <div className="game-controls">
          <div className="game-session-controls">
            <button className="button button-primary" onClick={togglePlay} disabled={!activity || hud.remaining === 0 || hud.phase === 'won' || loadState === 'refreshing'}>{playing ? <PauseIcon size={17} aria-hidden="true" /> : <PlayIcon size={17} aria-hidden="true" />}{playing ? 'Pause game' : hud.phase === 'paused' ? 'Resume game' : 'Play game'}</button>
            <button className="icon-button game-restart" aria-label="Restart game" onClick={restart} disabled={!activity || loadState === 'refreshing'}><ArrowClockwiseIcon size={20} aria-hidden="true" /></button>
          </div>
          <div className="game-touch-controls" role="group" aria-label="Spaceship controls">
            <button className="game-control" aria-label="Move spaceship left" disabled={!playing} {...touchProps('left')}><ArrowLeftIcon size={20} aria-hidden="true" /></button>
            <button className="game-control game-fire" aria-label="Fire laser" disabled={!playing} {...touchProps('fire')}><CrosshairIcon size={19} aria-hidden="true" /><span>Fire</span></button>
            <button className="game-control" aria-label="Move spaceship right" disabled={!playing} {...touchProps('right')}><ArrowRightIcon size={20} aria-hidden="true" /></button>
          </div>
        </div>
        <p id="game-instructions" className="game-instructions">Clear the active squares. Move with <kbd>←</kbd> <kbd>→</kbd> or <kbd>A</kbd> <kbd>D</kbd>, shoot with <kbd>Space</kbd>, and pause with <kbd>P</kbd>. You can also use the buttons above.</p>
        <p className="game-announcement sr-only" role="status">{hud.phase === 'won' ? `All targets cleared. Final score ${hud.score}.` : hud.phase === 'paused' ? 'Game paused.' : hud.phase === 'running' ? 'Game running.' : 'Game ready.'}</p>
      </div>
      <div className="game-meta"><p>{activity && <>{total} contributions in this snapshot · Saved <time dateTime={activity.savedAt}>{new Date(activity.savedAt).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}</time></>}</p><button className="text-link" onClick={refreshActivity} disabled={playing || hud.phase === 'paused' || loadState === 'refreshing'}><ArrowClockwiseIcon size={14} aria-hidden="true" />{loadState === 'refreshing' ? 'Refreshing…' : 'Refresh activity'}</button></div>
      {message && activity && <p className="game-data-message" role="status">{message}</p>}
    </section>
  );
}
