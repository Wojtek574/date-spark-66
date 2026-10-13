import { describe, expect, it } from 'vitest';
import { affiliateIsConfigured, assignVariant, outbound, track } from '@/lib/landing-analytics';

describe('Privacy-safe affiliate landing', () => {
  it('rejects missing or unsafe affiliate destinations', () => {
    expect(affiliateIsConfigured('')).toBe(false);
    expect(affiliateIsConfigured('javascript:alert(1)')).toBe(false);
    expect(affiliateIsConfigured('http://partner.example')).toBe(false);
    expect(affiliateIsConfigured('https://user:password@partner.example')).toBe(false);
    expect(affiliateIsConfigured('https://partner.example/signup')).toBe(true);
    expect(outbound('test', '')).toBe(false);
  });
  it('keeps the same variant for this visit', () => { expect(assignVariant()).toBe(assignVariant()); });
  it('never includes arbitrary campaign data', () => {
    const events: unknown[] = [];
    const handler = (e: Event) => events.push((e as CustomEvent).detail);
    window.addEventListener('miedzy-nami:analytics', handler);
    window.matchMedia = () => ({ matches: false, media: '', onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent: () => false });
    window.history.replaceState({}, '', '/?utm_source=campaign&utm_campaign=name%40example.com');
    track('cta_view');
    expect(events[0]).toMatchObject({ event: 'cta_view', source: 'campaign', utm_campaign: undefined });
    window.removeEventListener('miedzy-nami:analytics', handler);
  });
});