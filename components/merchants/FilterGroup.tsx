'use client';

import { Checkbox } from '@/components/ui/Checkbox';
import { ReactNode } from 'react';

interface FilterOption {
  name: string;
  count: number;
  displayName?: string;
}

interface FilterGroupProps {
  title: string;
  icon?: ReactNode;
  options: FilterOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function FilterGroup({ title, icon, options, selected, onChange }: FilterGroupProps) {
  const handleToggle = (optionName: string) => {
    if (selected.includes(optionName)) {
      onChange(selected.filter(s => s !== optionName));
    } else {
      onChange([...selected, optionName]);
    }
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
        {icon && <span className="text-blue-600 dark:text-blue-400">{icon}</span>}
        {title}
      </h3>
      <div className="space-y-2">
        {options.map(option => (
          <Checkbox
            key={option.name}
            label={option.displayName || option.name}
            count={option.count}
            checked={selected.includes(option.name)}
            onChange={() => handleToggle(option.name)}
          />
        ))}
      </div>
    </div>
  );
}
