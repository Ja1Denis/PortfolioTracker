# Portfolio Tracker - Upute za Izgradnju Windows Aplikacije

## 📋 Preduvjeti

Prije početka, osigurajte da imate instalirano:
- [Node.js](https://nodejs.org/) (preporučena verzija 18.x ili novija)
- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/) ili drugi editor
- [API ključeve](#-api-ključevi)

## 🗂️ Struktura Projekta

```
portfolio-tracker/
├── 📁 src/
│   ├── 📁 components/      # React komponente
│   ├── 📁 services/        # API servisi
│   ├── 📄 App.js          # Glavna komponenta
│   └── 📄 index.js        # Entry point
├── 📄 main.js             # Electron konfiguracija
├── 📄 package.json        # NPM konfiguracija
└── 📄 .env               # API ključevi
```

## 🔑 API Ključevi

1. **Google Gemini API**
   - Posjetite [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Kreirajte novi API ključ
   - Kopirajte ključ u `.env` datoteku:
     ```
     REACT_APP_GEMINI_API_KEY=vaš_gemini_ključ
     ```

2. **Perplexity API**
   - Posjetite [Perplexity](https://www.perplexity.ai/settings/api)
   - Generirajte novi API ključ
   - Kopirajte ključ u `.env` datoteku:
     ```
     REACT_APP_PERPLEXITY_API_KEY=vaš_perplexity_ključ
     ```

## 📥 Instalacija

1. **Klonirajte repozitorij**
   ```bash
   git clone https://github.com/Ja1Denis/PortfolioTracker.git
   cd portfolio-tracker
   ```

2. **Instalirajte dependencies**
   ```bash
   npm install
   ```

3. **Dodajte Electron dependencies**
   ```bash
   npm install --save-dev electron electron-builder concurrently wait-on
   ```

## ⚙️ Konfiguracija za Windows Aplikaciju

1. **Dodajte main.js u root direktorij**
   ```javascript
   const { app, BrowserWindow } = require('electron')
   const path = require('path')
   const isDev = require('electron-is-dev')

   function createWindow() {
     const win = new BrowserWindow({
       width: 1200,
       height: 800,
       webPreferences: {
         nodeIntegration: true,
         contextIsolation: false
       }
     })

     win.loadURL(
       isDev
         ? 'http://localhost:3000'
         : `file://${path.join(__dirname, '../build/index.html')}`
     )
   }

   app.whenReady().then(createWindow)

   app.on('window-all-closed', () => {
     if (process.platform !== 'darwin') {
       app.quit()
     }
   })

   app.on('activate', () => {
     if (BrowserWindow.getAllWindows().length === 0) {
       createWindow()
     }
   })
   ```

2. **Ažurirajte package.json**
   Dodajte sljedeće u postojeći package.json:
   ```json
   {
     "main": "main.js",
     "scripts": {
       "electron-dev": "concurrently \"BROWSER=none npm start\" \"wait-on http://localhost:3000 && electron .\"",
       "electron-pack": "electron-builder -c.extraMetadata.main=build/electron.js",
       "preelectron-pack": "npm run build"
     },
     "build": {
       "appId": "com.denissakac.portfoliotracker",
       "files": [
         "build/**/*",
         "node_modules/**/*"
       ],
       "directories": {
         "buildResources": "assets"
       },
       "win": {
         "target": ["nsis"]
       }
     }
   }
   ```

## 🚀 Razvoj i Testiranje

1. **Pokrenite aplikaciju u development modu**
   ```bash
   npm run electron-dev
   ```

2. **Testirajte funkcionalnosti**
   - Dodavanje dionica
   - Dodavanje gotovine
   - Pregled portfelja
   - Analiza trendova

## 📦 Build Windows Aplikacije

1. **Izradite produkcijski build**
   ```bash
   npm run electron-pack
   ```

2. **Pronađite instalacijski program**
   - Nakon uspješnog builda, instalacijski program će biti u `dist` folderu
   - Ime: `PortfolioTracker Setup.exe`

## 🔍 Važne Napomene

- **Lokalno Spremanje**: Aplikacija koristi localStorage za spremanje podataka
- **Internet Veza**: Potrebna za dohvat cijena dionica
- **API Ključevi**: Čuvajte ih sigurno i ne dijelite s drugima
- **Ažuriranja**: Redovito provjeravajte GitHub za nova ažuriranja

## 🐛 Rješavanje Problema

1. **Greška pri instalaciji paketa**
   ```bash
   npm cache clean --force
   npm install
   ```

2. **Greška pri buildanju**
   - Provjerite jesu li svi dependencies instalirani
   - Provjerite imate li najnoviju verziju Node.js

## 📞 Podrška

- GitHub Issues: [Portfolio Tracker Issues](https://github.com/Ja1Denis/PortfolioTracker/issues)
- Web: [denissakac.com](https://denissakac.com)
- Facebook: [Denis Sakač](https://www.facebook.com/sdenis.vr)
