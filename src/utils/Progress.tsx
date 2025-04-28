import React, { forwardRef } from 'react';
import { cn } from '../utils/cn';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  className?: string;
  color?: 'blue' | 'green' | 'red' | 'gray'; // Added color prop
  determinate?: boolean; // Added determinate prop
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    { className, value = 0, color = 'blue', determinate = true, ...props },
    ref
  ) => {
    const progressBarStyle = determinate
      ? { width: `${Math.min(100, Math.max(0, value))}%` }
      : {
          width: '100%',
          animation: 'indeterminate-progress 1.5s linear infinite',
        };

    const colorClasses = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      red: 'bg-red-500',
      gray: 'bg-gray-500',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'w-full h-2 rounded-full relative overflow-hidden',
          'bg-gray-200',
          className
        )}
        {...props}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            colorClasses[color],
            'absolute inset-0'
          )}
          style={progressBarStyle}
        />
        {!determinate && (
          <style jsx global>{`
            @keyframes indeterminate-progress {
              0% {
                transform: translateX(-100%);
              }
              100% {
                transform: translateX(100%);
              }
            }
          `}</style>
        )}
      </div>
    );
  }
);
Progress.displayName = 'Progress';

export { Progress };
