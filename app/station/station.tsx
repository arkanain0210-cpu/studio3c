'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { BUCKET, STATION_EMAIL, getSupabase, newSessionId } from '@/lib/gallery';
import QrCode from './qr-code';
import { CHANNEL_NAME, type ChannelMessage, type DisplayState } from './channel';

const POLL_MS = 1500;
const UPLOAD_TICK_MS = 1000;
const AUTO_NEW_AFTER_MS = 3 * 60 * 1000;
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
const MAX_EDGE = 3000;
const IMAGE_RE = /\.(jpe?g|png)$/i;

const STORAGE_SESSION = 'studio3c.station.session';
const STORAGE_NEXT_NO = 'studio3c.station.nextNo';
const STORAGE_AUTO_NEW = 'studio3c.station.autoNew';

interface Session {
  id: string;
  customerNo: number;
  startedAt: number;
}

type Status = 'queued' | 'uploading' | 'done' | 'error';

interface Item {
  key: string;
  name: string;
  file: File;
  sessionId: string;
  customerNo: number;
  addedAt: number;
  status: Status;
  attempts: number;
  retryAt: number;
  error?: string;
}

interface KnownFile {
  size: number;
  lastModified: number;
  handledAt: number | null;
}

// File System Access API는 크롬/엣지 전용이라 TS 기본 타입에 없습니다
type DirHandle = FileSystemDirectoryHandle & { values(): AsyncIterable<FileSystemHandle> };
declare global {
  interface Window {
    showDirectoryPicker?: (options?: { mode?: 'read' | 'readwrite' }) => Promise<DirHandle>;
  }
}

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

function writeStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 저장 공간이 막혀 있어도 동작에는 지장 없음
  }
}

function galleryUrl(sessionId: string) {
  return `${window.location.origin}/g/${sessionId}`;
}

// 큰 원본이 들어와도 현장 회선에서 빨리 올라가도록 긴 변 3000px JPEG로 줄입니다
async function prepareUpload(file: File): Promise<{ body: Blob; ext: string; type: string }> {
  const isJpeg = /\.jpe?g$/i.test(file.name);
  if (file.size <= MAX_UPLOAD_BYTES) {
    return { body: file, ext: isJpeg ? 'jpg' : 'png', type: isJpeg ? 'image/jpeg' : 'image/png' };
  }
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const body = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('이미지 변환 실패'))), 'image/jpeg', 0.92),
  );
  return { body, ext: 'jpg', type: 'image/jpeg' };
}

