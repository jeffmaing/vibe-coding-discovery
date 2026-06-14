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
