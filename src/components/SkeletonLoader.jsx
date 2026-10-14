import { motion, useReducedMotion } from 'motion/react';
import Skeleton from './Skeleton';
import Hero from './Hero';
export { default as Skeleton } from './Skeleton';

/* ────────────────────────────────────────────
 * Core Skeleton bone
 * Mirrors @motion/loader-skeleton behaviour:
 *   - compositor-only shimmer sweep
 *   - theme-aware base/highlight via CSS vars
 *   - respects prefers-reduced-motion
 * ──────────────────────────────────────────── */

/* ────────────────────────────────────────────
 * SkeletonReveal — crossfade from skeleton → real content
 * Mirrors @motion/loader-skeleton's <SkeletonReveal />.
 * ──────────────────────────────────────────── */
export function SkeletonReveal({ loading, skeleton, children }) {
  const reducedMotion = useReducedMotion();
  return (
    <div className="skeleton-reveal">
      {loading ? (
        <motion.div
          key="skeleton"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          {skeleton}
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={reducedMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.4, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}

export function PortfolioLoadingScreen() {
  return (
    <div className="portfolio-loading-screen">
      <Hero loading />
      <p className="loader-status" role="status"><span className="loader-status-dot" aria-hidden="true" />Loading portfolio<span className="sr-only">. Preparing Jessie James Pepito’s website.</span></p>
    </div>
  );
}

/* ────────────────────────────────────────────
 * Section-specific skeleton presets
 * ──────────────────────────────────────────── */

export function HeroSkeleton() {
  return (
    <section className="hero skeleton-hero" aria-busy="true" aria-label="Loading hero section">
      <div className="hero-main">
        <div className="hero-copy">
          <Skeleton width={260} height={16} borderRadius={20} />
          <div style={{ marginTop: 20 }}>
            <Skeleton width="80%" height={52} borderRadius={8} />
          </div>
          <div style={{ marginTop: 6 }}>
            <Skeleton width="60%" height={52} borderRadius={8} />
          </div>
          <div style={{ marginTop: 20 }}>
            <Skeleton width={180} height={20} borderRadius={6} />
          </div>
          <div style={{ marginTop: 14 }}>
            <Skeleton width="90%" height={16} borderRadius={6} />
            <Skeleton width="75%" height={16} borderRadius={6} style={{ marginTop: 10 }} />
          </div>
          <div className="skeleton-buttons">
            <Skeleton width={160} height={47} borderRadius={5} />
            <Skeleton width={130} height={47} borderRadius={5} />
          </div>
        </div>
        <div className="skeleton-portrait-wrap">
          <Skeleton circle height={320} />
        </div>
      </div>
    </section>
  );
}

export function AboutSkeleton() {
  return (
    <div className="content-section skeleton-about" aria-busy="true" aria-label="Loading about section">
      <div className="skeleton-section-heading">
        <div>
          <Skeleton width={100} height={12} borderRadius={4} />
          <Skeleton width={280} height={28} borderRadius={6} style={{ marginTop: 12 }} />
        </div>
      </div>
      <div className="about-grid">
        <div className="skeleton-portrait-box">
          <Skeleton width="100%" height={320} borderRadius={3} />
          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
            <Skeleton width="40%" height={12} borderRadius={4} />
            <Skeleton width="30%" height={12} borderRadius={4} />
          </div>
        </div>
        <div className="skeleton-about-copy">
          <Skeleton count={3} width="100%" height={16} borderRadius={6} gap={10} />
          <Skeleton width="70%" height={16} borderRadius={6} style={{ marginTop: 10 }} />
          <Skeleton count={2} width="100%" height={14} borderRadius={6} gap={10} style={{ marginTop: 18 }} />
          <div className="skeleton-education-row">
            <Skeleton circle height={44} />
            <div style={{ flex: 1 }}>
              <Skeleton width="60%" height={16} borderRadius={6} />
              <Skeleton width="40%" height={13} borderRadius={6} style={{ marginTop: 6 }} />
            </div>
            <Skeleton width={64} height={28} borderRadius={20} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProjectCardSkeleton({ count = 4 }) {
  return (
    <div className="content-section skeleton-projects" aria-busy="true" aria-label="Loading projects">
      <div className="skeleton-section-heading">
        <div>
          <Skeleton width={100} height={12} borderRadius={4} />
          <Skeleton width={250} height={28} borderRadius={6} style={{ marginTop: 12 }} />
        </div>
      </div>
      <div className="skeleton-toolbar">
        <div className="skeleton-filters">
          {[100, 80, 70, 90].map((w, i) => (
            <Skeleton key={i} width={w} height={38} borderRadius={4} />
          ))}
        </div>
        <Skeleton width={70} height={14} borderRadius={4} />
      </div>
      <div className="projects-grid grid grid-cols-1 md:grid-cols-2 skeleton-cards">
        {Array.from({ length: count }).map((_, i) => (
          <motion.article
            className="project-card skeleton-project-card"
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
          >
            <div className="skeleton-project-image">
              <Skeleton width="100%" height="100%" borderRadius={0} />
            </div>
            <div className="project-copy">
              <Skeleton width={70} height={12} borderRadius={4} />
              <Skeleton width="75%" height={20} borderRadius={6} style={{ marginTop: 10 }} />
              <Skeleton count={2} width="100%" height={13} borderRadius={6} gap={8} style={{ marginTop: 10 }} />
              <div className="skeleton-tags">
                {Array.from({ length: 3 }).map((_, j) => (
                  <Skeleton key={j} width={60 + j * 8} height={26} borderRadius={3} />
                ))}
              </div>
              <Skeleton width="100%" height={13} borderRadius={6} style={{ marginTop: 18 }} />
              <Skeleton width="80%" height={13} borderRadius={6} style={{ marginTop: 6 }} />
              <Skeleton width={140} height={40} borderRadius={5} style={{ marginTop: 18 }} />
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

export function SkillsSkeleton() {
  return (
    <div className="content-section skeleton-skills-section" aria-busy="true" aria-label="Loading skills">
      <div className="skeleton-section-heading">
        <div>
          <Skeleton width={100} height={12} borderRadius={4} />
          <Skeleton width={270} height={28} borderRadius={6} style={{ marginTop: 12 }} />
        </div>
      </div>
      <div className="skills-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 skeleton-skills">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.article
            className="skill-group"
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: i * 0.07 }}
          >
            <div className="skill-group-top">
              <Skeleton width={44} height={44} borderRadius={6} />
              <Skeleton width={18} height={18} borderRadius={4} />
            </div>
            <Skeleton width="65%" height={18} borderRadius={6} />
            <Skeleton count={2} width="100%" height={12} borderRadius={6} gap={6} style={{ marginTop: 8 }} />
            <div className="skeleton-tags">
              {Array.from({ length: 4 }).map((_, j) => (
                <Skeleton key={j} width={65 + j * 6} height={34} borderRadius={3} />
              ))}
            </div>
            <div style={{ marginTop: 'auto', paddingTop: 22 }}>
              <Skeleton width={100} height={12} borderRadius={6} />
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

export function GithubGameSkeleton() {
  return (
    <div className="github-game-section skeleton-game-section" aria-busy="true" aria-label="Loading GitHub game">
      <div className="skeleton-section-heading">
        <div>
          <Skeleton width={100} height={12} borderRadius={4} />
          <Skeleton width={280} height={28} borderRadius={6} style={{ marginTop: 12 }} />
        </div>
      </div>
      <div className="github-game-panel skeleton-game">
        <div className="game-toolbar">
          <div>
            <Skeleton width={200} height={14} borderRadius={6} />
            <Skeleton width={280} height={13} borderRadius={6} style={{ marginTop: 8 }} />
          </div>
          <div className="game-stats" style={{ gap: 16 }}>
            <Skeleton width={80} height={14} borderRadius={6} />
            <Skeleton width={80} height={14} borderRadius={6} />
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <Skeleton width="100%" height={260} borderRadius={4} />
        </div>
        <div className="skeleton-buttons" style={{ marginTop: 14 }}>
          <Skeleton width={140} height={47} borderRadius={5} />
          <Skeleton circle height={44} />
        </div>
      </div>
    </div>
  );
}

/**
 * Full-page skeleton — mirrors the entire portfolio layout.
 * Drop this into App.jsx inside a loading state or Suspense boundary.
 */
export default function FullPageSkeleton() {
  return (
    <div className="container skeleton-page">
      <HeroSkeleton />
      <AboutSkeleton />
      <SkillsSkeleton />
      <ProjectCardSkeleton />
      <GithubGameSkeleton />
    </div>
  );
}
