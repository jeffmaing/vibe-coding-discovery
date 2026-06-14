import ScrollReveal from './ScrollReveal';

const steps = [
  {
    number: '1',
    title: '描述你的想法',
    description: '告诉 AI 你想做什么，比如"我想做一个记账 App"',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    number: '2',
    title: '获得推荐项目',
    description: 'AI 帮你找到最适合参考的开源项目',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    number: '3',
    title: '一键搭建',
    description: '用 Claude Code 直接部署到本地',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-apple-bgSecondary">
      <div className="max-w-content mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-12">
            <p className="text-[14px] font-medium text-apple-blue tracking-wide uppercase mb-3">
              如何使用
            </p>
            <h2 className="text-[32px] md:text-[40px] font-semibold tracking-tight text-apple-ink">
              3 步搭建你的项目
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, idx) => (
            <ScrollReveal key={step.number} delay={idx * 100}>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-apple-blue mb-5 shadow-sm">
                  {step.icon}
                </div>
                <h3 className="text-[20px] font-semibold text-apple-ink mb-2">
                  {step.title}
                </h3>
                <p className="text-[15px] text-apple-gray leading-relaxed">
                  {step.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={400}>
          <div className="mt-12 text-center">
            <p className="text-[14px] text-apple-gray">
              适配 <span className="font-medium text-apple-ink">Claude Code</span> / <span className="font-medium text-apple-ink">Cursor</span> / <span className="font-medium text-apple-ink">Hermes Skills</span>
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
