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

const audienceOptions = ['我自己', '分享给朋友', '公开给所有人'];
const platformOptions = ['网页', '手机应用', '桌面工具'];
const goalOptions = ['先做出来', '可以长期使用', '认真学习开发'];

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
      const response = await fetch('/api/adviser/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: idea.trim(), audience, platform, goal }),
      });
      if (!response.ok) throw new Error('request failed');
      setResult(await response.json());
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
