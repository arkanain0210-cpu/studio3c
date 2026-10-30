'use client';

import { useEffect, useState } from 'react';
import { isValidSessionId, listGalleryFiles, publicUrl, type GalleryFile } from '@/lib/gallery';

const POLL_MS = 2500;
const POLL_FOR_MS = 20 * 60 * 1000; // 인화·업로드가 늦어져도 20분까지는 기다립니다

function fileName(id: string, index: number) {
  return `studio3c-${id}-${index + 1}.jpg`;
}

async function toFile(url: string, name: string) {
  const res = await fetch(url);
  const blob = await res.blob();
  return new File([blob], name, { type: blob.type || 'image/jpeg' });
}

// 폰에서는 공유 시트("이미지 저장")가 가장 확실하고, 안 되면 일반 다운로드로 넘어갑니다.
async function saveFiles(files: File[]) {
  if (navigator.canShare?.({ files })) {
    try {
      await navigator.share({ files });
      return;
    } catch (e) {
      if ((e as Error).name === 'AbortError') return;
    }
  }
  for (const file of files) {
    const href = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = href;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(href), 10_000);
  }
}

export default function Gallery({ id }: { id: string }) {
  const valid = isValidSessionId(id);
  const [files, setFiles] = useState<GalleryFile[]>([]);
  const [timedOut, setTimedOut] = useState(false);
  const [saving, setSaving] = useState<number | 'all' | null>(null);

  useEffect(() => {
    if (!valid) return;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;
    const startedAt = Date.now();

    const poll = async () => {
      try {
        const next = await listGalleryFiles(id);
        if (!stopped) setFiles((prev) => (prev.length === next.length ? prev : next));
      } catch {
        // 네트워크가 잠깐 끊겨도 다음 주기에 다시 시도합니다
      }
      if (stopped) return;
      if (Date.now() - startedAt > POLL_FOR_MS) {
        setTimedOut(true);
        return;
      }
      timer = setTimeout(poll, POLL_MS);
    };
    poll();
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [id, valid]);

  const save = async (target: number | 'all') => {
    setSaving(target);
    try {
      const picked = target === 'all' ? files.map((f, i) => [f, i] as const) : [[files[target], target] as const];
      const list = await Promise.all(picked.map(([f, i]) => toFile(publicUrl(f.name), fileName(id, i))));
      await saveFiles(list);
    } catch {
      alert('저장에 실패했어요. 사진을 길게 눌러 저장해 주세요.');
    } finally {
      setSaving(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f3ee] text-zinc-900">
      <div className="mx-auto max-w-md px-4 pb-16 pt-10">
        <p className="text-center text-xs tracking-[0.3em] text-zinc-500">STUDIO 3C</p>

        {!valid ? (
          <p className="mt-16 text-center text-zinc-600">잘못된 링크예요. 현장 스태프에게 QR을 다시 요청해 주세요.</p>
        ) : files.length === 0 ? (
          <div className="mt-16 flex flex-col items-center text-center">
            {timedOut ? (
              <p className="text-zinc-600">아직 사진이 올라오지 않았어요.<br />현장 스태프에게 문의해 주세요.</p>
            ) : (
              <>
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
                <h1 className="mt-6 text-xl font-semibold">사진을 준비하고 있어요</h1>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  인화되는 동안 잠시만 기다려 주세요.<br />준비되면 이 화면에 자동으로 나타나요.
                </p>
              </>
            )}
          </div>
        ) : (
          <>
            <h1 className="mt-6 text-center text-xl font-semibold">사진이 도착했어요</h1>
            <p className="mt-1 text-center text-sm text-zinc-600">버튼을 누르거나 사진을 길게 눌러 저장하세요</p>

            {files.length > 1 && (
              <button
                onClick={() => save('all')}
                disabled={saving !== null}
                className="mt-6 w-full rounded-full bg-zinc-900 py-3.5 text-sm font-medium text-white disabled:opacity-50"
              >
                {saving === 'all' ? '준비 중…' : `전체 저장 (${files.length}장)`}
              </button>
            )}

            <ul className="mt-6 space-y-8">
              {files.map((f, i) => (
                <li key={f.name}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- 원본 그대로 저장되도록 최적화 없이 표시 */}
                  <img src={publicUrl(f.name)} alt={`사진 ${i + 1}`} className="w-full rounded-lg shadow-md" />
                  <button
                    onClick={() => save(i)}
                    disabled={saving !== null}
                    className="mt-3 w-full rounded-full border border-zinc-900 py-3 text-sm font-medium disabled:opacity-50"
                  >
                    {saving === i ? '준비 중…' : '사진 저장'}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </main>
  );
}
