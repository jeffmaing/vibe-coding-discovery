import { NextRequest, NextResponse } from 'next/server';
import { fetchTrendingRepos, transformRepoToProject } from '@/lib/github';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category') || 'all';

  try {
    const repos = await fetchTrendingRepos(category);
    const projects = repos.map(transformRepoToProject);
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
