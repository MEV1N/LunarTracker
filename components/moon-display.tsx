'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { MoonPhase } from '@/lib/types';

interface MoonDisplayProps {
  moonData: MoonPhase;
  size?: 'small' | 'large';
}

export function MoonDisplay({ moonData, size = 'large' }: MoonDisplayProps) {
  const isLarge = size === 'large';
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="text-center"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.05, 1],
          filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)']
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={`${isLarge ? 'w-48 h-48 md:w-56 md:h-56' : 'w-24 h-24'} mb-4 relative mx-auto`}
      >
        <div className="absolute inset-0 blur-2xl opacity-50">
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
            className="object-cover rounded-full shadow-2xl"
          />
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h2 className={`${isLarge ? 'text-2xl md:text-3xl' : 'text-lg'} font-bold text-white mb-2`}>
          {moonData.phaseName}
        </h2>
        {isLarge && (
          <p className="text-white/70 text-lg">
            {new Date(moonData.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        )}
        <p className={`text-white/60 ${isLarge ? 'text-base mt-2' : 'text-sm mt-1'}`}>
          {moonData.illumination}% illuminated
        </p>
      </motion.div>
    </motion.div>
  );
}