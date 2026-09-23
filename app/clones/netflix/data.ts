import type { Motif } from '../_shared/CoverArt';

export type Genre = 'Action' | 'Comedy' | 'Drama' | 'Sci-Fi' | 'Thriller' | 'Documentary';

export type Title = {
  id: string;
  name: string;
  kind: 'Movie' | 'Series';
  year: number;
  maturity: string;
  runtime: string;
  match: number;
  genres: Genre[];
  description: string;
  cast: string[];
  palette: [string, string];
  motif: Motif;
};

export type Tab = 'home' | 'shows' | 'movies' | 'new' | 'mylist';

export const tabs: { id: Tab; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'shows', label: 'TV Shows' },
  { id: 'movies', label: 'Movies' },
  { id: 'new', label: 'New & Popular' },
  { id: 'mylist', label: 'My List' },
];

export function isTab(value: string | null): value is Tab {
  return tabs.some((tab) => tab.id === value);
}

// All titles, cast names, and artwork are fictional.
export const titles: Title[] = [
  {
    id: 'the-last-harbor',
    name: 'The Last Harbor',
    kind: 'Series',
    year: 2026,
    maturity: 'TV-MA',
    runtime: '2 Seasons',
    match: 98,
    genres: ['Drama', 'Thriller'],
    description:
      'When a storm cuts off a fishing town from the mainland, its harbor master uncovers a smuggling ring that reaches every family on the island.',
    cast: ['Andrea Villanueva', 'Marco Delos Santos', 'Ines Tan'],
    palette: ['#0f2027', '#2c5364'],
    motif: 'waves',
  },
  {
    id: 'neon-district',
    name: 'Neon District',
    kind: 'Movie',
    year: 2025,
    maturity: 'R',
    runtime: '2h 7m',
    match: 95,
    genres: ['Action', 'Sci-Fi'],
    description:
      'A courier carrying a stolen memory chip has one night to cross a city where every street camera is hunting her.',
    cast: ['Kira Navarro', 'Joel Ramos', 'Hana Lim'],
    palette: ['#3a0ca3', '#f72585'],
    motif: 'grid',
  },
  {
    id: 'salt-and-stone',
    name: 'Salt & Stone',
    kind: 'Movie',
    year: 2024,
    maturity: 'PG',
    runtime: '1h 32m',
    match: 91,
    genres: ['Documentary'],
    description:
      'Salt farmers on the coast and stonemasons in the mountains keep centuries-old crafts alive as the climate around them changes.',
    cast: ['Narrated by Lorna Bautista'],
    palette: ['#5f4b32', '#c9a66b'],
    motif: 'peaks',
  },
  {
    id: 'midnight-jeepney',
    name: 'Midnight Jeepney',
    kind: 'Movie',
    year: 2025,
    maturity: 'PG-13',
    runtime: '1h 48m',
    match: 93,
    genres: ['Comedy'],
    description:
      'On his last shift before retiring, a jeepney driver picks up five strangers who all need to reach the same wedding before sunrise.',
    cast: ['Ramon Aquino', 'Bea Salazar', 'Tonton Reyes'],
    palette: ['#ff512f', '#dd2476'],
    motif: 'city',
  },
  {
    id: 'orbiters',
    name: 'Orbiters',
    kind: 'Series',
    year: 2026,
    maturity: 'TV-14',
    runtime: '3 Seasons',
    match: 97,
    genres: ['Sci-Fi', 'Drama'],
    description:
      'The crew of an aging space station must decide who goes home when only one return capsule still works.',
    cast: ['Daniel Cruz', 'Mei Tanaka', 'Paolo Garcia'],
    palette: ['#000428', '#004e92'],
    motif: 'orbit',
  },
  {
    id: 'paper-kings',
    name: 'Paper Kings',
    kind: 'Series',
    year: 2024,
    maturity: 'TV-MA',
    runtime: '4 Seasons',
    match: 94,
    genres: ['Drama', 'Thriller'],
    description:
      "Three siblings inherit their father's printing business and discover it has been printing a lot more than wedding invitations.",
    cast: ['Carla Mendoza', 'Luis Ocampo', 'Sam Uy'],
    palette: ['#232526', '#5a5d61'],
    motif: 'stripes',
  },
  {
    id: 'wild-coast',
    name: 'Wild Coast',
    kind: 'Series',
    year: 2025,
    maturity: 'TV-G',
    runtime: '1 Season',
    match: 90,
    genres: ['Documentary'],
    description:
      'A year on the reefs and mangroves of Palawan, filmed from the smallest seahorse to migrating whale sharks.',
    cast: ['Narrated by Miguel Santos'],
    palette: ['#134e5e', '#71b280'],
    motif: 'waves',
  },
  {
    id: 'second-serve',
    name: 'Second Serve',
    kind: 'Movie',
    year: 2023,
    maturity: 'PG-13',
    runtime: '1h 41m',
    match: 88,
    genres: ['Comedy', 'Drama'],
    description:
      "A retired tennis star agrees to coach her neighbor's hopeless teenage son and accidentally remembers why she loved the game.",
    cast: ['Patricia Lim', 'Jomar Dizon', 'Ella Cruz'],
    palette: ['#e0681b', '#c49a00'],
    motif: 'rings',
  },
  {
    id: 'echo-protocol',
    name: 'Echo Protocol',
    kind: 'Movie',
    year: 2026,
    maturity: 'PG-13',
    runtime: '2h 1m',
    match: 96,
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    description:
      'An AI negotiator is sent to talk down a hijacked satellite, but the hijacker sounds exactly like the engineer who built her.',
    cast: ['Nadia Park', 'Anton Rivera', 'Grace Yu'],
    palette: ['#0f0c29', '#302b63'],
    motif: 'rings',
  },
  {
    id: 'the-quiet-year',
    name: 'The Quiet Year',
    kind: 'Movie',
    year: 2024,
    maturity: 'PG-13',
    runtime: '1h 56m',
    match: 89,
    genres: ['Drama'],
    description:
      "After losing his hearing, a young composer moves back to his grandmother's farm and learns to hear music differently.",
    cast: ['Enzo Villar', 'Lola Remedios Tan', 'Kat Javier'],
    palette: ['#3e5151', '#a88f62'],
    motif: 'sun',
  },
  {
    id: 'kitchen-wars',
    name: 'Kitchen Wars',
    kind: 'Series',
    year: 2025,
    maturity: 'TV-PG',
    runtime: '2 Seasons',
    match: 87,
    genres: ['Comedy'],
    description:
      'Two rival carinderia owners on the same street face off in a weekly cook-off judged by the whole barangay.',
    cast: ['Aling Nena Cruz', 'Mang Bert Sison', 'Joy Ramirez'],
    palette: ['#e52d27', '#7a0c10'],
    motif: 'stripes',
  },
  {
    id: 'red-horizon',
    name: 'Red Horizon',
    kind: 'Movie',
    year: 2025,
    maturity: 'R',
    runtime: '2h 14m',
    match: 92,
    genres: ['Action'],
    description:
      'A desert rescue pilot flies one last mission into a sandstorm to bring home a stranded medical team.',
    cast: ['Victor Lao', 'Sara Delgado', 'Mark Chua'],
    palette: ['#870000', '#190a05'],
    motif: 'sun',
  },
  {
    id: 'deep-blue-archive',
    name: 'Deep Blue Archive',
    kind: 'Series',
    year: 2023,
    maturity: 'TV-G',
    runtime: '1 Season',
    match: 90,
    genres: ['Documentary'],
    description:
      'Marine scientists catalog shipwrecks across the Philippine Sea and trace the stories of the people who sailed them.',
    cast: ['Dr. Liza Manalo', 'Carlo Reyes'],
    palette: ['#1a2980', '#1b8f8d'],
    motif: 'waves',
  },
  {
    id: 'signal-lost',
    name: 'Signal Lost',
    kind: 'Movie',
    year: 2024,
    maturity: 'PG-13',
    runtime: '1h 49m',
    match: 93,
    genres: ['Sci-Fi', 'Thriller'],
    description:
      'A radio operator at a remote mountain station starts receiving calls for help dated thirty years in the future.',
    cast: ['Iris Domingo', 'Ben Alcantara', 'Rico Sy'],
    palette: ['#141e30', '#243b55'],
    motif: 'peaks',
  },
  {
    id: 'barkada-road-trip',
    name: 'Barkada Road Trip',
    kind: 'Movie',
    year: 2026,
    maturity: 'PG-13',
    runtime: '1h 38m',
    match: 95,
    genres: ['Comedy'],
    description:
      'Five college friends borrow a van for a trip up north and lose the van, the map, and each other along the way.',
    cast: ['Migo Santos', 'Trina Lopez', 'Kevin Ang', 'Dani Reyes'],
    palette: ['#0f8a7e', '#2a9d4b'],
    motif: 'peaks',
  },
  {
    id: 'iron-tide',
    name: 'Iron Tide',
    kind: 'Series',
    year: 2025,
    maturity: 'TV-MA',
    runtime: '2 Seasons',
    match: 91,
    genres: ['Action', 'Drama'],
    description:
      'A coast guard unit fights pirates, typhoons, and politics along one of the busiest shipping lanes in Southeast Asia.',
    cast: ['Gabriel Tolentino', 'Rhea Castillo', 'Jun Pascual'],
    palette: ['#2c3e50', '#4ca1af'],
    motif: 'stripes',
  },
  {
    id: 'glass-garden',
    name: 'Glass Garden',
    kind: 'Series',
    year: 2024,
    maturity: 'TV-14',
    runtime: '1 Season',
    match: 86,
    genres: ['Drama'],
    description:
      'Four generations of a flower-growing family fight to save their greenhouse from a developer who happens to be their cousin.',
    cast: ['Celia Morales', 'Nico Fernandez', 'Abby Go'],
    palette: ['#3f7d20', '#8cbf3f'],
    motif: 'rings',
  },
  {
    id: 'beyond-the-reef',
    name: 'Beyond the Reef',
    kind: 'Movie',
    year: 2025,
    maturity: 'PG',
    runtime: '1h 27m',
    match: 92,
    genres: ['Documentary'],
    description:
      'A free diver trains for a record-breaking dive while documenting the reefs she grew up swimming in.',
    cast: ['Maya Robles'],
    palette: ['#0083b0', '#0045a5'],
    motif: 'waves',
  },
  {
    id: 'late-checkout',
    name: 'Late Checkout',
    kind: 'Series',
    year: 2026,
    maturity: 'TV-14',
    runtime: '2 Seasons',
    match: 94,
    genres: ['Comedy'],
    description:
      'The night staff of a struggling beach resort in La Union will do anything to protect their five-star rating, including lying to the guest who wrote it.',
    cast: ['Pia Valdez', 'Rafael Co', 'Jessa Marquez'],
    palette: ['#c94b4b', '#4b134f'],
    motif: 'sun',
  },
  {
    id: 'parallel',
    name: 'Parallel',
    kind: 'Series',
    year: 2025,
    maturity: 'TV-14',
    runtime: '2 Seasons',
    match: 97,
    genres: ['Sci-Fi', 'Thriller'],
    description:
      'A physics student wakes up in a version of Manila where she was never born and has to convince her own mother to trust her.',
    cast: ['Sofia Herrera', 'Lito Manansala', 'Clara Ong'],
    palette: ['#8e2de2', '#4a00e0'],
    motif: 'grid',
  },
  {
    id: 'stormbreak',
    name: 'Stormbreak',
    kind: 'Movie',
    year: 2023,
    maturity: 'PG-13',
    runtime: '1h 58m',
    match: 89,
    genres: ['Action', 'Thriller'],
    description:
      'When a super typhoon traps a heist crew inside a bank vault, the robbers and their hostages have to work together to survive.',
    cast: ['Dante Ignacio', 'Monica Uy', 'Paul Serrano'],
    palette: ['#373b44', '#4286f4'],
    motif: 'city',
  },
  {
    id: 'small-hours',
    name: 'Small Hours',
    kind: 'Movie',
    year: 2026,
    maturity: 'R',
    runtime: '1h 44m',
    match: 90,
    genres: ['Drama', 'Thriller'],
    description:
      'A call-center agent working the graveyard shift takes a call from a customer who knows far too much about her.',
    cast: ['Janine Soriano', 'Alex Tiu', 'Rosa Magno'],
    palette: ['#0f2027', '#34525c'],
    motif: 'city',
  },
];

