import type { Metadata } from 'next';
import Display from './display';

export const metadata: Metadata = {
  title: 'QR 화면 | STUDIO 3C',
  robots: { index: false, follow: false },
};

export default function DisplayPage() {
  return <Display />;
}
