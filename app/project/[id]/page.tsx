import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { fetchRepoByFullName, transformRepoToProject, fetchTrendingRepos } from '@/lib/github';
import { generateInterpretation } from '@/lib/interpretation';
import ProjectInterpretationView from '@/components/ProjectInterpretation';
import type { Project } from '@/types';

export const revalidate = 3600;

function formatStars(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(num >= 10000 ? 0 : 1)}k`;
  }
  return num.toString();
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  try {
    const repos = await fetchTrendingRepos();
    const projects = repos.map(transformRepoToProject);
    return projects.slice(0, 20).map((project) => ({
      id: encodeURIComponent(project.fullName),
    }));
  } catch {
    return [];
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { id } = await params;
  const fullName = decodeURIComponent(id);
  
  const repo = await fetchRepoByFullName(fullName);
  if (!repo) {
    notFound();
  }

  const project = transformRepoToProject(repo);
  const interpretation = await generateInterpretation(project);

  // 获取相关项目推荐（同语言的其他热门项目）
  const allRepos = await fetchTrendingRepos();
  const relatedProjects = allRepos
    .map(transformRepoToProject)
    .filter((p) => p.fullName !== project.fullName && p.language === project.language)
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 5);

  return (
    <main className="min-h-screen bg-white">
      {/* 头部 */}
      <section className="border-b border-apple-border">
        <div className="max-w-content mx-auto px-6 py-10 md:py-14">
          <div className="flex items-start gap-5 md:gap-6">
            <div className="relative h-16 w-16 md:h-20 md:w-20 shrink-0 rounded-2xl overflow-hidden bg-apple-bgSecondary">
              <Image
                src={project.ownerAvatar}
                alt={`${project.owner} 图标`}
                width={80}
                height={80}
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-[24px] md:text-[28px] font-semibold tracking-tight text-apple-ink leading-tight">
                {project.name}
              </h1>
              <p className="mt-2 text-[15px] md:text-[16px] text-apple-gray leading-[1.5]">
                {interpretation.what}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-[13px] text-apple-gray">
                <span className="inline-flex items-center gap-1">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-3.5 w-3.5"
                  >
                    <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
                  </svg>
                  {formatStars(project.stars)}
                </span>
                <span className="text-apple-border">·</span>
                <span>{project.language || '未知'}</span>
                <span className="text-apple-border">·</span>
                <span>难度 {'★'.repeat(interpretation.difficultyStars)}{'☆'.repeat(5 - interpretation.difficultyStars)}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href={`/project/${encodeURIComponent(project.fullName)}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-[14px] font-medium text-white bg-apple-ink rounded-pill hover:bg-apple-ink/90 transition"
                >
                  用这个项目做我的项目
                </Link>
                <a
                  href={project.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-[14px] font-medium text-apple-ink bg-apple-bgSecondary rounded-pill hover:bg-white hover:ring-1 hover:ring-apple-border transition"
                >
                  查看 GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 解读内容 */}
      <section className="bg-white">
        <div className="max-w-content mx-auto px-6 py-10 md:py-14">
          <ProjectInterpretationView interpretation={interpretation} />
        </div>
      </section>

      {/* 相关项目 */}
      {relatedProjects.length > 0 && (
        <section className="bg-apple-bgSecondary">
          <div className="max-w-content mx-auto px-6 py-10 md:py-14">
            <h2 className="text-[20px] md:text-[22px] font-semibold tracking-tight text-apple-ink mb-6">
              相关项目推荐
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedProjects.map((related) => (
                <Link
                  key={related.fullName}
                  href={`/project/${encodeURIComponent(related.fullName)}`}
                  className="group flex items-center gap-4 bg-white border border-apple-border rounded-apple p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(0,0,0,0.04)]"
                >
                  <div className="relative h-10 w-10 shrink-0 rounded-xl overflow-hidden bg-apple-bgSecondary">
                    <Image
                      src={related.ownerAvatar}
                      alt={`${related.owner} 图标`}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[14px] font-semibold text-apple-ink truncate">
                      {related.name}
                    </h3>
                    <div className="mt-1 flex items-center gap-1.5 text-[11px] text-apple-gray">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-3 w-3"
                      >
                        <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
                      </svg>
                      {formatStars(related.stars)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 返回 */}
      <section className="bg-white border-t border-apple-border">
        <div className="max-w-content mx-auto px-6 py-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[14px] text-apple-gray hover:text-apple-ink transition"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            返回排行榜
          </Link>
        </div>
      </section>
    </main>
  );
}
