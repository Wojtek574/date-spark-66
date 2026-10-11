import { createFileRoute, Link } from '@tanstack/react-router';
import { site } from '@/config/site';
import { Brand } from '@/components/dating/experience';
import { ArrowLeft, FileText } from 'lucide-react';

function getDocument(key: string) { return Object.entries(site.documents).find(([id]) => key === id)?.[1]; }
export const Route = createFileRoute('/informacje/$document')({
  head: ({ params }) => { const title = getDocument(params.document)?.title ?? 'Informacje'; return { meta: [{ title: `${title} — blinkmatchlive` }, { name: 'description', content: `Status informacji: ${title}. Sprawdź dostępność dokumentów strony blinkmatchlive.` }, { property: 'og:title', content: `${title} — blinkmatchlive` }, { property: 'og:description', content: 'Informacje i status dokumentów strony promocyjnej 18+.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }, { name: 'robots', content: 'noindex' }] }; },
  component: DocumentPage,
});
function DocumentPage() { const { document: key } = Route.useParams(); const doc = getDocument(key); return <div className="info-page container"><Brand /><Link to="/" className="back-link"><ArrowLeft size={16} /> Wróć na stronę główną</Link><FileText className="text-primary" size={32} /><h1>{doc?.title ?? 'Nie znaleziono informacji'}</h1><><span className="status-label">DO UZUPEŁNIENIA PRZED PUBLIKACJĄ</span><p>{key === 'kontakt' ? 'Właściciel nie podał jeszcze danych kontaktowych.' : 'Właściciel nie dostarczył jeszcze tego dokumentu. To oznaczenie brakującej treści, a nie dokument prawny.'}</p></>{doc?.url.startsWith('https://') && <a href={doc.url} target="_blank" rel="noopener noreferrer">Otwórz dokument</a>}<p className="text-muted-foreground">Informacje o opłatach, koncie i przetwarzaniu danych w serwisie randkowym należy sprawdzić bezpośrednio u operatora.</p></div>; }