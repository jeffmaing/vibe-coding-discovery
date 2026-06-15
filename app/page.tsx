import { fetchTrendingRepos, transformRepoToProject } from '@/lib/github';
import RankingList from '@/components/RankingList';

export const revalidate = 3600;

export default async function HomePage() {
  const repos = await fetchTrendingRepos();
  const allProjects = repos.map(transformRepoToProject);

  const topProjects = [...allProjects]
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 20);

  return (
    <main className="min-h-screen">
      <section className="bg-white">
        <div className="max-w-content mx-auto px-6 pt-10 md:pt-16 pb-8 md:pb-10 text-center">
          <h1 className="text-[28px] md:text-[40px] leading-[1.15] font-semibold tracking-tight text-apple-ink text-balance">
            本周最火项目
          </h1>
          <p className="mt-3 md:mt-4 text-[14px] md:text-[16px] text-apple-gray max-w-[640px] mx-auto">
            精选 GitHub 上最适合新手的开源项目，一键复制给 AI 就能做
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-content mx-auto px-6 pb-20 md:pb-28">
          <RankingList projects={topProjects} />
        </div>
      </section>
    </main>
  );
}
