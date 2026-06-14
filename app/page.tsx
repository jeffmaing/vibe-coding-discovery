import Hero from '@/components/Hero';
import CategorySection from '@/components/CategorySection';
import { fetchTrendingRepos, transformRepoToProject } from '@/lib/github';
import { categories } from '@/lib/categories';
import { categorizeRepo } from '@/lib/categories';
import type { Project } from '@/types';

// 分类副标题
const categorySubtitles: Record<string, string> = {
  ai: '最火 AI 开源项目',
  productivity: '提升工作效率的神器',
  saas: '企业级 SaaS 模板与框架',
  portfolio: '漂亮的个人网站与博客',
  game: '游戏引擎与游戏项目',
  ecommerce: '电商与支付解决方案',
};

export default async function HomePage() {
  // 一次性获取所有热门项目
  const repos = await fetchTrendingRepos();
  const allProjects = repos.map(transformRepoToProject);

  // 按分类分组，每个分类取 top 5
  const categoryProjects: Record<string, Project[]> = {};
  for (const cat of categories) {
    categoryProjects[cat.id] = [];
  }
  categoryProjects['other'] = [];

  for (const project of allProjects) {
    const catId = categorizeRepo(project.topics, project.name, project.description);
    if (categoryProjects[catId]) {
      categoryProjects[catId].push(project);
    } else {
      categoryProjects['other'].push(project);
    }
  }

  // 每个分类按星标排序，取前5
  for (const key of Object.keys(categoryProjects)) {
    categoryProjects[key].sort((a, b) => b.stars - a.stars);
  }

  return (
    <main className="min-h-screen">
      <Hero />

      {categories.map((cat, idx) => {
        const projects = categoryProjects[cat.id] || [];
        if (projects.length === 0) return null;

        return (
          <CategorySection
            key={cat.id}
            id={cat.id}
            title={cat.name}
            subtitle={categorySubtitles[cat.id] || `精选${cat.name}项目`}
            projects={projects.slice(0, 5)}
            variant={idx % 2 === 0 ? 'light' : 'gray'}
          />
        );
      })}
    </main>
  );
}
