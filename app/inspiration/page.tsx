'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { Project } from '@/types';

function formatNumber(num: number): string {
  if (num >= 1000) return `${(num / 1000).toFixed(num >= 10000 ? 0 : 1)}k`;
  return num.toString();
}

function categorizeByTopics(topics: string[], name: string): string {
  const text = [...topics, name].join(' ').toLowerCase();
  if (text.includes('ai') || text.includes('llm') || text.includes('gpt') || text.includes('machine-learning') || text.includes('deep-learning')) return 'ai';
  if (text.includes('react') || text.includes('vue') || text.includes('next') || text.includes('css') || text.includes('ui')) return 'frontend';
  if (text.includes('cli') || text.includes('tool') || text.includes('dev') || text.includes('editor')) return 'devtools';
  if (text.includes('design') || text.includes('figma') || text.includes('icon') || text.includes('font')) return 'design';
  if (text.includes('productivity') || text.includes('workflow') || text.includes('automation')) return 'productivity';
  return 'other';
}

const storyLines = [
  '正在重新定义创作方式',
  '让效率提升一个量级',
  '把复杂变简单',
  '开发者都在用',
  '灵感从这里开始',
];

const categoryLabels: Record<string, string> = {
  ai: 'AI & LLM',
  frontend: 'FRONTEND',
  devtools: 'DEV TOOLS',
  design: 'DESIGN',
  productivity: 'PRODUCTIVITY',
  other: 'TRENDING',
};

function InspirationCard({ project, index, className = '' }: { project: Project; index: number; className?: string }) {
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
        <small>{categoryLabels[project.category] || project.language}</small>
        <strong>{project.name}</strong>
        <span>{storyLines[index % storyLines.length]}</span>
        <em>{formatNumber(project.stars)} stars</em>
      </span>
    </Link>
  );
}

export default function InspirationPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch(
          'https://api.github.com/search/repositories?q=stars:>500+pushed:>2024-01-01&sort=stars&order=desc&per_page=100',
          { headers: { Accept: 'application/vnd.github.v3+json' } }
        );
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();

        const transformed: Project[] = data.items.map((repo: any) => ({
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
          demoUrl: repo.homepage || undefined,
          category: categorizeByTopics(repo.topics || [], repo.name),
          trendingScore: 0,
          createdAt: repo.created_at,
          updatedAt: repo.updated_at,
          htmlUrl: repo.html_url,
        }));

        setProjects(transformed);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  // Group by category
  const projectsByCategory: Record<string, Project[]> = {};
  projects.forEach(project => {
    if (!projectsByCategory[project.category]) projectsByCategory[project.category] = [];
    projectsByCategory[project.category].push(project);
  });
  Object.values(projectsByCategory).forEach(projs => projs.sort((a, b) => b.stars - a.stars));

  const categoryDescriptions: Record<string, string> = {
    ai: 'AI 与大模型工具，重新定义创作方式',
    frontend: '前端框架与组件库，构建现代界面',
    devtools: '开发者工具，提升编码效率',
    design: '设计资源与灵感，视觉创作必备',
    productivity: '效率工具，让工作更顺畅',
    other: '其他优质开源项目',
  };

  return (
    <main className="home-page">
      {/* Hero */}
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">INSPIRATION LIBRARY</p>
          <h1>发现下一个<br />改变你的项目</h1>
          <p className="hero-intro">从 GitHub 实时获取最热门的开源项目，按分类浏览，找到属于你的灵感。</p>
          <div className="hero-actions">
            {loading ? (
              <span className="primary-button" style={{ opacity: 0.5 }}>加载中...</span>
            ) : (
              <>
                <span className="primary-button">{projects.length} 个热门项目</span>
                <span className="secondary-button">{Object.keys(projectsByCategory).length} 个分类</span>
              </>
            )}
          </div>
        </div>

        <div className="hero-gallery" aria-label="热门项目视觉精选">
          {loading ? (
            <div className="trend-empty"><span>灵感正在赶来</span><p>正在从 GitHub 获取最新数据...</p></div>
          ) : projects.length >= 4 ? (
            <>
              <InspirationCard project={projects[0]} index={0} className="story-main" />
              <InspirationCard project={projects[1]} index={1} className="story-top" />
              <InspirationCard project={projects[2]} index={2} className="story-bottom" />
              <InspirationCard project={projects[3]} index={3} className="story-edge" />
            </>
          ) : (
            <div className="trend-empty"><span>灵感正在赶来</span><p>GitHub 数据暂时不可用，请稍后再来。</p></div>
          )}
        </div>
      </section>

      {/* Category Sections */}
      {!loading && Object.entries(projectsByCategory).map(([category, projs]) => (
        <section key={category} className="trend-section">
          <div className="trend-heading">
            <h2>{categoryLabels[category] || category.toUpperCase()}</h2>
            <Link href={`/category/${category}`}>查看全部 <ArrowRight size={17} /></Link>
          </div>
          <p style={{ width: 'min(100% - 48px, 1500px)', margin: '-12px auto 20px', color: '#888', fontSize: '14px' }}>
            {categoryDescriptions[category] || '精选开源项目'}
          </p>
          <div className="trend-rail">
            {projs.slice(0, 12).map((project, index) => (
              <InspirationCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
