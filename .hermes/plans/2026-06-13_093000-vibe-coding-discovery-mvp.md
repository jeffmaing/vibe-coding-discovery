# Vibe Coding 发现平台 MVP 实施计划

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** 构建 Vibe Coding 最火项目发现平台 MVP，包含首页、搜索、分类浏览功能

**Architecture:** Next.js 14 App Router + TypeScript + Tailwind CSS，通过 GitHub REST API 获取数据，内存缓存避免限流

**Tech Stack:** Next.js 14, TypeScript 5, Tailwind CSS 3, Lucide React, GitHub REST API v3

---

## 当前上下文

**项目路径：** `~/Desktop/vibe-coding-discovery`

**设计文档：** `~/Desktop/vibe-coding-discovery/PRODUCT_DESIGN_SPEC.md`

**已完成：**
- 产品定位确认
- 核心功能定义
- UI/UX 设计规范
- 数据模型设计
- API 设计

**待实施：** Phase 1 MVP（首页 + 搜索 + 分类 + 项目卡片）

---

## 任务列表

### Task 1: 初始化 Next.js 项目

**Objective:** 创建 Next.js 14 项目，配置 TypeScript 和 Tailwind CSS

**Files:**
- Create: 整个项目目录结构

**Step 1: 创建 Next.js 项目**

```bash
cd ~/Desktop/vibe-coding-discovery
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm
```

Expected: 项目创建成功，生成 package.json、tsconfig.json、tailwind.config.ts 等文件

**Step 2: 安装额外依赖**

```bash
npm install lucide-react
```

Expected: lucide-react 安装成功

**Step 3: 验证项目可运行**

```bash
npm run dev
```

Expected: 开发服务器启动在 http://localhost:3000，无报错

**Step 4: 提交**

```bash
git init
git add .
git commit -m "chore: initialize Next.js project with TypeScript and Tailwind"
```

---

### Task 2: 定义 TypeScript 类型

**Objective:** 创建项目核心类型定义

**Files:**
- Create: `types/index.ts`

**Step 1: 创建类型文件**

```typescript
// types/index.ts

export interface Project {
  id: string;
  name: string;
  fullName: string;
  description: string;
  stars: number;
  language: string;
  topics: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  demoUrl?: string;
  screenshot?: string;
  category: string;
  trendingScore: number;
  createdAt: string;
  updatedAt: string;
  htmlUrl: string;
}

export interface Category {
  id: string;
  name: string;
  keywords: string[];
  icon: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  topics: string[];
  homepage: string | null;
  html_url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
}
```

**Step 2: 验证类型文件**

```bash
npx tsc --noEmit types/index.ts
```

Expected: 无类型错误

**Step 3: 提交**

```bash
git add types/index.ts
git commit -m "feat: add TypeScript type definitions"
```

---

### Task 3: 创建分类配置

**Objective:** 定义项目分类和关键词匹配规则

**Files:**
- Create: `lib/categories.ts`

**Step 1: 创建分类配置文件**

```typescript
// lib/categories.ts

import { Category } from '@/types';

export const categories: Category[] = [
  {
    id: 'ai',
    name: 'AI工具',
    keywords: ['ai', 'llm', 'gpt', 'machine-learning', 'chatbot', 'openai', 'claude', 'artificial-intelligence'],
    icon: 'Bot',
  },
  {
    id: 'productivity',
    name: '效率工具',
    keywords: ['productivity', 'todo', 'notes', 'calendar', 'task', 'workflow', 'automation'],
    icon: 'CheckSquare',
  },
  {
    id: 'saas',
    name: 'SaaS',
    keywords: ['saas', 'dashboard', 'admin', 'crm', 'analytics', 'management', 'platform'],
    icon: 'LayoutDashboard',
  },
  {
    id: 'portfolio',
    name: '个人网站',
    keywords: ['portfolio', 'blog', 'personal-site', 'resume', 'cv', 'website'],
    icon: 'Globe',
  },
  {
    id: 'game',
    name: '游戏',
    keywords: ['game', 'game-engine', 'unity', 'godot', 'multiplayer', 'gaming'],
    icon: 'Gamepad2',
  },
  {
    id: 'ecommerce',
    name: '电商',
    keywords: ['ecommerce', 'shop', 'store', 'payment', 'checkout', 'commerce'],
    icon: 'ShoppingCart',
  },
];

export function categorizeRepo(topics: string[], name: string, description: string): string {
  const searchText = [...topics, name, description].join(' ').toLowerCase();
  
  for (const category of categories) {
    const hasMatch = category.keywords.some(keyword => 
      searchText.includes(keyword)
    );
    if (hasMatch) {
      return category.id;
    }
  }
  
  return 'other';
}
```

