export interface MoonPhase {
  date: string;
  phase: string;
  illumination: number;
  phaseName: string;
  emoji: string; // Contains local image path (e.g., '/img/full.webp')
}

export interface MoonPhaseData {
  today: MoonPhase;
  forecast: MoonPhase[];
}