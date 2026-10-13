import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, type FormEvent } from 'react';
import { ArrowLeft, BarChart3, LoaderCircle } from 'lucide-react';
import { Brand } from '@/components/dating/experience';
import { Button } from '@/components/ui/button';
import { getStats, type Group } from '@/lib/stats.functions';
import { site } from '@/config/site';

export const Route = createFileRoute('/statystyki')({
  head: () => ({ meta: [{ title: 'Statystyki strony — blink-match' }, { name: 'description', content: 'Prywatne statystyki odwiedzin, kliknięć i testów A/B strony blink-match.' }, { property: 'og:title', content: 'Statystyki strony — blink-match' }, { property: 'og:description', content: 'Prywatny panel statystyk strony.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }, { name: 'robots', content: 'noindex' }] }),
  component: Stats,
});

type Result = Awaited<ReturnType<typeof getStats>>;
const pct = (a: number, b: number) => (b ? `${((a / b) * 100).toFixed(1)}%` : '—');
const variantName = (id: string) => { const m = id.match(/^headline-(\d)$/); return m ? `Nagłówek: „${site.headlines[Number(m[1])]}”` : id === 'control' ? 'Wersja podstawowa' : id; };

function Table({ title, rows, label = (k: string) => k }: { title: string; rows: Group[]; label?: (k: string) => string }) {
  return <section className="stats-block"><h2>{title}</h2>{rows.length === 0 ? <p>Brak danych.</p> : <div className="stats-table-wrap"><table className="stats-table"><thead><tr><th>Grupa</th><th>Wizyty</th><th>Kliknięcia</th><th>CTR</th><th>Wyjścia</th><th>Konwersja</th></tr></thead><tbody>{rows.map(r => <tr key={r.key}><td>{label(r.key)}</td><td>{r.visits}</td><td>{r.clicks}</td><td>{pct(r.clicks, r.visits)}</td><td>{r.outbound}</td><td>{pct(r.outbound, r.visits)}</td></tr>)}</tbody></table></div>}</section>;
}

function Stats() {
  const [password, setPassword] = useState('');
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  async function load(e?: FormEvent) {
    e?.preventDefault(); setLoading(true);
    try { setResult(await getStats({ data: { password, days } })); } catch { setResult({ ok: false, error: 'Nie udało się pobrać statystyk.' }); }
    setLoading(false);
  }
  const ok = result?.ok ? result : null;
  return <div className="info-page container"><Brand /><Link to="/" className="back-link"><ArrowLeft size={16} /> Wróć na stronę główną</Link><BarChart3 className="text-primary" size={32} /><h1>Statystyki strony</h1>
    <form className="stats-form" onSubmit={load}>
      <label>Hasło<input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required /></label>
      <label>Okres<select value={days} onChange={e => setDays(Number(e.target.value))}><option value={1}>Ostatnie 24 h</option><option value={7}>7 dni</option><option value={30}>30 dni</option><option value={90}>90 dni</option></select></label>
      <Button type="submit" disabled={loading}>{loading ? <LoaderCircle className="animate-spin" /> : null}Pokaż statystyki</Button>
    </form>
    {result && !result.ok && <p role="alert" className="stats-error">{result.error}</p>}
    {ok && <>
      <div className="report-grid">{[['Wizyty', ok.totals.visits, ''], ['Kliknięcia przycisków', ok.totals.clicks, pct(ok.totals.clicks, ok.totals.visits)], ['Wybór wieku', ok.totals.age, pct(ok.totals.age, ok.totals.visits)], ['Przejścia do rejestracji', ok.totals.outbound, pct(ok.totals.outbound, ok.totals.visits)], ['Przewinięcie 50%', ok.totals.s50, pct(ok.totals.s50, ok.totals.visits)], ['Przewinięcie 90%', ok.totals.s90, pct(ok.totals.s90, ok.totals.visits)]].map(([l, v, p]) => <article key={l as string}><span>{l}</span><strong>{v}</strong><small>{p || 'unikalne wizyty'}</small></article>)}</div>
      <Table title="Test A/B — nagłówki" rows={ok.variants} label={variantName} />
      {ok.variants.length > 1 && <p className="stats-note">{ok.variants.every(v => v.visits >= 300) ? 'Każdy wariant ma min. 300 wizyt — porównanie zaczyna być wiarygodne.' : 'Za mało danych, by wskazać zwycięzcę (potrzeba ok. 300 wizyt na wariant).'}</p>}
      <Table title="Urządzenia" rows={ok.devices} label={k => (k === 'mobile' ? 'Telefon' : 'Komputer')} />
      <Table title="Źródła ruchu" rows={ok.sources} label={k => (k === 'direct' ? 'Bezpośrednio' : k)} />
      <section className="stats-block"><h2>Grupy wiekowe</h2>{Object.keys(ok.ages).length ? <ul>{Object.entries(ok.ages).map(([k, v]) => <li key={k}>{k} lat: <strong>{v}</strong></li>)}</ul> : <p>Brak danych.</p>}</section>
      <section className="stats-block"><h2>Kliknięcia wg miejsca</h2>{Object.keys(ok.placements).length ? <ul>{Object.entries(ok.placements).map(([k, v]) => <li key={k}>{k}: <strong>{v}</strong></li>)}</ul> : <p>Brak danych.</p>}</section>
      <p className="stats-note">„Przejście do rejestracji” to wyjście na stronę serwisu — faktyczne rejestracje widać tylko w panelu programu.</p>
    </>}
  </div>;
}
