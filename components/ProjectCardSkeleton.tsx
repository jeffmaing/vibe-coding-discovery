export default function ProjectCardSkeleton() {
  return (
    <div className="h-[300px] bg-white rounded-apple border border-apple-border p-6 flex flex-col animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="h-14 w-14 rounded-2xl bg-apple-bgSecondary" />
        <div className="h-4 w-12 rounded bg-apple-bgSecondary" />
      </div>

      <div className="h-5 w-3/4 rounded bg-apple-bgSecondary" />
      <div className="mt-1.5 space-y-1.5">
        <div className="h-3.5 w-full rounded bg-apple-bgSecondary" />
        <div className="h-3.5 w-2/3 rounded bg-apple-bgSecondary" />
      </div>

      <div className="mt-3 flex items-center gap-2">
        <div className="h-3 w-16 rounded bg-apple-bgSecondary" />
        <div className="h-3 w-12 rounded bg-apple-bgSecondary" />
      </div>

      <div className="mt-4 flex gap-2">
        <div className="flex-1 h-8 rounded-pill bg-apple-bgSecondary" />
        <div className="flex-1 h-8 rounded-pill bg-apple-bgSecondary" />
      </div>
    </div>
  );
}
