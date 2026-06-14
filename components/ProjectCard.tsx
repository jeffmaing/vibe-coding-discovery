import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
}

function formatStars(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(num >= 10000 ? 0 : 1)}k`;
  }
  return num.toString();
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={project.htmlUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block h-[280px] bg-white rounded-apple border border-apple-border p-6 flex flex-col transition-all duration-300 ease-apple hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(0,0,0,0.04)] hover:border-apple-border/80"
    >
      <div className="flex items-start justify-between mb-5">
        <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-apple-bg flex items-center justify-center">
          <Image
            src={project.ownerAvatar}
            alt={`${project.owner} avatar`}
            width={64}
            height={64}
            className="object-cover"
          />
        </div>
        <span className="inline-flex items-center gap-1 text-[12px] text-apple-gray">
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
      </div>

      <h3 className="text-[16px] font-semibold tracking-tight text-apple-ink truncate">
        {project.name}
      </h3>
      <p className="mt-2 text-[14px] leading-[1.45] text-apple-gray line-clamp-2 flex-1">
        {project.description}
      </p>

      <div className="mt-4 flex items-center gap-2 text-[12px] text-apple-gray">
        <span className="inline-flex items-center gap-1">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: '#1D1D1F' }}
            aria-hidden="true"
          />
          {project.language || 'Unknown'}
        </span>
        <span className="text-apple-border">·</span>
        <span className="truncate">{project.topics?.[0] || '开源'}</span>
      </div>
    </Link>
  );
}
