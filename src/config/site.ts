export const AFFILIATE_URL = 'https://safeoffers.pro/a/82jyTYKjVcRmEy'; // Link partnera.
export const CANONICAL_URL = ''; // WYMAGANE: docelowa domena HTTPS.
export const site = {
  name: 'między nami',
  headlines: ['Profil ukryty', 'Poznaj profil', 'Odkryj więcej'],
  ctaLabels: ['Przejdź do rejestracji', 'Sprawdź dostępne profile'],
  documents: {
    prywatnosc: { title: 'Polityka prywatności', url: '' },
    cookies: { title: 'Informacje o cookies', url: '' },
    regulamin: { title: 'Regulamin', url: '' },
    afiliacja: { title: 'Informacja afiliacyjna', url: '' },
    kontakt: { title: 'Kontakt', url: '' },
  },
};
export type Experiment = 'none' | 'headline' | 'cta' | 'profile' | 'order' | 'secondary';
export const ACTIVE_EXPERIMENT: Experiment = 'none'; // Tylko jeden test naraz.
export const ANALYTICS_CONFIG = { provider: '', measurementId: '' }; // Nie ładuje skryptów bez zgody.