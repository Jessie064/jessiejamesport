import { ArrowUpIcon, CodeIcon } from '@phosphor-icons/react';
import { personal } from '../data/portfolio';

export default function Footer() {
  return (
    <footer className="site-footer container"><p>© {new Date().getFullYear()} {personal.name}</p><span><CodeIcon size={16} />Built with curiosity & a little AI help.</span><a href="#home">Back to top<ArrowUpIcon size={17} /></a></footer>
  );
}
