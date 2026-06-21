'use client';

import Link from 'next/link';
import { ArrowRight, ChevronDown, Grid2X2, Layers3, ListChecks, ShieldCheck } from 'lucide-react';
import { useMemo, useState } from 'react';

type Recommendation = {
  name: string;
  fullName: string;
  description: string;
  stars: number;
  language: string;
  reason: string;
};

type PlanItem = { name: string; description: string };
type AdviserResult = { recommendations: Recommendation[]; plan: PlanItem[] };

type GitHubSearchRepo = {
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  homepage: string | null;
  topics?: string[];
};

const audienceOptions = ['我自己', '分享给朋友', '公开给所有人'];
const platformOptions = ['网页', '手机应用', '桌面工具'];
const goalOptions = ['先做出来', '可以长期使用', '认真学习开发'];

const keywordGroups: Array<[RegExp, string, string[]]> = [
  [/待办|任务|清单|todo/i, 'todo', ['todo', 'task']],
  [/博客|文章|写作|blog/i, 'blog', ['blog', 'publishing', 'cms']],
  [/灵感|笔记|知识|记录|note/i, 'notes', ['note', 'memo', 'knowledge', 'wiki', 'journal']],
  [/作品集|个人网站|简历|portfolio/i, 'portfolio', ['portfolio', 'personal website', 'resume']],
  [/习惯|打卡|habit/i, 'habit-tracker', ['habit', 'tracker']],
  [/图片|相册|摄影|photo/i, 'photo-gallery', ['photo', 'gallery']],
  [/视频|剪辑|video/i, 'video-editor', ['video', 'editor']],
  [/商店|电商|购物|shop/i, 'ecommerce', ['ecommerce', 'commerce', 'shop', 'store']],
  [/聊天|对话|chat/i, 'chat-app', ['chat', 'messaging']],
  [/AI|智能|助手|agent/i, 'ai-assistant', ['assistant', 'agent', 'chatbot']],
];

async function createAdvice(idea: string, platform: string, goal: string): Promise<AdviserResult> {
  const matched = keywordGroups.find(([pattern]) => pattern.test(idea));
  const searchTerm = matched?.[1] ?? 'starter';
  const relevance = matched?.[2] ?? ['starter', 'template', 'app'];
  const query = encodeURIComponent(`${searchTerm} stars:>20 archived:false in:name,description,topics`);
  const response = await fetch(`https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&per_page=30`);
  if (!response.ok) throw new Error('GitHub search failed');

  const data = await response.json() as { items?: GitHubSearchRepo[] };
  const referenceOnly = ['awesome', 'interview', 'leetcode', 'book', 'course', 'tutorial', 'cheatsheet', 'roadmap'];
  const recommendations = (data.items ?? [])
    .filter((repo) => {
      const text = `${repo.name} ${repo.description ?? ''} ${(repo.topics ?? []).join(' ')}`.toLowerCase();
      const identity = `${repo.name} ${(repo.topics ?? []).join(' ')}`.toLowerCase();
      return relevance.some((term) => identity.includes(term)) && !referenceOnly.some((term) => text.includes(term));
    })
    .sort((a, b) => Number(Boolean(b.homepage)) - Number(Boolean(a.homepage)) || b.stargazers_count - a.stargazers_count)
    .slice(0, 4)
    .map((repo, index) => ({
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description || '这个项目暂时没有简介。',
      stars: repo.stargazers_count,
      language: repo.language || 'Unknown',
      reason: index === 0
        ? `和“${idea.slice(0, 20)}”最接近，可以先研究核心结构。`
        : `适合作为${platform}方向的实现参考，不必从空白开始。`,
    }));

  const timeFrame = goal === '先做出来' ? '先用 1-2 天' : '先用一周';
  return {
    recommendations,
    plan: [
      { name: '写下唯一目标', description: `第一版只解决“${idea.slice(0, 36)}”这一个问题。` },
      { name: '跑通一个参考项目', description: `${timeFrame}把推荐项目在本地运行起来，先不要修改。` },
      { name: '只保留三个核心功能', description: `围绕${platform}使用场景，删除登录、付费等暂时不需要的部分。` },
      { name: '完成第一次真实使用', description: '自己连续使用三次，再决定下一项功能，而不是一次做完所有设想。' },
    ],
  };
}

function SelectRow({ label, value, options, onChange }: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="make-select-row">
      <span>{label}</span>
      <span className="select-wrap">
        <select value={value} onChange={(event) => onChange(event.target.value)}>
          {options.map((option) => <option key={option}>{option}</option>)}
        </select>
        <ChevronDown aria-hidden="true" size={18} />
      </span>
    </label>
  );
}

