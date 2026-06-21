'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { Project } from '@/types';

export default function InspirationPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        // 从GitHub API直接获取数据
        const response = await fetch(
          'https://api.github.com/search/repositories?q=stars:>500+pushed:>2024-01-01&sort=stars&order=desc&per_page=100',
          {
            headers: { Accept: 'application/vnd.github.v3+json' },
          }
        );
        
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        
        // 转换为Project格式
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

  // 按分类分组
  const projectsByCategory: Record<string, Project[]> = {};
  projects.forEach(project => {
    if (!projectsByCategory[project.category]) {
      projectsByCategory[project.category] = [];
    }
    projectsByCategory[project.category].push(project);
  });

  // 排序每个分类
  Object.values(projectsByCategory).forEach(projs => {
    projs.sort((a, b) => b.stars - a.stars);
  });

  const categoryDescriptions: Record<string, string> = {
    ai: 'AI 与大模型工具，重新定义创作方式',
    frontend: '前端框架与组件库，构建现代界面',
    devtools: '开发者工具，提升编码效率',
    design: '设计资源与灵感，视觉创作必备',
    productivity: '效率工具，让工作更顺畅',
    other: '其他优质开源项目',
  };

  const categoryIcons: Record<string, string> = {
    ai: '🤖',
    frontend: '🎨',
    devtools: '🛠️',
    design: '✨',
    productivity: '⚡',
    other: '📦',
  };

  return (
    <main className="inspiration-page">
      {/* Hero Section */}
      <section className="inspiration-hero">
        <div className="inspiration-hero-content">
          <div className="inspiration-badge">
            <Sparkles size={18} />
            <span>灵感库</span>
          </div>
          <h1>发现下一个<br />改变你的项目</h1>
          <p className="inspiration-intro">
            从 GitHub 实时获取最热门的开源项目，按分类浏览，找到属于你的灵感。
          </p>
          <div className="inspiration-stats">
            <div className="stat-item">
              <strong>{projects.length}</strong>
              <span>热门项目</span>
            </div>
            <div className="stat-item">
              <strong>{Object.keys(projectsByCategory).length}</strong>
              <span>分类</span>
            </div>
            <div className="stat-item">
              <strong>实时</strong>
              <span>更新频率</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      {loading ? (
        <div className="inspiration-loading">
          <Sparkles size={32} className="loading-icon" />
          <p>正在从 GitHub 获取最新数据...</p>
        </div>
      ) : (
        <section className="inspiration-categories">
          {Object.entries(projectsByCategory).map(([category, projs]) => (
            <div key={category} className="category-block">
              <div className="category-header">
                <div className="category-title">
                  <span className="category-icon">{categoryIcons[category] || '📦'}</span>
                  <div>
                    <h2>{category.toUpperCase()}</h2>
                    <p>{categoryDescriptions[category] || '精选开源项目'}</p>
                  </div>
                </div>
                <Link href={`/category/${category}`} className="category-view-all">
                  查看全部 <ArrowRight size={16} />
                </Link>
              </div>

              <div className="category-grid">
                {projs.slice(0, 6).map((project) => (
                  <Link
                    key={project.id}
                    href={`/project/${encodeURIComponent(project.fullName)}`}
                    className="inspiration-card"
                  >
                    <div className="inspiration-card-image">
                      <Image
                        src={project.ownerAvatar}
                        alt={project.owner}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="inspiration-card-overlay" />
                    </div>
                    <div className="inspiration-card-content">
                      <div className="inspiration-card-meta">
                        <span className="inspiration-card-lang">{project.language}</span>
                        <span className="inspiration-card-stars">
                          ⭐ {formatNumber(project.stars)}
                        </span>
                      </div>
                      <h3>{project.name}</h3>
                      <p>{project.description}</p>
                      <div className="inspiration-card-footer">
                        <span className="inspiration-card-owner">@{project.owner}</span>
                        <ArrowRight size={16} className="inspiration-card-arrow" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Empty State */}
      {!loading && projects.length === 0 && (
        <div className="inspiration-empty">
          <Sparkles size={48} />
          <h2>灵感正在赶来</h2>
          <p>GitHub 数据暂时不可用，请稍后再来。</p>
        </div>
      )}
    </main>
  );
}

function categorizeByTopics(topics: string[], name: string): string {
  const text = [...topics, name].join(' ').toLowerCase();
  
  if (text.includes('ai') || text.includes('llm') || text.includes('gpt') || text.includes('machine-learning') || text.includes('deep-learning')) {
    return 'ai';
  }
  if (text.includes('react') || text.includes('vue') || text.includes('next') || text.includes('css') || text.includes('ui')) {
    return 'frontend';
  }
  if (text.includes('cli') || text.includes('tool') || text.includes('dev') || text.includes('editor')) {
    return 'devtools';
  }
  if (text.includes('design') || text.includes('figma') || text.includes('icon') || text.includes('font')) {
    return 'design';
  }
  if (text.includes('productivity') || text.includes('workflow') || text.includes('automation')) {
    return 'productivity';
  }
  return 'other';
}

function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
}
