import { createServerFn } from '@tanstack/react-start';

type Row = { visit_id: string; event: string; variant_id: string; device: string; source: string; placement: string | null };
export type Group = { key: string; visits: number; clicks: number; outbound: number };

export const getStats = createServerFn({ method: 'POST' })
  .inputValidator((d: { password: string; days: number }) => ({ password: String(d.password ?? '').slice(0, 200), days: Math.min(365, Math.max(1, Number(d.days) || 30)) }))
  .handler(async ({ data }) => {
    const expected = process.env.STATS_PASSWORD;
    if (!expected) return { ok: false as const, error: 'Hasło do statystyk nie zostało jeszcze ustawione.' };
    if (data.password !== expected) return { ok: false as const, error: 'Nieprawidłowe hasło.' };
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const since = new Date(Date.now() - data.days * 86400000).toISOString();
    const rows: Row[] = [];
    for (let from = 0; from < 200000; from += 1000) {
      const { data: page, error } = await supabaseAdmin.from('page_events').select('visit_id,event,variant_id,device,source,placement').gte('created_at', since).order('id').range(from, from + 999);
      if (error) return { ok: false as const, error: 'Nie udało się pobrać statystyk.' };
      rows.push(...(page as Row[]));
      if (!page || page.length < 1000) break;
    }
    const visits = new Map<string, { variant: string; device: string; source: string; click: boolean; out: boolean; age: boolean; s50: boolean; s90: boolean }>();
    const ages: Record<string, number> = {};
    const placements: Record<string, number> = {};
    for (const r of rows) {
      let v = visits.get(r.visit_id);
      if (!v) { v = { variant: r.variant_id, device: r.device, source: r.source, click: false, out: false, age: false, s50: false, s90: false }; visits.set(r.visit_id, v); }
      if (r.event === 'cta_click') { v.click = true; if (r.placement) placements[r.placement] = (placements[r.placement] ?? 0) + 1; }
      if (r.event === 'affiliate_outbound_click') v.out = true;
      if (r.event === 'age_group_selected') { v.age = true; if (r.placement) ages[r.placement] = (ages[r.placement] ?? 0) + 1; }
      if (r.event === 'scroll_50') v.s50 = true;
      if (r.event === 'scroll_90') v.s90 = true;
    }
    const all = [...visits.values()];
    const group = (pick: (v: (typeof all)[number]) => string): Group[] => {
      const m = new Map<string, Group>();
      for (const v of all) { const k = pick(v); const g = m.get(k) ?? { key: k, visits: 0, clicks: 0, outbound: 0 }; g.visits++; if (v.click) g.clicks++; if (v.out) g.outbound++; m.set(k, g); }
      return [...m.values()].sort((a, b) => b.visits - a.visits);
    };
    return {
      ok: true as const,
      totals: { visits: all.length, clicks: all.filter(v => v.click).length, outbound: all.filter(v => v.out).length, age: all.filter(v => v.age).length, s50: all.filter(v => v.s50).length, s90: all.filter(v => v.s90).length },
      variants: group(v => v.variant), devices: group(v => v.device), sources: group(v => v.source).slice(0, 15), ages, placements,
    };
  });
