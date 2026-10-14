import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { XIcon, ArrowUpRightIcon } from '@phosphor-icons/react';
import { ProjectImage, ProjectLinks } from './ProjectCard';
import { validWebUrl } from '../data/portfolio';

export default function ProjectDetails({ project, onClose }) {
  const dialog = useRef(null);
  useEffect(() => {
    const element = dialog.current;
    const trigger = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, []);
  const hasLinks = validWebUrl(project.demoUrl) || validWebUrl(project.sourceUrl);
  return createPortal(
    <dialog ref={dialog} className="project-dialog" aria-labelledby="project-dialog-title" aria-describedby="project-dialog-description" onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => {
      if (event.target === event.currentTarget) {
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
      }
    }}>
      <div className="dialog-heading"><span className="eyebrow">PROJECT {project.number} / {project.category}</span><button className="icon-button" autoFocus onClick={onClose} aria-label="Close project details"><XIcon size={23} /></button></div>
      <ProjectImage project={project} />
      <div className="dialog-body">
        <p className="project-kind">{project.kind}</p>
        <h2 id="project-dialog-title">{project.title}</h2>
        <p id="project-dialog-description">{project.overview}</p>
        <ul className="tags">{project.technologies.map((tech) => <li key={tech}>{tech}</li>)}</ul>
        <div className="detail-block"><h3>My contribution</h3><p>{project.contribution}</p></div>
        <div className="detail-block"><h3>Learning focus</h3><p>{project.learning}</p></div>
        <div className="detail-block"><h3>Project status</h3><p>{project.status}</p></div>
        {hasLinks ? <ProjectLinks project={project} /> : <p className="dialog-pending"><ArrowUpRightIcon size={17} />Demo and source links will be added when available.</p>}
      </div>
    </dialog>, document.body,
  );
}
