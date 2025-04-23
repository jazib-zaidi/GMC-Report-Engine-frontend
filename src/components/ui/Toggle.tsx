import React from 'react';
import { cn } from '../../utils/cn';

interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, label, description, checked, disabled, onChange, ...props }, ref) => {
    return (
      <label className={cn('relative inline-flex items-start cursor-pointer', disabled && 'cursor-not-allowed opacity-50', className)}>
        <div className="flex items-center h-6">
          <input
            ref={ref}
            type="checkbox"
            className="sr-only"
            checked={checked}
            disabled={disabled}
            onChange={onChange}
            {...props}
          />
          <div
            className={cn(
              'relative w-11 h-6 rounded-full transition-colors',
              checked ? 'bg-primary-600' : 'bg-gray-300'
            )}
          >
            <div
              className={cn(
                'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform',
                checked && 'translate-x-5'
              )}
            />
          </div>
        </div>
        {(label || description) && (
          <div className="ml-3 text-sm">
            {label && <span className="font-medium text-gray-900">{label}</span>}
            {description && (
              <p className="text-gray-500">{description}</p>
            )}
          </div>
        )}
      </label>
    );
  }
);

Toggle.displayName = 'Toggle';

export default Toggle;