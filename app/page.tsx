import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { fetchCurrentMovementRepos, transformRepoToProject } from '@/lib/github';
import { formatNumber } from '@/lib/utils';
import type { Project } from '@/types';

export const revalidate = 3600;

const storyLines = [
  '正在重新定义人和工具的关系',
  '让一个人也能完成完整产品',
  '把复杂技术变成可以动手的起点',
  '正在成为新一代创作者的工作台',
  '让灵感更快变成看得见的作品',
];

function StoryCard({ project, index, className = '' }: { project: Project; index: number; className?: string }) {
  return (
    <Link href={`/project/${encodeURIComponent(project.fullName)}`} className={`story-card ${className}`}>
      <span className="story-mark" aria-hidden="true">{project.name.slice(0, 2)}</span>
      <Image
        src={project.ownerAvatar}
        alt={`${project.owner} 的头像`}
        fill
        sizes="(max-width: 768px) 88vw, 38vw"
        loading={index < 4 ? 'eager' : 'lazy'}
      />
      <span className="story-scrim" />
      <span className="story-copy">
        <small>{project.category === 'other' ? project.language : project.category}</small>
        <strong>{project.name}</strong>
        <span>{storyLines[index % storyLines.length]}</span>
        <em>{formatNumber(project.stars)} stars</em>
      </span>
    </Link>
  );
}

export default async function HomePage() {
  let projects: Project[] = [];

  try {
    const repos = await fetchCurrentMovementRepos();
    projects = repos.map(transformRepoToProject).slice(0, 12);
  } catch {
    projects = [];
  }

  return (
    <main className="home-page">
      <section className="home-hero" id="inspiration">
        <div className="hero-copy">
          <p className="eyebrow">WHAT&apos;S MOVING NOW</p>
          <h1>看见新的。<br />做出你的。</h1>
          <p className="hero-intro">追踪正在发生的 AI、产品和创作趋势，再把灵感变成自己的作品。</p>
          <div className="hero-actions">
            <a href="#projects" className="primary-button">看看现在流行什么</a>
            <Link href="/make" className="secondary-button">我已经有想法了 <ArrowRight size={18} /></Link>
          </div>
        </div>

        <div className="hero-gallery" aria-label="热门项目视觉精选">
          {projects.length >= 4 ? (
            <>
              <StoryCard project={projects[0]} index={0} className="story-main" />
              <StoryCard project={projects[1]} index={1} className="story-top" />
              <StoryCard project={projects[2]} index={2} className="story-bottom" />
              <StoryCard project={projects[3]} index={3} className="story-edge" />
            </>
          ) : (
            <div className="trend-empty">
              <span>趋势正在更新</span>
              <p>GitHub 数据暂时不可用，请稍后再来看看。</p>
            </div>
          )}
        </div>
      </section>

      <section className="trend-section" id="projects">
        <div className="trend-heading">
          <h2>现在，大家在做什么</h2>
          <Link href="/category/ai">查看全部 <ArrowRight size={17} /></Link>
        </div>
        {projects.length > 0 ? (
          <div className="trend-rail">
            {projects.slice(4).map((project, index) => (
              <StoryCard key={project.id} project={project} index={index + 4} />
            ))}
          </div>
        ) : (
          <div className="trend-empty compact">暂时没有可展示的项目</div>
        )}
      </section>
    </main>
  );
}
