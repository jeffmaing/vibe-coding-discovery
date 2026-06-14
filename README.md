# Vibe Coding 发现平台

发现最火的 Vibe Coding 项目——帮你从海量开源项目中，只挑最值得做的那个。

## 功能特性

- **热门发现**：展示各类别最火项目，按热度分数排序
- **智能搜索**：输入关键词，直接找到相关项目
- **分类浏览**：AI工具、效率工具、SaaS、个人网站、游戏、电商
- **项目卡片**：名称、描述、星标数、语言、难度标签

## 技术栈

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Lucide React (图标)
- GitHub REST API

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 3. 构建生产版本

```bash
npm run build
npm start
```

## 项目结构

```
vibe-coding-discovery/
├── app/
│   ├── api/
│   │   ├── categories/route.ts      # 分类 API
│   │   └── projects/
│   │       ├── trending/route.ts    # 热门项目 API
│   │       └── search/route.ts      # 搜索 API
│   ├── layout.tsx                   # 根布局
│   ├── page.tsx                     # 首页
│   └── globals.css                  # 全局样式
├── components/
│   ├── Hero.tsx                     # Hero 区
│   ├── SearchBar.tsx                # 搜索框
│   ├── CategoryTabs.tsx             # 分类 Tab
│   ├── ProjectCard.tsx              # 项目卡片
│   └── ProjectGrid.tsx              # 项目网格
├── lib/
│   ├── categories.ts                # 分类配置
│   ├── github.ts                    # GitHub API 封装
│   └── utils.ts                     # 工具函数
├── types/
│   └── index.ts                     # TypeScript 类型定义
└── tailwind.config.ts               # Tailwind 配置
```

## 分类规则

| 分类 | 关键词 |
|------|--------|
| AI工具 | ai, llm, gpt, machine-learning, chatbot, openai, claude |
| 效率工具 | productivity, todo, notes, calendar, task, workflow |
| SaaS | saas, dashboard, admin, crm, analytics, management |
| 个人网站 | portfolio, blog, personal-site, resume, cv |
| 游戏 | game, game-engine, unity, godot, multiplayer |
| 电商 | ecommerce, shop, store, payment, checkout |

## 筛选标准

只展示真正 hot 的项目：
- 总星标 > 500
- 最近有更新
- 有 README 和基础文档
- 热度分数 > 20

## 热度分数算法

```
热度分数 = 基础分(总星标对数) + 活跃度加分(最近更新)
```

## 开发计划

- [x] Phase 1: MVP（首页 + 搜索 + 分类 + 项目卡片）
- [ ] Phase 2: 项目详情页
- [ ] Phase 3: 优化（缓存、SEO、性能）
- [ ] Phase 4: 部署上线

## 许可证

MIT
