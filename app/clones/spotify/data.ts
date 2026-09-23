import type { Motif } from '../_shared/CoverArt';

export type Track = {
  id: string;
  title: string;
  artist: string;
  albumId: string;
  /** Length in seconds. */
  duration: number;
  explicit?: boolean;
};

export type Collection = {
  id: string;
  name: string;
  kind: 'Playlist' | 'Album';
  owner: string;
  description: string;
  year?: number;
  palette: [string, string];
  motif: Motif;
  trackIds: string[];
};

export const LIKED_ID = 'liked';

// All artists, songs, and artwork are fictional.
export const tracks: Track[] = [
  { id: 'golden-hour-traffic', title: 'Golden Hour Traffic', artist: 'Luna Reyes', albumId: 'manila-nights', duration: 204 },
  { id: 'paper-planes', title: 'Paper Planes Over Pasig', artist: 'Luna Reyes', albumId: 'manila-nights', duration: 219 },
  { id: 'monsoon-letters', title: 'Monsoon Letters', artist: 'Luna Reyes', albumId: 'manila-nights', duration: 266 },
  { id: 'sleepless-in-makati', title: 'Sleepless in Makati', artist: 'Luna Reyes', albumId: 'manila-nights', duration: 231 },

  { id: 'ulan-sa-edsa', title: 'Ulan sa EDSA', artist: 'The Night Tricycles', albumId: 'commute', duration: 242 },
  { id: 'last-trip-home', title: 'Last Trip Home', artist: 'The Night Tricycles', albumId: 'commute', duration: 227 },
  { id: 'jeepney-window', title: 'Jeepney Window', artist: 'The Night Tricycles', albumId: 'commute', duration: 188 },
  { id: 'overpass', title: 'Overpass', artist: 'The Night Tricycles', albumId: 'commute', duration: 201, explicit: true },

  { id: 'satellite-heart', title: 'Satellite Heart', artist: 'Kalawakan', albumId: 'orbit', duration: 231 },
  { id: 'gravity-well', title: 'Gravity Well', artist: 'Kalawakan', albumId: 'orbit', duration: 302 },
  { id: 'tala', title: 'Tala', artist: 'Kalawakan', albumId: 'orbit', duration: 238 },
  { id: 'starlight-karaoke', title: 'Starlight Karaoke', artist: 'Kalawakan', albumId: 'orbit', duration: 215 },

  { id: 'low-tide', title: 'Low Tide', artist: 'Paolo & the Tides', albumId: 'shorelines', duration: 197 },
  { id: 'salt-air', title: 'Salt Air', artist: 'Paolo & the Tides', albumId: 'shorelines', duration: 213 },
  { id: 'boardwalk-at-dusk', title: 'Boardwalk at Dusk', artist: 'Paolo & the Tides', albumId: 'shorelines', duration: 245 },
  { id: 'siargao-summer', title: 'Siargao Summer', artist: 'Paolo & the Tides', albumId: 'shorelines', duration: 186 },

  { id: 'neon-sari-sari', title: 'Neon Sari-Sari', artist: 'Static Bloom', albumId: 'corner-store', duration: 178, explicit: true },
  { id: 'static-in-the-rain', title: 'Static in the Rain', artist: 'Static Bloom', albumId: 'corner-store', duration: 192 },
  { id: 'halo-halo-haze', title: 'Halo-Halo Haze', artist: 'Static Bloom', albumId: 'corner-store', duration: 224 },
  { id: 'loading-screen', title: 'Loading Screen', artist: 'Static Bloom', albumId: 'corner-store', duration: 170 },

  { id: 'sunday-silog', title: 'Sunday Silog', artist: 'Mira Santos', albumId: 'weekend', duration: 185 },
  { id: 'brownout-ballad', title: 'Brownout Ballad', artist: 'Mira Santos', albumId: 'weekend', duration: 250 },
  { id: 'tambay', title: 'Tambay', artist: 'Mira Santos', albumId: 'weekend', duration: 209 },
  { id: 'pasalubong', title: 'Pasalubong', artist: 'Mira Santos', albumId: 'weekend', duration: 233 },

  { id: 'signal-fires', title: 'Signal Fires', artist: 'Coastline Radio', albumId: 'frequencies', duration: 255 },
  { id: 'late-night-lugaw', title: 'Late Night Lugaw', artist: 'Coastline Radio', albumId: 'frequencies', duration: 167 },
  { id: 'am-radio-heart', title: 'AM Radio Heart', artist: 'Coastline Radio', albumId: 'frequencies', duration: 221 },
  { id: 'focus-loop', title: 'Focus Loop', artist: 'Coastline Radio', albumId: 'frequencies', duration: 150 },
];

type AlbumInfo = Omit<Collection, 'kind' | 'trackIds'>;

