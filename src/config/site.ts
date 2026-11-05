import profileAsset from '@/assets/hidden-profile.png.asset.json';

// Custom-domain hosts may not proxy Lovable's asset path; use the verified asset-serving origin.
export const PROFILE_IMAGE_URL = new URL(profileAsset.url, 'https://date-spark-66.lovable.app').href;
export const AFFILIATE_URL = 'https://analise.click/a/5y2vS0pojS41PZ'; // Link partnera.
export const CANONICAL_URL = ''; // WYMAGANE: docelowa domena HTTPS.
export const site = {
  name: 'blink-match',
  copy: {
    profileIntro: 'Przejdź do serwisu, aby sprawdzić dostępne profile i możliwości rozmowy.',
    destinationNote: 'Przejście do serwisu zewnętrznego · tylko 18+',
    ageSelected: 'Możesz przejść dalej.',
    ageCta: 'Przejdź dalej',
    ageTitle: 'Wybierz swój wiek',
    ageIntro: 'Twój kolejny krok do nowych znajomości.',
    ageOptional: 'Wybór opcjonalny · tylko na czas tej wizyty',
    ageSkip: 'Kontynuuj bez wyboru wieku',
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
export type Experiment = 'none' | 'ctaplace' | 'headline' | 'cta' | 'profile' | 'order' | 'secondary';
export const ACTIVE_EXPERIMENT: Experiment = 'ctaplace'; // Tylko jeden test naraz.
export const ANALYTICS_CONFIG = { provider: '', measurementId: '' }; // Nie ładuje skryptów bez zgody.// Test CTA: tekst × położenie głównego przycisku (4 warianty, losowane anonimowo na czas wizyty).
export const CTA_PLACEMENT_VARIANTS = [
  { label: 'Przejdź do rejestracji', position: 'below', name: '„Przejdź do rejestracji” · pod opisem' },
  { label: 'Sprawdź dostępne profile', position: 'below', name: '„Sprawdź dostępne profile” · pod opisem' },
  { label: 'Przejdź do rejestracji', position: 'above', name: '„Przejdź do rejestracji” · nad opisem' },
  { label: 'Sprawdź dostępne profile', position: 'above', name: '„Sprawdź dostępne profile” · nad opisem' },
] as const;
