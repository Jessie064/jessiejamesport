import { ArrowUpRightIcon, PlantIcon, DesktopTowerIcon, ChatCircleDotsIcon, ImageIcon } from '@phosphor-icons/react';
import { validWebUrl } from '../data/portfolio';

const projectIcons = { plant: PlantIcon, desktop: DesktopTowerIcon, chat: ChatCircleDotsIcon };

export function ProjectImage({ project }) {
  const Icon = projectIcons[project.icon] || DesktopTowerIcon;
  return (
    <div className={`project-image project-image-${project.icon}`}>
      {project.screenshot ? <img src={project.screenshot} alt={project.screenshotAlt} loading="lazy" width="800" height="500" /> : <>
        <div className="project-image-top"><span>PROJECT {project.number}</span><Icon size={23} weight="light" /></div>
        <div className="project-symbol" aria-hidden="true"><Icon size={72} weight="light" /></div>
        <span className="screenshot-label"><ImageIcon size={14} />Screenshot placeholder</span>
      </>}
    </div>
  );
}

export function ProjectLinks({ project }) {
  const links = [{ url: project.demoUrl, label: 'Live demo' }, { url: project.sourceUrl, label: 'Source code' }].filter(({ url }) => validWebUrl(url));
  return links.length > 0 ? <div className="project-links">{links.map(({ url, label }) => <a className="text-link" key={label} href={url} target="_blank" rel="noopener noreferrer">{label}<ArrowUpRightIcon size={17} /><span className="sr-only"> for {project.title} (opens in a new tab)</span></a>)}</div> : null;
}

export default function ProjectCard({ project, onOpen }) {
  return (
    <article className="project-card">
      <ProjectImage project={project} />
      <div className="project-copy">
        <p className="project-kind">{project.kind}</p>
        <h3>{project.title}</h3>
        <p className="project-description">{project.description}</p>
        <ul className="tags project-tags" aria-label={`Technologies for ${project.title}`}>{project.technologies.map((tech) => <li key={tech}>{tech}</li>)}</ul>
        <p className="project-contribution"><strong>My contribution</strong>{project.contribution}</p>
        <p className="project-status"><span className="tiny-dot" />{project.status}</p>
        <ProjectLinks project={project} />
        <button className="project-details-button" onClick={() => onOpen(project)} aria-label={`View details for ${project.title}`}>Explore project<ArrowUpRightIcon size={19} /></button>
      </div>
    </article>
  );
}
