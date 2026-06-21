'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const links = [
  { href: '/', label: 'NOW' },
  { href: '/inspiration', label: '灵感' },
  { href: '/projects', label: '作品' },
];

export default function Navbar() {
  const [currentPath, setCurrentPath] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  useEffect(() => setOpen(false), [currentPath]);

  // 检查当前路径是否匹配链接
  const isActive = (href: string) => {
    if (href === '/') {
      return currentPath === '/' || 
             currentPath === '/vibe-coding-discovery' || 
             currentPath === '/vibe-coding-discovery/' ||
             currentPath.endsWith('/vibe-coding-discovery/');
    }
    return currentPath.includes(href);
  };

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="主导航">
        <Link href="/" className="brand-wordmark">
          Vibe yourself
        </Link>

        <div className="desktop-nav">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={isActive(link.href) ? 'active' : ''}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link href="/make" className="nav-cta">
          做点什么
        </Link>

        <button
          type="button"
          className="mobile-menu-button"
          aria-label={open ? '关闭菜单' : '打开菜单'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        {open && (
          <div className="mobile-nav">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
            <Link href="/make">做点什么</Link>
          </div>
        )}
      </nav>
    </header>
  );
}
