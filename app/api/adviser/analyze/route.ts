import { NextRequest, NextResponse } from 'next/server';
import { searchRepos, transformRepoToProject } from '@/lib/github';

const keywordGroups: Array<[RegExp, string]> = [
  [/待办|任务|清单|todo/i, 'todo'],
  [/博客|文章|写作|blog/i, 'blog'],
  [/灵感|笔记|知识|记录|note/i, 'notes'],
  [/作品集|个人网站|简历|portfolio/i, 'portfolio'],
  [/习惯|打卡|habit/i, 'habit-tracker'],
  [/图片|相册|摄影|photo/i, 'photo-gallery'],
  [/视频|剪辑|video/i, 'video-editor'],
  [/商店|电商|购物|shop/i, 'ecommerce'],
  [/聊天|对话|chat/i, 'chat-app'],
  [/AI|智能|助手|agent/i, 'ai-assistant'],
];

function searchTerms(idea: string) {
  return keywordGroups.find(([pattern]) => pattern.test(idea))?.[1] ?? 'starter';
}

const relevanceTerms: Record<string, string[]> = {
  todo: ['todo', 'task'],
  blog: ['blog', 'publishing', 'cms'],
  notes: ['note', 'memo', 'knowledge', 'wiki', 'journal'],
  portfolio: ['portfolio', 'personal website', 'resume'],
  'habit-tracker': ['habit', 'tracker'],
  'photo-gallery': ['photo', 'gallery'],
  'video-editor': ['video', 'editor'],
  ecommerce: ['ecommerce', 'commerce', 'shop', 'store'],
  'chat-app': ['chat', 'messaging'],
  'ai-assistant': ['assistant', 'agent', 'chatbot'],
  starter: ['starter', 'template', 'app'],
};

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const idea = typeof body?.idea === 'string' ? body.idea.trim().slice(0, 200) : '';
  const platform = ['网页', '手机应用', '桌面工具'].includes(body?.platform) ? body.platform : '网页';
  const goal = ['先做出来', '可以长期使用', '认真学习开发'].includes(body?.goal) ? body.goal : '先做出来';

  if (idea.length < 6) return NextResponse.json({ error: '请再多描述一点你的想法' }, { status: 400 });

  try {
    const searchTerm = searchTerms(idea);
    const repos = await searchRepos(`${searchTerm} stars:>20 archived:false`);
    const recommendations = repos
      .filter((repo) => {
        const text = `${repo.name} ${repo.description ?? ''} ${(repo.topics ?? []).join(' ')}`.toLowerCase();
        const identityText = `${repo.name} ${(repo.topics ?? []).join(' ')}`.toLowerCase();
        const referenceOnly = ['awesome', 'interview', 'leetcode', 'book', 'course', 'tutorial', 'cheatsheet', 'roadmap'];
        const relevant = relevanceTerms[searchTerm].some((term) => identityText.includes(term));
        return relevant && !referenceOnly.some((term) => text.includes(term));
      })
      .sort((a, b) => Number(Boolean(b.homepage)) - Number(Boolean(a.homepage)) || b.stargazers_count - a.stargazers_count)
      .slice(0, 4)
      .map(transformRepoToProject)
      .map((project, index) => ({
        name: project.name,
        fullName: project.fullName,
        description: project.description,
        stars: project.stars,
        language: project.language,
        reason: index === 0
          ? `和“${idea.slice(0, 20)}”最接近，可以先研究核心结构。`
          : `适合作为${platform}方向的实现参考，不必从空白开始。`,
      }));

    const timeFrame = goal === '先做出来' ? '先用 1-2 天' : '先用一周';
    const plan = [
      { name: '写下唯一目标', description: `第一版只解决“${idea.slice(0, 36)}”这一个问题。` },
      { name: '跑通一个参考项目', description: `${timeFrame}把推荐项目在本地运行起来，先不要修改。` },
      { name: '只保留三个核心功能', description: `围绕${platform}使用场景，删除登录、付费等暂时不需要的部分。` },
      { name: '完成第一次真实使用', description: '自己连续使用三次，再决定下一项功能，而不是一次做完所有设想。' },
    ];

    return NextResponse.json({ recommendations, plan });
  } catch {
    return NextResponse.json({ error: '推荐服务暂时不可用' }, { status: 502 });
  }
}
