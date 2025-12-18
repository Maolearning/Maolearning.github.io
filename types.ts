export interface CityConfig {
  id: string;
  name: string;
  country: string;
  timezone: string;
  imageKeyword: string; // Used for abstract placeholder coloring or themes
  accentColor: string;
}

export interface TimeData {
  time: string;
  date: string;
  dayOfWeek: string;
  isDaytime: boolean;
  rawDate: Date;
}
