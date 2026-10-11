import { ACTIVE_EXPERIMENT, AFFILIATE_URL } from '@/config/site';

export type EventName = 'page_view' | 'cta_view' | 'cta_click' | 'hero_cta_click' | 'profile_cta_click' | 'age_group_selected' | 'scroll_50' | 'scroll_90' | 'affiliate_outbound_click';
export type Variant = { experiment: string; index: number; id: string };
let consent = false;
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
export function setAnalyticsConsent(allowed: boolean) { consent = allowed; }
export function isAnalyticsAllowed() { return consent; }
function safeCampaign(value: string | null) {
  return value && /^[a-zA-Z0-9_-]{1,64}$/.test(value) ? value : undefined;
}
export function track(name: EventName, detail: Record<string, string | number> = {}) {
  if (!consent || typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  const payload = {
    event: name, variant_id: variant.id, experiment: variant.experiment,
    device: window.matchMedia('(max-width: 767px)').matches ? 'mobile' : 'desktop',
    source: safeCampaign(params.get('utm_source')) ?? 'unknown',
    utm_medium: safeCampaign(params.get('utm_medium')), utm_campaign: safeCampaign(params.get('utm_campaign')),
    ...detail,
  };
  // Adapter: słuchaj tego zdarzenia i przekaż wyłącznie te pola do GA4/innego narzędzia.
  window.dispatchEvent(new CustomEvent('miedzy-nami:analytics', { detail: payload }));
}
export function affiliateIsConfigured(url = AFFILIATE_URL) {
  try { const parsed = new URL(url); return parsed.protocol === 'https:' && !parsed.username && !parsed.password; } catch { return false; }
}
export function outbound(source: string, url = AFFILIATE_URL) {
  if (!affiliateIsConfigured(url)) return false;
  track('affiliate_outbound_click', { placement: source });
  window.location.assign(url);
  return true;
}