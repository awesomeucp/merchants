'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getInitials } from '@/lib/utils/format';
import type { MerchantLogo as LogoType } from '@/lib/types/merchant';

interface MerchantLogoProps {
  logo: LogoType;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function MerchantLogo({ logo, name, size = 'md' }: MerchantLogoProps) {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-12 h-12 text-sm',
    md: 'w-16 h-16 text-base',
    lg: 'w-24 h-24 text-2xl',
    xl: 'w-32 h-32 text-4xl',
  };

  const sizePx = {
    sm: 48,
    md: 64,
    lg: 96,
    xl: 128,
  };

  const showFallback = !logo.url || imageError;

  return (
    <div className={`${sizeClasses[size]} relative rounded-lg overflow-hidden flex items-center justify-center ${
      showFallback
        ? 'bg-blue-600 dark:bg-blue-600'
        : 'bg-white dark:bg-zinc-900'
    }`}>
      {!showFallback ? (
        <Image
          src={logo.url}
          alt={logo.alt || `${name} logo`}
          width={logo.width || sizePx[size]}
          height={logo.height || sizePx[size]}
          className="object-cover w-full h-full"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="font-bold text-white">
          {getInitials(name)}
        </span>
      )}
    </div>
  );
}
