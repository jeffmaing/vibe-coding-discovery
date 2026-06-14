import ScrollReveal from './ScrollReveal';

const methods = [
  {
    title: 'Claude Code',
    description: '复制项目地址，在 Claude Code 中输入：',
    example: '"参考这个项目，帮我做一个类似的记账 App"',
    color: 'bg-orange-50 text-orange-700',
  },
  {
    title: 'Hermes Skills',
    description: '安装对应 Skill，直接复用项目能力',
    example: 'hermes skill install github.com/user/repo',
    color: 'bg-blue-50 text-blue-700',
  },
  {
    title: '直接部署',
    description: 'Fork 项目，修改后一键部署到 Vercel',
    example: 'git fork → 修改 → vercel --prod',
    color: 'bg-green-50 text-green-700',
  },
];

export default function UsageMethods() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-content mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-[32px] md:text-[40px] font-semibold tracking-tight text-apple-ink">
              选择你的方式
            </h2>
            <p className="mt-4 text-[17px] text-apple-gray">
              3 种方式，让你快速上手
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {methods.map((method, idx) => (
            <ScrollReveal key={method.title} delay={idx * 100}>
              <div className="h-full p-6 bg-apple-bgSecondary rounded-2xl hover:bg-white hover:shadow-md transition-all duration-300">
                <div className={`inline-block px-3 py-1 rounded-full text-[13px] font-medium mb-4 ${method.color}`}>
                  {method.title}
                </div>
                <p className="text-[15px] text-apple-ink mb-3 leading-relaxed">
                  {method.description}
                </p>
                <code className="block text-[13px] text-apple-gray bg-white px-3 py-2 rounded-lg font-mono">
                  {method.example}
                </code>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
