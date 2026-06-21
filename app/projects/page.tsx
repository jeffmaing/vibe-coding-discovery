'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ExternalLink, Github } from 'lucide-react';
import type { Project } from '@/types';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const createdAfter = new Date();
        createdAfter.setMonth(createdAfter.getMonth() - 18);
        const pushedAfter = new Date();
        pushedAfter.setMonth(pushedAfter.getMonth() - 4);

        const response = await fetch(
          `https://api.github.com/search/repositories?q=stars:>100+created:>${createdAfter.toISOString().slice(0, 10)}+pushed:>${pushedAfter.toISOString().slice(0, 10)}+archived:false&sort=stars&order=desc&per_page=30`,
          {
            headers: { Accept: 'application/vnd.github.v3+json' },
          }
        );

        if (!response.ok) throw new Error('Failed to fetch');

        const data = await response.json();

        // 转换为Project格式，只保留有demo的项目
        const transformed: Project[] = data.items
          .filter((repo: any) => repo.homepage)
          .map((repo: any) => ({
            id: repo.full_name,
            name: repo.name,
            fullName: repo.full_name,
            owner: repo.owner.login,
            ownerAvatar: repo.owner.avatar_url,
            description: repo.description || '暂无描述',
            stars: repo.stargazers_count,
            language: repo.language || 'Unknown',
            topics: repo.topics || [],
            difficulty: 'medium',
            demoUrl: repo.homepage,
            category: 'other',
            trendingScore: 0,
            createdAt: repo.created_at,
            updatedAt: repo.updated_at,
            htmlUrl: repo.html_url,
          }));

        // 按stars排序
        transformed.sort((a, b) => b.stars - a.stars);
        setProjects(transformed);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

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
        {loading ? (
          <div className="projects-loading">
            <ExternalLink size={32} className="loading-icon" />
            <p>正在从 GitHub 获取最新数据...</p>
          </div>
        ) : projects.length > 0 ? (
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

function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
}
