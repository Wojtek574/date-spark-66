import { ACTIVE_EXPERIMENT, AFFILIATE_URL } from '@/config/site';
const STORED = new Set(['page_view', 'cta_view', 'cta_click', 'age_group_selected', 'scroll_50', 'scroll_90', 'affiliate_outbound_click', 'engagement']);
let visitId = '';
let token: string | undefined;
let queue = Promise.resolve();
const seen = new Set<string>();
let activeMs = 0;
let activeSince = 0;
function activeTime() { return Math.min(7200000,activeMs + (activeSince ? Date.now()-activeSince : 0)); }
export function startEngagement() {
  const update = () => { if(activeSince) activeMs+=Date.now()-activeSince; activeSince=document.visibilityState==='visible' && document.hasFocus() ? Date.now() : 0; };
  update();
  const flush = () => { update(); track('engagement'); };
  const timer=window.setInterval(flush,15000);
  window.addEventListener('focus',update); window.addEventListener('blur',flush); window.addEventListener('pagehide',flush); document.addEventListener('visibilitychange',flush);
  return () => { clearInterval(timer); window.removeEventListener('focus',update); window.removeEventListener('blur',flush); window.removeEventListener('pagehide',flush); document.removeEventListener('visibilitychange',flush); };
}

export type EventName = 'page_view' | 'cta_view' | 'cta_click' | 'hero_cta_click' | 'profile_cta_click' | 'age_group_selected' | 'scroll_50' | 'scroll_90' | 'affiliate_outbound_click' | 'engagement';
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
    const key=`${name}:${placement ?? ''}`;
    const once=['page_view','cta_view','scroll_50','scroll_90'].includes(name);
    if(once && seen.has(key)) return;
    if(once) seen.add(key);
    const body={ id:crypto.randomUUID(),visit:visitId,event:name,variant:variant.id,source:src,medium:payload.utm_medium ?? null,campaign:payload.utm_campaign ?? null,placement,active:Math.round(activeTime()),webdriver:navigator.webdriver };
    queue=queue.then(async()=>{
      if(name!=='page_view' && !token) return;
      try {
        for(let attempt=0;attempt<2;attempt++) {
          const response=await fetch('/api/public/events',{ method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...body,token}),keepalive:true });
          if(response.ok) { const result=await response.json() as {token?:string}; token=result.token ?? token; break; }
          if(response.status<500) break;
        }
      } catch { /* No invented success: failed requests do not enter reports. */ }
    });
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