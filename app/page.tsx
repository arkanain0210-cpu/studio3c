'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Masonry from 'react-masonry-css';
import Image from 'next/image';

// --- 데이터 타입 정의 ---
interface VideoItem { id: string; title: string; }
interface PhotoItem { id: number; src: string; category: string; }

export default function Home() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [activeTab, setActiveTab] = useState('ALL');

  // --- [ 데이터 설정 ] ---
  const landscapeVideos: VideoItem[] = [
    { id: '_F4SxCrGfmA', title: '비욘드스페이스' },
    { id: 'cfgI9f_MM48', title: '고기리막국수' },
    { id: 'se-_G2RsqKc', title: '방방곳곳이케아' },
    { id: '31vNtId47-c', title: '번호사형' },
    { id: 'wZiXlcM5W5Y', title: 'M/V 강현기-멜로우' },
    { id: 'GD4sJe7LPqk', title: 'M/V 김효민-짐 밖은 위험해' }
  ];

  const verticalVideos: VideoItem[] = [
    { id: '_F4SxCrGfmA', title: 'Shorts 01' }, 
    { id: 'cfgI9f_MM48', title: 'Shorts 02' },
    { id: 'se-_G2RsqKc', title: 'Shorts 03' },
    { id: '31vNtId47-c', title: 'Shorts 04' },
  ];

  const photos: PhotoItem[] = [
    { id: 1, src: '/photo-1.jpg', category: '제품' },
    { id: 2, src: '/photo-2.jpg', category: '스냅' },
    { id: 3, src: '/photo-3.jpg', category: '스냅' },
    { id: 4, src: '/photo-4.jpg', category: '스냅' },
    { id: 5, src: '/photo-5.jpg', category: '스냅' },
    { id: 6, src: '/photo-6.jpg', category: '제품' },
    { id: 7, src: '/photo-7.jpg', category: '제품' },
    { id: 8, src: '/photo-8.jpg', category: '제품' },
    { id: 9, src: '/photo-9.jpg', category: '제품' },
    { id: 10, src: '/photo-10.jpg', category: '풍경' },
    { id: 11, src: '/photo-11.jpg', category: '풍경' },
    { id: 12, src: '/photo-12.jpg', category: '제품' },
  ];

  const categories = ['ALL', '화보/프로필', '포트레이트', '스냅', '제품', '풍경'];
  const filteredPhotos = activeTab === 'ALL' ? photos : photos.filter(p => p.category === activeTab);

  const dupLandscape = [...landscapeVideos, ...landscapeVideos];
  const dupVertical = [...verticalVideos, ...verticalVideos];

  return (
    <main className="min-h-screen bg-white text-[#1a1a1a] font-sans overflow-x-hidden">
      
      {/* 1. 히어로 */}
      <section className="relative h-[85vh] w-full overflow-hidden bg-black">
        <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover opacity-70">
          <source src="/main-bg.mp4" type="video/mp4" />
        </video>
        <nav className="absolute top-0 left-0 right-0 p-10 flex justify-between items-center z-20 text-white">
          <div className="flex flex-col text-left">
            <h1 className="text-2xl font-light tracking-[0.2em]">STUDIO 3C</h1>
            <span className="text-[9px] tracking-[0.1em] opacity-70 uppercase">스튜디오 삼씨네</span>
          </div>
          <div className="hidden md:flex space-x-12 text-[11px] tracking-[0.3em] uppercase">
            <a href="#studio3c" className="hover:opacity-50 transition">Studio 3C</a>
            <a href="#muguum" className="hover:opacity-50 transition">Studio Mug:um</a>
          </div>
        </nav>
        <div className="absolute inset-0 flex flex-col justify-center items-center z-10 text-white text-center">
          <h2 className="text-4xl md:text-6xl font-serif italic tracking-tighter mb-4">Visual Storytelling</h2>
          <p className="text-[10px] tracking-[0.6em] uppercase opacity-60">Photography & Cinematography</p>
        </div>
      </section>

      {/* --- 2. STUDIO 3C: 영상 포트폴리오 (드래그 가능 버전) --- */}
      <section id="studio3c" className="py-32 bg-black text-white overflow-hidden border-b border-zinc-900">
        <div className="max-w-[1600px] mx-auto px-6 mb-16 border-l-2 border-white pl-6">
          <h3 className="text-3xl font-light tracking-widest uppercase font-serif italic">Studio 3C</h3>
          <p className="text-gray-500 text-[10px] tracking-[0.4em] mt-2 uppercase text-left">Selected Film & Shorts</p>
        </div>

        {/* 가로형 브랜드 필름 슬라이드 (드래그 가능) */}
        <div className="relative flex overflow-hidden mb-12 h-[250px] md:h-[400px] cursor-grab active:cursor-grabbing">
          <motion.div 
            className="flex"
            drag="x" // 가로 드래그 활성화
            dragConstraints={{ left: -2000, right: 2000 }} // 드래그 범위 (데이터 양에 따라 조절)
            dragElastic={0.1} // 끄트머리 탄성
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 40, repeat: Infinity }}
            whileHover={{ transition: { duration: 0 } }} // 마우스 올리면 자동 흐름 일시정지
            style={{ width: "max-content" }}
          >
            {dupLandscape.map((video, idx) => (
              <div 
                key={`l-${idx}`} 
                onClick={() => setSelectedVideo(video.id)} 
                className="px-4 w-[400px] md:w-[600px] flex-shrink-0 pointer-events-none" // 이미지 클릭 방해 방지
              >
                <div className="relative aspect-video bg-zinc-900 overflow-hidden shadow-2xl group border border-white/5 pointer-events-auto">
                  <Image src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`} alt={video.title} fill className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* 세로형 쇼츠 슬라이드 (드래그 가능) */}
        <div className="relative flex overflow-hidden h-[320px] md:h-[500px] cursor-grab active:cursor-grabbing">
          <motion.div 
            className="flex"
            drag="x"
            dragConstraints={{ left: -2000, right: 2000 }}
            dragElastic={0.1}
            animate={{ x: ["-50%", "0%"] }}
            transition={{ ease: "linear", duration: 50, repeat: Infinity }}
            whileHover={{ transition: { duration: 0 } }}
            style={{ width: "max-content" }}
          >
            {dupVertical.map((video, idx) => (
              <div 
                key={`v-${idx}`} 
                onClick={() => setSelectedVideo(video.id)} 
                className="px-3 w-[180px] md:w-[280px] flex-shrink-0 pointer-events-none"
              >
                <div className="relative aspect-[9/16] bg-zinc-900 overflow-hidden shadow-2xl group border border-white/5 pointer-events-auto">
                  <Image src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`} alt={video.title} fill className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. 사진 섹션 */}
      <section id="muguum" className="py-24 bg-white px-6">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-16">
            <div className="border-r-2 border-black pr-6 text-left mb-8 md:mb-0">
              <h3 className="text-3xl font-serif italic tracking-tighter uppercase">Studio Mug:um</h3>
              <p className="text-[10px] tracking-[0.4em] text-gray-400 mt-2 uppercase font-medium">Photography Portfolio</p>
            </div>
            <div className="flex flex-wrap gap-8 text-[11px] tracking-widest uppercase font-semibold">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setActiveTab(cat)} className={`pb-1 transition-all duration-300 ${activeTab === cat ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-black'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <Masonry breakpointCols={{ default: 4, 1100: 3, 700: 2, 500: 1 }} className="flex -ml-4 w-auto" columnClassName="pl-4 bg-clip-padding">
            {filteredPhotos.map((p) => (
              <div key={p.id} onClick={() => setSelectedPhoto(p)} className="mb-4 group relative overflow-hidden bg-white shadow-sm cursor-pointer border border-gray-100">
                <Image src={p.src} alt="p" width={800} height={1200} className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-105" />
              </div>
            ))}
          </Masonry>
        </div>
      </section>

      {/* 모달 */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedVideo(null)} className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
            <div className="relative w-full max-w-5xl aspect-video">
              <iframe src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`} className="w-full h-full border-0" allowFullScreen />
            </div>
          </motion.div>
        )}
        {selectedPhoto && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedPhoto(null)} className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="relative max-w-full max-h-full">
              <Image src={selectedPhoto.src} alt="f" width={1920} height={1080} className="max-w-full max-h-[90vh] object-contain shadow-2xl" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}