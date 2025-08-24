import { MoonPhaseData, MoonPhase } from './types';

// Real moon phase API using lunaf.com data
export const getMoonPhaseData = async (): Promise<MoonPhaseData> => {
  try {
    // For now, we'll use a mock implementation that simulates real data
    // In production, you would integrate with lunaf.com's API
    const today = new Date();
    
    // Calculate moon phase based on lunar cycle (approximately 29.5 days)
    const lunarCycleLength = 29.53058867; // days
    const knownNewMoon = new Date('2024-01-11'); // Known new moon date
    const daysSinceNewMoon = (today.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
    const cyclePosition = (daysSinceNewMoon % lunarCycleLength) / lunarCycleLength;
    
    const getCurrentPhase = (position: number) => {
      if (position < 0.0625) return { name: 'New Moon', illumination: 0 };
      if (position < 0.1875) return { name: 'Waxing Crescent', illumination: 25 };
      if (position < 0.3125) return { name: 'First Quarter', illumination: 50 };
      if (position < 0.4375) return { name: 'Waxing Gibbous', illumination: 75 };
      if (position < 0.5625) return { name: 'Full Moon', illumination: 100 };
      if (position < 0.6875) return { name: 'Waning Gibbous', illumination: 75 };
      if (position < 0.8125) return { name: 'Last Quarter', illumination: 50 };
      if (position < 0.9375) return { name: 'Waning Crescent', illumination: 25 };
      return { name: 'New Moon', illumination: 0 };
    };
    
    const getMoonImage = (phaseName: string): string => {
      const phaseImages: { [key: string]: string } = {
        'New Moon': 'https://images.pexels.com/photos/39644/moon-night-sky-dark-39644.jpeg?auto=compress&cs=tinysrgb&w=400',
        'Waxing Crescent': 'https://images.pexels.com/photos/1146134/pexels-photo-1146134.jpeg?auto=compress&cs=tinysrgb&w=400',
        'First Quarter': 'https://images.pexels.com/photos/1146134/pexels-photo-1146134.jpeg?auto=compress&cs=tinysrgb&w=400',
        'Waxing Gibbous': 'https://images.pexels.com/photos/1146134/pexels-photo-1146134.jpeg?auto=compress&cs=tinysrgb&w=400',
        'Full Moon': 'https://images.pexels.com/photos/1146134/pexels-photo-1146134.jpeg?auto=compress&cs=tinysrgb&w=400',
        'Waning Gibbous': 'https://images.pexels.com/photos/1146134/pexels-photo-1146134.jpeg?auto=compress&cs=tinysrgb&w=400',
        'Last Quarter': 'https://images.pexels.com/photos/1146134/pexels-photo-1146134.jpeg?auto=compress&cs=tinysrgb&w=400',
        'Waning Crescent': 'https://images.pexels.com/photos/1146134/pexels-photo-1146134.jpeg?auto=compress&cs=tinysrgb&w=400'
      };
      return phaseImages[phaseName] || phaseImages['Full Moon'];
    };
    
    const todayPhase = getCurrentPhase(cyclePosition);
    
    const todayData: MoonPhase = {
      date: today.toISOString().split('T')[0],
      phase: todayPhase.name,
      illumination: todayPhase.illumination,
      phaseName: todayPhase.name,
      emoji: getMoonImage(todayPhase.name)
    };
    
    const forecast: MoonPhase[] = [];
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const futurePosition = ((daysSinceNewMoon + i) % lunarCycleLength) / lunarCycleLength;
      const futurePhase = getCurrentPhase(futurePosition);
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        phase: futurePhase.name,
        illumination: futurePhase.illumination,
        phaseName: futurePhase.name,
        emoji: getMoonImage(futurePhase.name)
      });
    }
    
    return {
      today: todayData,
      forecast
    };
  } catch (error) {
    console.error('Error fetching moon data:', error);
    throw error;
  }
};