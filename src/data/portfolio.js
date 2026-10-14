// Personal facts, draft skills, projects, and contact links live here.
// Confirm draft skills, project status, and contributions before public submission.
export const personal = {
  name: 'Jessie James Pepito',
  firstName: 'Jessie James',
  lastName: 'Pepito',
  initials: 'JP',
  wordmark: 'jessie',
  role: 'BSIT Student & Aspiring Web Developer',
  location: 'Cebu City, Philippines',
  school: 'Cebu Eastern College',
  degree: 'BS Information Technology',
  introduction: 'I’m an IT student based in Cebu, learning to build practical and user-friendly web applications.',
  heroNote: 'Curiosity first. One project at a time.',
  heroPortrait: '/images/moy.jpg',
  heroPortraitAlt: 'Portrait of Jessie James Pepito',
  portrait: '/images/moy.jpg',
  portraitAlt: 'Portrait of Jessie James Pepito',
  about: [
    'Hi, I’m Jessie — an Information Technology student at Cebu Eastern College, Cebu City, with a growing interest in web development.',
    'Through classwork and personal practice, I’m learning how ideas become useful applications. I enjoy working through problems, making interfaces easier to use, and understanding what happens behind the scenes.',
    'I’m still building my foundations. This portfolio is a place to share what I’m working on and how I’m learning along the way.',
  ],
  learningNote: 'Turning the things I learn into things I can build.',
};

export const navigation = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

export const skills = {
  note: 'A growing toolkit. These are draft learning areas, not claims of mastery.',
  groups: [
    {
      id: 'frontend', title: 'Frontend', description: 'Bringing interfaces to life.',
      level: 'Learning & practicing',
      items: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind CSS'],
    },
    {
      id: 'backend', title: 'Backend', description: 'Exploring what powers the web.',
      level: 'Learning',
      items: ['Python', 'Django', 'Node.js', 'C# / ASP.NET Core'],
    },
    {
      id: 'tools', title: 'Tools & databases', description: 'Supporting the development process.',
      level: 'Learning & practicing',
      items: ['Git', 'GitHub', 'VS Code', 'MySQL', 'Supabase'],
    },
    {
      id: 'ai', title: 'AI tools', description: 'Exploring ideas and supporting my learning.',
      level: 'Learning & experimenting',
      items: ['Claude', 'ChatGPT', 'DeepSeek', 'Gemini'],
    },
  ],
};

export const projectCategories = ['All projects', 'Practice', 'Client work'];

export const projects = [
  {
    id: 'lab-monitoring', number: '01', title: 'Computer Laboratory Monitoring System', category: 'Practice',
    kind: 'Web application · Management', icon: 'desktop',
    description: 'A school project built with Node.js and MySQL for managing computers, staff, and incident records in a computer laboratory.',
    technologies: ['Node.js', 'MySQL'],
    contribution: 'I built this school project, developing the web interface, Node.js backend, and MySQL database integration to manage computer, staff, and incident records.',
    status: 'School project',
    overview: 'Computer Laboratory Monitoring System is my school project built with Node.js and MySQL. It focuses on organizing computer laboratory records, including computers, staff, and incidents, while applying what I learn about web development and databases.',
    learning: 'Exploring the relationship between application logic and structured data.',
    screenshot: '/images/computer.png', screenshotAlt: 'Computer Laboratory Monitoring System school project screenshot',
    demoUrl: null, sourceUrl: null,
  },
  {
    id: 'moldezai', number: '02', title: 'MoldezAI', category: 'Client work',
    kind: 'Web application · AI', icon: 'chat',
    description: 'A chatbot application I am developing solo for a client using Django, AI API integration, and chat history.',
    technologies: ['Python', 'Django', 'AI API'],
    contribution: 'As the sole developer, I handle the chatbot interface, Python and Django backend, AI API integration, and chat history. I bring these parts together into one web application for my client.',
    status: 'Client project · In development · Solo developer',
    overview: 'MoldezAI is a chatbot web application I am developing independently for a client. The project combines a Django backend with an external AI API and chat history to support ongoing conversations.',
    learning: 'Building a complete chatbot application around client needs while connecting the interface, backend, and external AI API.',
    screenshot: '/images/moldezai.png',
    screenshotAlt: 'MoldezAI chatbot interface',
    demoUrl: null, sourceUrl: null,
  },
];

export const contact = {
  heading: 'Good things start with a hello.',
  introduction: 'Have a question about a project, or just want to connect? I’d be happy to hear from you.',
  facebook: 'https://www.facebook.com/jessiejamespepito2002',
  email: 'jessiejames.pepito064@gmail.com',
  github: 'https://github.com/Jessie064',
  linkedin: null, // Your real https://www.linkedin.com/in/... URL.
  pendingMessage: 'Contact details coming soon',
};

// Render external links only after a real, safe web URL is supplied.
export function validWebUrl(value) {
  if (!value) return false;
  try { return ['http:', 'https:'].includes(new URL(value).protocol); }
  catch { return false; }
}

export function validEmail(value) {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && !/[\r\n]/.test(value);
}
