import Link from 'next/link';
import { fetchTrendingRepos, transformRepoToProject } from '@/lib/github';
import { categories } from '@/lib/categories';
import ProjectCard from '@/components/ProjectCard';
import ScrollReveal from '@/components/ScrollReveal';

interface CategoryPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return categories.map((c) => ({ id: c.id }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;
  const category = categories.find((c) => c.id === id);

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-12">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-apple-ink mb-4">分类未找到</h1>
          <Link href="/" className="text-apple-blue hover:underline">
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  const repos = await fetchTrendingRepos(id);
  const projects = repos.map(transformRepoToProject);
  projects.sort((a, b) => b.stars - a.stars);

  return (
    <main className="min-h-screen pt-12">
      {/* Header */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-content mx-auto px-6">
          <ScrollReveal>
            <nav className="mb-6">
              <Link
                href="/"
                className="text-[14px] text-apple-blue hover:underline inline-flex items-center gap-1"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                返回首页
              </Link>
            </nav>
            <h1 className="text-[40px] md:text-[48px] font-semibold tracking-tight text-apple-ink">
              {category.name}
            </h1>
            <p className="mt-3 text-[18px] md:text-[20px] text-apple-gray">
              共 {projects.length} 个项目 · 按星标数排序
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="bg-apple-bgSecondary py-12 md:py-16">
        <div className="max-w-content mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {projects.map((project, idx) => (
              <ScrollReveal key={project.id} delay={idx * 60}>
                <ProjectCard project={project} />
              </ScrollReveal>
            ))}
          </div>

          {projects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-[16px] text-apple-gray">该分类暂无项目</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
