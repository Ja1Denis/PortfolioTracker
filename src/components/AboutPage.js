import React from 'react';
import styles from './AboutPage.module.css';

const AboutPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>O Portfolio Tracker Aplikaciji</h1>
      
      <section className={styles.section}>
        <h2>Što je Portfolio Tracker?</h2>
        <p>
          Portfolio Tracker je moderna web aplikacija za praćenje i analizu vašeg investicijskog portfelja.
          Omogućuje vam jednostavno praćenje dionica i gotovine na jednom mjestu, s automatskim ažuriranjem
          cijena i vizualnim prikazom vaših ulaganja.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Glavne Značajke</h2>
        <div className={styles.featureGrid}>
          <div className={styles.feature}>
            <h3>🎯 Praćenje Portfelja</h3>
            <p>Pratite svoje dionice i gotovinu u stvarnom vremenu</p>
          </div>
          <div className={styles.feature}>
            <h3>📊 Vizualizacija</h3>
            <p>Pregledni grafikoni za analizu raspodjele imovine</p>
          </div>
          <div className={styles.feature}>
            <h3>💱 Više Valuta</h3>
            <p>Podrška za različite valute i automatska konverzija</p>
          </div>
          <div className={styles.feature}>
            <h3>📈 Povijest Cijena</h3>
            <p>Praćenje povijesnih cijena i performansi</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Postavljanje API Ključeva</h2>
        <div className={styles.apiGuide}>
          <div className={styles.apiCard}>
            <h3>🤖 Google Gemini API</h3>
            <ol className={styles.apiSteps}>
              <li>Posjetite <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a></li>
              <li>Prijavite se s Google računom</li>
              <li>Kliknite na "Get API key"</li>
              <li>Kopirajte generirani API ključ</li>
              <li>U aplikaciji, kliknite na "API Postavke"</li>
              <li>Zalijepite ključ u polje "Gemini API Key"</li>
            </ol>
            <div className={styles.apiNote}>
              <strong>Napomena:</strong> Gemini API se koristi za analizu tržišta i predviđanje trendova.
            </div>
          </div>

          <div className={styles.apiCard}>
            <h3>🧠 Perplexity API</h3>
            <ol className={styles.apiSteps}>
              <li>Posjetite <a href="https://www.perplexity.ai/settings/api" target="_blank" rel="noopener noreferrer">Perplexity API Dashboard</a></li>
              <li>Kreirajte račun ili se prijavite</li>
              <li>U postavkama odaberite "API Keys"</li>
              <li>Kliknite "Create API Key"</li>
              <li>U aplikaciji, kliknite na "API Postavke"</li>
              <li>Zalijepite ključ u polje "Perplexity API Key"</li>
            </ol>
            <div className={styles.apiNote}>
              <strong>Napomena:</strong> Perplexity API se koristi za dohvaćanje trenutnih cijena dionica i tržišnih informacija.
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Kako Koristiti</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <span className={styles.stepNumber}>1</span>
            <h3>Dodajte Dionice</h3>
            <p>Koristite "Nova Dionica" za dodavanje novih dionica u bazu</p>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNumber}>2</span>
            <h3>Upravljajte Portfeljem</h3>
            <p>Dodajte dionice u portfelj i pratite njihovu vrijednost</p>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNumber}>3</span>
            <h3>Pratite Gotovinu</h3>
            <p>Dodajte i upravljajte gotovinom u različitim valutama</p>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNumber}>4</span>
            <h3>Analizirajte</h3>
            <p>Koristite grafikone za analizu raspodjele i performansi</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Tehnički Detalji</h2>
        <ul className={styles.techList}>
          <li>Izrađeno s React.js</li>
          <li>Real-time ažuriranje cijena</li>
          <li>Lokalno spremanje podataka</li>
          <li>Responzivan dizajn</li>
          <li>Integracija s Gemini AI</li>
          <li>Perplexity API za podatke</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>O Autoru</h2>
        <div className={styles.authorCard}>
          <div className={styles.authorInfo}>
            <h3>Denis Sakač</h3>
            <p>AI prompt kuhar</p>
            <div className={styles.authorLinks}>
              <a 
                href="https://denissakac.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.authorLink}
              >
                🌐 denissakac.com
              </a>
              <a 
                href="https://www.facebook.com/sdenis.vr" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.authorLink}
              >
                📱 Facebook
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
