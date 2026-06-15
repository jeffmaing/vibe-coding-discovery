import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/types';

interface RankingItemProps {
  project: Project;
  rank: number;
}

function formatStars(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(num >= 10000 ? 0 : 1)}k`;
  }
  return num.toString();
}

const rankColor = (rank: number): string => {
  if (rank === 1) return 'text-[#C9A227]';
  if (rank === 2) return 'text-[#9CA3AF]';
  if (rank === 3) return 'text-[#B9743E]';
  return 'text-apple-gray';
};

export default function RankingItem({ project, rank }: RankingItemProps) {
  return (
    <Link
      href={`/project/${encodeURIComponent(project.fullName)}`}
      className="group flex items-center gap-4 md:gap-6 bg-white border border-apple-border rounded-apple px-5 md:px-6 py-4 transition-all duration-300 ease-apple hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(0,0,0,0.04)] hover:border-apple-border/80"
    >
      <div
        className={`w-10 md:w-12 shrink-0 text-center text-[28px] md:text-[32px] font-bold tracking-tight ${rankColor(rank)}`}
        aria-hidden="true"
      >
        {rank}
      </div>

      <div className="relative h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-xl overflow-hidden bg-apple-bgSecondary">
        <Image
          src={project.ownerAvatar}
          alt={`${project.owner} 图标`}
          width={48}
          height={48}
          className="object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-[15px] md:text-[16px] font-semibold tracking-tight text-apple-ink truncate">
          {project.name}
        </h3>
        <div className="mt-1 flex items-center gap-2 text-[12px] text-apple-gray">
          <span className="inline-flex items-center gap-1">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-3 w-3"
            >
              <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
            </svg>
            {formatStars(project.stars)}
          </span>
          <span className="text-apple-border">·</span>
          <span>{project.language || '未知'}</span>
        </div>
      </div>

      <div className="shrink-0 hidden sm:inline-flex items-center text-[13px] font-medium text-apple-ink bg-apple-bgSecondary rounded-pill px-4 py-1.5 group-hover:bg-apple-ink group-hover:text-white transition-colors">
        查看详情
      </div>
    </Link>
  );
}
