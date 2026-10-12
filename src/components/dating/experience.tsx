import { useEffect, useState, createContext, useContext, type ReactNode } from 'react';
import { ArrowDown, ArrowUpRight, Heart, LoaderCircle, LockKeyhole, ShieldCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { site } from '@/config/site';
import { assignVariant, outbound, setAnalyticsConsent, track, type Variant } from '@/lib/landing-analytics';

const Experience = createContext<{ variant: Variant; consent: boolean; openMissing: () => void }>({ variant: { experiment: 'none', index: 0, id: 'control' }, consent: false, openMissing: () => {} });
export function Brand() { return <a href="/" className="brand" aria-label={`${site.name} — strona główna`}><Heart aria-hidden="true" /><span>{site.name}</span></a>; }
export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [variant, setVariant] = useState<Variant>({ experiment: 'none', index: 0, id: 'control' });
  const [missing, setMissing] = useState(false);
  const [consent, setConsent] = useState<'pending' | 'yes' | 'no'>('pending');
  const [sticky, setSticky] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => { setVariant(assignVariant()); }, []);
  useEffect(() => {
    const seen = new Set<string>();
    const onScroll = () => {
      const footer = document.querySelector('footer');
      const primary = document.querySelector('[data-cta-source="hero"]');
      const visibleCTA = Array.from(document.querySelectorAll('.profile-inner .main-cta')).some(el => {
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 76;
      });
      setSticky(Boolean(primary && primary.getBoundingClientRect().bottom < 76 && !visibleCTA && (!footer || footer.getBoundingClientRect().top > window.innerHeight)));
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const percent = height > 0 ? window.scrollY / height : 0;
      if (consent === 'yes') for (const [threshold, name] of [[.5, 'scroll_50'], [.9, 'scroll_90']] as const) {
        if (percent >= threshold && !seen.has(name)) { seen.add(name); track(name); }
      }
    };
    const observer = new ResizeObserver(onScroll); observer.observe(document.body);
    window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', onScroll); onScroll();
    return () => { observer.disconnect(); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, [consent]);
  const chooseConsent = (allow: boolean) => { setAnalyticsConsent(allow); setConsent(allow ? 'yes' : 'no'); if (allow) track('page_view'); };
  return <Experience.Provider value={{ variant, consent: consent === 'yes', openMissing: () => setMissing(true) }}>
    {children}
    {sticky && !dismissed && <div className="mobile-sticky"><CTA source="sticky" /><Button variant="ghost" size="icon" aria-label="Zamknij pasek rejestracji" onClick={() => setDismissed(true)}><X /></Button></div>}
    {consent === 'pending' ? <aside className="consent-strip" aria-label="Zgoda na pomiar"><div><ShieldCheck /><p><strong>Twój wybór ma znaczenie.</strong> Opcjonalny pomiar kliknięć włączymy tylko za Twoją zgodą. Bez danych osobowych.</p></div><div className="consent-actions"><Button variant="ghost" onClick={() => chooseConsent(false)}>Tylko niezbędne</Button><Button variant="outline" onClick={() => chooseConsent(true)}>Zgadzam się na pomiar</Button></div></aside> : <div className="consent-settings"><Button variant="link" onClick={() => { setAnalyticsConsent(false); setConsent('pending'); }}>Ustawienia prywatności</Button></div>}
    <Dialog open={missing} onOpenChange={setMissing}><DialogContent><LockKeyhole className="text-primary" /><DialogTitle>{site.copy.unavailableTitle}</DialogTitle><DialogDescription>{site.copy.unavailableDescription}</DialogDescription><Button onClick={() => setMissing(false)}>Rozumiem</Button></DialogContent></Dialog>
  </Experience.Provider>;
}
export function useVariant() { return useContext(Experience).variant; }
export function CTA({ source, label, secondary = false }: { source: string; label?: string; secondary?: boolean }) {
  const { variant, consent, openMissing } = useContext(Experience);
  const [loading, setLoading] = useState(false);
  const text = label ?? site.ctaLabels[variant.experiment === 'cta' ? variant.index : 0];
  useEffect(() => {
    const reset = () => setLoading(false);
    const onVisible = () => { if (document.visibilityState === 'visible') reset(); };
    window.addEventListener('pageshow', reset);
    document.addEventListener('visibilitychange', onVisible);
    return () => { window.removeEventListener('pageshow', reset); document.removeEventListener('visibilitychange', onVisible); };
  }, []);
  useEffect(() => {
    if (!consent) return;
    const element = document.querySelector(`[data-cta-source="${source}"]`);
    if (!element) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= .5)) {
        track('cta_view', { placement: source }); observer.disconnect();
      }
    }, { threshold: .5 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [consent, source]);
  function click() {
    if (loading) return;
    track('cta_click', { placement: source });
    if (source === 'hero') track('hero_cta_click', { placement: source });
    if (source.startsWith('profile')) track('profile_cta_click', { placement: source });
    if (text === 'Przejdź do rejestracji') {
      const ageSection = document.getElementById('age-selection');
      if (ageSection) {
        ageSection.focus({ preventScroll: true });
        ageSection.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
      }
      return;
    }
    setLoading(true);
    if (!outbound(source)) { setLoading(false); openMissing(); }
  }
  return <Button data-cta-source={source} variant={secondary ? 'ghost' : 'romantic'} size="lg" className={secondary ? 'secondary-cta' : 'main-cta'} onClick={click} disabled={loading} aria-busy={loading}>{loading ? <><LoaderCircle className="animate-spin" />{site.copy.loading}</> : <>{text}{text === 'Przejdź do rejestracji' ? <ArrowDown aria-hidden="true" /> : <ArrowUpRight aria-hidden="true" />}</>}</Button>;
}