**Step 2: 验证分类逻辑**

```bash
npx tsc --noEmit lib/categories.ts
```

Expected: 无类型错误

**Step 3: 提交**

```bash
git add lib/categories.ts
git commit -m "feat: add category configuration and matching logic"
```

---

### Task 4: 创建工具函数

**Objective:** 创建通用工具函数（难度推断、热度计算等）

**Files:**
- Create: `lib/utils.ts`

**Step 1: 创建工具函数文件**

```typescript
// lib/utils.ts

import { GitHubRepo } from '@/types';

export function inferDifficulty(repo: GitHubRepo): 'easy' | 'medium' | 'hard' {
  const size = repo.size; // KB
  const hasDemo = repo.homepage !== null;
  const topics = repo.topics || [];
  
  // 简单：代码量小，有演示
  if (size < 5000 && hasDemo) return 'easy';
  
  // 困难：代码量大，或包含复杂关键词
  const complexKeywords = ['kubernetes', 'microservices', 'distributed', 'blockchain'];
  if (size > 50000 || topics.some(t => complexKeywords.includes(t))) return 'hard';
  
  // 中等：其他
  return 'medium';
}

export function calculateTrendingScore(repo: GitHubRepo): number {
  const totalStars = repo.stargazers_count;
  const updatedAt = new Date(repo.updated_at);
  const now = new Date();
  const daysSinceUpdate = Math.floor((now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24));
  
  // 基础分：总星标（对数缩放）
  const baseScore = Math.log10(totalStars + 1) * 10;
  
  // 活跃度加分：最近更新
  const recencyBonus = Math.max(0, 30 - daysSinceUpdate);
  
  return Math.round(baseScore + recencyBonus);
}

export function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
}

export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
```

**Step 2: 验证工具函数**

```bash
npx tsc --noEmit lib/utils.ts
```

Expected: 无类型错误

**Step 3: 提交**

```bash
git add lib/utils.ts
git commit -m "feat: add utility functions for difficulty inference and trending score"
```

---

### Task 5: 创建 GitHub API 封装

**Objective:** 封装 GitHub REST API 调用逻辑

**Files:**
- Create: `lib/github.ts`

**Step 1: 创建 GitHub API 封装**

```typescript
// lib/github.ts

import { GitHubRepo, Project } from '@/types';
import { categorizeRepo } from './categories';
import { inferDifficulty, calculateTrendingScore } from './utils';

const GITHUB_API_BASE = 'https://api.github.com';

export async function fetchTrendingRepos(category?: string): Promise<GitHubRepo[]> {
  const queryParams = new URLSearchParams({
    q: 'stars:>500 pushed:>2024-01-01',
    sort: 'stars',
    order: 'desc',
    per_page: '100',
  });

  if (category && category !== 'all') {
    const { categories } = await import('./categories');
    const cat = categories.find(c => c.id === category);
    if (cat) {
      queryParams.set('q', `${cat.keywords.join(' OR ')} stars:>500 pushed:>2024-01-01`);
    }
  }

  const response = await fetch(`${GITHUB_API_BASE}/search/repositories?${queryParams}`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
    },
    next: { revalidate: 3600 }, // 1小时缓存
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  const data = await response.json();
  return data.items || [];
}

export async function searchRepos(query: string): Promise<GitHubRepo[]> {
  const queryParams = new URLSearchParams({
    q: `${query} in:name,description,topics`,
    sort: 'stars',
    order: 'desc',
    per_page: '50',
  });

  const response = await fetch(`${GITHUB_API_BASE}/search/repositories?${queryParams}`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  const data = await response.json();
  return data.items || [];
}

export function transformRepoToProject(repo: GitHubRepo): Project {
  return {
    id: repo.full_name,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description || '暂无描述',
    stars: repo.stargazers_count,
    language: repo.language || 'Unknown',
    topics: repo.topics || [],
    difficulty: inferDifficulty(repo),
    demoUrl: repo.homepage || undefined,
    category: categorizeRepo(repo.topics || [], repo.name, repo.description || ''),
    trendingScore: calculateTrendingScore(repo),
    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
    htmlUrl: repo.html_url,
  };
}
```

