import { createFileRoute } from '@tanstack/react-router';
import { Landing } from '@/components/dating/landing';
import { CANONICAL_URL, PROFILE_IMAGE_URL } from '@/config/site';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'blink-match — nowe znajomości, Twój pierwszy krok | 18+' },
    { name: 'description', content: 'Odkryj możliwości poznania nowych osób. Sprawdź zasady serwisu i zdecyduj we własnym tempie. Strona promocyjna dla osób pełnoletnich.' },
    { property: 'og:title', content: 'blink-match — nowe znajomości. Twój pierwszy krok.' },
    { property: 'og:description', content: 'Czasem wszystko zaczyna się od „cześć”. Poznaj możliwości serwisu randkowego. Wyłącznie 18+.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
    { property: 'og:image', content: PROFILE_IMAGE_URL }, { name: 'twitter:image', content: PROFILE_IMAGE_URL },
  ], links: CANONICAL_URL.startsWith('https://') ? [{ rel: 'canonical', href: CANONICAL_URL }] : [] }),
  component: Landing,
});