function ideaTitle(idea: string) {
  const clean = idea.replace(/^我想(做|要|创建)一个?/, '').replace(/[，。,.]/g, ' ').trim();
  return clean ? clean.slice(0, 22) : '一个等待成形的新想法';
}

export default function MakeStudio() {
  const [idea, setIdea] = useState('我想做一个能帮我记录每天灵感的东西');
  const [audience, setAudience] = useState(audienceOptions[0]);
  const [platform, setPlatform] = useState(platformOptions[0]);
  const [goal, setGoal] = useState(goalOptions[0]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'done'>('idle');
  const [result, setResult] = useState<AdviserResult | null>(null);
  const summary = useMemo(() => ideaTitle(idea), [idea]);

  const submit = async () => {
    if (idea.trim().length < 6) return;
    setStatus('loading');
    setResult(null);
    try {
      setResult(await createAdvice(idea.trim(), platform, goal));
      setStatus('done');
      requestAnimationFrame(() => document.querySelector('#make-results')?.scrollIntoView({ behavior: 'smooth' }));
    } catch {
      setStatus('error');
    }
  };

  return (
    <main className="make-page">
      <section className="make-workspace">
        <div className="make-editor">
          <p className="eyebrow">MAKE YOUR OWN</p>
          <h1>今天，想做点什么？</h1>
          <p className="make-intro">先说一个模糊的想法也可以。我们会陪你把它变成能开始的项目。</p>

          <label className="idea-composer">
            <span className="sr-only">描述你的想法</span>
            <textarea value={idea} onChange={(event) => setIdea(event.target.value)} maxLength={200} />
            <span className="composer-hint">继续补充你的想法...</span>
          </label>

          <div className="make-selects">
            <SelectRow label="它主要给谁用？" value={audience} options={audienceOptions} onChange={setAudience} />
            <SelectRow label="你希望它出现在哪里？" value={platform} options={platformOptions} onChange={setPlatform} />
            <SelectRow label="你更想要？" value={goal} options={goalOptions} onChange={setGoal} />
          </div>

          <div className="make-actions">
            <button type="button" onClick={submit} disabled={idea.trim().length < 6 || status === 'loading'}>
              {status === 'loading' ? '正在整理你的想法...' : '把这个想法变清楚'}
              {status !== 'loading' && <ArrowRight size={22} />}
            </button>
            <button type="button" className="inspiration-link" onClick={() => setIdea('我想做一个帮助自己坚持好习惯的简单工具')}>
              还没想好，给我一点灵感
            </button>
          </div>
          {status === 'error' && <p className="make-error">刚才没有连接成功，请再试一次。</p>}
        </div>

        <aside className="idea-outline" aria-live="polite">
          <p>你的想法</p>
          <h2>{summary}</h2>
          <dl>
            <div><dt>使用场景</dt><dd>{audience === '我自己' ? '随时为自己记录和使用' : `提供给${audience.replace('分享给', '')}使用`}</dd></div>
            <div><dt>第一版本</dt><dd>{platform}中的核心功能，不做多余部分</dd></div>
            <div><dt>下一步</dt><dd>找到可以参考的开源项目</dd></div>
          </dl>
          <span className="outline-assurance"><ShieldCheck size={20} />不会只按热度推荐</span>
        </aside>
      </section>

      <section className="make-deliverables">
        <h2>接下来，你会得到</h2>
        <div><Grid2X2 /><span><strong>适合参考的项目</strong><small>匹配你的想法与技术栈</small></span></div>
        <div><Layers3 /><span><strong>最小功能范围</strong><small>聚焦第一版的核心价值</small></span></div>
        <div><ListChecks /><span><strong>可以直接开始的步骤</strong><small>从环境到第一个功能</small></span></div>
      </section>

      {status === 'done' && result && (
        <section className="make-results" id="make-results">
          <div className="results-heading">
            <p className="eyebrow">A PLACE TO START</p>
            <h2>从这些项目开始看</h2>
            <p>它们不是单纯按 Star 排序，而是更接近你的想法和使用方式。</p>
          </div>
          <div className="recommendation-grid">
            {result.recommendations.map((item) => (
              <article key={item.fullName}>
                <span>{item.language} · {Intl.NumberFormat('zh-CN', { notation: 'compact' }).format(item.stars)} stars</span>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <strong>{item.reason}</strong>
                <div>
                  <a href={`https://github.com/${item.fullName}`} target="_blank" rel="noreferrer">查看 GitHub</a>
                  <Link href={`/project/${encodeURIComponent(item.fullName)}`}>中文解读</Link>
                </div>
              </article>
            ))}
          </div>
          <div className="build-plan">
            <h2>第一版怎么开始</h2>
            {result.plan.map((item) => <div key={item.name}><strong>{item.name}</strong><p>{item.description}</p></div>)}
          </div>
        </section>
      )}
    </main>
  );
}
