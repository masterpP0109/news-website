import React from 'react';

interface LoadingSkeletonProps {
  count?: number;
  className?: string;
  itemClassName?: string;
}

/**
 * Reusable loading skeleton component
 */
export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  count = 1,
  className = '',
  itemClassName = ''
}) => {
  return (
    <div className={className}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className={`animate-pulse ${itemClassName}`}>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
          <div className="flex gap-2">
            <div className="h-3 bg-gray-200 rounded w-16"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Specific skeleton for article cards
 */
export const ArticleSkeleton: React.FC<{ count?: number }> = ({ count = 1 }) => {
  return (
    <div className="flex flex-col divide-y w-[250px] space-x-4 divide-gray-300 border-[1px] border-r-gray-500 mb-12 px-[1px] border-b-0">
      {Array.from({ length: count }, (_, index) => (
        <article key={index} className="flex flex-col py-4">
          <div className="relative h-30 w-[200px] mb-3 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
          <div className="flex gap-2">
            <div className="h-3 bg-gray-200 rounded w-16"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
        </article>
      ))}
    </div>
  );
};

/**
 * Specific skeleton for sidebar items
 */
export const SidebarSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="px-2 py-2">
      <div className="flex flex-col w-[220px] border-l-[1px] border-l-gray-500 mb-12 px-3 border-b-0">
        <div className="w-[150px] h-[9px] flex gap-[6px]">
          <div className="h-[5px] w-[30px] bg-rose-500 transform skew-x-3"></div>
          <div>
            <div className="w-[70px] border-t-[1px] border-b-[1px] border-gray-400 h-[5px]"></div>
          </div>
        </div>
        <h1>Top Stories</h1>
        <div className="flex flex-col divide-y space-x-4 divide-gray-300 mb-12 px-3 border-b-0">
          {Array.from({ length: count }, (_, index) => (
            <div key={index} className="flex items-center justify-between my-2">
              <div className="flex flex-col items-start gap-2">
                <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-2 bg-gray-200 rounded w-12 animate-pulse"></div>
              </div>
              <div className="w-[60px] h-[60px] bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};