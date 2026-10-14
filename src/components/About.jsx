import { GraduationCapIcon, ArrowUpRightIcon, CodeIcon } from '@phosphor-icons/react';
import { personal } from '../data/portfolio';
import SectionHeading from './SectionHeading';

export default function About() {
  return (
    <section id="about" className="content-section section-anchor" aria-labelledby="about-title" tabIndex={-1}>
      <SectionHeading number="01" eyebrow="A little about me" title={<span id="about-title">Curious mind. Builder at heart.</span>} />
      <div className="about-grid">
        <figure className="portrait">
          {personal.portrait ? <img src={personal.portrait} alt={personal.portraitAlt} loading="lazy" width="540" height="540" /> : (
            <div className="portrait-placeholder" role="img" aria-label="Portrait placeholder with the initials JP">
              <span className="portrait-corner">HELLO, I’M JESSIE</span>
              <span className="portrait-initials">{personal.initials}<span>.</span></span>
              <span className="portrait-placeholder-note">A face to the name, soon.</span>
            </div>
          )}
          <figcaption><span>{personal.name}</span><span>{personal.portrait ? 'IT student & aspiring developer' : 'Portrait coming soon'}<ArrowUpRightIcon size={15} /></span></figcaption>
        </figure>
        <div className="about-copy">
          {personal.about.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
          <div className="education-row"><GraduationCapIcon size={27} weight="light" /><div><h3>{personal.school}</h3><p>{personal.degree}</p></div><span className="small-badge">Student</span></div>
          <div className="learning-note"><CodeIcon size={20} /><span>{personal.learningNote}</span></div>
        </div>
      </div>
    </section>
  );
}
