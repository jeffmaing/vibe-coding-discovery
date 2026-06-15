import { GitHubRepo, Project } from '@/types';
import { categorizeRepo, categories } from './categories';
import { inferDifficulty, calculateTrendingScore } from './utils';

const GITHUB_API_BASE = 'https://api.github.com';

export async function fetchTrendingRepos(category?: string): Promise<GitHubRepo[]> {
  let queryStr = 'stars:>500 pushed:>2024-01-01';

  if (category && category !== 'all') {
    const cat = categories.find(c => c.id === category);
    if (cat) {
      // GitHub Search API: use first 3 keywords with OR, avoid too-long queries
      const keywords = cat.keywords.slice(0, 3).join(' OR ');
      queryStr = `${keywords} stars:>500 pushed:>2024-01-01`;
    }
  }

  const queryParams = new URLSearchParams({
    q: queryStr,
    sort: 'stars',
    order: 'desc',
    per_page: '100',
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

export async function fetchRepoByFullName(fullName: string): Promise<GitHubRepo | null> {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${fullName}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

export function transformRepoToProject(repo: GitHubRepo): Project {
  return {
    id: repo.full_name,
    name: repo.name,
    fullName: repo.full_name,
    owner: repo.owner.login,
    ownerAvatar: repo.owner.avatar_url,
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
