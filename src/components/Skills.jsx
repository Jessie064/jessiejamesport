import { BrowsersIcon, DatabaseIcon, WrenchIcon, SparkleIcon, ArrowUpRightIcon, InfoIcon } from '@phosphor-icons/react';
import { skills } from '../data/portfolio';
import SectionHeading from './SectionHeading';
import TechnologyIcon from './TechnologyIcon';

const groupIcons = { frontend: BrowsersIcon, backend: DatabaseIcon, tools: WrenchIcon, ai: SparkleIcon };

export default function Skills() {
  return (
    <section id="skills" className="content-section section-anchor" aria-labelledby="skills-title" tabIndex={-1}>
      <SectionHeading number="02" eyebrow="My growing toolkit" title={<span id="skills-title">Learning the building blocks.</span>}><p>A mix of classroom learning,<br className="desktop-break" /> personal practice, and curiosity.</p></SectionHeading>
      <div className="skills-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {skills.groups.map((group) => {
          const Icon = groupIcons[group.id] || WrenchIcon;
          return <article className="skill-group" key={group.id}>
            <div className="skill-group-top"><span className="skill-icon"><Icon size={25} weight="light" /></span><ArrowUpRightIcon size={18} className="muted-icon" /></div>
            <h3>{group.title}</h3><p className="skill-description">{group.description}</p>
            <ul className="tags skill-tags" aria-label={`${group.title} technologies`}>{group.items.map((item) => <li key={item}><TechnologyIcon name={item} /><span>{item}</span></li>)}</ul>
            <p className="skill-level"><span className="tiny-dot" />{group.level}</p>
          </article>;
        })}
      </div>
      <p className="draft-note"><InfoIcon size={16} /><span>{skills.note}</span></p>
    </section>
  );
}
