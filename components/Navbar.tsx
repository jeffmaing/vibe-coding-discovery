'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { categories } from '@/lib/categories';

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

        <ul className="hidden md:flex items-center gap-7 text-[13px] text-apple-ink/80">
          {categories.map((c) => (
            <li key={c.id}>
              <Link
                href={`/category/${c.id}`}
                className="hover:text-apple-ink transition-colors duration-200"
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>

        <form onSubmit={submitSearch} className="hidden sm:block flex-1 max-w-[260px]">
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

        <button
          type="button"
          aria-label="切换菜单"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-md text-apple-ink"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-5 w-5"
          >
            {open ? (
              <>
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-apple-border/60 bg-white/95 backdrop-blur-xl">
          <form
            onSubmit={submitSearch}
            className="px-6 py-3 border-b border-apple-border/60"
          >
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
                className="w-full h-10 pl-9 pr-3 text-[14px] bg-apple-bgSecondary rounded-pill placeholder:text-apple-gray focus:outline-none focus:bg-white focus:ring-4 focus:ring-apple-blueSoft transition"
              />
            </div>
          </form>
          <ul className="px-6 py-2">
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/category/${c.id}`}
                  className="block py-2 text-[15px] text-apple-ink/90"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
