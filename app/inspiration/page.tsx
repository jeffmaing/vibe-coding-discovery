import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { fetchTrendingRepos, transformRepoToProject } from '@/lib/github';
import { formatNumber } from '@/lib/utils';
import type { Project } from '@/types';

export const revalidate = 1800; // 30分钟更新一次

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

export default async function InspirationPage() {
  let allProjects: Project[] = [];

  try {
    const repos = await fetchTrendingRepos();
    allProjects = repos.map(transformRepoToProject);
  } catch {
    allProjects = [];
  }

  // 按分类分组
  const projectsByCategory: Record<string, Project[]> = {};
  allProjects.forEach(project => {
    if (!projectsByCategory[project.category]) {
      projectsByCategory[project.category] = [];
    }
    projectsByCategory[project.category].push(project);
  });

  // 排序每个分类（按stars）
  Object.values(projectsByCategory).forEach(projects => {
    projects.sort((a, b) => b.stars - a.stars);
  });

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
              <strong>{allProjects.length}</strong>
              <span>热门项目</span>
            </div>
            <div className="stat-item">
              <strong>{Object.keys(projectsByCategory).length}</strong>
              <span>分类</span>
            </div>
            <div className="stat-item">
              <strong>30min</strong>
              <span>更新频率</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="inspiration-categories">
        {Object.entries(projectsByCategory).map(([category, projects]) => (
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
              {projects.slice(0, 6).map((project) => (
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

      {/* Empty State */}
      {allProjects.length === 0 && (
        <div className="inspiration-empty">
          <Sparkles size={48} />
          <h2>灵感正在赶来</h2>
          <p>GitHub 数据暂时不可用，请稍后再来。</p>
        </div>
      )}
    </main>
  );
}
