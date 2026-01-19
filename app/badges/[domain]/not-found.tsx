import Link from 'next/link';
import { WarningCircle } from '@phosphor-icons/react/dist/ssr';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8F5F2] dark:bg-zinc-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="fixed inset-0 z-0 opacity-[0.08] dark:opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #A8B89F 1px, transparent 0)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Floating Blobs */}
      <div className="fixed -top-[15%] -left-[15%] w-[900px] h-[900px] bg-[#A8B89F] dark:bg-emerald-900 rounded-full blur-[140px] opacity-20 dark:opacity-10 z-0" />
      <div className="fixed -bottom-[15%] -right-[15%] w-[700px] h-[700px] bg-[#E6BAA3] dark:bg-amber-900 rounded-full blur-[140px] opacity-20 dark:opacity-10 z-0" />

      <div className="relative z-10 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/90 dark:border-zinc-800 rounded-[44px] p-10 max-w-md text-center shadow-[0_40px_100px_-30px_rgba(60,71,58,0.1)]">
        <div className="w-16 h-16 rounded-full bg-[#E6BAA3]/20 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-6">
          <WarningCircle size={32} className="text-[#D4A373] dark:text-red-400" />
        </div>
        <h1 className="text-2xl font-semibold text-[#3C473A] dark:text-zinc-100 mb-2">UCP Profile Not Found</h1>
        <p className="text-[#A8B89F] dark:text-zinc-400 mb-6 text-sm">
          This domain doesn&apos;t have a valid UCP discovery profile at{' '}
          <code className="text-[#3C473A] dark:text-zinc-200 bg-[#3C473A]/5 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-xs">
            /.well-known/ucp
          </code>
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-[#3C473A] dark:bg-zinc-700 hover:bg-[#D4A373] dark:hover:bg-amber-600 text-white font-semibold rounded-2xl transition-all duration-300"
        >
          Browse UCP Merchants
        </Link>
      </div>
    </div>
  );
}
