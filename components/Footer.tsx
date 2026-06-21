import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <Link href="/" className="brand-wordmark">Vibe yourself</Link>
        <p>看见正在发生的，做出属于自己的。</p>
      </div>
      <div className="footer-links">
        <Link href="/">NOW</Link>
        <Link href="/make">做点什么</Link>
        <a href="https://github.com/trending" target="_blank" rel="noreferrer">GitHub Trending</a>
      </div>
    </footer>
  );
}
