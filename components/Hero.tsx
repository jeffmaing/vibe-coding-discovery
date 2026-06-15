'use client';

import { useState } from 'react';
import ScrollReveal from './ScrollReveal';
import Link from 'next/link';

const quickTags = [
  { label: '个人网站', href: '/category/portfolio' },
  { label: 'AI 应用', href: '/category/ai' },
  { label: '效率工具', href: '/category/productivity' },
  { label: 'SaaS 模板', href: '/category/saas' },
  { label: '移动端', href: '/category/mobile' },
  { label: '全栈模板', href: '/category/fullstack' },
];

export default function Hero() {
  const [query, setQuery] = useState('');

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/?q=${encodeURIComponent(query.trim())}`;
    }
  };

  return (
    <section className="relative bg-white">
      <div className="max-w-content mx-auto px-6 pt-8 pb-12 md:pt-12 md:pb-16 text-center">
        <ScrollReveal delay={0}>
          <h1 className="text-[28px] md:text-[36px] leading-[1.15] font-semibold tracking-tight text-apple-ink text-balance">
            想做个项目？<br className="hidden md:block" />先看看别人怎么做的
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <form onSubmit={submitSearch} className="mt-6 max-w-[600px] mx-auto">
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
                placeholder="我想做一个..."
                className="w-full h-12 pl-14 pr-20 text-[15px] bg-apple-bgSecondary rounded-pill placeholder:text-apple-gray focus:outline-none focus:bg-white focus:ring-4 focus:ring-apple-blueSoft transition"
                aria-label="搜索项目"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-1 text-[12px] text-apple-gray bg-white border border-apple-border rounded px-2 py-0.5 pointer-events-none">
                <span>⌘K</span>
              </span>
            </div>
          </form>
        </ScrollReveal>

        <ScrollReveal delay={160}>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {quickTags.map((tag) => (
              <Link
                key={tag.href}
                href={tag.href}
                className="px-4 py-1.5 text-[13px] text-apple-ink bg-apple-bgSecondary rounded-pill hover:bg-white hover:ring-1 hover:ring-apple-border transition"
              >
                {tag.label}
              </Link>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
