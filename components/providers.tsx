'use client';

import { ThemeProvider } from '@/components/theme/ThemeProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
