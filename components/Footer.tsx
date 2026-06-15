import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-apple-bgSecondary border-t border-apple-border/60">
      <div className="max-w-content mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-apple-ink text-white text-[11px] font-bold">
                V
              </span>
              <span className="text-[15px] font-semibold text-apple-ink">
                Vibe Coding
              </span>
            </div>
            <p className="text-[13px] leading-relaxed text-apple-gray max-w-md">
              精选 GitHub 上最适合新手的开源项目，用中文解读，一键复制给 AI 就能做。
            </p>
          </div>
          <div className="flex items-center gap-6 text-[13px]">
            <Link href="/" className="text-apple-gray hover:text-apple-ink transition-colors">
              排行榜
            </Link>
            <a
              href="https://github.com/trending"
              target="_blank"
              rel="noopener noreferrer"
              className="text-apple-gray hover:text-apple-ink transition-colors"
            >
              GitHub Trending
            </a>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-apple-border/60">
          <p className="text-[12px] text-apple-gray text-center">
            {year} Vibe Coding. 数据来源 GitHub API. 仅供学习交流使用.
          </p>
        </div>
      </div>
    </footer>
  );
}
