import type { IconName } from './icons';

export type Project = {
  id: string;
  title: string;
  kind?: string;
  description: string;
  tech: string[];
  demo?: string;
  icon: IconName;
  images: { src: string; alt: string }[];
};

export const projects: Project[] = [
  {
    id: 'job-tracker',
    title: 'Job Application Tracker',
    kind: 'Personal project',
    description:
      'A job hunt organizer with a drag-and-drop board, interview schedule, and a dashboard for response rate and weekly activity. Front-end only, with data saved in the browser.',
    tech: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    demo: '/projects/job-tracker',
    icon: 'jobtrack',
    images: [
      { src: '/projects/job-tracker-dashboard.png', alt: 'Job tracker dashboard with stats and weekly chart' },
      { src: '/projects/job-tracker-board.png', alt: 'Job tracker kanban board of applications by status' },
      { src: '/projects/job-tracker-details.png', alt: 'Job tracker application details with interviews' },
    ],
  },
  {
    id: 'netflix',
    title: 'Netflix Clone',
    kind: 'Clone project',
    description:
      'A Netflix UI clone with a featured billboard, scrollable title rows, a Top 10 row, a details modal, search, and a My List that persists in local storage.',
    tech: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    demo: '/clones/netflix',
    icon: 'netflix',
    images: [
      { src: '/projects/netflix-home.png', alt: 'Netflix clone home screen with featured billboard' },
      { src: '/projects/netflix-details.png', alt: 'Netflix clone title details modal' },
      { src: '/projects/netflix-search.png', alt: 'Netflix clone search results screen' },
    ],
  },
  {
    id: 'spotify',
    title: 'Spotify Clone',
    kind: 'Clone project',
    description:
      'A Spotify web player UI clone with a library sidebar, playlist and album pages, search, liked songs, and a player bar with simulated playback, shuffle, and repeat.',
    tech: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    demo: '/clones/spotify',
    icon: 'spotify',
    images: [
      { src: '/projects/spotify-home.png', alt: 'Spotify clone home screen' },
      { src: '/projects/spotify-playlist.png', alt: 'Spotify clone playlist screen with a track playing' },
      { src: '/projects/spotify-search.png', alt: 'Spotify clone search and browse screen' },
    ],
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce Admin Dashboard',
    description:
      'A full-featured admin panel for managing products, orders, and inventory with real-time sales analytics and reporting.',
    tech: ['Laravel', 'Vue.js', 'MySQL', 'Tailwind CSS'],
    icon: 'cart',
    images: [
      { src: '/projects/ecommerce-dashboard.png', alt: 'E-commerce dashboard analytics screen' },
      { src: '/projects/ecommerce-products.png', alt: 'E-commerce product catalog screen' },
      { src: '/projects/ecommerce-orders.png', alt: 'E-commerce orders management screen' },
    ],
  },
];

export const skillGroups = [
  {
    title: 'Front end',
    skills: [
      'HTML & CSS',
      'JavaScript',
      'TypeScript',
      'React',
      'Next.js',
      'Vue.js',
      'Angular',
      'Ionic',
      'Tailwind CSS',
      'Bootstrap',
      'jQuery',
      'CoreUI',
    ],
  },
  {
    title: 'Back end',
    skills: ['PHP', 'Laravel', 'Livewire', 'Inertia.js', 'Node.js', 'REST APIs', 'Socket.io', 'Python', 'Java'],
  },
  {
    title: 'Databases',
    skills: ['MySQL', 'PostgreSQL', 'SQL Server', 'MongoDB'],
  },
  {
    title: 'Tools',
    skills: ['Git', 'GitHub', 'GitLab', 'Supabase', 'Azure', 'DigitalOcean'],
  },
];

export const facts = [
  { term: 'Based in', value: 'Philippines' },
  { term: 'Focus', value: 'Full stack web apps' },
  { term: 'Main stack', value: 'Laravel, React, Next.js, Vue' },
  { term: 'Available for', value: 'Full-time roles and freelance' },
];

export const EMAIL = 'naglejohnhendrix@gmail.com';

export const socialLinks = [
  { name: 'GitHub', url: 'https://github.com/hendrix034' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/john-hendrix-nagle-61a410216/' },
  { name: 'Upwork', url: 'https://www.upwork.com/freelancers/~01e313a2e4a2a2aa4f' },
];
