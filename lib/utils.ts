import { GitHubRepo } from '@/types';

export function inferDifficulty(repo: GitHubRepo): 'easy' | 'medium' | 'hard' {
  const size = repo.size; // KB
  const hasDemo = repo.homepage !== null;
  const topics = repo.topics || [];
  
  if (size < 5000 && hasDemo) return 'easy';
  
  const complexKeywords = ['kubernetes', 'microservices', 'distributed', 'blockchain'];
  if (size > 50000 || topics.some(t => complexKeywords.includes(t))) return 'hard';
  
  return 'medium';
}

export function calculateTrendingScore(repo: GitHubRepo): number {
  const totalStars = repo.stargazers_count;
  const updatedAt = new Date(repo.updated_at);
  const now = new Date();
  const daysSinceUpdate = Math.floor((now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24));
  
  const baseScore = Math.log10(totalStars + 1) * 10;
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
