'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ThemeSwitcher } from '@/components/theme/ThemeSwitcher';
import { House, GithubLogo, MagnifyingGlass, PlusCircle, List, X } from '@phosphor-icons/react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-900/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={closeMobileMenu}
            >
              <House size={24} weight="duotone" />
              <span className="hidden xs:inline">UCP Merchants</span>
              <span className="xs:hidden">UCP</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
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

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeSwitcher />
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X size={24} weight="bold" />
              ) : (
                <List size={24} weight="bold" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 text-base font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              onClick={closeMobileMenu}
            >
              <MagnifyingGlass size={20} weight="regular" />
              Browse Merchants
            </Link>
            <Link
              href="/submit"
              className="flex items-center gap-3 px-4 py-3 text-base font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              onClick={closeMobileMenu}
            >
              <PlusCircle size={20} weight="regular" />
              Submit Merchant
            </Link>
            <a
              href="https://github.com/awesomeucp/merchants"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 text-base font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              onClick={closeMobileMenu}
            >
              <GithubLogo size={20} weight="fill" />
              GitHub Repository
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
