# Portfolio Tracker

## Opis
Portfolio Tracker je moderna React aplikacija koja omogućuje korisnicima praćenje portfelja dionica na Zagrebačkoj burzi. Aplikacija integrira stvarne podatke o cijenama dionica putem Perplexity API-ja, pružajući korisnicima ažurirane informacije o njihovim ulaganjima.

## Ključne značajke
- Odabir i dodavanje dionica iz predefiniranog popisa
- Prikaz ukupne vrijednosti portfelja
- Automatsko osvježavanje cijena dionica svakih 2 sata
- Ručno osvježavanje podataka
- Detaljan prikaz pojedinačnih dionica kroz modal
- Napredni grafički prikazi:
  * Kombinirani stupčasti i linijski dijagrami
  * Prilagođeni tooltipovi s formatiranim datumima
  * Prikaz povijesti cijena za svaku dionicu
- Praćenje vremena zadnjeg i sljedećeg osvježavanja
- Integracija Gemini AI za analizu i preporuke ulaganja
- Responzivni dizajn i moderan korisnički interfejs
- Detaljno logiranje i error handling

## Kako pokrenuti aplikaciju
1. Klonirajte repozitorij:
   ```bash
   git clone <URL>
   ```
2. Instalirajte potrebne pakete:
   ```bash
   npm install
   ```
3. Pokrenite server:
   ```bash
   npm run server
   ```
4. Pokrenite aplikaciju:
   ```bash
   npm start
   ```

## Tehnologije
- React
- Chart.js
- Express
- Perplexity API
- Gemini API
- Axios
- CSS Modules
- localStorage za pohranu povijesti cijena

## Autor
Denis Sakač