**Step 2: 验证 GitHub API 封装**

```bash
npx tsc --noEmit lib/github.ts
```

Expected: 无类型错误

**Step 3: 提交**

```bash
git add lib/github.ts
git commit -m "feat: add GitHub API integration with caching"
```

---

### Task 6: 创建 API Routes

**Objective:** 创建 Next.js API Routes 供前端调用

**Files:**
- Create: `app/api/categories/route.ts`
- Create: `app/api/projects/trending/route.ts`
- Create: `app/api/projects/search/route.ts`

**Step 1: 创建分类 API**

```typescript
// app/api/categories/route.ts

import { NextResponse } from 'next/server';
import { categories } from '@/lib/categories';

export async function GET() {
  return NextResponse.json(categories);
}
```

**Step 2: 创建热门项目 API**

```typescript
// app/api/projects/trending/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { fetchTrendingRepos, transformRepoToProject } from '@/lib/github';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category') || 'all';

  try {
    const repos = await fetchTrendingRepos(category);
    const projects = repos.map(transformRepoToProject);
    
    // 按热度分数排序
    projects.sort((a, b) => b.trendingScore - a.trendingScore);
    
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching trending repos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending projects' },
      { status: 500 }
    );
  }
}
```

**Step 3: 创建搜索 API**

```typescript
// app/api/projects/search/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { searchRepos, transformRepoToProject } from '@/lib/github';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';

  if (!query.trim()) {
    return NextResponse.json([]);
  }

  try {
    const repos = await searchRepos(query);
    const projects = repos.map(transformRepoToProject);
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error searching repos:', error);
    return NextResponse.json(
      { error: 'Failed to search projects' },
      { status: 500 }
    );
  }
}
```

**Step 4: 验证 API Routes**

```bash
npx tsc --noEmit app/api/**/*.ts
```

Expected: 无类型错误

**Step 5: 提交**

```bash
git add app/api/
git commit -m "feat: add API routes for categories and projects"
```

---

### Task 7: 配置 Tailwind CSS

**Objective:** 配置 Tailwind CSS 主题（色值、字体、间距）

**Files:**
- Modify: `tailwind.config.ts`
- Create: `app/globals.css`

**Step 1: 更新 Tailwind 配置**

```typescript
// tailwind.config.ts

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366F1',
          hover: '#4F46E5',
        },
        background: {
          primary: '#FFFFFF',
          secondary: '#F9FAFB',
          tertiary: '#F3F4F6',
        },
        text: {
          primary: '#111827',
          secondary: '#6B7280',
          tertiary: '#9CA3AF',
        },
        border: {
          DEFAULT: '#E5E7EB',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'PingFang SC',
          'Hiragino Sans GB',
          'Microsoft YaHei',
          'sans-serif',
        ],
      },
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '12px',
      },
    },
  },
  plugins: [],
};

export default config;
```

**Step 2: 更新全局样式**

```css
/* app/globals.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 17, 24, 39;
  --background-start-rgb: 255, 255, 255;
  --background-end-rgb: 255, 255, 255;
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
    to bottom,
    transparent,
    rgb(var(--background-end-rgb))
  ) rgb(var(--background-start-rgb));
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

**Step 3: 验证配置**

```bash
npm run build
```

Expected: 构建成功，无 Tailwind 配置错误

**Step 4: 提交**

```bash
git add tailwind.config.ts app/globals.css
git commit -m "feat: configure Tailwind CSS theme with design tokens"
```

---

### Task 8: 创建 UI 组件 - Hero 区

**Objective:** 创建首页 Hero 区组件（标题 + 搜索框）

**Files:**
- Create: `components/Hero.tsx`

**Step 1: 创建 Hero 组件**

```tsx
// components/Hero.tsx

import SearchBar from './SearchBar';

export default function Hero() {
  return (
    <section className="bg-background-secondary py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold text-text-primary mb-4">
          发现最火的 Vibe Coding 项目
        </h1>
        <p className="text-lg text-text-secondary mb-8">
          不用去 GitHub，在这里找到最适合你的项目
        </p>
        <SearchBar />
      </div>
    </section>
  );
}
```

**Step 2: 验证组件**

```bash
npx tsc --noEmit components/Hero.tsx
```

Expected: 无类型错误

**Step 3: 提交**

```bash
git add components/Hero.tsx
git commit -m "feat: add Hero component with search bar"
```

---

### Task 9: 创建 UI 组件 - SearchBar

**Objective:** 创建搜索框组件

**Files:**
- Create: `components/SearchBar.tsx`

**Step 1: 创建 SearchBar 组件**

```tsx
// components/SearchBar.tsx

