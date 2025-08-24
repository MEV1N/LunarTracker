export interface MoonPhase {
  date: string;
  phase: string;
  illumination: number;
  phaseName: string;
  emoji: string; // Now contains image URL instead of emoji
}

export interface MoonPhaseData {
  today: MoonPhase;
  forecast: MoonPhase[];
}