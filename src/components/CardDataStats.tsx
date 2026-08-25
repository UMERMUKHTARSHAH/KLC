import React, { ReactNode } from 'react';

interface CardDataStatsProps {
  title: string;
  total: string;
  rate: string;
  levelUp?: boolean;
  levelDown?: boolean;
  children: ReactNode;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  total,
  rate,
  levelUp,
  levelDown,
  children,
}) => {
  return (
   <div className="group relative overflow-hidden rounded-2xl backdrop-blur-md bg-white/10 dark:bg-black/20 shadow-2xl border border-white/30 hover:border-purple-500/50 transition-all duration-500 flex flex-col p-6 hover:shadow-purple-500/30 hover:shadow-2xl min-h-[130px]">

  {/* Glass reflection effect */}
  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl"></div>

  {/* Neon ring effect */}
  <div className="absolute inset-2 rounded-2xl border border-purple-500/0 group-hover:border-purple-500/50 transition-all duration-500 pointer-events-none"></div>

  {/* Floating particles */}
  <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500 rounded-full filter blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700"></div>
  <div className="absolute bottom-0 left-0 w-20 h-20 bg-pink-500 rounded-full filter blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700"></div>

  {/* Content - Title and Count on left, Icon on right corner */}
  <div className="relative flex items-center justify-between gap-4 w-full">
    {/* Title and Count - Left side */}
    <div className="flex-1 min-w-0">
      <div className="relative inline-block">
        <span className="absolute inset-0 blur-md bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-50 transition-opacity duration-500"></span>
        <h4 className="relative text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-pink-400 ">
          {total}
        </h4>
      </div>

      <div className="mt-0.5">
        <h2 className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
          {title}
        </h2>
      </div>
    </div>

    {/* Icon - Right side corner */}
    <div className="relative flex-shrink-0">
      <div className="absolute inset-0 rounded-full border-2 border-dashed border-purple-500 animate-spin-slow opacity-0 group-hover:opacity-100"></div>
      <div className="relative flex h-12 w-12 items-center justify-center rounded-full shadow-lg group-hover:shadow-purple-500/50 transition-all duration-500 group-hover:scale-105">
        <div className="text-xl">
          {children}
        </div>
      </div>
    </div>
  </div>

  {/* Interactive bottom bar */}
  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left rounded-b-2xl"></div>
</div>
  );
};

export default CardDataStats;