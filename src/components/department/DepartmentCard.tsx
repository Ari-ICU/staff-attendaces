
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Export the Color type for reuse
export type Color = 'blue' | 'indigo' | 'purple' | 'teal' | 'orange' | 'pink' | 'emerald';

interface DepartmentCardProps {
  name: string;
  description: string;
  staffCount: number;
  color?: Color;
  icon?: React.ReactNode;
}

// Color themes (unchanged)
const colorThemes = {
  blue: { gradient: 'from-blue-600/30 to-blue-700/30', border: 'border-blue-200 dark:border-blue-800/50', ring: 'focus:ring-blue-500', text: 'text-blue-700 dark:text-blue-300', iconBg: 'bg-blue-100 dark:bg-blue-900/40', glow: 'shadow-lg shadow-blue-200/50 dark:shadow-blue-800/20', overlayText: 'text-blue-100 dark:text-blue-200' },
  indigo: { gradient: 'from-indigo-600/30 to-indigo-700/30', border: 'border-indigo-200 dark:border-indigo-800/50', ring: 'focus:ring-indigo-500', text: 'text-indigo-700 dark:text-indigo-300', iconBg: 'bg-indigo-100 dark:bg-indigo-900/40', glow: 'shadow-lg shadow-indigo-200/50 dark:shadow-indigo-800/20', overlayText: 'text-indigo-100 dark:text-indigo-200' },
  purple: { gradient: 'from-purple-600/30 to-purple-700/30', border: 'border-purple-200 dark:border-purple-800/50', ring: 'focus:ring-purple-500', text: 'text-purple-700 dark:text-purple-300', iconBg: 'bg-purple-100 dark:bg-purple-900/40', glow: 'shadow-lg shadow-purple-200/50 dark:shadow-purple-800/20', overlayText: 'text-purple-100 dark:text-purple-200' },
  teal: { gradient: 'from-teal-600/30 to-teal-700/30', border: 'border-teal-200 dark:border-teal-800/50', ring: 'focus:ring-teal-500', text: 'text-teal-700 dark:text-teal-300', iconBg: 'bg-teal-100 dark:bg-teal-900/40', glow: 'shadow-lg shadow-teal-200/50 dark:shadow-teal-800/20', overlayText: 'text-teal-100 dark:text-teal-200' },
  orange: { gradient: 'from-orange-600/30 to-orange-700/30', border: 'border-orange-200 dark:border-orange-800/50', ring: 'focus:ring-orange-500', text: 'text-orange-700 dark:text-orange-300', iconBg: 'bg-orange-100 dark:bg-orange-900/40', glow: 'shadow-lg shadow-orange-200/50 dark:shadow-orange-800/20', overlayText: 'text-orange-100 dark:text-orange-200' },
  pink: { gradient: 'from-pink-600/30 to-pink-700/30', border: 'border-pink-200 dark:border-pink-800/50', ring: 'focus:ring-pink-500', text: 'text-pink-700 dark:text-pink-300', iconBg: 'bg-pink-100 dark:bg-pink-900/40', glow: 'shadow-lg shadow-pink-200/50 dark:shadow-pink-800/20', overlayText: 'text-pink-100 dark:text-pink-200' },
  emerald: { gradient: 'from-emerald-600/30 to-emerald-700/30', border: 'border-emerald-200 dark:border-emerald-800/50', ring: 'focus:ring-emerald-500', text: 'text-emerald-700 dark:text-emerald-300', iconBg: 'bg-emerald-100 dark:bg-emerald-900/40', glow: 'shadow-lg shadow-emerald-200/50 dark:shadow-emerald-800/20', overlayText: 'text-emerald-100 dark:text-emerald-200' },
};

// Default icon
const IconPlaceholder = ({ color }: { color: Color }) => (
  <div className={`p-2.5 rounded-lg ${colorThemes[color].iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h-2m-2 0H9m2 0h2m4 0h2" />
    </svg>
  </div>
);

export default function DepartmentCard({ name, description, staffCount, color = 'blue', icon }: DepartmentCardProps) {
  const theme = colorThemes[color];
  const router = useRouter();

  const handleViewTeam = () => {
    const departmentSlug = name.toLowerCase().replace(/\s+/g, '-');
    router.push(`/departments/${departmentSlug}/team`);
  };

  return (
    <div className={`group relative rounded-2xl border ${theme.border} overflow-hidden bg-white dark:bg-gray-900/70 backdrop-blur-xl shadow-md transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${theme.glow}`}>
      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
      <div className="relative z-20 p-4 sm:p-5 flex flex-col justify-between h-full min-h-[200px]">
        <div className="mb-3 sm:mb-4 flex justify-start">{icon || <IconPlaceholder color={color} />}</div>
        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight line-clamp-2 group-hover:text-white">{name}</h3>
        <p className={`mt-1.5 sm:mt-2 text-xs sm:text-sm ${theme.text} line-clamp-3 group-hover:text-white`}>{description}</p>
        <div className="mt-3 sm:mt-4 flex justify-between items-center">
          <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-white">Team Size</span>
          <span className="text-base sm:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 dark:from-gray-50 to-gray-700 dark:to-gray-300 group-hover:text-white">{staffCount}</span>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl p-4 sm:p-5 text-center z-30">
          <h4 className="text-base sm:text-lg font-bold text-white mb-1.5">Explore {name}</h4>
          <p className={`text-xs sm:text-sm ${theme.overlayText} mb-3 sm:mb-4 line-clamp-2`}>{description}</p>
          <button
            onClick={handleViewTeam}
            className={`px-4 sm:px-5 py-1.5 sm:py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-white rounded-full font-medium text-xs sm:text-sm shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 ${theme.ring} focus:outline-none focus:ring-2`}
            aria-label={`View team for ${name}`}
          >
            View Team
          </button>
        </div>
        <div className={`absolute bottom-0 right-0 w-12 h-12 sm:w-16 sm:h-16 rounded-tl-full bg-gradient-to-tl from-${color}-500/10 to-transparent opacity-60 transition-opacity duration-300`} />
      </div>
    </div>
  );
}