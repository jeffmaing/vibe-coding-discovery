'use client';

import type { Project } from '@/types';
import ProjectCard from './ProjectCard';
import ScrollReveal from './ScrollReveal';

interface ProjectGridProps {
  projects: Project[];
  emptyText?: string;
}

export default function ProjectGrid({
  projects,
  emptyText = '暂无项目',
}: ProjectGridProps) {
  if (!projects || projects.length === 0) {
    return (
      <div className="py-20 text-center text-apple-gray text-[15px]">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {projects.map((project, idx) => (
        <ScrollReveal key={project.id} delay={(idx % 8) * 60}>
          <ProjectCard project={project} />
        </ScrollReveal>
      ))}
    </div>
  );
}
