import { ArrowDownIcon, ArrowDownRightIcon, ArrowRightIcon, AsteriskIcon, MapPinIcon, CodeIcon } from '@phosphor-icons/react';
import { personal } from '../data/portfolio';
import TypingName from './TypingName';
import Skeleton from './Skeleton';

function TextSkeleton({ children, paragraph = false }) {
  return <span className={`hero-text-skeleton${paragraph ? ' hero-paragraph-skeleton' : ''}`}><span className="skeleton-reserve">{children}</span><Skeleton as="span" width="100%" height={paragraph ? '100%' : '.78em'} borderRadius={4} /></span>;
}

export default function Hero({ loading = false }) {
  const Action = loading ? 'span' : 'a';
  return (
    <section id="home" className={`hero section-anchor${loading ? ' hero-loading' : ''}`} aria-labelledby={loading ? undefined : 'hero-title'} aria-hidden={loading || undefined} tabIndex={loading ? undefined : -1}>
      <div className="hero-main">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow"><span className="status-dot" />{loading ? <TextSkeleton>A student. A builder. Always curious.</TextSkeleton> : 'A student. A builder. Always curious.'}</p>
          {loading ? <h1><span className="typing-line"><TextSkeleton>{personal.firstName}</TextSkeleton></span><span className="typing-line"><TextSkeleton>{personal.lastName}.</TextSkeleton></span></h1> : <TypingName firstName={personal.firstName} lastName={personal.lastName} />}
          <p className="hero-role">{loading ? <TextSkeleton>{personal.role}</TextSkeleton> : personal.role}</p>
          <p className="hero-description">{loading ? <TextSkeleton paragraph>{personal.introduction}</TextSkeleton> : personal.introduction}</p>
          <div className="hero-buttons flex flex-wrap items-center gap-3">
            <Action href={loading ? undefined : '#projects'} className={`button button-primary${loading ? ' skeleton-bone hero-button-skeleton' : ''}`}>View Projects <ArrowDownRightIcon size={19} />{loading && <span className="skeleton-shimmer" />}</Action>
            <Action href={loading ? undefined : '#about'} className={`button button-secondary${loading ? ' skeleton-bone hero-button-skeleton' : ''}`}>About Me <ArrowRightIcon size={18} />{loading && <span className="skeleton-shimmer" />}</Action>
          </div>
        </div>
        {personal.heroPortrait ? (
          <figure className="hero-profile">
            {loading ? <Skeleton width="100%" height="100%" borderRadius="50%" className="hero-photo-skeleton" /> : <img className="hero-portrait" src={personal.heroPortrait} alt={personal.heroPortraitAlt} width="692" height="689" fetchPriority="high" />}
          </figure>
        ) : (
          <figure className="hero-art" aria-label="An original typographic composition of the initials JP">
            <div className="art-top"><span>LEARNING BY BUILDING</span><CodeIcon size={22} /></div>
            <div className="monogram-disc"><span>{personal.initials}<span className="monogram-dot">.</span></span></div>
            <div className="art-bottom"><AsteriskIcon size={35} weight="light" /><span>A work in progress.<br />In the best way.</span><ArrowDownRightIcon size={25} weight="light" /></div>
            <figcaption>THE DEVELOPER JOURNEY / CHAPTER 01</figcaption>
          </figure>
        )}
      </div>
      <div className="hero-footer">
        <span className="location"><MapPinIcon size={17} />{loading ? <TextSkeleton>{personal.location}</TextSkeleton> : personal.location}</span>
        <span className="hero-note">{loading ? <TextSkeleton>{personal.heroNote}</TextSkeleton> : personal.heroNote}</span>
        <Action href={loading ? undefined : '#about'} className="scroll-link">{loading ? <TextSkeleton>Scroll to explore</TextSkeleton> : 'Scroll to explore'} <ArrowDownIcon size={16} /></Action>
      </div>
    </section>
  );
}
