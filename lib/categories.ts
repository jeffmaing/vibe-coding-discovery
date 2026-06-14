import { Category } from '@/types';

export const categories: Category[] = [
  {
    id: 'portfolio',
    name: '个人网站',
    description: '漂亮的个人主页、博客、作品集模板',
    keywords: ['portfolio', 'blog', 'personal-site', 'resume', 'cv', 'website', 'homepage'],
    icon: 'Globe',
  },
  {
    id: 'ai',
    name: 'AI 应用',
    description: 'ChatGPT 类应用、AI Agent、LLM 工具',
    keywords: ['ai', 'llm', 'gpt', 'machine-learning', 'chatbot', 'openai', 'claude', 'agent', 'assistant'],
    icon: 'Bot',
  },
  {
    id: 'productivity',
    name: '效率工具',
    description: '桌面工具、浏览器插件、CLI 工具',
    keywords: ['productivity', 'todo', 'notes', 'calendar', 'task', 'workflow', 'automation', 'cli', 'desktop', 'extension'],
    icon: 'CheckSquare',
  },
  {
    id: 'saas',
    name: 'SaaS 模板',
    description: '开箱即用的商业项目模板、管理后台',
    keywords: ['saas', 'dashboard', 'admin', 'crm', 'analytics', 'management', 'platform', 'template', 'starter'],
    icon: 'LayoutDashboard',
  },
  {
    id: 'mobile',
    name: '移动端',
    description: 'App、小程序、跨平台开发方案',
    keywords: ['mobile', 'app', 'react-native', 'flutter', 'ios', 'android', 'cross-platform'],
    icon: 'Smartphone',
  },
  {
    id: 'fullstack',
    name: '全栈模板',
    description: 'Next.js、Nuxt 等全栈项目模板',
    keywords: ['fullstack', 'nextjs', 'nuxt', 'starter', 'boilerplate', 'template'],
    icon: 'Code2',
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
