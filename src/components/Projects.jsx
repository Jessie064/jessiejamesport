import { useState } from 'react';
import { projects, projectCategories } from '../data/portfolio';
import SectionHeading from './SectionHeading';
import ProjectCard from './ProjectCard';
import ProjectDetails from './ProjectDetails';

export default function Projects() {
  const [category, setCategory] = useState('All projects');
  const [selected, setSelected] = useState(null);
  const filtered = projects.filter((project) => category === 'All projects' || project.category === category);
  return (
    <section id="projects" className="content-section section-anchor" aria-labelledby="projects-title" tabIndex={-1}>
      <SectionHeading number="03" eyebrow="Ideas into practice" title={<span id="projects-title">Things I’m working on.</span>}><p>Client work and school projects.<br className="desktop-break" /> Each one is a chance to learn.</p></SectionHeading>
      <div className="project-toolbar"><div className="project-filters" role="group" aria-label="Filter projects">{projectCategories.map((item) => <button key={item} className={category === item ? 'filter-button selected' : 'filter-button'} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}{item === 'All projects' && <span>{projects.length.toString().padStart(2, '0')}</span>}</button>)}</div><span className="project-count" role="status">{filtered.length} {filtered.length === 1 ? 'project' : 'projects'}</span></div>
      <div className="projects-grid grid grid-cols-1 md:grid-cols-2">{filtered.map((project) => <ProjectCard key={project.id} project={project} onOpen={setSelected} />)}</div>
      {selected && <ProjectDetails project={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
