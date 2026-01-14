import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingSkeleton = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Logo skeleton */}
        <div className="flex justify-center">
          <Skeleton className="h-24 w-24 rounded-full" />
        </div>

        {/* Title skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 mx-auto rounded" />
          <Skeleton className="h-6 w-64 mx-auto rounded" />
        </div>

        {/* Progress bar skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-2 w-full rounded" />
        </div>

        {/* Content skeletons */}
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-2 w-2 rounded-full" />
              <Skeleton className="h-4 flex-1 rounded" />
            </div>
          ))}
        </div>

        {/* Tip card skeleton */}
        <div className="p-4">
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;