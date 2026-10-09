export const AFFILIATE_URL = ''; // WYMAGANE: pełny adres HTTPS partnera.
export const CANONICAL_URL = ''; // WYMAGANE: docelowa domena HTTPS.
export const site = {
  name: 'między nami',
  headlines: ['Nowe znajomości.\nTwój pierwszy krok.', 'Poznaj kogoś.\nZacznij od ciekawości.', 'Dobre rozmowy\nmają swój początek.'],
  ctaLabels: ['Sprawdź możliwości', 'Przejdź do rejestracji'],
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