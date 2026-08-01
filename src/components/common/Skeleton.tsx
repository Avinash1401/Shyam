import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Base shimmer primitive with smooth animated pulse and subtle gradient glow.
 */
export const Skeleton: React.FC<SkeletonProps> = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-800/80 border border-slate-700/30 relative overflow-hidden ${className}`}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-slate-700/20 to-transparent" />
    </div>
  );
};

/**
 * Skeleton loader for KPI / Stat Metric Cards on Dashboard
 */
export const StatCardSkeleton: React.FC = () => {
  return (
    <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <Skeleton className="w-16 h-5 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="w-24 h-3 rounded-md" />
        <Skeleton className="w-36 h-7 rounded-lg" />
      </div>
      <div className="pt-2 border-t border-slate-800/60 flex justify-between items-center">
        <Skeleton className="w-28 h-3 rounded-md" />
        <Skeleton className="w-12 h-3 rounded-md" />
      </div>
    </div>
  );
};

/**
 * Skeleton loader for Game Cards (e.g., Lucky 12 cards, 2D/3D Lottery cards)
 */
export const GameCardSkeleton: React.FC<{ count?: number }> = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-lg"
        >
          {/* Header & Tag */}
          <div className="flex items-center justify-between">
            <Skeleton className="w-16 h-4 rounded-md" />
            <Skeleton className="w-12 h-5 rounded-full" />
          </div>

          {/* Image / Thumbnail placeholder */}
          <div className="w-full h-32 rounded-xl overflow-hidden my-1">
            <Skeleton className="w-full h-full" />
          </div>

          {/* Card Info */}
          <div className="space-y-2">
            <Skeleton className="w-3/4 h-5 rounded-md" />
            <div className="flex justify-between items-center">
              <Skeleton className="w-20 h-4 rounded-md" />
              <Skeleton className="w-16 h-4 rounded-md" />
            </div>
          </div>

          {/* Button placeholder */}
          <Skeleton className="w-full h-10 rounded-xl" />
        </div>
      ))}
    </>
  );
};

/**
 * Reusable Skeleton loader for Data Tables (Transactions, Bets, Users)
 */
export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
      {/* Table Header */}
      <div className="p-4 bg-slate-800/40 border-b border-slate-800 flex gap-4">
        {Array.from({ length: cols }).map((_, cIdx) => (
          <Skeleton key={cIdx} className="h-4 flex-1 rounded-md" />
        ))}
      </div>
      {/* Table Body */}
      <div className="divide-y divide-slate-800/50 p-2">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="p-3.5 flex items-center gap-4">
            {Array.from({ length: cols }).map((_, cIdx) => (
              <Skeleton
                key={cIdx}
                className={`h-4 flex-1 rounded-md ${cIdx === 0 ? 'w-12 flex-none' : ''}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Skeleton loader for full Admin Dashboard View
 */
export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80">
        <div className="space-y-2">
          <Skeleton className="w-48 h-7 rounded-lg" />
          <Skeleton className="w-72 h-4 rounded-md" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="w-28 h-10 rounded-xl" />
          <Skeleton className="w-32 h-10 rounded-xl" />
        </div>
      </div>

      {/* KPI Metrics Grid Skeleton (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Middle Analytics & Live Games Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="w-40 h-6 rounded-md" />
            <Skeleton className="w-24 h-8 rounded-lg" />
          </div>
          <Skeleton className="w-full h-64 rounded-xl" />
        </div>

        {/* Live Game Status Column (1 Col) */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <Skeleton className="w-36 h-6 rounded-md" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-3 bg-slate-800/40 rounded-xl space-y-2 border border-slate-800/60">
                <div className="flex justify-between items-center">
                  <Skeleton className="w-24 h-4 rounded-md" />
                  <Skeleton className="w-12 h-5 rounded-full" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="flex-1 h-8 rounded-lg" />
                  <Skeleton className="flex-1 h-8 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bets / Activity Table Skeleton */}
      <TableSkeleton rows={5} cols={5} />
    </div>
  );
};

/**
 * Skeleton loader for Player Game Portal View
 */
export const GamePortalSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Wallet Banner Skeleton */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800/90 border border-slate-800/80 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-3">
          <Skeleton className="w-32 h-4 rounded-md" />
          <Skeleton className="w-56 h-10 rounded-xl" />
          <Skeleton className="w-40 h-4 rounded-md" />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Skeleton className="flex-1 md:w-32 h-12 rounded-2xl" />
          <Skeleton className="flex-1 md:w-32 h-12 rounded-2xl" />
        </div>
      </div>

      {/* Game Selector Tabs */}
      <div className="flex gap-3 bg-slate-900/80 p-2 rounded-2xl border border-slate-800/80 w-fit">
        <Skeleton className="w-28 h-10 rounded-xl" />
        <Skeleton className="w-28 h-10 rounded-xl" />
        <Skeleton className="w-28 h-10 rounded-xl" />
      </div>

      {/* Game Content Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <GameCardSkeleton count={12} />
      </div>
    </div>
  );
};

/**
 * Generic Card Skeleton
 */
export const CardSkeleton: React.FC<{ lines?: number }> = ({ lines = 3 }) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <Skeleton className="w-32 h-5 rounded-md" />
        <Skeleton className="w-8 h-8 rounded-lg" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className={`h-4 rounded-md ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
        ))}
      </div>
    </div>
  );
};
