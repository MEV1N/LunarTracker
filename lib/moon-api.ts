import { MoonPhaseData, MoonPhase } from './types';

// Helper function to get moon image based on phase name
const getMoonImage = (phaseName: string): string => {
  const phaseImages: { [key: string]: string } = {
    'New Moon': '/img/new-moon.jpg',
    'Waxing Crescent': '/img/waxing-crescent.jpg',
    'First Quarter': '/img/first-quarter.jpg',
    'Waxing Gibbous': '/img/waxing-gibbous.jpg',
    'Full Moon': '/img/full.webp',
    'Waning Gibbous': '/img/waning-gibbous.webp',
    'Last Quarter': '/img/third-quarter.webp',
    'Waning Crescent': '/img/waning-crescent.webp'
  };
  return phaseImages[phaseName] || phaseImages['Full Moon'];
};

// Helper function to fetch real-time moon data from lunaf.com
const fetchLunafData = async (date?: Date): Promise<{ phase: string; illumination: number } | null> => {
  try {
    const targetDate = date || new Date();
    const dateStr = targetDate.toISOString().split('T')[0];
    const [year, month, day] = dateStr.split('-');
    
    const response = await fetch(`https://lunaf.com/lunar-calendar/${year}/${month}/${day}/`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    
    // Parse the HTML to extract moon phase information
    const phaseMatch = html.match(/<h2[^>]*>\s*([^<]+)\s+in\s+/i);
    const illuminationMatch = html.match(/The illuminated surface of the moon is (\d+)%/i);
    
    if (phaseMatch && illuminationMatch) {
      return {
        phase: phaseMatch[1].trim(),
        illumination: parseInt(illuminationMatch[1])
      };
    }
    
    return null;
  } catch (error) {
    console.warn('Failed to fetch real-time lunaf data:', error);
    return null;
  }
};

// Calculate approximate moon phase using lunar cycle
const calculateApproximatePhase = (date: Date) => {
  const lunarCycleLength = 29.53058867; // days
  const knownNewMoon = new Date('2025-08-23T06:06:00Z');
  const daysSinceNewMoon = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  const cyclePosition = (daysSinceNewMoon % lunarCycleLength) / lunarCycleLength;
  
  if (cyclePosition < 0.0625) return { name: 'New Moon', illumination: Math.round(cyclePosition * 16) };
  if (cyclePosition < 0.1875) return { name: 'Waxing Crescent', illumination: Math.round(15 + (cyclePosition - 0.0625) * 280) };
  if (cyclePosition < 0.3125) return { name: 'First Quarter', illumination: Math.round(40 + (cyclePosition - 0.1875) * 80) };
  if (cyclePosition < 0.4375) return { name: 'Waxing Gibbous', illumination: Math.round(65 + (cyclePosition - 0.3125) * 280) };
  if (cyclePosition < 0.5625) return { name: 'Full Moon', illumination: Math.round(95 + (cyclePosition - 0.4375) * 40) };
  if (cyclePosition < 0.6875) return { name: 'Waning Gibbous', illumination: Math.round(95 - (cyclePosition - 0.5625) * 280) };
  if (cyclePosition < 0.8125) return { name: 'Last Quarter', illumination: Math.round(60 - (cyclePosition - 0.6875) * 80) };
  if (cyclePosition < 0.9375) return { name: 'Waning Crescent', illumination: Math.round(35 - (cyclePosition - 0.8125) * 280) };
  return { name: 'New Moon', illumination: Math.round(5 - (cyclePosition - 0.9375) * 80) };
};

// Interpolate moon phase between two known phases
const interpolatePhase = (prevPhase: any, nextPhase: any, progress: number, date: Date) => {
  const phaseOrder = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
  const prevIndex = phaseOrder.indexOf(prevPhase.phase);
  const nextIndex = phaseOrder.indexOf(nextPhase.phase);
  
  // Handle cycle wrap-around
  let currentIndex = prevIndex;
  if (nextIndex < prevIndex) {
    // Wrapped around the cycle
    if (progress < 0.5) {
      currentIndex = prevIndex;
    } else {
      currentIndex = nextIndex;
    }
  } else {
    // Normal progression
    if (progress < 0.25) currentIndex = prevIndex;
    else if (progress < 0.75) {
      // Transition phase
      currentIndex = prevIndex + Math.floor((nextIndex - prevIndex) * (progress - 0.25) * 2);
      if (currentIndex >= phaseOrder.length) currentIndex = 0;
    } else currentIndex = nextIndex;
  }
  
  const currentPhase = phaseOrder[currentIndex] || prevPhase.phase;
  
  // Calculate illumination based on phase and progress
  let illumination = 0;
  switch (currentPhase) {
    case 'New Moon': illumination = Math.round(progress * 10); break;
    case 'Waxing Crescent': illumination = Math.round(10 + progress * 30); break;
    case 'First Quarter': illumination = Math.round(40 + progress * 20); break;
    case 'Waxing Gibbous': illumination = Math.round(60 + progress * 35); break;
    case 'Full Moon': illumination = Math.round(95 + progress * 5); break;
    case 'Waning Gibbous': illumination = Math.round(95 - progress * 35); break;
    case 'Last Quarter': illumination = Math.round(60 - progress * 20); break;
    case 'Waning Crescent': illumination = Math.round(40 - progress * 30); break;
  }
  
  return { name: currentPhase, illumination: Math.max(0, Math.min(100, illumination)) };
};

// Real moon phase API using astronomical calculations based on lunaf.com data
export const getMoonPhaseData = async (useRealTimeData = false): Promise<MoonPhaseData> => {
  try {
    const today = new Date();
    
    // Known accurate moon phase dates from lunaf.com for 2025
    const knownMoonPhases = [
      { date: '2025-08-23', phase: 'New Moon', time: '06:06' },
      { date: '2025-08-31', phase: 'First Quarter', time: '06:25' },
      { date: '2025-09-07', phase: 'Full Moon', time: '18:09' },
      { date: '2025-09-14', phase: 'Last Quarter', time: '10:33' },
      { date: '2025-09-21', phase: 'New Moon', time: '19:54' },
      { date: '2025-09-29', phase: 'First Quarter', time: '13:54' },
      { date: '2025-10-07', phase: 'Full Moon', time: '03:47' },
      { date: '2025-10-13', phase: 'Last Quarter', time: '18:13' },
      { date: '2025-10-21', phase: 'New Moon', time: '12:25' },
      // Add more phases as needed
    ];
    
    const calculateMoonPhase = (date: Date) => {
      const dateStr = date.toISOString().split('T')[0];
      const targetTime = date.getTime();
      
      // Find the closest known phases before and after the target date
      let prevPhase = null;
      let nextPhase = null;
      
      for (const phase of knownMoonPhases) {
        const phaseTime = new Date(phase.date).getTime();
        if (phaseTime <= targetTime) {
          if (!prevPhase || phaseTime > new Date(prevPhase.date).getTime()) {
            prevPhase = phase;
          }
        } else {
          if (!nextPhase || phaseTime < new Date(nextPhase.date).getTime()) {
            nextPhase = phase;
          }
        }
      }
      
      if (!prevPhase || !nextPhase) {
        // Fallback to approximate calculation if we don't have known phases
        return calculateApproximatePhase(date);
      }
      
      const prevTime = new Date(prevPhase.date).getTime();
      const nextTime = new Date(nextPhase.date).getTime();
      const progress = (targetTime - prevTime) / (nextTime - prevTime);
      
      // Determine current phase based on the known phases and progress
      return interpolatePhase(prevPhase, nextPhase, progress, date);
    };
    
    // Try to get real-time data if requested
    if (useRealTimeData) {
      const realTimeData = await fetchLunafData(today);
      if (realTimeData) {
        const todayData: MoonPhase = {
          date: today.toISOString().split('T')[0],
          phase: realTimeData.phase,
          illumination: realTimeData.illumination,
          phaseName: realTimeData.phase,
          emoji: getMoonImage(realTimeData.phase)
        };
        
        // Generate forecast using calculated data
        const forecast: MoonPhase[] = [];
        for (let i = 1; i <= 7; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() + i);
          const futurePhase = calculateMoonPhase(date);
          
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
      }
    }
    
    const todayPhase = calculateMoonPhase(today);
    
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
      const futurePhase = calculateMoonPhase(date);
      
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