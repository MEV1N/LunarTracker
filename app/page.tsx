'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getMoonPhaseData } from '@/lib/moon-api';
import { MoonPhaseData } from '@/lib/types';
import { MoonDisplay } from '@/components/moon-display';
import { ForecastSection } from '@/components/forecast-section';
import { ThemeToggle } from '@/components/theme-toggle';
import { StarsBackground } from '@/components/stars-background';
import { LoadingSpinner } from '@/components/loading-spinner';

export default function Home() {
  const [moonData, setMoonData] = useState<MoonPhaseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoonData = async () => {
      try {
        const data = await getMoonPhaseData();
        setMoonData(data);
      } catch (error) {
        console.error('Error fetching moon data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoonData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black dark:from-indigo-900 dark:via-purple-900 dark:to-black relative overflow-hidden">
      <StarsBackground />
      <ThemeToggle />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 container mx-auto px-4 py-8"
      >
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
            Moonlight Tracker
          </h1>
          <p className="text-white/70 text-lg md:text-xl">
            Track the lunar cycle with precision and beauty
          </p>
        </motion.header>

        {loading ? (
          <LoadingSpinner />
        ) : moonData ? (
          <div className="flex flex-col items-center space-y-12">
            <motion.section
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl"
            >
              <MoonDisplay moonData={moonData.today} size="large" />
            </motion.section>

            <ForecastSection forecast={moonData.forecast} />
          </div>
        ) : (
          <div className="text-center text-white/70">
            <p>Failed to load moon phase data. Please try again later.</p>
          </div>
        )}
      </motion.div>

      {/* Bottom gradient overlay */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
    </div>
  );
}