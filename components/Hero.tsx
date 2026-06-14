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
    <section className="relative pt-12 bg-white">
      <div className="max-w-content mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-20 text-center">
        <ScrollReveal delay={0}>
          <p className="text-[14px] md:text-[15px] font-medium text-apple-blue tracking-wide uppercase mb-4">
            Vibe Coding 发现
          </p>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <h1 className="text-[36px] md:text-[52px] leading-[1.1] font-semibold tracking-tight text-apple-ink text-balance">
            想做个项目？<br className="hidden md:block" />先看看别人怎么做的
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={160}>
          <p className="mt-5 text-[17px] md:text-[21px] font-normal text-apple-gray max-w-2xl mx-auto text-balance">
            告诉 AI 你的想法，推荐最适合参考的开源项目<br className="hidden md:block" />
            支持 Claude Code / Cursor / Hermes Skills 一键搭建
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
                placeholder="我想做一个..."
                className="w-full h-14 pl-14 pr-6 text-[17px] bg-apple-bgSecondary rounded-pill placeholder:text-apple-gray focus:outline-none focus:bg-white focus:ring-4 focus:ring-apple-blueSoft transition"
                aria-label="搜索项目"
              />
            </div>
          </form>
        </ScrollReveal>

        <ScrollReveal delay={320}>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {quickTags.map((tag) => (
              <Link
                key={tag.href}
                href={tag.href}
                className="px-4 py-2 text-[14px] text-apple-ink bg-apple-bgSecondary rounded-pill hover:bg-white hover:ring-1 hover:ring-apple-border transition"
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
