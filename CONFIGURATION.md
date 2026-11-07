# Konfiguracja przed publikacją

## Działa bez usług zewnętrznych
- Landing 18+, ukryty podgląd z rozmytymi zdjęciami dostarczonymi przez właściciela; bez fikcyjnych profili, imion, wieku i treści demonstracyjnych.
- Wspólne CTA prowadzące do linku partnera, opcjonalny wybór wieku, zamykany pasek mobilny.
- Zgoda na pomiar i zdarzenia przeglądarkowe; bez skryptu GA4, cookies, localStorage ani danych profilowych.
- Pojedynczy test A/B przypisany w pamięci bieżącej wizyty, domyślnie wyłączony.
- Osobne strony informacji i raportowania; raport nie przedstawia żadnych wymyślonych wyników.

## Wymaga właściciela
1. `AFFILIATE_URL` jest ustawiony na `https://analise.click/a/5y2vS0pojS41PZ`. Potwierdź u partnera, że adres jest aktualny i że przejście jest poprawnie rozliczane.
2. Ustaw `CANONICAL_URL` na docelowy adres domeny. Obecnie tag canonical jest pominięty.
3. Dostarcz prawdziwe dokumenty prywatności/cookies, kontakt oraz ewentualny regulamin. Ustaw adresy dokumentów w `site.documents`. Nie publikuj brakujących dokumentów jako polityk prawnych.
4. Potwierdź u partnera funkcje, ceny i zasady; obecna treść nie obiecuje bezpłatności, dopasowania ani odpowiedzi.
5. Podłącz narzędzie analityczne: załaduj je dopiero po zgodzie i nasłuchuj `miedzy-nami:analytics`. `ANALYTICS_CONFIG` samo niczego nie uruchamia. Nie przesyłaj automatycznie pełnego URL, referrera, wieku ani danych osobowych. Sprawdź ustawienia prywatności wybranego narzędzia.
6. Faktyczne rejestracje wymagają osobnej integracji/raportów partnera; `affiliate_outbound_click` mierzy jedynie przejście. Nie ma API, bazy ani aktywnej integracji GA4.
7. Zdjęcia kart proponowanych to `src/assets/suggested/profil-01.webp` … `profil-10.webp`. Podmień plik o tej samej nazwie (portret 300×400, WebP, mocne rozmycie) albo zaktualizuj importy w `src/components/dating/landing.tsx`. Karty nie mają imion, wieku ani lokalizacji i nie należy ich tak podpisywać.

## Raportowanie
W narzędziu porównuj odsłony, kliknięcia CTA i przejścia w podziale na `source`, `utm_medium`, `utm_campaign`, `device`, `variant_id`. CTR = `hero_cta_click` / `page_view` × 100%. Porównania prowadź na poziomie wizyt; adapter aktualnie emituje tylko zdarzenia, nie przechowuje raportów. Źródło pochodzi z oczyszczonych parametrów UTM; bez UTM ma wartość `unknown`.

## Eksperymenty
Ustaw jeden `ACTIVE_EXPERIMENT`: `ctaplace`, `headline`, `cta`, `profile`, `order` albo `secondary`; `none` wyłącza test. Wariant pozostaje stały w aktualnej wizycie SPA, a pełne odświeżenie zaczyna nową wizytę bez trwałego zapisu. Nagłówki i teksty CTA znajdują się w konfiguracji.

Test wygrywa sam, gdy zostaną spełnione oba warunki z `EXPERIMENT_RULES` w `src/config/site.ts`:
1. każdy wariant zbierze min. `minVisitsPerVariant` wizyt (obecnie 100),
2. przedział 95% odsetka wyjść prowadzącego leży całkowicie ponad przedziałem drugiego wariantu.

Wtedy serwer zapisuje decyzję i od tej chwili nowym wizytom pokazuje tylko zwycięski wariant; panel `/statystyki` pokazuje status („jeszcze za mało danych”, „różnica niewystarczająca” albo „test zakończony”). Aby uruchomić nowy test, zmień `ACTIVE_EXPERIMENT` na inną nazwę. Ponowne uruchomienie tego samego testu wymaga usunięcia zapisanej decyzji — poproś o to. Bez danych nie ma zwycięzcy.

## Zakres inspiracji
Sprawdzono stronę referencyjną: ukryty profil i krótka ścieżka do rejestracji. Nie przeniesiono jej nazwy, tekstów, danych osób, liczników, procentów ani oczekujących wiadomości. Projekt używa własnej identyfikacji, kompozycji i tekstów.