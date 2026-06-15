import { promises as fs } from 'fs';
import path from 'path';
import type { Project } from '@/types';
import { fetchReadme } from './readme';

export interface ProjectInterpretation {
  id: string;
  what: string;
  goodFor: string[];
  notFor: string[];
  tech: string;
  learning: string;
  deploy: string;
  suggestion: string;
  difficultyStars: number;
  prompt: string;
}

const CACHE_DIR = path.join(process.cwd(), 'data', 'project-interpretations');

function chineseDescription(project: Project): string {
  // 不直接使用英文 description，而是用项目名称生成通用描述
  return `${project.name} 是 GitHub 上非常受欢迎的一个项目，已有 ${project.stars >= 1000 ? Math.round(project.stars / 1000) + 'k' : project.stars} 人关注。`;
}

function buildPrompt(project: Project, readme: string): string {
  const truncatedReadme = readme.slice(0, 5000) || '（暂无 README）';
  return `你是一个技术翻译专家，帮不懂技术的普通人解读 GitHub 项目。

请根据以下 GitHub 项目信息，生成通俗易懂的中文解读。

项目信息：
- 名称：${project.fullName}
- 描述：${project.description || '（无描述）'}
- 主要语言：${project.language}
- 星标数：${project.stars}
- README 内容：
${truncatedReadme}

请严格按照下面的 JSON 格式输出，不要输出任何其他内容，不要 markdown 代码块包裹：

{
  "what": "用 2-3 句话解释这个项目是什么，举生活中的例子，让不懂技术的人也能理解",
  "goodFor": ["3-5 个具体场景，用 想做XXX 的句式"],
  "notFor": ["2-3 个不适合的场景，并告诉用户应该用什么替代"],
  "tech": "技术门槛评估：1-5 星（用 ★ 表示），并简要说明需要懂什么",
  "learning": "学习时间评估：1-5 星（用 ★ 表示），并说明大约多久可以上手",
  "deploy": "部署难度评估：1-5 星（用 ★ 表示），并说明需要什么条件",
  "difficultyStars": 3,
  "suggestion": "给小白的具体建议，告诉他们第一步该做什么",
  "prompt": "一段可以让用户复制给 AI 助手的中文 prompt，让 AI 参考该项目帮用户做自己的项目。prompt 要包含项目链接和具体功能要求"
}

注意：
- 全部用通俗中文，不要用 SSR、全栈、开源等技术术语
- difficultyStars 是 1-5 的整数
- 不要用 emoji`;
}

function buildFallbackInterpretation(project: Project): ProjectInterpretation {
  const id = project.fullName;
  const prompt = `参考 GitHub 项目 ${project.htmlUrl}，帮我做一个类似的项目，但请用更简单的方式实现，并加上中文界面和详细注释。`;

  return {
    id,
    what: chineseDescription(project),
    goodFor: [
      '想做一个类似的网站或应用',
      '想学习别人是怎么写代码的',
      '想节省开发时间，直接在已有项目上改',
    ],
    notFor: [
      '完全没有写过代码的人（建议先看一些基础教程）',
      '想做一个完全不同类型的项目（应该找更对口的模板）',
    ],
    tech: '★ ★ ★（需要会基础的编程操作）',
    learning: '★ ★（花一两周研究可以上手）',
    deploy: '★ ★（需要一台能上网的电脑，按照说明一步步来）',
    difficultyStars: 3,
    suggestion: `第一步：打开 ${project.htmlUrl} 仔细读一下介绍。第二步：把上面的 prompt 复制给 AI 助手，让它帮你拆解任务。`,
    prompt,
  };
}

function safeId(id: string): string {
  return id.replace(/[\/\\]/g, '__');
}

async function readCache(id: string): Promise<ProjectInterpretation | null> {
  try {
    const file = path.join(CACHE_DIR, `${safeId(id)}.json`);
    const raw = await fs.readFile(file, 'utf-8');
    return JSON.parse(raw) as ProjectInterpretation;
  } catch {
    return null;
  }
}

async function writeCache(interpretation: ProjectInterpretation): Promise<void> {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    const file = path.join(CACHE_DIR, `${safeId(interpretation.id)}.json`);
    await fs.writeFile(file, JSON.stringify(interpretation, null, 2), 'utf-8');
  } catch {
    // 缓存写入失败不影响主流程
  }
}

function extractJson(text: string): string | null {
  let t = text.trim();
  if (t.startsWith('```')) {
    t = t.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  }
  const firstBrace = t.indexOf('{');
  const lastBrace = t.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace === -1) return null;
  return t.slice(firstBrace, lastBrace + 1);
}

function parseDifficultyStars(text: string): number {
  const match = text.match(/★/g);
  const count = match ? match.length : 3;
  return Math.max(1, Math.min(5, count));
}

function safeParse(text: string, project: Project): ProjectInterpretation | null {
  const jsonStr = extractJson(text);
  if (!jsonStr) return null;
  try {
    const data = JSON.parse(jsonStr);
    if (!data.what || !Array.isArray(data.goodFor)) return null;
    return {
      id: project.fullName,
      what: String(data.what),
      goodFor: Array.isArray(data.goodFor) ? data.goodFor.map(String) : [],
      notFor: Array.isArray(data.notFor) ? data.notFor.map(String) : [],
      tech: String(data.tech || ''),
      learning: String(data.learning || ''),
      deploy: String(data.deploy || ''),
      difficultyStars: typeof data.difficultyStars === 'number'
        ? Math.max(1, Math.min(5, data.difficultyStars))
        : parseDifficultyStars(String(data.tech || '')),
      suggestion: String(data.suggestion || ''),
      prompt: String(data.prompt || ''),
    };
  } catch {
    return null;
  }
}

export async function generateInterpretation(
  project: Project
): Promise<ProjectInterpretation> {
  const cached = await readCache(project.fullName);
  if (cached) return cached;

  const fallback = buildFallbackInterpretation(project);
  const apiKey = process.env.DASHSCOPE_API_KEY;
  if (!apiKey) {
    return fallback;
  }

  const readme = await fetchReadme(project.fullName);
  const promptText = buildPrompt(project, readme);

  try {
    const response = await fetch(
      'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'qwen-plus',
          messages: [{ role: 'user', content: promptText }],
          temperature: 0.5,
        }),
      }
    );

    if (!response.ok) {
      return fallback;
    }

    const data = await response.json();
    const content: string = data?.choices?.[0]?.message?.content ?? '';
    const parsed = safeParse(content, project);
    const result = parsed || fallback;
    await writeCache(result);
    return result;
  } catch {
    return fallback;
  }
}
