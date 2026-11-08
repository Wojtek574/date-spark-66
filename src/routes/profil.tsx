import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { ExperienceProvider } from '@/components/dating/experience';
import { HiddenProfile, ProfilePageLabel, SiteFooter, SiteHeader } from '@/components/dating/landing';
import { CANONICAL_URL, PROFILE_IMAGE_URL } from '@/config/site';

export const Route = createFileRoute('/profil')({
  head: () => ({ meta: [
    { title: 'blink-match — profil w podglądzie | 18+' },
    { name: 'description', content: 'Podgląd jednego ukrytego profilu. Zdjęcia i dane zobaczysz po rejestracji. Strona promocyjna dla osób pełnoletnich.' },
    { property: 'og:title', content: 'blink-match — profil w podglądzie' },
    { property: 'og:description', content: 'Ukryty profil czeka na rejestrację. Zobacz, co możesz odblokować. Wyłącznie 18+.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
    { property: 'og:image', content: PROFILE_IMAGE_URL }, { name: 'twitter:image', content: PROFILE_IMAGE_URL },
  ], links: CANONICAL_URL.startsWith('https://') ? [{ rel: 'canonical', href: `${CANONICAL_URL}/profil` }] : [] }),
  component: ProfilePage,
});

function ProfilePage() {
  return <ExperienceProvider>
    <SiteHeader />
    <main className="profile-page">
      <ProfilePageLabel />
      <HiddenProfile />
      <Link to="/" className="profile-page-back"><ArrowLeft size={14} aria-hidden="true" /> Wróć na stronę główną</Link>
    </main>
    <SiteFooter />
  </ExperienceProvider>;
}
