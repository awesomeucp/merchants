import { type InputHTMLAttributes } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  count?: number;
}

export function Checkbox({ label, count, className = '', ...props }: CheckboxProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <input
        type="checkbox"
        className={`
          w-4 h-4
          text-blue-600
          bg-white dark:bg-zinc-900
          border-zinc-300 dark:border-zinc-700
          rounded
          focus:ring-2 focus:ring-blue-500 focus:ring-offset-0
          cursor-pointer
          ${className}
        `}
        {...props}
      />
      <span className="text-sm text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 flex-1">
        {label}
      </span>
      {count !== undefined && (
        <span className="text-xs text-zinc-500 dark:text-zinc-500">
          {count}
        </span>
      )}
    </label>
  );
}