export default function Station() {
  const supabase = getSupabase();
  const [authState, setAuthState] = useState<'loading' | 'out' | 'in'>('loading');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [session, setSession] = useState<Session | null>(null);
  const [autoNew, setAutoNew] = useState(true);
  const [dirName, setDirName] = useState<string | null>(null);
  const [folderError, setFolderError] = useState('');
  const [online, setOnline] = useState(true);
  const [dragging, setDragging] = useState(false);
  // 백그라운드 루프는 itemsRef를 직접 고치고, 화면은 그 복사본(items)으로 그립니다
  const [items, setItems] = useState<Item[]>([]);

  const sessionRef = useRef<Session | null>(null);
  const autoNewRef = useRef(true);
  const itemsRef = useRef<Item[]>([]);
  const lastAddedRef = useRef<{ sessionId: string; at: number } | null>(null);
  const knownRef = useRef(new Map<string, KnownFile>());
  const dirRef = useRef<DirHandle | null>(null);
  const uploadingRef = useRef(false);
  const channelRef = useRef<BroadcastChannel | null>(null);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const { error } = await supabase.auth.signInWithPassword({ email: STATION_EMAIL, password });
    if (error) setLoginError('비밀번호가 맞지 않거나 인터넷 연결이 없습니다.');
    else setPassword('');
  };

  // --- 고객 세션 ---
  const applySession = useCallback((next: Session) => {
    sessionRef.current = next;
    setSession(next);
    writeStorage(STORAGE_SESSION, next);
  }, []);

  const startNewSession = useCallback(() => {
    const customerNo = readStorage(STORAGE_NEXT_NO, 1);
    writeStorage(STORAGE_NEXT_NO, customerNo + 1);
    applySession({ id: newSessionId(), customerNo, startedAt: Date.now() });
  }, [applySession]);

  // 새로고침해도 화면에 띄운 QR(현재 고객)이 그대로 유지되도록 저장된 세션을 이어받습니다
  const restoreStation = useCallback(() => {
    if (sessionRef.current) return;
    const saved = readStorage<Session | null>(STORAGE_SESSION, null);
    if (saved) applySession(saved);
    else startNewSession();
    const savedAutoNew = readStorage(STORAGE_AUTO_NEW, true);
    autoNewRef.current = savedAutoNew;
    setAutoNew(savedAutoNew);
  }, [applySession, startNewSession]);

  // --- 로그인 ---
  useEffect(() => {
    const apply = (signedIn: boolean) => {
      if (signedIn) restoreStation();
      setAuthState(signedIn ? 'in' : 'out');
    };
    supabase.auth.getSession().then(({ data }) => apply(!!data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, s) => apply(!!s));
    return () => data.subscription.unsubscribe();
  }, [supabase, restoreStation]);

  const resetNumbers = () => {
    if (!confirm('고객 번호를 1번부터 다시 시작할까요?')) return;
    writeStorage(STORAGE_NEXT_NO, 1);
    startNewSession();
  };

  const toggleAutoNew = (value: boolean) => {
    autoNewRef.current = value;
    setAutoNew(value);
    writeStorage(STORAGE_AUTO_NEW, value);
  };

  const publishItems = useCallback(() => {
    setItems(itemsRef.current.map((it) => ({ ...it })));
  }, []);

  // --- 파일 추가 ---
  const enqueue = useCallback(
    (file: File) => {
      let current = sessionRef.current;
      if (!current) return;
      const last = lastAddedRef.current;
      // "다음 고객"을 깜빡해도 다른 손님 사진이 섞이지 않도록, 한동안 조용했으면 새 고객으로 넘깁니다
      if (autoNewRef.current && last?.sessionId === current.id && Date.now() - last.at > AUTO_NEW_AFTER_MS) {
        startNewSession();
        current = sessionRef.current!;
      }
      lastAddedRef.current = { sessionId: current.id, at: Date.now() };
      itemsRef.current = [
        ...itemsRef.current,
        {
          key: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          name: file.name,
          file,
          sessionId: current.id,
          customerNo: current.customerNo,
          addedAt: Date.now(),
          status: 'queued',
          attempts: 0,
          retryAt: 0,
        },
      ];
      publishItems();
    },
    [startNewSession, publishItems],
  );

  // --- 폴더 감시 ---
  const scanFolder = useCallback(
    async (initial: boolean) => {
      const dir = dirRef.current;
      if (!dir) return;
      const known = knownRef.current;
      for await (const handle of dir.values()) {
        if (handle.kind !== 'file' || !IMAGE_RE.test(handle.name) || /^[.~]/.test(handle.name)) continue;
        const file = await (handle as FileSystemFileHandle).getFile();
        const entry = known.get(handle.name);
        if (initial) {
          known.set(handle.name, { size: file.size, lastModified: file.lastModified, handledAt: file.lastModified });
          continue;
        }
        if (!entry) {
          known.set(handle.name, { size: file.size, lastModified: file.lastModified, handledAt: null });
          continue;
        }
        // 포토샵이 아직 쓰는 중이면 크기·시간이 바뀌므로, 한 주기 동안 변화가 없을 때만 올립니다
        if (entry.size !== file.size || entry.lastModified !== file.lastModified) {
          entry.size = file.size;
          entry.lastModified = file.lastModified;
          continue;
        }
        if (file.size === 0 || entry.handledAt === file.lastModified) continue;
        // 같은 파일 이름에 덮어써도(포토샵 액션) 새 사진으로 인식합니다
        entry.handledAt = file.lastModified;
        enqueue(file);
      }
    },
    [enqueue],
  );

  const pickFolder = async () => {
    setFolderError('');
    if (!window.showDirectoryPicker) {
      setFolderError('이 브라우저는 폴더 감시를 지원하지 않습니다. 크롬이나 엣지에서 열어 주세요.');
      return;
    }
    try {
      const dir = await window.showDirectoryPicker({ mode: 'read' });
      dirRef.current = dir;
      knownRef.current = new Map();
      await scanFolder(true);
      setDirName(dir.name);
    } catch (e) {
      if ((e as Error).name !== 'AbortError') setFolderError('폴더를 열 수 없습니다.');
    }
  };

  useEffect(() => {
    if (!dirName) return;
    let busy = false;
    const timer = setInterval(async () => {
      if (busy) return;
      busy = true;
      try {
        await scanFolder(false);
      } catch {
        setFolderError('폴더를 읽을 수 없습니다. 폴더를 다시 선택해 주세요.');
      } finally {
        busy = false;
      }
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [dirName, scanFolder]);

  // --- 업로드 (실패하면 간격을 늘려가며 계속 재시도) ---
  useEffect(() => {
    if (authState !== 'in') return;
    const timer = setInterval(async () => {
      if (uploadingRef.current) return;
      const now = Date.now();
      const item = itemsRef.current.find(
        (it) => it.status === 'queued' || (it.status === 'error' && it.retryAt <= now),
      );
      if (!item) return;
      uploadingRef.current = true;
      item.status = 'uploading';
      publishItems();
      try {
        const { body, ext, type } = await prepareUpload(item.file);
        const path = `${item.sessionId}/${Date.now()}.${ext}`;
        const { error } = await supabase.storage
          .from(BUCKET)
          .upload(path, body, { contentType: type, cacheControl: '31536000', upsert: false });
        if (error) throw error;
        item.status = 'done';
        item.error = undefined;
      } catch (e) {
        item.attempts += 1;
        item.status = 'error';
        item.error = (e as Error).message;
        item.retryAt = Date.now() + Math.min(30_000, 2000 * 2 ** (item.attempts - 1));
      } finally {
        uploadingRef.current = false;
        publishItems();
      }
    }, UPLOAD_TICK_MS);
    return () => clearInterval(timer);
  }, [authState, supabase, publishItems]);

  // --- 고객용 QR 화면과 동기화 ---
  const sessionItems = session ? items.filter((it) => it.sessionId === session.id) : [];
  const displayState: DisplayState | null = session
    ? {
        sessionId: session.id,
        url: galleryUrl(session.id),
        customerNo: session.customerNo,
        total: sessionItems.length,
        uploaded: sessionItems.filter((it) => it.status === 'done').length,
      }
    : null;
  const displayKey = JSON.stringify(displayState);
  const displayStateRef = useRef<DisplayState | null>(null);

  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;
    channel.onmessage = (e: MessageEvent<ChannelMessage>) => {
      if (e.data.type === 'hello') channel.postMessage({ type: 'state', state: displayStateRef.current } satisfies ChannelMessage);
    };
    return () => channel.close();
  }, []);

  useEffect(() => {
    displayStateRef.current = JSON.parse(displayKey) as DisplayState | null;
    channelRef.current?.postMessage({ type: 'state', state: displayStateRef.current } satisfies ChannelMessage);
  }, [displayKey]);

  // --- 기타: 온라인 상태, 화면 꺼짐 방지, 단축키 ---
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  useEffect(() => {
    let lock: WakeLockSentinel | null = null;
    const request = () => {
      if (document.visibilityState === 'visible') navigator.wakeLock?.request('screen').then((l) => (lock = l)).catch(() => {});
    };
    request();
    document.addEventListener('visibilitychange', request);
    return () => {
      document.removeEventListener('visibilitychange', request);
      lock?.release();
    };
  }, []);

  useEffect(() => {
    if (authState !== 'in') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'n' || e.key === 'N' || e.key === 'ㅜ') startNewSession();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [authState, startNewSession]);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files)
      .filter((f) => IMAGE_RE.test(f.name))
      .forEach(enqueue);
  };

  const openDisplay = () => {
    window.open('/station/display', 'studio3c-display', 'popup,width=900,height=1000');
  };

  if (authState === 'loading') return <main className="min-h-screen bg-zinc-950" />;

  if (authState === 'out') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
        <form onSubmit={login} className="w-full max-w-sm space-y-4">
          <h1 className="text-center text-lg tracking-[0.3em]">STUDIO 3C STATION</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="스테이션 비밀번호"
            autoFocus
            className="w-full rounded-lg bg-zinc-800 px-4 py-3 outline-none focus:ring-2 focus:ring-white/40"
          />
          {loginError && <p className="text-sm text-red-400">{loginError}</p>}
          <button className="w-full rounded-lg bg-white py-3 font-medium text-black">로그인</button>
        </form>
      </main>
    );
  }

  const pending = items.filter((it) => it.status !== 'done').length;
  const recent = [...items].reverse().slice(0, 30);

  return (
    <main
      className="min-h-screen bg-zinc-950 text-white"
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        addFiles(e.dataTransfer.files);
      }}
    >
      <header className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
        <h1 className="text-sm tracking-[0.3em]">STUDIO 3C STATION</h1>
        <div className="flex items-center gap-4 text-sm">
          <span className={online ? 'text-emerald-400' : 'text-red-400'}>{online ? '● 온라인' : '● 오프라인 (재연결 시 자동 업로드)'}</span>
          {pending > 0 && <span className="text-amber-300">업로드 대기 {pending}</span>}
          <button onClick={() => supabase.auth.signOut()} className="text-zinc-500 hover:text-white">
            로그아웃
          </button>
        </div>
      </header>

      <div className="grid gap-6 p-6 lg:grid-cols-[420px_1fr]">
        <section className="rounded-2xl bg-zinc-900 p-6">
          {session && displayState && (
            <>
              <div className="flex items-baseline justify-between">
                <p className="text-sm text-zinc-400">현재 고객</p>
                <p className="text-3xl font-semibold">No.{String(session.customerNo).padStart(3, '0')}</p>
              </div>
              <div className="mt-4 flex justify-center rounded-xl bg-white p-4">
                <QrCode value={displayState.url} size={300} />
              </div>
              <a href={displayState.url} target="_blank" rel="noreferrer" className="mt-3 block break-all text-center text-xs text-zinc-500 hover:text-white">
                {displayState.url}
              </a>
              <p className="mt-3 text-center text-sm text-zinc-300">
                {displayState.total === 0 ? '아직 사진 없음' : `사진 ${displayState.uploaded}/${displayState.total} 업로드됨`}
              </p>
              <button
                onClick={startNewSession}
                className="mt-6 w-full rounded-xl bg-white py-4 text-lg font-semibold text-black hover:bg-zinc-200"
              >
                다음 고객 <span className="text-sm font-normal text-zinc-500">(N)</span>
              </button>
              <button onClick={openDisplay} className="mt-3 w-full rounded-xl border border-zinc-700 py-3 text-sm hover:bg-zinc-800">
                고객용 QR 화면 열기
              </button>
              <button onClick={resetNumbers} className="mt-3 w-full text-xs text-zinc-500 hover:text-white">
                고객 번호 1번부터 다시
              </button>
            </>
          )}
        </section>

        <div className="space-y-6">
          <section className="rounded-2xl bg-zinc-900 p-6">
            <h2 className="font-medium">출력 사진 폴더</h2>
            <p className="mt-1 text-sm text-zinc-400">
              포토샵이 출력용 JPG를 저장하는 폴더를 선택하세요. 새로 저장되는 파일이 현재 고객에게 자동으로 올라갑니다.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button onClick={pickFolder} className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200">
                {dirName ? '폴더 바꾸기' : '폴더 선택'}
              </button>
              {dirName && <span className="text-sm text-emerald-400">● 감시 중: {dirName}</span>}
              <label className="cursor-pointer rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800">
                파일 직접 올리기
                <input type="file" accept="image/jpeg,image/png" multiple className="hidden" onChange={(e) => {
                  addFiles(e.target.files);
                  e.target.value = '';
                }} />
              </label>
            </div>
            {folderError && <p className="mt-3 text-sm text-red-400">{folderError}</p>}
            <label className="mt-4 flex items-center gap-2 text-sm text-zinc-300">
              <input type="checkbox" checked={autoNew} onChange={(e) => toggleAutoNew(e.target.checked)} />
              마지막 사진 후 3분이 지나 새 사진이 들어오면 자동으로 다음 고객으로 넘기기
            </label>
            <p className="mt-2 text-xs text-zinc-500">사진 파일을 이 창에 끌어다 놓아도 현재 고객에게 올라갑니다.</p>
          </section>

          <section className="rounded-2xl bg-zinc-900 p-6">
            <h2 className="font-medium">업로드 기록</h2>
            {recent.length === 0 ? (
              <p className="mt-3 text-sm text-zinc-500">아직 없음</p>
            ) : (
              <ul className="mt-3 divide-y divide-zinc-800 text-sm">
                {recent.map((it) => (
                  <li key={it.key} className="flex items-center justify-between gap-4 py-2">
                    <span className="w-16 shrink-0 text-zinc-400">No.{String(it.customerNo).padStart(3, '0')}</span>
                    <span className="flex-1 truncate">{it.name}</span>
                    <span
                      className={
                        it.status === 'done'
                          ? 'text-emerald-400'
                          : it.status === 'error'
                            ? 'text-red-400'
                            : 'text-amber-300'
                      }
                      title={it.error}
                    >
                      {it.status === 'done'
                        ? '완료'
                        : it.status === 'uploading'
                          ? '업로드 중…'
                          : it.status === 'error'
                            ? `실패 · 재시도 ${it.attempts}회`
                            : '대기'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      {dragging && (
        <div className="pointer-events-none fixed inset-0 flex items-center justify-center bg-black/70 text-2xl">
          여기에 놓으면 No.{String(session?.customerNo ?? 0).padStart(3, '0')} 고객에게 올라갑니다
        </div>
      )}
    </main>
  );
}
