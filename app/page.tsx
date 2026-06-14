import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import UsageMethods from '@/components/UsageMethods';
import CategorySection from '@/components/CategorySection';
import { fetchTrendingRepos, transformRepoToProject } from '@/lib/github';
import { categories } from '@/lib/categories';
import { categorizeRepo } from '@/lib/categories';
import type { Project } from '@/types';

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

  // 过滤有项目的分类
  const activeCategories = categories.filter(cat => (categoryProjects[cat.id] || []).length > 0);

  return (
    <main className="min-h-screen">
      <Hero />
      <HowItWorks />

      {activeCategories.map((cat, idx) => {
        const projects = categoryProjects[cat.id] || [];
        if (projects.length === 0) return null;

        return (
          <CategorySection
            key={cat.id}
            id={cat.id}
            title={cat.name}
            subtitle={cat.description}
            projects={projects.slice(0, 5)}
            variant={idx % 2 === 0 ? 'light' : 'gray'}
          />
        );
      })}

      <UsageMethods />
    </main>
  );
}
