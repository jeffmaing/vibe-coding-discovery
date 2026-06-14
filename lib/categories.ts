import { Category } from '@/types';

export const categories: Category[] = [
  {
    id: 'ai',
    name: 'AI工具',
    keywords: ['ai', 'llm', 'gpt', 'machine-learning', 'chatbot', 'openai', 'claude', 'artificial-intelligence'],
    icon: 'Bot',
  },
  {
    id: 'productivity',
    name: '效率工具',
    keywords: ['productivity', 'todo', 'notes', 'calendar', 'task', 'workflow', 'automation'],
    icon: 'CheckSquare',
  },
  {
    id: 'saas',
    name: 'SaaS',
    keywords: ['saas', 'dashboard', 'admin', 'crm', 'analytics', 'management', 'platform'],
    icon: 'LayoutDashboard',
  },
  {
    id: 'portfolio',
    name: '个人网站',
    keywords: ['portfolio', 'blog', 'personal-site', 'resume', 'cv', 'website'],
    icon: 'Globe',
  },
  {
    id: 'game',
    name: '游戏',
    keywords: ['game', 'game-engine', 'unity', 'godot', 'multiplayer', 'gaming'],
    icon: 'Gamepad2',
  },
  {
    id: 'ecommerce',
    name: '电商',
    keywords: ['ecommerce', 'shop', 'store', 'payment', 'checkout', 'commerce'],
    icon: 'ShoppingCart',
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