'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索项目，如：记账、简历、聊天机器人..."
          className="w-full h-12 pl-12 pr-4 bg-white border-2 border-border rounded-md text-base focus:outline-none focus:border-primary"
        />
      </div>
    </form>
  );
}
```

**Step 2: 验证组件**

```bash
npx tsc --noEmit components/SearchBar.tsx
```

Expected: 无类型错误

**Step 3: 提交**

```bash
git add components/SearchBar.tsx
git commit -m "feat: add SearchBar component with client-side search"
```

---

### Task 10: 创建 UI 组件 - CategoryTabs

**Objective:** 创建分类 Tab 切换组件

**Files:**
- Create: `components/CategoryTabs.tsx`

**Step 1: 创建 CategoryTabs 组件**

```tsx
// components/CategoryTabs.tsx

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { categories } from '@/lib/categories';
import { cn } from '@/lib/utils';

export default function CategoryTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'all';

  const handleCategoryClick = (categoryId: string) => {
    const params = new URLSearchParams(searchParams);
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
```

**Step 2: 验证组件**

```bash
npx tsc --noEmit components/CategoryTabs.tsx
```

Expected: 无类型错误

**Step 3: 提交**

```bash
git add components/CategoryTabs.tsx
git commit -m "feat: add CategoryTabs component with URL-based filtering"
```

---

### Task 11: 创建 UI 组件 - ProjectCard

**Objective:** 创建项目卡片组件

**Files:**
- Create: `components/ProjectCard.tsx`

**Step 1: 创建 ProjectCard 组件**

```tsx
// components/ProjectCard.tsx

import { Star, Code2 } from 'lucide-react';
import { Project } from '@/types';
import { formatNumber } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const difficultyLabel = {
    easy: '⭐ 入门',
    medium: '⭐⭐ 中等',
    hard: '⭐⭐⭐ 进阶',
  };

  return (
    <a
      href={project.htmlUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white border border-border rounded-md p-4 hover:shadow-md transition-shadow"
    >
      {/* 截图区 */}
      <div className="h-40 bg-background-tertiary rounded-md mb-4 flex items-center justify-center">
        <Code2 className="w-12 h-12 text-text-tertiary" />
      </div>

      {/* 标题 */}
      <h3 className="text-base font-semibold text-text-primary mb-2 line-clamp-1">
        {project.name}
      </h3>

      {/* 描述 */}
      <p className="text-sm text-text-secondary mb-4 line-clamp-2">
        {project.description}
      </p>

      {/* 底部信息 */}
      <div className="flex items-center justify-between text-xs text-text-secondary">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-success fill-success" />
          <span>{formatNumber(project.stars)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Code2 className="w-4 h-4" />
          <span>{project.language}</span>
        </div>
        <div>{difficultyLabel[project.difficulty]}</div>
      </div>
    </a>
  );
}
```

**Step 2: 验证组件**

```bash
npx tsc --noEmit components/ProjectCard.tsx
```

Expected: 无类型错误

**Step 3: 提交**

```bash
git add components/ProjectCard.tsx
git commit -m "feat: add ProjectCard component with star count and difficulty"
```

---

### Task 12: 创建 UI 组件 - ProjectGrid

**Objective:** 创建项目列表网格组件

**Files:**
- Create: `components/ProjectGrid.tsx`

**Step 1: 创建 ProjectGrid 组件**

```tsx
// components/ProjectGrid.tsx

import { Project } from '@/types';
import ProjectCard from './ProjectCard';

interface ProjectGridProps {
  projects: Project[];
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-text-secondary">暂无项目</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

**Step 2: 验证组件**

```bash
npx tsc --noEmit components/ProjectGrid.tsx
```

Expected: 无类型错误

**Step 3: 提交**

```bash
git add components/ProjectGrid.tsx
git commit -m "feat: add ProjectGrid component with responsive layout"
```

---

### Task 13: 创建根布局

**Objective:** 创建 Next.js 根布局文件

**Files:**
- Create: `app/layout.tsx`

**Step 1: 创建根布局**

```tsx
// app/layout.tsx

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vibe Coding 发现 - 最火项目精选',
  description: '发现最火的 Vibe Coding 项目，不用去 GitHub，在这里找到最适合你的项目',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
```

**Step 2: 验证布局**

```bash
npx tsc --noEmit app/layout.tsx
```

Expected: 无类型错误

**Step 3: 提交**

```bash
git add app/layout.tsx
git commit -m "feat: add root layout with metadata"
```

---

### Task 14: 创建首页

**Objective:** 创建首页，集成所有组件和数据获取

**Files:**
- Create: `app/page.tsx`

**Step 1: 创建首页**

```tsx
// app/page.tsx

import { Suspense } from 'react';
import Hero from '@/components/Hero';
import CategoryTabs from '@/components/CategoryTabs';
import ProjectGrid from '@/components/ProjectGrid';
import { fetchTrendingRepos, searchRepos, transformRepoToProject } from '@/lib/github';

interface HomePageProps {
  searchParams: {
    q?: string;
    category?: string;
  };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const query = searchParams.q;
  const category = searchParams.category || 'all';

  let projects;

  if (query) {
    // 搜索模式
    const repos = await searchRepos(query);
    projects = repos.map(transformRepoToProject);
  } else {
    // 热门模式
    const repos = await fetchTrendingRepos(category);
    projects = repos.map(transformRepoToProject);
    // 按热度排序
    projects.sort((a, b) => b.trendingScore - a.trendingScore);
  }

  return (
    <main className="min-h-screen bg-background-primary">
      <Hero />
      
      <section className="max-w-7xl mx-auto px-4 py-8">
        <Suspense fallback={<div>加载中...</div>}>
          <CategoryTabs />
        </Suspense>
        
        <div className="mt-8">
          <ProjectGrid projects={projects} />
        </div>
      </section>
    </main>
  );
}
```

**Step 2: 验证首页**

```bash
npx tsc --noEmit app/page.tsx
```

Expected: 无类型错误

**Step 3: 提交**

```bash
git add app/page.tsx
git commit -m "feat: add home page with search and category filtering"
```

---

### Task 15: 本地测试和验证

**Objective:** 运行项目，验证所有功能正常

**Step 1: 启动开发服务器**

```bash
npm run dev
```

Expected: 服务器启动在 http://localhost:3000

**Step 2: 验证首页加载**

访问 http://localhost:3000

Expected:
- Hero 区正常显示（标题 + 搜索框）
- 分类 Tab 正常显示
- 项目卡片网格正常显示（从 GitHub API 获取数据）
- 无控制台错误

**Step 3: 验证搜索功能**

在搜索框输入"记账"，按回车

Expected:
- URL 变为 `/?q=记账`
- 项目列表更新为搜索结果
- 无报错

**Step 4: 验证分类切换**

点击"AI工具"分类

Expected:
- URL 变为 `/?category=ai`
- 项目列表更新为 AI 相关项目
- Tab 高亮状态正确

**Step 5: 验证响应式布局**

调整浏览器窗口大小

Expected:
- 移动端：1 列
- 平板：2 列
- 桌面：3-4 列

**Step 6: 提交**

```bash
git add .
git commit -m "feat: MVP complete with search, categories, and project grid"
```

---

## 验收标准

### 功能验收
- [x] 首页能正常加载热门项目
- [x] 搜索功能正常（关键词 + 空搜索）
- [x] 分类切换正常
- [x] 响应式布局正常（移动端/平板/桌面）

### 性能验收
- [ ] 首屏加载 < 3s
- [ ] 搜索响应 < 1s
- [ ] 无控制台错误

### 视觉验收
- [ ] 符合设计规范（色值、间距、圆角）
- [ ] 无错位、溢出
- [ ] 中文显示正常

---

## 风险和注意事项

1. **GitHub API 限流**：未认证请求每小时 60 次，已通过 1 小时缓存缓解
2. **网络延迟**：GitHub API 在中国大陆可能较慢，建议后续添加代理
3. **数据准确性**：热度分数基于简单算法，可能需要调优

---

## 下一步（Phase 2）

- [ ] 项目详情页
- [ ] 难度推断优化
- [ ] 相关推荐
- [ ] 截图抓取

---

**计划版本**：v1.0  
**创建日期**：2026-06-13  
**预计工时**：2-3 小时（含测试）
