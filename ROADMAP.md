# Roadmap za Portfolio Tracker

## 1. React Charting Libraries
- **Chart.js**: Jednostavna i fleksibilna biblioteka za izradu grafikonova. Podržava različite vrste grafikonova kao što su linijski, stupčasti, tortni i još mnogo toga.
- **Recharts**: Popularna biblioteka za izradu grafikonova koja je izgrađena na Reactu i D3.js. Pruža jednostavno sučelje za izradu složenih grafikonova.
- **Victory**: Moćna biblioteka za izradu grafikonova koja nudi visoku razinu prilagodljivosti i podršku za različite vrste grafikonova.

## 2. Data Fetching
- **Axios**: Biblioteka za HTTP zahtjeve koja će vam omogućiti dohvaćanje povijesnih podataka o cijenama dionica s API-ja.

## 3. State Management
- **Redux**: Za upravljanje stanjem aplikacije, posebno ako želite pohraniti povijesne podatke o cijenama dionica i podatke o grafikonima.

## 4. Styling
- **Styled Components**: Za stiliziranje komponenti grafikonova i osiguravanje responzivnog dizajna.

## 5. Dodatne funkcionalnosti
1. **Dodavanje grafikona**: Implementirajte grafikone koji prikazuju povijest cijena dionica i trendove. Ovo bi korisnicima pružilo bolji uvid u njihova ulaganja.
2. **Notifikacije**: Dodajte sustav notifikacija koji će obavještavati korisnike o značajnim promjenama u cijenama dionica ili postizanju određenih ciljeva.
3. **Analiza rizika**: Implementirajte alat za analizu rizika koji će korisnicima pružati informacije o rizicima povezanim s njihovim portfeljom.
4. **Integracija s drugim burzama**: Proširite aplikaciju tako da podržava praćenje dionica s drugih burzi, ne samo Zagrebačke burze.
5. **Korisnički profil**: Dodajte mogućnost kreiranja korisničkog profila gdje korisnici mogu spremiti svoje postavke i povijest ulaganja.
6. **Mobilna aplikacija**: Razmislite o razvoju mobilne aplikacije kako bi korisnici mogli pratiti svoje ulaganja i na mobilnim uređajima.
7. **Sigurnosna poboljšanja**: Implementirajte dodatne sigurnosne mjere kao što su dvofaktorska autentifikacija i enkripcija osjetljivih podataka.

## Planirane funkcionalnosti

### 1. Osnovni podaci
- [x] Broj dionica u portfelju
- [x] Trenutna cijena
- [x] Ukupna vrijednost pozicije
- [ ] Prosječna cijena kupnje
- [ ] P/L (Profit/Loss) u postotku i apsolutnom iznosu

### 2. Dividende
- [ ] Povijest isplaćenih dividendi
- [ ] Dividend yield
- [ ] Ex-dividend datumi
- [ ] Predviđanja budućih dividendi

### 3. Tehnička analiza
- [ ] RSI indikator
- [ ] Moving averages (50, 200 dana)
- [ ] Volume analiza
- [ ] Support/Resistance razine

### 4. Fundamentalna analiza
- [ ] P/E ratio
- [ ] Market cap
- [ ] Book value
- [ ] Debt/Equity ratio

### 5. Vizualizacije
- [x] Linijski grafikon povijesti cijena
- [x] Više timeframe-ova (1M, 3M, 6M, 1Y)
- [ ] Volume bars ispod grafikona
- [ ] Candlestick opcija za prikaz
- [ ] Mogućnost dodavanja indikatora na grafikon

### 6. Novosti i analize
- [ ] Zadnje vijesti vezane uz dionicu
- [ ] Analitička izvješća
- [ ] Sentiment analiza vijesti

### 7. Usporedbe
- [ ] Usporedba s indeksom (CROBEX)
- [ ] Usporedba s konkurencijom iz istog sektora
- [ ] Sector performance

### 8. Risk management
- [ ] Stop-loss preporuke
- [ ] Position sizing analiza
- [ ] Portfolio exposure warning

### 9. Interaktivnost
- [ ] Mogućnost dodavanja bilješki za dionicu
- [ ] Postavljanje price alertova
- [ ] Dodavanje na watchlistu

### 10. Export opcije
- [ ] PDF izvještaj za dionicu
- [ ] Excel export trgovanja
- [ ] Porezni izvještaj za dividende

## Koraci za implementaciju:
1. **Instalirajte potrebne biblioteke:**
   ```bash
   npm install chart.js recharts victory axios redux styled-components
   ```
2. **Dohvaćanje podataka:**
   - Koristite Axios za dohvaćanje povijesnih podataka o cijenama dionica s Perplexity API-ja.
3. **Izrada komponente grafikona:**
   - Koristite odabranu biblioteku za izradu grafikonova (npr. Chart.js, Recharts ili Victory) kako biste stvorili komponentu koja će prikazivati podatke.
4. **Integracija s aplikacijom:**
   - Integrirajte komponentu grafikona u postojeću aplikaciju, osiguravajući da se podaci osvježavaju u stvarnom vremenu.

## Tehnička implementacija

### UI/UX
- [x] Modal za prikaz detalja dionice
- [ ] Tabs za organizaciju različitih sekcija informacija
- [ ] Responsive dizajn za mobile view
- [ ] Lazy loading za optimizaciju performansi

### Optimizacije
- [ ] Cachiranje podataka
- [ ] Optimizacija API poziva
- [ ] Poboljšanje performansi grafikona
