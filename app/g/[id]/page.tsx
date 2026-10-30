import type { Metadata } from 'next';
import Gallery from './gallery';

export const metadata: Metadata = {
  title: '사진 받기 | STUDIO 3C',
  robots: { index: false, follow: false },
};

export default async function GalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <Gallery id={id} />;
}
