import type { Metadata } from 'next';
import MakeStudio from '@/components/MakeStudio';

export const metadata: Metadata = {
  title: '做点什么',
  description: '说出一个模糊的想法，把它变成可以开始的项目。',
};

export default function MakePage() {
  return <MakeStudio />;
}
