import { createServerFn } from '@tanstack/react-start';
import { setResponseHeader } from '@tanstack/react-start/server';
import { z } from 'zod';
import { ACTIVE_EXPERIMENT, EXPERIMENT_RULES, EXPERIMENT_VARIANT_COUNT } from '@/config/site';
import { aggregateStats, evaluateExperiment, variantGroups, type StatsRow } from '@/lib/stats-model';
export type { Group } from '@/lib/stats-model';
export const getStats = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => z.object({ password:z.string().max(200),days:z.number().int().min(1).max(365) }).parse(input))
  .handler(async ({ data }) => {
    setResponseHeader('Cache-Control','no-store');
    const expected=process.env['STATS_PASSWORD'];
    if(!expected) return {ok:false as const,error:'Hasło do statystyk nie zostało jeszcze ustawione.'};
    if(data.password!==expected) return {ok:false as const,error:'Nieprawidłowe hasło.'};
    const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
    const until=new Date().toISOString(),since=new Date(Date.now()-data.days*86400000).toISOString();
    const rows:StatsRow[]=[]; let truncated=false;
    for(let from=0;from<=200000;from+=1000) {
      const {data:page,error}=await supabaseAdmin.from('quality_page_events').select('visit_id,event,variant_id,device,source,placement,created_at,quality,active_ms,browser,os,medium,campaign').gte('created_at',since).lte('created_at',until).order('created_at').order('id').range(from,from+999);
      if(error) return {ok:false as const,error:'Nie udało się pobrać statystyk.'};
      if(from===200000) {truncated=Boolean(page?.length); break;}
      rows.push(...(page ?? [])); if(!page || page.length<1000) break;
    }
    const {count:legacy}=await supabaseAdmin.from('page_events').select('id',{count:'exact',head:true}).gte('created_at',since).lte('created_at',until);
    const {data:stored}=await supabaseAdmin.from('experiment_decisions').select('variant_id,decided_at').eq('experiment',ACTIVE_EXPERIMENT).maybeSingle();
    return {ok:true as const,...aggregateStats(rows),truncated,legacy:legacy ?? 0,since,until,promoted:stored?{variantId:stored.variant_id,decidedAt:stored.decided_at}:null};
  });
const DECISION_CACHE_MS = 60_000;
let decisionCheckedAt = 0;
let promotedVariant: { experiment: string; index: number; id: string } | null = null;
// Decyzja mieszka w bazie; pamięć modułu tylko ogranicza liczbę odpytań na rozgrzanym isolate.
function parseVariant(id: string | null | undefined) {
  const index = Number(new RegExp(`^${ACTIVE_EXPERIMENT}-(\\d+)$`).exec(id ?? '')?.[1]);
  if (!Number.isInteger(index) || index < 0 || index >= (EXPERIMENT_VARIANT_COUNT[ACTIVE_EXPERIMENT] ?? 0)) return null;
  return { experiment: ACTIVE_EXPERIMENT, index, id: `${ACTIVE_EXPERIMENT}-${index}` };
}
// Publiczne pytanie „który wariant pokazać” — nigdy nie zwraca liczb ani odsetków.export const getServedVariant = createServerFn({ method: 'POST' }).handler(async () => {
  setResponseHeader('Cache-Control', 'no-store');
  if (ACTIVE_EXPERIMENT === 'none') return null;
  if (promotedVariant) return promotedVariant;
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const { data: stored } = await supabaseAdmin.from('experiment_decisions').select('variant_id').eq('experiment', ACTIVE_EXPERIMENT).maybeSingle();
  const saved = parseVariant(stored?.variant_id);
  if (saved) { promotedVariant = saved; return saved; }
  const now = Date.now();
  if (now - decisionCheckedAt < DECISION_CACHE_MS) return null;
  decisionCheckedAt = now;
  const since = new Date(now - EXPERIMENT_RULES.windowDays * 86400000).toISOString();
  const { data, error } = await supabaseAdmin.rpc('experiment_variant_stats', { since });
  if (error) return null;
  const decision = evaluateExperiment(variantGroups((data ?? []) as { variant_id: string; visits: number | string; outbound: number | string }[]), ACTIVE_EXPERIMENT, EXPERIMENT_RULES);
  if (decision.status !== 'promoted') return null;
  const winner = parseVariant(decision.winner);
  if (!winner) return null;
  await supabaseAdmin.from('experiment_decisions').upsert({ experiment: ACTIVE_EXPERIMENT, variant_id: winner.id, evidence: { reason: decision.reason, variants: decision.variants, needed: decision.needed, windowDays: EXPERIMENT_RULES.windowDays } });
  promotedVariant = winner;
  return winner;
});