'use client';

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
    <div className="group bg-white rounded-apple border border-apple-border p-5 flex flex-col transition-all duration-300 ease-apple hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(0,0,0,0.04)] hover:border-apple-border/80">
      <div className="flex items-start justify-between mb-4">
        <div className="relative h-14 w-14 rounded-2xl overflow-hidden bg-apple-bg flex items-center justify-center">
          <Image
            src={project.ownerAvatar}
            alt={`${project.owner} avatar`}
            width={56}
            height={56}
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

      <h3 className="text-[15px] font-semibold tracking-tight text-apple-ink truncate">
        {project.name}
      </h3>
      <p className="mt-1.5 text-[13px] leading-[1.45] text-apple-gray line-clamp-2 flex-1">
        {project.description}
      </p>

      <div className="mt-3 flex items-center gap-2 text-[12px] text-apple-gray">
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

      <div className="mt-4 flex gap-2">
        <Link
          href={project.htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center py-2 text-[12px] font-medium text-apple-ink bg-apple-bgSecondary rounded-pill hover:bg-white hover:ring-1 hover:ring-apple-border transition"
        >
          查看项目
        </Link>
        <button
          onClick={() => {
            const prompt = `参考这个 GitHub 项目 ${project.htmlUrl}，帮我做一个类似的项目`;
            navigator.clipboard.writeText(prompt);
          }}
          className="flex-1 text-center py-2 text-[12px] font-medium text-white bg-apple-ink rounded-pill hover:bg-apple-ink/90 transition"
        >
          Claude Code
        </button>
      </div>
    </div>
  );
}
