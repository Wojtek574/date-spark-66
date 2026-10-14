# Konfiguracja przed publikacją

## Działa bez usług zewnętrznych
- Landing 18+, ukryty abstrakcyjny podgląd bez zdjęć kobiet, fikcyjnych profili i wiadomości.
- Wspólne CTA prowadzące do linku partnera, opcjonalny wybór wieku, zamykany pasek mobilny.
- Zgoda na pomiar i zdarzenia przeglądarkowe; bez skryptu GA4, cookies, localStorage ani danych profilowych.
- Pojedynczy test A/B przypisany w pamięci bieżącej wizyty, domyślnie wyłączony.
- Osobne strony informacji i raportowania; raport nie przedstawia żadnych wymyślonych wyników.

## Wymaga właściciela
1. `AFFILIATE_URL` jest ustawiony na `https://analise.click/a/0RWnF2gKoio9KZ`. Potwierdź u partnera, że adres jest aktualny i że przejście jest poprawnie rozliczane.
2. Ustaw `CANONICAL_URL` na docelowy adres domeny. Obecnie tag canonical jest pominięty.
3. Dostarcz prawdziwe dokumenty prywatności/cookies, kontakt oraz ewentualny regulamin. Ustaw adresy dokumentów w `site.documents`. Nie publikuj brakujących dokumentów jako polityk prawnych.
4. Potwierdź u partnera funkcje, ceny i zasady; obecna treść nie obiecuje bezpłatności, dopasowania ani odpowiedzi.
5. Podłącz narzędzie analityczne: załaduj je dopiero po zgodzie i nasłuchuj `miedzy-nami:analytics`. `ANALYTICS_CONFIG` samo niczego nie uruchamia. Nie przesyłaj automatycznie pełnego URL, referrera, wieku ani danych osobowych. Sprawdź ustawienia prywatności wybranego narzędzia.
6. Faktyczne rejestracje wymagają osobnej integracji/raportów partnera; `affiliate_outbound_click` mierzy jedynie przejście. Nie ma API, bazy ani aktywnej integracji GA4.

## Raportowanie
W narzędziu porównuj odsłony, kliknięcia CTA i przejścia w podziale na `source`, `utm_medium`, `utm_campaign`, `device`, `variant_id`. CTR = `hero_cta_click` / `page_view` × 100%. Porównania prowadź na poziomie wizyt; adapter aktualnie emituje tylko zdarzenia, nie przechowuje raportów. Źródło pochodzi z oczyszczonych parametrów UTM; bez UTM ma wartość `unknown`.

## Eksperymenty
Ustaw jeden `ACTIVE_EXPERIMENT`: `headline`, `cta`, `profile`, `order` albo `secondary`; `none` wyłącza test. Wariant pozostaje stały w aktualnej wizycie SPA, a pełne odświeżenie zaczyna nową wizytę bez trwałego zapisu. Nagłówki i teksty CTA znajdują się w konfiguracji. Ustal długość testu, minimalną próbę oraz metodę oceny przed startem. Bez danych nie ma zwycięzcy.

## Zakres inspiracji
Sprawdzono stronę referencyjną: ukryty profil i krótka ścieżka do rejestracji. Nie przeniesiono jej nazwy, tekstów, danych osób, liczników, procentów ani oczekujących wiadomości. Projekt używa własnej identyfikacji, kompozycji i tekstów.