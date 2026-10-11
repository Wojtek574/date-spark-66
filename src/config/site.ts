export const AFFILIATE_URL = 'https://safeoffers.pro/a/82jyTYKjVcRmEy'; // Link partnera.
export const CANONICAL_URL = ''; // WYMAGANE: docelowa domena HTTPS.
export const site = {
  name: 'blinkmatchlive',
  copy: {
    profileIntro: 'Przejdź do serwisu, aby sprawdzić dostępne profile i możliwości rozmowy.',
    destinationNote: 'Przejście do serwisu zewnętrznego · tylko 18+',
    ageSelected: 'Wybór nie zmienia dostępnych ofert.',
    ageCta: 'Przejdź dalej',
    loading: 'Przechodzimy…',
    unavailableTitle: 'Przejście jest teraz niedostępne',
    unavailableDescription: 'Nie możemy otworzyć strony rejestracji. Spróbuj ponownie później. Nie przekierowujemy Cię na inny adres.',
  },
  headlines: ['Profil ukryty', 'Poznaj profil', 'Odkryj więcej'],
  ctaLabels: ['Przejdź do rejestracji', 'Sprawdź dostępne profile'],
  documents: {
    prywatnosc: { title: 'Polityka prywatności', url: '' },
    cookies: { title: 'Informacje o cookies', url: '' },
    regulamin: { title: 'Regulamin', url: '' },
    kontakt: { title: 'Kontakt', url: '' },
  },
};
export type Experiment = 'none' | 'headline' | 'cta' | 'profile' | 'order' | 'secondary';
export const ACTIVE_EXPERIMENT: Experiment = 'none'; // Tylko jeden test naraz.
export const ANALYTICS_CONFIG = { provider: '', measurementId: '' }; // Nie ładuje skryptów bez zgody.