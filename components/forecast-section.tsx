'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ForecastCard } from './forecast-card';
import { MoonPhase } from '@/lib/types';

interface ForecastSectionProps {
  forecast: MoonPhase[];
}

export function ForecastSection({ forecast }: ForecastSectionProps) {
  const [showForecast, setShowForecast] = useState(false);

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="text-center mb-8"
      >
        <Button
          onClick={() => setShowForecast(!showForecast)}
          className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white px-8 py-3 rounded-full transition-all duration-300 hover:scale-105"
          size="lg"
        >
          {showForecast ? (
            <>
              <ChevronLeft className="mr-2 h-5 w-5" />
              Hide 7-Day Forecast
            </>
          ) : (
            <>
              Next 7 Days
              <ChevronRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </motion.div>

      <AnimatePresence>
        {showForecast && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h3 className="text-2xl font-bold text-white text-center mb-8">
                7-Day Moon Phase Forecast
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-4 px-4 scrollbar-hide">
                <div className="flex gap-4 min-w-max">
                  {forecast.map((moonData, index) => (
                    <ForecastCard
                      key={moonData.date}
                      moonData={moonData}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}