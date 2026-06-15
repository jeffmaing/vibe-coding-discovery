import Link from 'next/link';
import type { Project } from '@/types';
import ProjectCard from './ProjectCard';
import ScrollReveal from './ScrollReveal';

interface CategorySectionProps {
  id: string;
  title: string;
  subtitle: string;
  projects: Project[];
}

export default function CategorySection({
  id,
  title,
  subtitle,
  projects,
}: CategorySectionProps) {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-16">
      <div className="max-w-content mx-auto px-6">
        <ScrollReveal>
          <div className="flex items-end justify-between gap-6 mb-8">
            <div>
              <h2 className="text-[24px] md:text-[28px] font-semibold tracking-tight text-apple-ink leading-tight">
                {title}
              </h2>
              <p className="mt-1.5 text-[15px] md:text-[16px] text-apple-gray">
                {subtitle}
              </p>
            </div>
            <Link
              href={`/category/${id}`}
              className="group inline-flex items-center gap-1 text-[14px] md:text-[15px] text-apple-blue font-medium whitespace-nowrap"
            >
              查看全部
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {projects.slice(0, 4).map((project, idx) => (
            <ScrollReveal key={project.id} delay={idx * 80}>
              <ProjectCard project={project} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
