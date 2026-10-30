import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';

// Photos are kept for this many days after upload, then removed.
// The window is fixed here on purpose: callers cannot shorten it.
const RETENTION_DAYS = 3;
const BATCH = 100;

Deno.serve(async () => {
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

  const { data, error } = await supabase.rpc('expired_gallery_files', { days: RETENTION_DAYS });
  if (error) return Response.json({ error: error.message }, { status: 500 });

  const names = (data ?? []).map((row: { name: string }) => row.name);
  let deleted = 0;
  for (let i = 0; i < names.length; i += BATCH) {
    const batch = names.slice(i, i + BATCH);
    const { error: removeError } = await supabase.storage.from('gallery').remove(batch);
    if (removeError) return Response.json({ error: removeError.message, deleted }, { status: 500 });
    deleted += batch.length;

    const sids = [...new Set(batch.map((n: string) => n.split('/')[0]))].map((sid) => ({ sid }));
    const { error: markError } = await supabase.from('expired_galleries').upsert(sids, { ignoreDuplicates: true });
    if (markError) return Response.json({ error: markError.message, deleted }, { status: 500 });
  }

  return Response.json({ deleted, retentionDays: RETENTION_DAYS });
});
