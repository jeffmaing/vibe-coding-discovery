'use client';

import { useState } from 'react';
import ScrollReveal from './ScrollReveal';

export default function Hero() {
  const [query, setQuery] = useState('');

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/?q=${encodeURIComponent(query.trim())}`;
    }
  };

  return (
    <section className="relative pt-12 bg-white">
      <div className="max-w-content mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32 text-center">
        <ScrollReveal delay={0}>
          <p className="text-[14px] md:text-[15px] font-medium text-apple-blue tracking-wide uppercase mb-4">
            Vibe Coding 发现
          </p>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <h1 className="text-[40px] md:text-[56px] leading-[1.1] font-semibold tracking-tight text-apple-ink text-balance">
            发现最火的开源项目
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={160}>
          <p className="mt-5 text-[19px] md:text-[24px] font-normal text-apple-gray max-w-2xl mx-auto text-balance">
            精选 GitHub 各类别最受欢迎项目，按分类浏览，找到适合你的下一个项目
          </p>
        </ScrollReveal>

        <ScrollReveal delay={240}>
          <form onSubmit={submitSearch} className="mt-10 max-w-[600px] mx-auto">
            <div className="relative">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-apple-gray pointer-events-none"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索项目，如：记账、简历、AI..."
                className="w-full h-14 pl-14 pr-6 text-[17px] bg-apple-bgSecondary rounded-pill placeholder:text-apple-gray focus:outline-none focus:bg-white focus:ring-4 focus:ring-apple-blueSoft transition"
                aria-label="搜索项目"
              />
            </div>
          </form>
        </ScrollReveal>
      </div>
    </section>
  );
}
