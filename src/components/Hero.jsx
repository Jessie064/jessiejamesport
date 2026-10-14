import { ArrowDownIcon, ArrowDownRightIcon, ArrowRightIcon, AsteriskIcon, MapPinIcon, CodeIcon } from '@phosphor-icons/react';
import { personal } from '../data/portfolio';
import TypingName from './TypingName';

export default function Hero() {
  return (
    <section id="home" className="hero section-anchor" aria-labelledby="hero-title" tabIndex={-1}>
      <div className="hero-main">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow"><span className="status-dot" />A student. A builder. Always curious.</p>
          <TypingName firstName={personal.firstName} lastName={personal.lastName} />
          <p className="hero-role">{personal.role}</p>
          <p className="hero-description">{personal.introduction}</p>
          <div className="hero-buttons flex flex-wrap items-center gap-3">
            <a href="#projects" className="button button-primary">View Projects <ArrowDownRightIcon size={19} /></a>
            <a href="#about" className="button button-secondary">About Me <ArrowRightIcon size={18} /></a>
          </div>
        </div>
        {personal.heroPortrait ? (
          <figure className="hero-profile">
            <img className="hero-portrait" src={personal.heroPortrait} alt={personal.heroPortraitAlt} width="692" height="689" fetchPriority="high" />
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
        <span className="location"><MapPinIcon size={17} />{personal.location}</span>
        <span className="hero-note">{personal.heroNote}</span>
        <a href="#about" className="scroll-link">Scroll to explore <ArrowDownIcon size={16} /></a>
      </div>
    </section>
  );
}
