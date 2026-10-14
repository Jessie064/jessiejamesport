import { useEffect, useRef, useState } from 'react';
import { ListIcon, XIcon, MoonIcon, SunIcon, ArrowUpRightIcon } from '@phosphor-icons/react';
import { navigation, personal } from '../data/portfolio';
import { useTheme } from '../hooks/useTheme';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  const menuButton = useRef(null);
  const header = useRef(null);

  useEffect(() => {
    const updateActive = () => {
      if (document.querySelector('main[aria-busy="true"]')) { setActive('home'); return; }
      const marker = window.scrollY + 160;
      let current = 'home';
      for (const item of navigation) {
        if (document.getElementById(item.id)?.offsetTop <= marker) current = item.id;
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 20) current = 'contact';
      setActive(current);
    };
    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
    return () => window.removeEventListener('scroll', updateActive);
  }, []);

  useEffect(() => {
    const breakpoint = window.matchMedia('(min-width: 768px)');
    const closeOnDesktop = () => { if (breakpoint.matches) setOpen(false); };
    breakpoint.addEventListener('change', closeOnDesktop);
    return () => breakpoint.removeEventListener('change', closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event) => {
      if (event.key === 'Escape') { setOpen(false); menuButton.current?.focus(); }
    };
    const onOutside = (event) => { if (!header.current?.contains(event.target)) setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onOutside);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onOutside);
    };
  }, [open]);

  const closeAndNavigate = (event, id) => {
    if (!open) return;
    event.preventDefault();
    setOpen(false);
    const target = document.getElementById(id);
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    history.replaceState(null, '', `#${id}`);
  };

  return (
    <header className="site-header" ref={header}>
      <div className="container nav-inner">
        <a className="wordmark" href="#home" aria-label={`${personal.name}, home`}>
          {personal.wordmark}<span>.</span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map(({ id, label }) => (
            <a href={`#${id}`} key={id} className={active === id ? 'active' : ''} aria-current={active === id ? 'location' : undefined}>{label}</a>
          ))}
        </nav>
        <div className="nav-actions flex items-center gap-2">
          <button className="icon-button theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>
            {theme === 'light' ? <MoonIcon size={20} /> : <SunIcon size={20} />}
          </button>
          <a href="#contact" className="nav-contact">Let’s connect <ArrowUpRightIcon size={16} /></a>
          <button ref={menuButton} className="icon-button menu-toggle" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>
            {open ? <XIcon size={23} /> : <ListIcon size={23} />}
          </button>
        </div>
      </div>
      <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation" hidden={!open}>
        {navigation.map(({ id, label }, index) => (
          <a href={`#${id}`} key={id} onClick={(event) => closeAndNavigate(event, id)} aria-current={active === id ? 'location' : undefined}>
            <span><span className="mobile-nav-number">0{index + 1}</span>{label}</span><ArrowUpRightIcon size={18} />
          </a>
        ))}
      </nav>
    </header>
  );
}
