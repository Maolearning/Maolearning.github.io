import { CityConfig } from './types';

export const CITIES: CityConfig[] = [
  {
    id: 'nyc',
    name: 'New York',
    country: 'USA',
    timezone: 'America/New_York',
    imageKeyword: 'skyscraper',
    accentColor: 'from-blue-500/20 to-purple-500/20'
  },
  {
    id: 'ldn',
    name: 'London',
    country: 'United Kingdom',
    timezone: 'Europe/London',
    imageKeyword: 'bridge',
    accentColor: 'from-red-500/20 to-blue-500/20'
  },
  {
    id: 'par',
    name: 'Paris',
    country: 'France',
    timezone: 'Europe/Paris',
    imageKeyword: 'tower',
    accentColor: 'from-amber-500/20 to-pink-500/20'
  },
  {
    id: 'tyo',
    name: 'Tokyo',
    country: 'Japan',
    timezone: 'Asia/Tokyo',
    imageKeyword: 'neon',
    accentColor: 'from-fuchsia-500/20 to-cyan-500/20'
  },
  {
    id: 'shg',
    name: 'Shanghai',
    country: 'China',
    timezone: 'Asia/Shanghai',
    imageKeyword: 'river',
    accentColor: 'from-red-600/20 to-yellow-500/20'
  },
  {
    id: 'syd',
    name: 'Sydney',
    country: 'Australia',
    timezone: 'Australia/Sydney',
    imageKeyword: 'opera',
    accentColor: 'from-cyan-500/20 to-blue-600/20'
  },
  {
    id: 'dxb',
    name: 'Dubai',
    country: 'UAE',
    timezone: 'Asia/Dubai',
    imageKeyword: 'desert',
    accentColor: 'from-yellow-400/20 to-orange-500/20'
  },
  {
    id: 'lax',
    name: 'Los Angeles',
    country: 'USA',
    timezone: 'America/Los_Angeles',
    imageKeyword: 'palm',
    accentColor: 'from-pink-500/20 to-purple-500/20'
  }
];
