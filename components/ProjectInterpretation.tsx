'use client';

import { useState } from 'react';
import type { ProjectInterpretation } from '@/lib/interpretation';

interface ProjectInterpretationProps {
  interpretation: ProjectInterpretation;
}

function Stars({ count }: { count: number }) {
  return (
    <span aria-label={`${count} 星`}>
      {'★'.repeat(Math.max(1, Math.min(5, count)))}
      <span className="text-apple-border">
        {'★'.repeat(Math.max(0, 5 - Math.max(1, Math.min(5, count))))}
      </span>
    </span>
  );
}

export default function ProjectInterpretationView({
  interpretation,
}: ProjectInterpretationProps) {
  const [copied, setCopied] = useState(false);

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(interpretation.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 浏览器拒绝复制时静默失败
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="bg-apple-bgSecondary rounded-apple p-6 md:p-8">
        <h2 className="text-[18px] md:text-[20px] font-semibold text-apple-ink mb-3">
          这是什么？
        </h2>
        <p className="text-[15px] leading-[1.7] text-apple-ink/90 whitespace-pre-line">
          {interpretation.what}
        </p>
      </section>

      <section className="bg-apple-bgSecondary rounded-apple p-6 md:p-8">
        <h2 className="text-[18px] md:text-[20px] font-semibold text-apple-ink mb-4">
          适合做什么？
        </h2>
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <p className="text-[14px] font-medium text-apple-ink mb-2">适合：</p>
            <ul className="space-y-2">
              {interpretation.goodFor.map((item, idx) => (
                <li
                  key={idx}
                  className="flex gap-2 text-[14px] leading-[1.6] text-apple-ink/90"
                >
                  <span className="shrink-0 text-apple-ink font-bold">+</span>
                  <span>{item}</span>
                </li>
              ))}
              {interpretation.goodFor.length === 0 && (
                <li className="text-[14px] text-apple-gray">暂无建议</li>
              )}
            </ul>
          </div>
          <div>
            <p className="text-[14px] font-medium text-apple-ink mb-2">不适合：</p>
            <ul className="space-y-2">
              {interpretation.notFor.map((item, idx) => (
                <li
                  key={idx}
                  className="flex gap-2 text-[14px] leading-[1.6] text-apple-ink/90"
                >
                  <span className="shrink-0 text-apple-gray font-bold">-</span>
                  <span>{item}</span>
                </li>
              ))}
              {interpretation.notFor.length === 0 && (
                <li className="text-[14px] text-apple-gray">暂无建议</li>
              )}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-apple-bgSecondary rounded-apple p-6 md:p-8">
        <h2 className="text-[18px] md:text-[20px] font-semibold text-apple-ink mb-4">
          难度评估
        </h2>
        <div className="grid md:grid-cols-3 gap-4 md:gap-6 text-[14px]">
          <div>
            <p className="text-apple-gray mb-1">技术门槛</p>
            <p className="text-[15px] text-apple-ink mb-1">
              <Stars count={interpretation.difficultyStars} />
            </p>
            <p className="text-apple-ink/80 leading-[1.6]">
              {interpretation.tech || '需要基础的编程操作能力'}
            </p>
          </div>
          <div>
            <p className="text-apple-gray mb-1">学习时间</p>
            <p className="text-[15px] text-apple-ink mb-1">
              <Stars count={Math.max(1, interpretation.difficultyStars - 1)} />
            </p>
            <p className="text-apple-ink/80 leading-[1.6]">
              {interpretation.learning || '大约一两周可以上手'}
            </p>
          </div>
          <div>
            <p className="text-apple-gray mb-1">部署难度</p>
            <p className="text-[15px] text-apple-ink mb-1">
              <Stars count={Math.min(5, interpretation.difficultyStars + 0)} />
            </p>
            <p className="text-apple-ink/80 leading-[1.6]">
              {interpretation.deploy || '按照说明文档操作即可'}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-apple-bgSecondary rounded-apple p-6 md:p-8">
        <h2 className="text-[18px] md:text-[20px] font-semibold text-apple-ink mb-3">
          使用建议
        </h2>
        <p className="text-[15px] leading-[1.7] text-apple-ink/90 whitespace-pre-line">
          {interpretation.suggestion}
        </p>
      </section>

      <section className="bg-white border border-apple-border rounded-apple p-6 md:p-8">
        <h2 className="text-[18px] md:text-[20px] font-semibold text-apple-ink mb-2">
          怎么用？
        </h2>
        <p className="text-[13px] text-apple-gray mb-4">
          复制下面这段话，发给 Claude Code 或 ChatGPT，让它参考这个项目帮你做自己的版本
        </p>
        <pre className="bg-apple-bgSecondary rounded-2xl p-4 md:p-5 text-[13px] md:text-[14px] leading-[1.6] text-apple-ink whitespace-pre-wrap break-words font-mono">
          {interpretation.prompt}
        </pre>
        <button
          type="button"
          onClick={copyPrompt}
          className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 text-[14px] font-medium text-white bg-apple-ink rounded-pill hover:bg-apple-ink/90 transition"
        >
          {copied ? '已复制' : '复制 prompt'}
        </button>
      </section>
    </div>
  );
}
