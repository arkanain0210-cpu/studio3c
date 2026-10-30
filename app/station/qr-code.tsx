'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export default function QrCode({ value, size }: { value: string; size: number }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(value, { width: size * 2, margin: 1, errorCorrectionLevel: 'M' }).then((url) => {
      if (!cancelled) setSrc(url);
    });
    return () => {
      cancelled = true;
    };
  }, [value, size]);

  if (!src) return <div style={{ width: size, height: size }} className="bg-white" />;
  // eslint-disable-next-line @next/next/no-img-element -- data URL
  return <img src={src} alt="사진 받기 QR 코드" width={size} height={size} className="bg-white" />;
}
