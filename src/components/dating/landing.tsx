import { useState } from 'react';
import { ArrowUpRight, Check, Heart, LockKeyhole, MapPin, ShieldCheck, UserRound } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { CTA, Brand, ExperienceProvider, useVariant } from './experience';
import { site } from '@/config/site';
import { track } from '@/lib/landing-analytics';

function HiddenProfile() {
  const variant = useVariant();
  const [age, setAge] = useState('');
  const headline = site.headlines[variant.experiment === 'headline' ? variant.index : 0] ?? 'Profil ukryty';
  return <article className={`single-profile ${variant.experiment === 'profile' && variant.index === 1 ? 'profile-alternative' : ''}`} aria-labelledby="profile-title">
    <div className="profile-cover" aria-hidden="true"><div className="cover-pattern" /><span className="cover-heart"><Heart strokeWidth={1} /></span></div>
    <div className="profile-inner">
      <div className="locked-avatar" aria-label="Zdjęcie profilu ukryte"><UserRound className="blurred-avatar" strokeWidth={1} /><LockKeyhole className="avatar-lock" strokeWidth={1.7} /><span className="avatar-lock-badge"><LockKeyhole /></span></div>
      <span className="profile-status"><LockKeyhole size={12} /> PRYWATNY PODGLĄD</span>
      <h1 id="profile-title">{headline}</h1>
      <div className="hidden-location"><MapPin size={16} /><span aria-label="Lokalizacja ukryta" /></div>
      <div className="private-fields" aria-hidden="true"><i /><i /><i /></div>
      <div className="profile-message"><LockKeyhole size={20} /><h2>Nie wszystko widać od razu.</h2><p>{site.copy.profileIntro}</p></div>
      <CTA source="hero" />
      {!(variant.experiment === 'secondary' && variant.index === 1) && <CTA source="profile-secondary" label="Sprawdź możliwości rozmowy" secondary />}
      <div className="profile-assurance"><ShieldCheck size={14} /> {site.copy.destinationNote}</div>
      <div className="profile-age"><h2>Wybierz swoją grupę wiekową</h2><p>Opcjonalnie — możesz też od razu przejść dalej.</p><div className="age-options" role="group" aria-label="Opcjonalny przedział wiekowy">{['18–29', '30–44', '45+'].map(group => <Button key={group} variant="outline" aria-pressed={age === group} className={age === group ? 'age-option selected' : 'age-option'} onClick={() => { setAge(group); track('age_group_selected', { age_group: group }); }}><span>{group} lat</span>{age === group && <Check size={13} />}</Button>)}</div><p className="age-feedback" aria-live="polite">{age ? `Wybrano ${age} lat. ${site.copy.ageSelected}` : 'Wybór pozostaje tylko na czas tej wizyty.'}</p>{age && <CTA source="profile-age" label={site.copy.ageCta} />}</div>
    </div>
  </article>;
}
function Footer() { return <footer><div className="container"><div className="footer-top"><Brand /><span>Nowe znajomości zaczynają się od Ciebie.</span><span className="adult-badge">18+</span></div><div className="footer-links">{Object.entries(site.documents).map(([key, doc]) => <Link key={key} to="/informacje/$document" params={{ document: key }}>{doc.title}<ArrowUpRight size={12} /></Link>)}<Link to="/raportowanie">Konfiguracja i pomiar</Link></div><div className="footer-bottom"><span>© 2026 między nami.</span></div></div></footer>; }


export function Landing() { return <ExperienceProvider><header className="site-header"><div className="container header-inner"><Brand /><div className="header-right"><span className="adult-badge">18+</span><CTA source="header" label="Załóż konto" /></div></div></header><main className="profile-page"><div className="profile-page-label"><span>PODGLĄD PROFILU</span><span><LockKeyhole size={12} /> Dostęp prywatny</span></div><HiddenProfile /></main><Footer /></ExperienceProvider>; }
