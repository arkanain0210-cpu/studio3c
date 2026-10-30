import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// 공개(publishable) 키라서 코드에 넣어도 안전합니다. 업로드 권한은 스테이션 계정에만 있습니다.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://hxgfmocmdljpryqcqmyg.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? 'sb_publishable_UboOi_FjBNkJwsj9Jh_z4w_L1w8e9uP';

export const BUCKET = 'gallery';
export const STATION_EMAIL = 'station@studio3c.app';

// 헷갈리는 글자(0/o, 1/l/i)를 뺀 소문자+숫자
const ID_ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789';
const ID_PATTERN = /^[a-z0-9]{6,16}$/;

let client: SupabaseClient | null = null;

export function getSupabase() {
  if (!client) client = createClient(SUPABASE_URL, SUPABASE_KEY);
  return client;
}

export function newSessionId(length = 8) {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (b) => ID_ALPHABET[b % ID_ALPHABET.length]).join('');
}

export function isValidSessionId(id: string) {
  return ID_PATTERN.test(id);
}

export function publicUrl(path: string) {
  return getSupabase().storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

export interface GalleryFile {
  name: string;
  created_at: string;
}

export async function listGalleryFiles(sessionId: string): Promise<GalleryFile[]> {
  const { data, error } = await getSupabase().rpc('gallery_files', { sid: sessionId });
  if (error) throw error;
  return (data ?? []) as GalleryFile[];
}
