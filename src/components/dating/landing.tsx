import { useState } from 'react';
import { ArrowDown, ArrowUpRight, Check, ChevronDown, Compass, Heart, LockKeyhole, MessageCircle, MousePointer2, Plus, ShieldCheck, Smartphone, Sparkles, UserRound } from 'lucide-react';
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
  return <div className={`hidden-profile ${variant.experiment === 'profile' && variant.index === 1 ? 'profile-alternative' : ''}`}>
    <div className="profile-top"><span><span className="tiny-dot" /> PODGLĄD PROFILU</span><LockKeyhole size={16} /></div>
    <div className="concealed-art" aria-hidden="true"><div className="concealed-lines"><i /><i /><i /><i /><i /></div><div className="lock-disc"><LockKeyhole strokeWidth={1.4} /></div></div>
    <div className="profile-caption"><span className="mini-label">ODROBINA CIEKAWOŚCI</span><h2>Reszta zaczyna się<br />od pierwszego kroku.</h2><p>Podgląd jest ukryty. Sprawdź dostępne profile i zasady na stronie serwisu.</p></div>
    <CTA source="profile-card" label="Poznaj profil" />
    <div className="profile-bottom"><ShieldCheck size={14} /><span>Bez danych osobowych na tej stronie</span></div>
  </div>;
}

function Hero() {
  const variant = useVariant();
  const headline = site.headlines[variant.experiment === 'headline' ? variant.index : 0];
  const secondary = !(variant.experiment === 'secondary' && variant.index === 1);
  return <section className="hero" aria-labelledby="hero-title"><div className="hero-texture" aria-hidden="true" /><div className="container hero-grid"><div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line" /> MNIEJ SCROLLOWANIA. WIĘCEJ CIEKAWOŚCI.</div><h1 id="hero-title">{headline.split('\n')[0]}<br /><span>{headline.split('\n')[1]}</span></h1><p className="hero-subtitle">Czasem wszystko zaczyna się od zwykłego „cześć”.<br className="desktop-break" /> Odkryj możliwości poznania nowych osób —<br className="desktop-break" /> w swoim tempie, na swoich zasadach.</p><div className="hero-actions"><CTA source="hero" />{secondary && <CTA source="hero-secondary" label="Zobacz, co dalej" secondary />}</div><div className="hero-assurance"><span><ShieldCheck />Świadomy wybór</span><span><LockKeyhole />Bez rejestracji tutaj</span></div></div><div className="hero-profile"><div className="profile-note"><Sparkles /><span>Każda znajomość ma swój początek</span></div><HiddenProfile /><div className="floating-note"><Heart /><span>Nie wszystko trzeba wiedzieć od razu.</span></div></div></div><div className="container hero-bottom"><span>NOWE ROZMOWY. NOWE PERSPEKTYWY.</span><a href="#mozliwosci" aria-label="Przewiń do możliwości"><ArrowDown /></a><span>TY DECYDUJESZ, CO DALEJ.</span></div></section>;
}

