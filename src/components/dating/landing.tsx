import { useState } from 'react';
import { ArrowUpRight, Check, LockKeyhole, MapPin, ShieldCheck } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { CTA, Brand, ExperienceProvider, useVariant } from './experience';
import { site, PROFILE_IMAGE_URL, CTA_PLACEMENT_VARIANTS } from '@/config/site';
import { track } from '@/lib/landing-analytics';
import profil01 from '@/assets/suggested/profil-01.webp';
import profil02 from '@/assets/suggested/profil-02.webp';
import profil03 from '@/assets/suggested/profil-03.webp';
import profil04 from '@/assets/suggested/profil-04.webp';
import profil05 from '@/assets/suggested/profil-05.webp';
import profil06 from '@/assets/suggested/profil-06.webp';
import profil07 from '@/assets/suggested/profil-07.webp';
import profil08 from '@/assets/suggested/profil-08.webp';
import profil09 from '@/assets/suggested/profil-09.webp';
import profil10 from '@/assets/suggested/profil-10.webp';

export function HiddenProfile() {
  const variant = useVariant();
  const [age, setAge] = useState('');
  const ctaAbove = variant.experiment === 'ctaplace' && CTA_PLACEMENT_VARIANTS[variant.index]?.position === 'above';
  const headline = site.headlines[variant.experiment === 'headline' ? variant.index : 0] ?? 'Profil ukryty';
  return <article className={`single-profile ${variant.experiment === 'profile' && variant.index === 1 ? 'profile-alternative' : ''}`} aria-labelledby="profile-title">
    <div className="profile-cover" aria-hidden="true"><img className="profile-cover-photo" src={PROFILE_IMAGE_URL} alt="" /></div>
    <div className="profile-inner">
      <div className="locked-avatar"><img className="profile-avatar-photo" src={PROFILE_IMAGE_URL} alt="Rozmyte zdjęcie ukrytego profilu" /></div>
      <span className="profile-status"><LockKeyhole size={12} /> PRYWATNY PODGLĄD</span>
      <h1 id="profile-title">{headline}</h1>
      <div className="hidden-location"><MapPin size={16} /><span aria-label="Lokalizacja ukryta" /></div>
      <div className="private-fields" aria-hidden="true"><i /><i /><i /></div>
      {ctaAbove && <CTA source="hero" />}
      <div className="profile-message"><LockKeyhole size={20} /><h2>Nie wszystko widać od razu.</h2><p>{site.copy.profileIntro}</p></div>
      {!ctaAbove && <CTA source="hero" />}
      {!(variant.experiment === 'secondary' && variant.index === 1) && <CTA source="profile-secondary" label="Sprawdź możliwości rozmowy" secondary />}
      <div className="profile-assurance"><ShieldCheck size={14} /> {site.copy.destinationNote}</div>
      <section id="age-selection" className="profile-age" tabIndex={-1} aria-labelledby="age-title">
        <h2 id="age-title">{site.copy.ageTitle}</h2>
        <p className="age-intro">{site.copy.ageIntro}</p>
        <div className="age-options" role="group" aria-label="Opcjonalny przedział wiekowy">
          {['18–29', '30–44', '45+'].map(group => <Button key={group} variant="outline" aria-label={`${group} lat`} aria-pressed={age === group} className={age === group ? 'age-option selected' : 'age-option'} onClick={() => { setAge(group); track('age_group_selected', { age_group: group }); }}>
            <Check className="age-check" size={16} aria-hidden="true" />
            <span className="age-number">{group}</span><span className="age-unit">lat</span>
          </Button>)}
        </div>
        <p className="age-feedback" aria-live="polite">{age ? <><Check size={14} aria-hidden="true" /> Wybrano {age} lat. {site.copy.ageSelected}</> : site.copy.ageOptional}</p>
        <CTA source="profile-age" label={site.copy.ageCta} />
        {!age && <CTA source="profile-age-skip" label={site.copy.ageSkip} secondary />}
      </section>
    </div>
  </article>;
}
const SUGGESTED_PHOTOS = [profil01, profil02, profil03, profil04, profil05, profil06, profil07, profil08, profil09, profil10];

export function SuggestedProfiles() {
  return <section className="suggested-section" aria-labelledby="suggested-title">
    <h2 id="suggested-title">Więcej profili czeka na Ciebie</h2>
    <p className="suggested-intro">Rejestracja jest szybka — po niej zobaczysz pełne zdjęcia i napiszesz pierwszą wiadomość.</p>
    <div className="suggested-grid">
      {SUGGESTED_PHOTOS.map((photo, i) => <article key={photo} className="suggested-card">
        <div className="suggested-avatar">
          <img className="suggested-avatar-photo" src={photo} alt="Rozmyte zdjęcie ukrytego profilu" loading="lazy" />
          <span className="avatar-lock-badge" aria-hidden="true"><LockKeyhole /></span>
        </div>
        <span className="profile-status"><LockKeyhole size={12} /> Profil ukryty</span>
        <div className="private-fields" aria-hidden="true"><i /><i /></div>
        <CTA source={`grid-${i + 1}`} label="Sprawdź profil" />
      </article>)}
    </div>
    <div className="suggested-more">
      <p>Chcesz zobaczyć zdjęcia bez rozmycia? Załóż darmowe konto — to zajmuje chwilę.</p>
      <CTA source="grid-bottom" label="Odblokuj wszystkie profile" />
    </div>
  </section>;
}

export function SiteHeader() {
  return <header className="site-header"><div className="container header-inner"><Brand /><div className="header-right"><Link to="/profil" className="header-profile-link">Profil</Link><span className="adult-badge">18+</span><CTA source="header" label="Załóż konto" /></div></div></header>;
}

export function ProfilePageLabel() {
  return <div className="profile-page-label"><span>PODGLĄD PROFILU</span><span><LockKeyhole size={12} /> Dostęp prywatny</span></div>;
}

export function SiteFooter() { return <footer><div className="container"><div className="footer-top"><Brand /><span>Nowe znajomości zaczynają się od Ciebie.</span><span className="adult-badge">18+</span></div><div className="footer-links"><Link to="/profil">Profil</Link>{Object.entries(site.documents).map(([key, doc]) => <Link key={key} to="/informacje/$document" params={{ document: key }}>{doc.title}<ArrowUpRight size={12} /></Link>)}<Link to="/raportowanie">Konfiguracja i pomiar</Link></div><div className="footer-bottom"><span>© 2026 {site.name}.</span></div></div></footer>; }


export function HowItWorks() {
  const steps = [
    ['Wybierz grupę wieku', 'Jedno kliknięcie, żeby zacząć.'],
    ['Załóż konto', 'Krótki formularz w serwisie randkowym.'],
    ['Odblokuj profile', 'Zobacz zdjęcia bez rozmycia i napisz pierwszą wiadomość.'],
  ];
  return <section className="how-section" aria-labelledby="how-title">
    <h2 id="how-title">Jak to działa?</h2>
    <ol className="how-steps">{steps.map(([t, d], i) => <li key={t}><span className="how-num">{i + 1}</span><div><strong>{t}</strong><p>{d}</p></div></li>)}</ol>
    <CTA source="how-it-works" label="Przejdź do rejestracji" />
    <p className="how-trust"><ShieldCheck size={14} aria-hidden="true" /> Tylko dla osób pełnoletnich · Bezpieczne połączenie</p>
  </section>;
}

export function Landing() { return <ExperienceProvider><SiteHeader /><main className="profile-page"><ProfilePageLabel /><HiddenProfile /><SuggestedProfiles /><HowItWorks /></main><SiteFooter /></ExperienceProvider>; }
