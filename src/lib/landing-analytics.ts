import { ACTIVE_EXPERIMENT, AFFILIATE_URL } from '@/config/site';
import { supabase } from '@/integrations/supabase/client';

const STORED = new Set(['page_view', 'cta_click', 'age_group_selected', 'scroll_50', 'scroll_90', 'affiliate_outbound_click']);
let visitId = '';

export type EventName = 'page_view' | 'cta_view' | 'cta_click' | 'hero_cta_click' | 'profile_cta_click' | 'age_group_selected' | 'scroll_50' | 'scroll_90' | 'affiliate_outbound_click';
export type Variant = { experiment: string; index: number; id: string };
let variant: Variant = { experiment: 'none', index: 0, id: 'control' };
let visitVariant: Variant | undefined;
export function assignVariant(): Variant {
  if (visitVariant) return visitVariant;
  const count = ACTIVE_EXPERIMENT === 'headline' ? 3 : ACTIVE_EXPERIMENT === 'none' ? 1 : 2;
  const index = Math.floor(Math.random() * count);
  variant = { experiment: ACTIVE_EXPERIMENT, index, id: ACTIVE_EXPERIMENT === 'none' ? 'control' : `${ACTIVE_EXPERIMENT}-${index}` };
  visitVariant = variant;
  return variant;
}
function safeCampaign(value: string | null) {
  return value && /^[a-zA-Z0-9_-]{1,64}$/.test(value) ? value : undefined;
}
export function track(name: EventName, detail: Record<string, string | number> = {}) {
  if (typeof window === 'undefined') return;
  if (!visitId) visitId = crypto.randomUUID();
  const params = new URLSearchParams(window.location.search);
  const payload = {
    event: name, variant_id: variant.id, experiment: variant.experiment,
    device: window.matchMedia('(max-width: 767px)').matches ? 'mobile' : 'desktop',
    source: safeCampaign(params.get('utm_source')) ?? 'unknown',
    utm_medium: safeCampaign(params.get('utm_medium')), utm_campaign: safeCampaign(params.get('utm_campaign')),
    ...detail,
  };
  if (STORED.has(name)) {
    const ref = document.referrer ? (() => { try { return new URL(document.referrer).hostname; } catch { return ''; } })() : '';
    const src = payload.source !== 'unknown' ? payload.source : (ref && ref !== window.location.hostname ? ref.slice(0, 64) : 'direct');
    const placement = typeof detail['placement'] === 'string' ? detail['placement'].slice(0, 40) : typeof detail['age_group'] === 'string' ? detail['age_group'].slice(0, 40) : null;
    void supabase.from('page_events').insert({ visit_id: visitId, event: name, variant_id: variant.id, device: payload.device, source: src, placement }).then(() => {}, () => {});
  }
  // Adapter: słuchaj tego zdarzenia i przekaż wyłącznie te pola do GA4/innego narzędzia.
  window.dispatchEvent(new CustomEvent('miedzy-nami:analytics', { detail: payload }));
}
export function affiliateIsConfigured(url = AFFILIATE_URL) {
  try { const parsed = new URL(url); return parsed.protocol === 'https:' && !parsed.username && !parsed.password; } catch { return false; }
}
export function outbound(source: string, url = AFFILIATE_URL) {
  if (!affiliateIsConfigured(url)) return false;
  track('affiliate_outbound_click', { placement: source });
  setTimeout(() => window.location.assign(url), 150);
  return true;
}