'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { categories } from '@/lib/categories';
import { cn } from '@/lib/utils';

export default function CategoryTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'all';

  const handleCategoryClick = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId === 'all') {
      params.delete('category');
    } else {
      params.set('category', categoryId);
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      <button
        onClick={() => handleCategoryClick('all')}
        className={cn(
          'px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors',
          currentCategory === 'all'
            ? 'bg-primary text-white'
            : 'bg-white text-text-primary hover:bg-background-tertiary'
        )}
      >
        全部
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryClick(category.id)}
          className={cn(
            'px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors',
            currentCategory === category.id
              ? 'bg-primary text-white'
              : 'bg-white text-text-primary hover:bg-background-tertiary'
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