/** Overall popularity, used to build the Top 10 rows. */
export const rankOrder = [
  'neon-district',
  'the-last-harbor',
  'parallel',
  'orbiters',
  'barkada-road-trip',
  'echo-protocol',
  'late-checkout',
  'paper-kings',
  'midnight-jeepney',
  'signal-lost',
  'iron-tide',
  'red-horizon',
  'kitchen-wars',
  'small-hours',
  'wild-coast',
  'beyond-the-reef',
  'glass-garden',
  'stormbreak',
  'the-quiet-year',
  'deep-blue-archive',
  'second-serve',
  'salt-and-stone',
];

export const featuredByTab: Record<Tab, string> = {
  home: 'the-last-harbor',
  shows: 'orbiters',
  movies: 'neon-district',
  new: 'echo-protocol',
  mylist: 'the-last-harbor',
};

export const genreRows: { genre: Genre; heading: string }[] = [
  { genre: 'Action', heading: 'Action & Adventure' },
  { genre: 'Comedy', heading: 'Comedies' },
  { genre: 'Sci-Fi', heading: 'Sci-Fi & Fantasy' },
  { genre: 'Drama', heading: 'Dramas' },
  { genre: 'Thriller', heading: 'Edge-of-Your-Seat Thrillers' },
  { genre: 'Documentary', heading: 'Documentaries' },
];

export function titleById(id: string): Title | undefined {
  return titles.find((title) => title.id === id);
}

/** Series episodes are simulated as 48 minutes; movies use their runtime. */
export function runtimeSeconds(title: Title): number {
  if (title.kind === 'Series') return 48 * 60;
  const match = /(?:(\d+)h)?\s*(?:(\d+)m)?/.exec(title.runtime);
  const hours = Number(match?.[1] ?? 0);
  const minutes = Number(match?.[2] ?? 0);
  return (hours * 60 + minutes) * 60;
}