function Possibilities() { return <section id="mozliwosci" className="section possibilities"><div className="container"><div className="section-heading"><div><span className="eyebrow">01 / PRZESTRZEŃ NA NOWE ZNAJOMOŚCI</span><h2>Niech ciekawość<br /><span>zrobi pierwszy ruch.</span></h2></div><p>Bez presji i wielkich obietnic.<br />Po prostu sprawdź, czy to miejsce dla Ciebie.</p></div><div className="benefit-grid">{[
  { icon: Compass, title: 'Nowe perspektywy', copy: 'Sprawdź, jakie możliwości odkrywania profili oferuje serwis.' },
  { icon: Heart, title: 'Wspólne zainteresowania', copy: 'Zobacz, czy partner pozwala poznawać osoby o podobnych pasjach.' },
  { icon: Smartphone, title: 'Zawsze pod ręką', copy: 'Przejdź dalej wygodnie z telefonu, gdziekolwiek jesteś.' },
  { icon: ShieldCheck, title: 'Decyzja należy do Ciebie', copy: 'Poznaj warunki operatora, zanim zdecydujesz się założyć konto.' },
].map(({ icon: Icon, title, copy }, i) => <article key={title} className="benefit"><div className="benefit-icon"><Icon strokeWidth={1.5} /><span>0{i + 1}</span></div><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>; }

function NextSteps() { return <section id="jak-to-dziala" className="section process"><div className="container process-layout"><div><span className="eyebrow">02 / PROSTO, BEZ POŚPIECHU</span><h2>Od ciekawości<br />do <span>pierwszego kroku.</span></h2><p className="section-description">Żadnych zbędnych formularzy.<br />Dalsza część jest na stronie partnera.</p><CTA source="steps" /></div><ol className="steps">{[
  { icon: Compass, title: 'Rozejrzyj się', text: 'Zapoznaj się z możliwościami i zdecyduj, czy chcesz dowiedzieć się więcej.' },
  { icon: ArrowUpRight, title: 'Przejdź do serwisu', text: 'Kliknij przycisk i sprawdź warunki rejestracji na stronie partnera.' },
  { icon: MessageCircle, title: 'Odkryj dostępne funkcje', text: 'Jeśli założysz konto, sprawdź możliwości oferowane przez operatora.' },
].map(({ icon: Icon, title, text }, i) => <li key={title}><span className="step-number">0{i + 1}</span><div><h3>{title}</h3><p>{text}</p></div><Icon className="step-icon" strokeWidth={1.5} /></li>)}</ol></div></section>; }

function AgeChoice() {
  const [age, setAge] = useState('');
  return <section className="section age-section"><div className="container age-layout"><div><span className="eyebrow">03 / TWÓJ ETAP ŻYCIA</span><h2>Na znajomości<br />nie ma <span>jednego wieku.</span></h2><p className="section-description">Każdy dorosły ma tu miejsce.<br />Wybór jest całkowicie opcjonalny.</p></div><div className="age-tool"><span className="mini-label">WYBIERZ SWOJĄ GRUPĘ WIEKOWĄ</span><div className="age-options" role="group" aria-label="Opcjonalny przedział wiekowy">{['18–29', '30–44', '45+'].map(group => <Button variant="outline" key={group} aria-pressed={age === group} className={age === group ? 'age-option selected' : 'age-option'} onClick={() => { setAge(group); track('age_group_selected', { age_group: group }); }}><UserRound strokeWidth={1.5} /><strong>{group}</strong><span>lat</span>{age === group && <Check className="age-check" />}</Button>)}</div><div className="age-feedback" aria-live="polite">{age ? `Wybrano ${age} lat. Możesz przejść dalej.` : 'Nie chcesz wybierać? Możesz od razu przejść dalej.'}</div><CTA source="age" /><p className="age-disclaimer">Wybór nie zmienia oferty partnera i nie jest zapisywany po zakończeniu wizyty. Wyłącznie dla osób 18+.</p></div></div></section>;
}

function FAQ() { const [open, setOpen] = useState<number | null>(null); return <section id="pytania" className="section faq-section"><div className="container faq-layout"><div><span className="eyebrow">04 / WARTO WIEDZIEĆ</span><h2>Masz pytania?<br /><span>To naturalne.</span></h2><p className="section-description">Jasne odpowiedzi.<br />Bez drobnego druku.</p><div className="faq-mark" aria-hidden="true"><MessageCircle strokeWidth={.7} /><Plus /></div></div><div className="faq-list">{faqs.map(([q, a], i) => <article className="faq-item" key={q}><h3><Button variant="ghost" aria-expanded={open === i} aria-controls={`faq-${i}`} onClick={() => { setOpen(open === i ? null : i); if (open !== i) track('faq_open', { question_id: i }); }}>{q}<ChevronDown className={open === i ? 'rotated' : ''} /></Button></h3><div id={`faq-${i}`} hidden={open !== i}><p>{a}</p></div></article>)}</div></div></section>; }

function Footer() { return <footer><div className="container"><div className="footer-top"><Brand /><span>Nowe znajomości zaczynają się od Ciebie.</span><span className="adult-badge">18+</span></div><div className="footer-links">{Object.entries(site.documents).map(([key, doc]) => <Link key={key} to="/informacje/$document" params={{ document: key }}>{doc.title}<ArrowUpRight size={12} /></Link>)}<Link to="/raportowanie">Konfiguracja i pomiar</Link></div><div className="footer-bottom"><p>Strona promocyjna z linkami afiliacyjnymi. Możemy otrzymać wynagrodzenie za przejście lub rejestrację u partnera. Nie jesteśmy operatorem serwisu randkowego. Wyłącznie 18+.</p><span>© 2026 między nami.</span></div></div></footer>; }

function Content() { const variant = useVariant(); return <><header className="site-header"><div className="container header-inner"><Brand /><nav aria-label="Nawigacja główna"><a href="#jak-to-dziala">Jak to działa</a><a href="#pytania">Pytania i odpowiedzi</a></nav><div className="header-right"><span className="adult-badge">18+</span><CTA source="header" label="Zacznij tutaj" secondary /></div></div></header><main><Hero /><div className="values-strip"><div className="container"><span><Heart />Nowe znajomości</span><i /><span><MessageCircle />Przestrzeń na rozmowę</span><i /><span><ShieldCheck />Twoje tempo. Twój wybór.</span></div></div>{variant.experiment === 'order' && variant.index === 1 ? <><NextSteps /><Possibilities /></> : <><Possibilities /><NextSteps /></>}<AgeChoice /><FAQ /><section className="final-section"><div className="container"><Heart className="final-heart" strokeWidth={1} /><span className="eyebrow">MAŁY KROK. NOWA PERSPEKTYWA.</span><h2>A gdyby tak<br /><span>zacząć od „cześć”?</span></h2><p>Sprawdź stronę serwisu. Resztę zdecydujesz samodzielnie.</p><CTA source="final" /><span className="final-note"><LockKeyhole size={13} />Rejestracja odbywa się na stronie partnera · 18+</span></div></section></main><Footer /></>; }
export function Landing() { return <ExperienceProvider><Content /></ExperienceProvider>; }