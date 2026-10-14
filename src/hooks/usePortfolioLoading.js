import { useEffect, useState } from 'react';
import { personal } from '../data/portfolio';

export default function usePortfolioLoading() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let minimumTimer;
    const reveal = () => { if (active) setLoading(false); };
    // Fail open if an asset hangs; the portfolio must remain usable.
    const fallbackTimer = window.setTimeout(reveal, 3500);
    const minimum = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 700;
    const briefPreview = new Promise((resolve) => { minimumTimer = window.setTimeout(resolve, minimum); });
    const portrait = new Image();
    let portraitReady = Promise.resolve();
    if (personal.heroPortrait) {
      portrait.src = personal.heroPortrait;
      portraitReady = portrait.decode();
    }

    Promise.allSettled([document.fonts?.ready || Promise.resolve(), portraitReady, briefPreview]).then(() => {
      window.clearTimeout(fallbackTimer);
      reveal();
    });
    return () => {
      active = false;
      window.clearTimeout(minimumTimer);
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  return loading;
}
