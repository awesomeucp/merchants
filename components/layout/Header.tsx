'use client';

import Link from 'next/link';
import { ThemeSwitcher } from '@/components/theme/ThemeSwitcher';
import { House, GithubLogo, MagnifyingGlass, PlusCircle } from '@phosphor-icons/react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-900/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <House size={24} weight="duotone" />
              <span>UCP Merchants</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors flex items-center gap-1.5"
            >
              <MagnifyingGlass size={16} weight="regular" />
              Browse
            </Link>
            <Link
              href="/submit"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors flex items-center gap-1.5"
            >
              <PlusCircle size={16} weight="regular" />
              Submit
            </Link>
            <a
              href="https://github.com/awesomeucp/merchants"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors flex items-center gap-1.5"
            >
              <GithubLogo size={16} weight="fill" />
              GitHub
            </a>
            <ThemeSwitcher />
          </nav>
        </div>
      </div>
    </header>
  );
}
