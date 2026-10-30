'use client';

import { useEffect, useState } from 'react';
import QrCode from '../qr-code';
import { CHANNEL_NAME, type ChannelMessage, type DisplayState } from '../channel';

export default function Display() {
  const [state, setState] = useState<DisplayState | null>(null);

  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = (e: MessageEvent<ChannelMessage>) => {
      if (e.data.type === 'state') setState(e.data.state);
    };
    channel.postMessage({ type: 'hello' } satisfies ChannelMessage);
    return () => channel.close();
  }, []);

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center bg-[#f6f3ee] px-6 text-zinc-900"
      onDoubleClick={() => document.documentElement.requestFullscreen?.()}
    >
      <p className="text-sm tracking-[0.4em] text-zinc-500">STUDIO 3C</p>
      {state ? (
        <>
          <h1 className="mt-6 text-4xl font-semibold md:text-5xl">사진 받기</h1>
          <p className="mt-3 text-lg text-zinc-600 md:text-xl">휴대폰 카메라로 QR을 찍어 주세요</p>
          <div className="mt-10 rounded-2xl bg-white p-5 shadow-lg">
            <QrCode value={state.url} size={340} />
          </div>
          <p className="mt-8 text-2xl font-medium">No.{String(state.customerNo).padStart(3, '0')}</p>
          <p className="mt-2 text-lg text-zinc-600">
            {state.total === 0
              ? '인화가 시작되면 사진이 자동으로 올라가요'
              : state.uploaded < state.total
                ? `사진 올리는 중… ${state.uploaded}/${state.total}`
                : `사진 ${state.total}장 준비 완료`}
          </p>
        </>
      ) : (
        <h1 className="mt-6 text-3xl font-semibold">잠시만 기다려 주세요</h1>
      )}
    </main>
  );
}
