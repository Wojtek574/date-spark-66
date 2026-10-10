import { useState } from 'react';
import { ArrowUpRight, Check, ChevronDown, Heart, LockKeyhole, MapPin, MessageCircle, ShieldCheck, UserRound } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { CTA, Brand, ExperienceProvider, useVariant } from './experience';
import { site } from '@/config/site';
import { track } from '@/lib/landing-analytics';

const faqs = [
  ['Jak działa serwis?', 'Ta strona przedstawia możliwość przejścia do zewnętrznego serwisu randkowego. Jego aktualne funkcje i zasady sprawdzisz u operatora przed założeniem konta.'],
  ['Czy rejestracja odbywa się na tej stronie?', 'Nie. Nie zakładasz tutaj konta i nie podajesz danych osobowych. Rejestracja odbywa się na stronie partnera.'],
  ['Co stanie się po kliknięciu przycisku?', 'Po ustawieniu linku afiliacyjnego przejdziesz na stronę partnera. Dopóki link nie jest skonfigurowany, zobaczysz komunikat, bez przekierowania.'],
  ['Czy korzystanie z serwisu jest bezpłatne?', 'Nie mamy potwierdzonego cennika partnera. Sprawdź dostępne plany, opłaty i warunki rejestracji na jego stronie.'],
  ['Czy muszę zakładać konto?', 'Przeglądanie tej strony nie wymaga konta. Partner może wymagać rejestracji, aby udostępnić swoje funkcje.'],
  ['Jak chronione są moje dane?', 'Ta strona nie zbiera danych profilowych ani daty urodzenia. Opcjonalny pomiar kliknięć wymaga zgody. Zasady przetwarzania danych przez partnera sprawdzisz w jego polityce prywatności.'],
  ['Czy mogę korzystać z serwisu na telefonie?', 'Ta strona działa na telefonie. Dostępność i funkcje mobilne serwisu partnera sprawdzisz na jego stronie.'],
];


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
      <div className="profile-message"><LockKeyhole size={20} /><h2>Nie wszystko widać od razu.</h2><p>Przejdź do serwisu, aby sprawdzić dostępne profile i możliwości rozmowy.</p></div>
      <CTA source="hero" />
      {!(variant.experiment === 'secondary' && variant.index === 1) && <CTA source="profile-secondary" label="Sprawdź możliwości rozmowy" secondary />}
      <div className="profile-assurance"><ShieldCheck size={14} /> Rejestracja na stronie partnera · tylko 18+</div>
      <div className="profile-age"><h2>Wybierz swoją grupę wiekową</h2><p>Opcjonalnie — możesz też od razu przejść dalej.</p><div className="age-options" role="group" aria-label="Opcjonalny przedział wiekowy">{['18–29', '30–44', '45+'].map(group => <Button key={group} variant="outline" aria-pressed={age === group} className={age === group ? 'age-option selected' : 'age-option'} onClick={() => { setAge(group); track('age_group_selected', { age_group: group }); }}><span>{group} lat</span>{age === group && <Check size={13} />}</Button>)}</div><p className="age-feedback" aria-live="polite">{age ? `Wybrano ${age} lat. Wybór nie zmienia oferty partnera.` : 'Wybór pozostaje tylko na czas tej wizyty.'}</p></div>
    </div>
  </article>;
}
function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return <section id="pytania" className="compact-faq"><div className="faq-heading"><MessageCircle size={18} /><h2>Warto wiedzieć przed kolejnym krokiem</h2></div>{faqs.map(([q, a], i) => <article className="faq-item" key={q}><h3><Button variant="ghost" aria-expanded={open === i} aria-controls={`faq-${i}`} onClick={() => { setOpen(open === i ? null : i); if (open !== i) track('faq_open', { question_id: i }); }}>{q}<ChevronDown className={open === i ? 'rotated' : ''} /></Button></h3><div id={`faq-${i}`} hidden={open !== i}><p>{a}</p></div></article>)}</section>;
}
function Footer() { return <footer><div className="container"><div className="footer-top"><Brand /><span>Nowe znajomości zaczynają się od Ciebie.</span><span className="adult-badge">18+</span></div><div className="footer-links">{Object.entries(site.documents).map(([key, doc]) => <Link key={key} to="/informacje/$document" params={{ document: key }}>{doc.title}<ArrowUpRight size={12} /></Link>)}<Link to="/raportowanie">Konfiguracja i pomiar</Link></div><div className="footer-bottom"><p>Strona promocyjna z linkami afiliacyjnymi. Możemy otrzymać wynagrodzenie za przejście lub rejestrację u partnera. Nie jesteśmy operatorem serwisu randkowego. Wyłącznie 18+.</p><span>© 2026 między nami.</span></div></div></footer>; }


export function Landing() { return <ExperienceProvider><header className="site-header"><div className="container header-inner"><Brand /><div className="header-right"><span className="adult-badge">18+</span><CTA source="header" label="Załóż konto" /></div></div></header><main className="profile-page"><div className="profile-page-label"><span>PODGLĄD PROFILU</span><span><LockKeyhole size={12} /> Dostęp prywatny</span></div><HiddenProfile /><FAQ /></main><Footer /></ExperienceProvider>; }
