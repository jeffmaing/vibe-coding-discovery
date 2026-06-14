import Link from 'next/link';
import { categories } from '@/lib/categories';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-apple-bgSecondary border-t border-apple-border/60">
      <div className="max-w-content mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-apple-ink text-white text-[11px] font-bold">
                V
              </span>
              <span className="text-[15px] font-semibold text-apple-ink">
                Vibe Coding
              </span>
            </div>
            <p className="text-[13px] leading-relaxed text-apple-gray max-w-xs">
              发现 GitHub 上最火的开源项目，按分类浏览，找到适合你的下一个项目。
            </p>
          </div>

          <div>
            <h4 className="text-[12px] font-semibold text-apple-ink uppercase tracking-wider mb-3">
              分类
            </h4>
            <ul className="space-y-2">
              {categories.slice(0, 3).map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/category/${c.id}`}
                    className="text-[13px] text-apple-gray hover:text-apple-ink transition-colors"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-semibold text-apple-ink uppercase tracking-wider mb-3">
              更多分类
            </h4>
            <ul className="space-y-2">
              {categories.slice(3).map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/category/${c.id}`}
                    className="text-[13px] text-apple-gray hover:text-apple-ink transition-colors"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-semibold text-apple-ink uppercase tracking-wider mb-3">
              资源
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/trending"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-apple-gray hover:text-apple-ink transition-colors"
                >
                  GitHub Trending
                </a>
              </li>
              <li>
                <a
                  href="https://docs.github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-apple-gray hover:text-apple-ink transition-colors"
                >
                  GitHub Docs
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-apple-border/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p className="text-[12px] text-apple-gray">
            © {year} Vibe Coding 发现. 数据来源 GitHub API.
          </p>
          <p className="text-[12px] text-apple-gray">
            仅供学习交流使用
          </p>
        </div>
      </div>
    </footer>
  );
}
