'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';
import type { Project } from '@/types';

function formatNumber(num: number): string {
  if (num >= 1000) return `${(num / 1000).toFixed(num >= 10000 ? 0 : 1)}k`;
  return num.toString();
}

const storyLines = [
  '可以直接体验',
  '从灵感到作品',
  '做出你自己的',
  '看看别人怎么做的',
  '灵感从这里开始',
];

function ProjectCard({ project, index, className = '' }: { project: Project; index: number; className?: string }) {
  return (
    <Link
      href={`/project/${encodeURIComponent(project.fullName)}`}
      className={`story-card ${className}`}
    >
      <span className="story-mark" aria-hidden="true">{project.name.slice(0, 2)}</span>
      <Image
        src={project.ownerAvatar}
        alt={`${project.owner} 的头像`}
        fill
        sizes="(max-width: 768px) 88vw, 23vw"
        loading={index < 4 ? 'eager' : 'lazy'}
      />
      <span className="story-scrim" />
      <span className="story-copy">
        <small>{project.language}</small>
        <strong>{project.name}</strong>
        <span>{storyLines[index % storyLines.length]}</span>
        <em>{formatNumber(project.stars)} stars</em>
      </span>
    </Link>
  );
}

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
          { headers: { Accept: 'application/vnd.github.v3+json' } }
        );
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();

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
    <main className="home-page">
      {/* Hero */}
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">WORKS SHOWCASE</p>
          <h1>看看别人<br />做出了什么</h1>
          <p className="hero-intro">这些项目都有在线 Demo，可以直接体验。从灵感开始，做出你自己的作品。</p>
          <div className="hero-actions">
            <Link href="/make" className="primary-button">做点什么 <ArrowRight size={18} /></Link>
            {loading ? (
              <span className="secondary-button" style={{ opacity: 0.5 }}>加载中...</span>
            ) : (
              <span className="secondary-button">{projects.length} 个可体验项目</span>
            )}
          </div>
        </div>

        <div className="hero-gallery" aria-label="作品视觉精选">
          {loading ? (
            <div className="trend-empty"><span>作品正在赶来</span><p>正在从 GitHub 获取最新数据...</p></div>
          ) : projects.length >= 4 ? (
            <>
              <ProjectCard project={projects[0]} index={0} className="story-main" />
              <ProjectCard project={projects[1]} index={1} className="story-top" />
              <ProjectCard project={projects[2]} index={2} className="story-bottom" />
              <ProjectCard project={projects[3]} index={3} className="story-edge" />
            </>
          ) : (
            <div className="trend-empty"><span>作品正在赶来</span><p>GitHub 数据暂时不可用，请稍后再来。</p></div>
          )}
        </div>
      </section>

      {/* Projects Rail */}
      <section className="trend-section">
        <div className="trend-heading">
          <h2>全部作品</h2>
          {projects.length > 0 && (
            <span style={{ color: '#888', fontSize: '13px' }}>{projects.length} 个项目</span>
          )}
        </div>
        {loading ? (
          <div className="trend-empty compact">正在加载...</div>
        ) : projects.length > 0 ? (
          <div className="trend-rail">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        ) : (
          <div className="trend-empty compact">暂时没有可展示的项目</div>
        )}
      </section>
    </main>
  );
}
