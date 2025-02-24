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
