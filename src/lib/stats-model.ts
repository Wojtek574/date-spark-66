export type StatsRow = { visit_id: string; event: string; variant_id: string; device: string; source: string; placement: string | null; created_at: string; quality: string; active_ms: number; browser: string; os: string; medium: string | null; campaign: string | null };
export type Group = { key: string; visits: number; clicks: number; outbound: number; low: number; high: number };
export function wilson(success: number, total: number) {
  if (!total) return [0, 0];
  const p = success / total, z = 1.96, d = 1 + z * z / total;
  const middle = (p + z * z / (2 * total)) / d;
  const spread = z * Math.sqrt(p * (1 - p) / total + z * z / (4 * total * total)) / d;
  return [Math.max(0, middle - spread) * 100, Math.min(1, middle + spread) * 100];
}
export function classifyTraffic(ua: string, host: string, webdriver: boolean) {
  if (webdriver || /bot|crawler|spider|headless|lighthouse|preview|facebookexternalhit|slurp|curl|wget/i.test(ua) || !ua) return 'automation';
  if (/localhost|127\.0\.0\.1|id-preview|\.lovableproject\.com/i.test(host)) return 'test';
  return 'eligible';
}
export function aggregateStats(rows: StatsRow[]) {
  const quality = { eligible: 0, test: 0, automation: 0, orphan: 0 };
  const views = new Map<string, StatsRow>();
  for (const r of rows) if (r.event === 'page_view' && !views.has(r.visit_id)) { views.set(r.visit_id, r); if (r.quality === 'eligible') quality.eligible++; else if (r.quality === 'test') quality.test++; else quality.automation++; }
  const visits = new Map([...views].filter(([,r]) => r.quality === 'eligible').map(([id,r]) => [id, { row: r, click: false, out: false, age: '', s50: false, s90: false, active: 0, viewed: new Set<string>(), clicked: new Set<string>() }]));
  const orphan = new Set<string>();
  for (const r of rows) {
    const v = visits.get(r.visit_id);
    if (!views.has(r.visit_id)) orphan.add(r.visit_id);
    if (!v || r.quality !== 'eligible') continue;
    if (r.event === 'cta_click') { v.click = true; if (r.placement) v.clicked.add(r.placement); }
    if (r.event === 'cta_view' && r.placement) v.viewed.add(r.placement);
    if (r.event === 'affiliate_outbound_click') v.out = true;
    if (r.event === 'age_group_selected' && r.placement) v.age = r.placement;
    if (r.event === 'scroll_50') v.s50 = true;
    if (r.event === 'scroll_90') v.s90 = true;
    v.active = Math.max(v.active, r.active_ms);
  }
  quality.orphan = orphan.size;
  const all = [...visits.values()];
  const group = (pick: (r: StatsRow) => string): Group[] => {
    const groups = new Map<string, Group>();
    for (const v of all) { const key = pick(v.row); const g = groups.get(key) ?? { key, visits: 0, clicks: 0, outbound: 0, low: 0, high: 0 }; g.visits++; if (v.click) g.clicks++; if (v.out) g.outbound++; groups.set(key,g); }
    return [...groups.values()].map(g => { const [low = 0, high = 0] = wilson(g.outbound,g.visits); return { ...g, low, high }; }).sort((a,b) => b.visits-a.visits);
  };
  const ages: Record<string,number> = {};
  const placements = new Map<string,{ key: string; views: number; clicks: number }>();
  for (const v of all) {
    if (v.age) ages[v.age] = (ages[v.age] ?? 0) + 1;
    for (const key of new Set([...v.viewed,...v.clicked])) { const p = placements.get(key) ?? { key, views: 0, clicks: 0 }; if (v.viewed.has(key)) p.views++; if (v.clicked.has(key)) p.clicks++; placements.set(key,p); }
  }
  const durations = all.map(v => v.active / 1000).sort((a,b) => a-b);
  const mid = Math.floor(durations.length / 2);
  const median = durations.length ? durations.length % 2 ? durations[mid] ?? 0 : ((durations[mid-1] ?? 0) + (durations[mid] ?? 0))/2 : 0;
  return { quality, totals: { visits: all.length, clicks: all.filter(v=>v.click).length, outbound: all.filter(v=>v.out).length, age: all.filter(v=>v.age).length, s50: all.filter(v=>v.s50).length, s90: all.filter(v=>v.s90).length, engaged: all.filter(v=>v.active >= 10000 || v.click || v.age || v.out).length, medianSeconds: Math.round(median), averageSeconds: Math.round(durations.reduce((a,b)=>a+b,0)/(all.length || 1)) }, variants: group(r=>r.variant_id), devices: group(r=>r.device), sources: group(r=>r.source), campaigns: group(r=>[r.source,r.medium ?? '—',r.campaign ?? '—'].join(' / ')), browsers: group(r=>r.browser), systems: group(r=>r.os), daily: group(r=>r.created_at.slice(0,10)).sort((a,b)=>a.key.localeCompare(b.key)), ages, placements: [...placements.values()] };
}