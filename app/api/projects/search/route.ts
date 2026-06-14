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
