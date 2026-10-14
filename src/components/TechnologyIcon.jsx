import { CodeIcon } from '@phosphor-icons/react';
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiReact,
  SiTailwindcss,
  SiPython,
  SiDjango,
  SiNodedotjs,
  SiGit,
  SiGithub,
  SiMysql,
  SiSupabase,
  SiClaude,
  SiDeepseek,
  SiGooglegemini,
} from 'react-icons/si';
import { TbBrandCSharp, TbBrandOpenai } from 'react-icons/tb';
import { VscVscode } from 'react-icons/vsc';

// Keep labels editable in portfolio.js; map their matching logos here.
const technologyIcons = {
  HTML: SiHtml5,
  CSS: SiCss,
  JavaScript: SiJavascript,
  React: SiReact,
  'Tailwind CSS': SiTailwindcss,
  Python: SiPython,
  Django: SiDjango,
  'Node.js': SiNodedotjs,
  'C# / ASP.NET Core': TbBrandCSharp,
  Git: SiGit,
  GitHub: SiGithub,
  'VS Code': VscVscode,
  MySQL: SiMysql,
  Supabase: SiSupabase,
  Claude: SiClaude,
  ChatGPT: TbBrandOpenai,
  DeepSeek: SiDeepseek,
  Gemini: SiGooglegemini,
};

export default function TechnologyIcon({ name }) {
  const Icon = technologyIcons[name] || CodeIcon;
  return <Icon className="technology-icon" size={17} aria-hidden="true" focusable="false" />;
}
