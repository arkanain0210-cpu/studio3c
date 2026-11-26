import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VS 프로필 사진 | VENTURE SQUARE',
  robots: { index: false, follow: false },
};

// 각 분의 네이버 MYBOX 공유 폴더 링크 (가나다순)
const PROFILES = [
  { name: '강민준 님', url: 'https://naver.me/FgElLJRi' },
  { name: '김두용 님', url: 'https://naver.me/5Z1h9rlF' },
  { name: '김우람 님', url: 'https://naver.me/GkIWBiEj' },
  { name: '김태민 님', url: 'https://naver.me/5K6RtToT' },
  { name: '김희준 님', url: 'https://naver.me/GzdNlCWk' },
  { name: '박승택 님', url: 'https://naver.me/xsZP9xbS' },
  { name: '이대림 님', url: 'https://naver.me/GowRbaYj' },
  { name: '이상원 님', url: 'https://naver.me/G3vcwdb7' },
  { name: '이승철 님', url: 'https://naver.me/GzdNlp5F' },
  { name: '이윤수 님', url: 'https://naver.me/xtNfY5dm' },
  { name: '이장철 님', url: 'https://naver.me/xllfdJm6' },
  { name: '이지연 님', url: 'https://naver.me/x52zZNhF' },
  { name: '이형준 님', url: 'https://naver.me/5nhKCqAQ' },
  { name: '전상권 님', url: 'https://naver.me/GsBIWHVi' },
  { name: '최진명 님', url: 'https://naver.me/FfsX8Ctx' },
];

export default function VSProfilePage() {
  return (
    <main className="min-h-screen bg-[#f6f3ee] text-zinc-900">
      <div className="mx-auto max-w-md px-4 pb-16 pt-10">
        <p className="text-center text-xs tracking-[0.3em] text-zinc-500">VENTURE SQUARE</p>
        <h1 className="mt-6 text-center text-xl font-semibold">VS 프로필 사진</h1>
        <p className="mt-1 text-center text-sm text-zinc-600">본인 이름을 누르면 사진 폴더가 열려요</p>

        <ul className="mt-8 grid grid-cols-2 gap-3">
          {PROFILES.map((p) => (
            <li key={p.name}>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-14 items-center justify-center rounded-full border border-zinc-900 bg-white text-base font-medium transition active:scale-[0.97] active:bg-zinc-900 active:text-white"
              >
                {p.name}
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center text-xs leading-relaxed text-zinc-500">
          네이버 MYBOX에서 원본 사진을 내려받을 수 있어요.
        </p>
      </div>
    </main>
  );
}
