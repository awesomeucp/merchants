'use client';

import { Input } from '@/components/ui/Input';
import { MagnifyingGlass, Funnel } from '@phosphor-icons/react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onOpenFilters?: () => void;
}

export function SearchBar({ value, onChange, onOpenFilters }: SearchBarProps) {
  return (
    <div className="flex gap-2">
      <div className="flex-1 relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
          <MagnifyingGlass size={18} weight="regular" />
        </div>
        <Input
          type="search"
          placeholder="Search merchants..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10"
        />
      </div>
      {onOpenFilters && (
        <button
          onClick={onOpenFilters}
          className="lg:hidden px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <Funnel size={16} weight="regular" />
          Filters
        </button>
      )}
    </div>
  );
}
