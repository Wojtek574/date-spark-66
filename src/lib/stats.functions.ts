import { createServerFn } from '@tanstack/react-start';
import { setResponseHeader } from '@tanstack/react-start/server';
import { z } from 'zod';
import { aggregateStats, type StatsRow } from '@/lib/stats-model';
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
    return {ok:true as const,...aggregateStats(rows),truncated,legacy:legacy ?? 0,since,until};
  });