import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, type FormEvent } from 'react';
import { ArrowLeft, BarChart3, LoaderCircle } from 'lucide-react';
import { Brand } from '@/components/dating/experience';
import { Button } from '@/components/ui/button';
import { getStats, type Group } from '@/lib/stats.functions';
import { site, CTA_PLACEMENT_VARIANTS } from '@/config/site';
import { useServerFn } from '@tanstack/react-start';

export const Route = createFileRoute('/statystyki')({
  head: () => ({ meta: [{ title: 'Statystyki strony — blink-match' }, { name: 'description', content: 'Prywatne statystyki odwiedzin, kliknięć i testów A/B strony blink-match.' }, { property: 'og:title', content: 'Statystyki strony — blink-match' }, { property: 'og:description', content: 'Prywatny panel statystyk strony.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }, { name: 'robots', content: 'noindex' }] }),
  component: Stats,
});

type Result = Awaited<ReturnType<typeof getStats>>;
const pct = (a: number, b: number) => (b ? `${((a / b) * 100).toFixed(1)}%` : '—');
const variantName = (id: string) => { const c = id.match(/^ctaplace-(\d)$/); if (c) return `CTA ${CTA_PLACEMENT_VARIANTS[Number(c[1])]?.name ?? id}`; const m = id.match(/^headline-(\d)$/); return m ? `Nagłówek: „${site.headlines[Number(m[1])]}”` : id === 'control' ? 'Wersja podstawowa' : id; };

function Table({ title, rows, label = (k: string) => k }: { title: string; rows: Group[]; label?: (k: string) => string }) {
  return <section className="stats-block"><h2>{title}</h2>{rows.length === 0 ? <p>Brak danych.</p> : <div className="stats-table-wrap"><table className="stats-table"><thead><tr><th>Grupa</th><th>Wizyty</th><th>Wizyty z kliknięciem</th><th>CTR wizyt</th><th>Wizyty z wyjściem</th><th>Odsetek wyjść</th><th>Przedział 95% wyjść</th></tr></thead><tbody>{rows.map(r => <tr key={r.key}><td>{label(r.key)}</td><td>{r.visits}</td><td>{r.clicks}</td><td>{pct(r.clicks, r.visits)}</td><td>{r.outbound}</td><td>{pct(r.outbound, r.visits)}</td><td>{r.low.toFixed(1)}–{r.high.toFixed(1)}%</td></tr>)}</tbody></table></div>}</section>;
}

function Stats() {
  const fetchStats = useServerFn(getStats);
  const [password, setPassword] = useState('');
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  async function load(e?: FormEvent) {
    e?.preventDefault(); setLoading(true);
    try { setResult(await fetchStats({ data: { password, days } })); } catch { setResult({ ok: false, error: 'Nie udało się pobrać statystyk.' }); }
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
      <p className="stats-note">Aktualizacja: {new Date(ok.until).toLocaleString('pl-PL')} · Dni w tabeli: UTC.</p>
      {ok.truncated && <p role="alert" className="stats-error">Raport częściowy: przekroczono limit 200 000 zdarzeń. Wybierz krótszy okres — wskaźniki mogą być niepełne.</p>}
      <div className="report-grid">{[['Wizyty po filtrach', ok.totals.visits, 'nie unikalne osoby'], ['Wizyty z kliknięciem', ok.totals.clicks, pct(ok.totals.clicks, ok.totals.visits)], ['Wybór wieku', ok.totals.age, pct(ok.totals.age, ok.totals.visits)], ['Wyjścia do serwisu', ok.totals.outbound, pct(ok.totals.outbound, ok.totals.visits)], ['Przewinięcie 50%', ok.totals.s50, pct(ok.totals.s50, ok.totals.visits)], ['Przewinięcie 90%', ok.totals.s90, pct(ok.totals.s90, ok.totals.visits)], ['Wizyty zaangażowane', ok.totals.engaged, pct(ok.totals.engaged,ok.totals.visits)], ['Mediana aktywnego czasu', `${ok.totals.medianSeconds} s`, `Średnia: ${ok.totals.averageSeconds} s`]].map(([l, v, p]) => <article key={l as string}><span>{l}</span><strong>{v}</strong><small>{p}</small></article>)}</div>
      <section className="stats-block"><h2>Jakość danych</h2><ul><li>Odfiltrowane wizyty automatyczne: <strong>{ok.quality.automation}</strong></li><li>Podgląd i ruch lokalny: <strong>{ok.quality.test}</strong></li><li>Wizyty bez odsłony w wybranym okresie: <strong>{ok.quality.orphan}</strong> — pominięte.</li><li>Historyczne zdarzenia bez nowych filtrów: <strong>{ok.legacy}</strong> — nie są mieszane z nowym raportem.</li></ul><p className="stats-note">Filtry wykrywają znane boty i oznaczenia automatyzacji, lecz nie potwierdzają tożsamości człowieka. Wizyty bez oznak automatyzacji mogą nadal zawierać nierozpoznane boty. Brak cookies i identyfikowania osób między wizytami: odświeżenie lub nowa karta to nowa wizyta.</p></section>
      <Table title="Dzienny przebieg ruchu" rows={ok.daily} />
      <Table title="Test A/B — tekst i położenie CTA (od najwyższego odsetka wyjść)" rows={[...ok.variants].sort((a, b) => b.outbound / (b.visits || 1) - a.outbound / (a.visits || 1))} label={variantName} />
      <p className="stats-note">Przedział 95% (Wilson) pokazuje niepewność odsetka wyjść. Sama liczba 300 wizyt nie oznacza wiarygodnego zwycięzcy; panel nie ogłasza zwycięzcy A/B.</p>
      <Table title="Urządzenia" rows={ok.devices} label={k => (k === 'mobile' ? 'Telefon' : k === 'tablet' ? 'Tablet' : 'Komputer')} />
      <Table title="Źródła ruchu" rows={ok.sources} label={k => (k === 'direct' ? 'Bezpośrednio' : k)} />
      <Table title="Kampanie — źródło / medium / kampania" rows={ok.campaigns} />
      <Table title="Przeglądarki" rows={ok.browsers} />
      <Table title="Systemy operacyjne" rows={ok.systems} />
      <section className="stats-block"><h2>Grupy wiekowe</h2>{Object.keys(ok.ages).length ? <ul>{Object.entries(ok.ages).map(([k, v]) => <li key={k}>{k} lat: <strong>{v}</strong></li>)}</ul> : <p>Brak danych.</p>}</section>
      <section className="stats-block"><h2>Widoczność i kliknięcia przycisków</h2>{ok.placements.length ? <div className="stats-table-wrap"><table className="stats-table"><thead><tr><th>Miejsce</th><th>Wizyty z widocznym przyciskiem</th><th>Wizyty z kliknięciem</th></tr></thead><tbody>{ok.placements.map(p=><tr key={p.key}><td>{p.key}</td><td>{p.views}</td><td>{p.clicks}</td></tr>)}</tbody></table></div> : <p>Brak danych.</p>}</section>
      <p className="stats-note">Każda wizyta jest liczona raz w danym wskaźniku; wielokrotne kliknięcia nie zwiększają CTR. Grupa wiekowa: ostatni wybór w wizycie. Zaangażowanie: minimum 10 s aktywnego czasu lub kliknięcie / wybór wieku. Czas obejmuje tylko widoczną, aktywną kartę i jest przybliżony; awaria pomiaru, blokery lub zamknięcie przeglądarki mogą powodować braki.</p>
      <p className="stats-note">„Przejście do rejestracji” to wyjście na stronę serwisu — faktyczne rejestracje widać tylko w panelu programu.</p>
    </>}
  </div>;
}
