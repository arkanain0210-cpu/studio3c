import type { Metadata } from 'next';
import Station from './station';

export const metadata: Metadata = {
  title: '스테이션 | STUDIO 3C',
  robots: { index: false, follow: false },
};

export default function StationPage() {
  return <Station />;
}
