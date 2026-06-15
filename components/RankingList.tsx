import type { Project } from '@/types';
import RankingItem from './RankingItem';

interface RankingListProps {
  projects: Project[];
}

export default function RankingList({ projects }: RankingListProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-16 text-apple-gray text-[14px]">
        暂时还没找到合适的项目，请稍后再来看看。
      </div>
    );
  }

  return (
    <ol className="flex flex-col gap-3">
      {projects.map((project, index) => (
        <RankingItem
          key={project.id}
          project={project}
          rank={index + 1}
        />
      ))}
    </ol>
  );
}
