import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Vibe yourself - 看见新的，做出你的',
    template: '%s | Vibe yourself',
  },
  description: '追踪正在发生的 AI、产品和创作趋势，再把灵感变成自己的作品。',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