const albumInfo: AlbumInfo[] = [
  { id: 'manila-nights', name: 'Manila Nights', owner: 'Luna Reyes', description: '', year: 2025, palette: ['#b3541e', '#2b1055'], motif: 'city' },
  { id: 'commute', name: 'Commute', owner: 'The Night Tricycles', description: '', year: 2024, palette: ['#1f4e5f', '#0b1d26'], motif: 'stripes' },
  { id: 'orbit', name: 'Orbit', owner: 'Kalawakan', description: '', year: 2026, palette: ['#3a2685', '#0b0b2b'], motif: 'orbit' },
  { id: 'shorelines', name: 'Shorelines', owner: 'Paolo & the Tides', description: '', year: 2023, palette: ['#0e6b8c', '#08324a'], motif: 'waves' },
  { id: 'corner-store', name: 'Corner Store', owner: 'Static Bloom', description: '', year: 2025, palette: ['#a4136e', '#3b0a45'], motif: 'grid' },
  { id: 'weekend', name: 'Weekend', owner: 'Mira Santos', description: '', year: 2026, palette: ['#c46a1b', '#5a2a0c'], motif: 'sun' },
  { id: 'frequencies', name: 'Frequencies', owner: 'Coastline Radio', description: '', year: 2024, palette: ['#2f6b3a', '#0f2a17'], motif: 'rings' },
];

const albums: Collection[] = albumInfo.map((album) => ({
  ...album,
  kind: 'Album',
  trackIds: tracks.filter((t) => t.albumId === album.id).map((t) => t.id),
}));

const playlists: Collection[] = [
  {
    id: 'daily-mix-1',
    name: 'Daily Mix 1',
    kind: 'Playlist',
    owner: 'Spotify',
    description: 'Luna Reyes, Mira Santos, Paolo & the Tides and more',
    palette: ['#8c1c3a', '#2a0a14'],
    motif: 'rings',
    trackIds: ['golden-hour-traffic', 'sunday-silog', 'low-tide', 'paper-planes', 'tambay', 'salt-air', 'monsoon-letters', 'brownout-ballad', 'siargao-summer', 'sleepless-in-makati'],
  },
  {
    id: 'discover-weekly',
    name: 'Discover Weekly',
    kind: 'Playlist',
    owner: 'Spotify',
    description: 'Your weekly mixtape of fresh music. Enjoy new music and deep cuts picked for you.',
    palette: ['#3b3fa8', '#15163d'],
    motif: 'orbit',
    trackIds: ['satellite-heart', 'neon-sari-sari', 'signal-fires', 'ulan-sa-edsa', 'halo-halo-haze', 'am-radio-heart', 'tala', 'jeepney-window'],
  },
  {
    id: 'release-radar',
    name: 'Release Radar',
    kind: 'Playlist',
    owner: 'Spotify',
    description: 'Catch all the latest music from artists you follow.',
    palette: ['#1f7a6b', '#0a2b26'],
    motif: 'stripes',
    trackIds: ['tala', 'starlight-karaoke', 'pasalubong', 'sunday-silog', 'gravity-well', 'tambay', 'halo-halo-haze'],
  },
  {
    id: 'opm-chill',
    name: 'OPM Chill',
    kind: 'Playlist',
    owner: 'Spotify',
    description: 'Mellow OPM for slow afternoons and long commutes.',
    palette: ['#b0413e', '#3d1414'],
    motif: 'sun',
    trackIds: ['ulan-sa-edsa', 'tala', 'sunday-silog', 'jeepney-window', 'golden-hour-traffic', 'brownout-ballad', 'monsoon-letters', 'tambay', 'low-tide'],
  },
  {
    id: 'deep-focus',
    name: 'Deep Focus',
    kind: 'Playlist',
    owner: 'Spotify',
    description: 'Keep calm and focus with ambient and instrumental tracks.',
    palette: ['#34495e', '#101820'],
    motif: 'peaks',
    trackIds: ['focus-loop', 'gravity-well', 'am-radio-heart', 'boardwalk-at-dusk', 'late-night-lugaw', 'signal-fires'],
  },
  {
    id: 'late-night-drive',
    name: 'Late Night Drive',
    kind: 'Playlist',
    owner: 'Spotify',
    description: 'Empty roads, city lights, and the windows down.',
    palette: ['#4a1f8c', '#140a2b'],
    motif: 'city',
    trackIds: ['sleepless-in-makati', 'last-trip-home', 'overpass', 'neon-sari-sari', 'satellite-heart', 'static-in-the-rain', 'signal-fires', 'late-night-lugaw'],
  },
  {
    id: 'rainy-day',
    name: 'Rainy Day',
    kind: 'Playlist',
    owner: 'Spotify',
    description: "Songs for when the rain won't stop.",
    palette: ['#3c5a73', '#141f29'],
    motif: 'waves',
    trackIds: ['ulan-sa-edsa', 'monsoon-letters', 'static-in-the-rain', 'brownout-ballad', 'salt-air', 'last-trip-home'],
  },
  {
    id: 'workout-boost',
    name: 'Workout Boost',
    kind: 'Playlist',
    owner: 'Spotify',
    description: 'Upbeat tracks to keep you moving.',
    palette: ['#b3261e', '#3a0c0a'],
    motif: 'stripes',
    trackIds: ['overpass', 'neon-sari-sari', 'loading-screen', 'siargao-summer', 'starlight-karaoke', 'jeepney-window'],
  },
];

export const collections: Collection[] = [...playlists, ...albums];

export function trackById(id: string | undefined): Track | undefined {
  return tracks.find((track) => track.id === id);
}

export function collectionById(id: string): Collection | undefined {
  return collections.find((collection) => collection.id === id);
}

export function likedCollection(trackIds: string[]): Collection {
  return {
    id: LIKED_ID,
    name: 'Liked Songs',
    kind: 'Playlist',
    owner: 'You',
    description: '',
    palette: ['#450af5', '#8e8ee5'],
    motif: 'rings',
    trackIds,
  };
}
