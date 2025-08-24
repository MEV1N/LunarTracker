'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { MoonPhase } from '@/lib/types';
import { Card } from '@/components/ui/card';

interface ForecastCardProps {
  moonData: MoonPhase;
  index: number;
}

export function ForecastCard({ moonData, index }: ForecastCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ 
        scale: 1.05,
        y: -5
      }}
      className="min-w-[200px]"
    >
      <Card className="bg-white/10 backdrop-blur-md border-white/20 p-4 text-center hover:bg-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="w-16 h-16 mb-3 relative mx-auto"
        >
          <div className="absolute inset-0 blur-xl opacity-50">
            <Image
              src={moonData.emoji}
              alt={`${moonData.phaseName} moon phase`}
              fill
              className="object-cover rounded-full"
            />
          </div>
          <div className="relative z-10 w-full h-full">
            <Image
              src={moonData.emoji}
              alt={`${moonData.phaseName} moon phase`}
              fill
              className="object-cover rounded-full"
            />
          </div>
        </motion.div>
        
        <h3 className="text-white font-semibold text-sm mb-1">
          {moonData.phaseName}
        </h3>
        
        <p className="text-white/70 text-xs mb-2">
          {new Date(moonData.date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          })}
        </p>
        
        <p className="text-white/60 text-xs">
          {moonData.illumination}% lit
        </p>
      </Card>
    </motion.div>
  );
}