import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Moonlight Tracker - Moon Phases & Lunar Calendar',
  description: 'Track moon phases with beautiful visualizations. Get today\'s moon phase and 7-day lunar forecast with accurate astronomical data.',
  keywords: 'moon phases, lunar calendar, astronomy, moonlight, lunar cycle',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}