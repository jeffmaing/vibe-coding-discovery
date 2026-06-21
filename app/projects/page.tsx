import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ExternalLink, Github } from 'lucide-react';
import { fetchCurrentMovementRepos, transformRepoToProject } from '@/lib/github';
import { formatNumber } from '@/lib/utils';
import type { Project } from '@/types';

export const revalidate = 1800;

export default async function ProjectsPage() {
  let projects: Project[] = [];

  try {
    const repos = await fetchCurrentMovementRepos();
    projects = repos.map(transformRepoToProject).filter(p => p.demoUrl);
  } catch {
    projects = [];
  }

  // 按stars排序
  projects.sort((a, b) => b.stars - a.stars);

  return (
    <main className="projects-page">
      {/* Hero Section */}
      <section className="projects-hero">
        <div className="projects-hero-content">
          <div className="projects-badge">
            <ExternalLink size={18} />
            <span>作品展示</span>
          </div>
          <h1>看看别人<br />做出了什么</h1>
          <p className="projects-intro">
            这些项目都有在线 Demo，可以直接体验。从灵感开始，做出你自己的作品。
          </p>
        </div>
      </section>

      {/* Projects List */}
      <section className="projects-list">
        {projects.length > 0 ? (
          <div className="projects-grid">
            {projects.map((project, index) => (
              <article key={project.id} className="project-item" style={{ animationDelay: `${index * 50}ms` }}>
                <div className="project-item-rank">
                  <span>#{index + 1}</span>
                </div>
                
                <div className="project-item-avatar">
                  <Image
                    src={project.ownerAvatar}
                    alt={project.owner}
                    width={56}
                    height={56}
                  />
                </div>

                <div className="project-item-info">
                  <div className="project-item-header">
                    <h3>{project.name}</h3>
                    <span className="project-item-lang">{project.language}</span>
                  </div>
                  <p className="project-item-desc">{project.description}</p>
                  <div className="project-item-meta">
                    <span className="project-item-owner">@{project.owner}</span>
                    <span className="project-item-stars">⭐ {formatNumber(project.stars)}</span>
                  </div>
                </div>

                <div className="project-item-actions">
                  <Link
                    href={`/project/${encodeURIComponent(project.fullName)}`}
                    className="project-item-btn project-item-btn-detail"
                  >
                    详情
                  </Link>
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-item-btn project-item-btn-demo"
                    >
                      体验 <ExternalLink size={14} />
                    </a>
                  )}
                  <a
                    href={project.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-item-btn project-item-btn-github"
                    aria-label="GitHub"
                  >
                    <Github size={16} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="projects-empty">
            <ExternalLink size={48} />
            <h2>作品正在赶来</h2>
            <p>GitHub 数据暂时不可用，请稍后再来。</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="projects-cta">
        <h2>有了灵感？</h2>
        <p>从这些作品中获得启发，开始你自己的项目。</p>
        <Link href="/make" className="projects-cta-btn">
          做点什么 <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  );
}
