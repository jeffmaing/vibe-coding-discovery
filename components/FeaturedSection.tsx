import type { Project } from '@/types';
import FeaturedCard from './FeaturedCard';
import ScrollReveal from './ScrollReveal';

interface FeaturedSectionProps {
  projects: Project[];
}

export default function FeaturedSection({ projects }: FeaturedSectionProps) {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section className="bg-white pt-2 pb-16 md:pb-20">
      <div className="max-w-content mx-auto px-6">
        <ScrollReveal>
          <div className="mb-6">
            <h2 className="text-[22px] md:text-[24px] font-semibold tracking-tight text-apple-ink leading-tight">
              精选项目
            </h2>
            <p className="mt-1 text-[14px] md:text-[15px] text-apple-gray">
              本周最火
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.slice(0, 3).map((project, idx) => (
            <ScrollReveal key={project.id} delay={idx * 80}>
              <FeaturedCard project={project} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
