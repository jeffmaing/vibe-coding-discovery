'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/?q=${encodeURIComponent(query.trim())}`;
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-12 bg-white/70 backdrop-blur-xl border-b border-apple-border/60">
      <nav className="max-w-content mx-auto h-full px-6 flex items-center justify-between gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-apple-ink"
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-apple-ink text-white text-[11px] font-bold">
            V
          </span>
          <span>Vibe Coding</span>
        </Link>

        <form onSubmit={submitSearch} className="flex-1 max-w-[320px]">
          <div className="relative">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-apple-gray pointer-events-none"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索项目"
              className="w-full h-8 pl-9 pr-3 text-[13px] bg-apple-bgSecondary rounded-pill placeholder:text-apple-gray focus:outline-none focus:bg-white focus:ring-4 focus:ring-apple-blueSoft transition"
            />
          </div>
        </form>
      </nav>
    </header>
  );
}
