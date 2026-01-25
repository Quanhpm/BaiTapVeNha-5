// Reusable Select component

import type { SelectHTMLAttributes, ReactNode } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  options?: SelectOption[];
  children?: ReactNode;
}

const Select = ({ 
  label, 
  error, 
  options,
  className = '',
  children,
  ...props 
}: SelectProps) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007ee1] ${
          error ? 'border-[#bc738c]' : 'border-gray-300'
        } ${className}`}
        {...props}
      >
        {options ? (
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))
        ) : (
          children
        )}
      </select>
      {error && (
        <p className="mt-1 text-sm text-[#bc738c]">{error}</p>
      )}
    </div>
  );
};

export default Select;