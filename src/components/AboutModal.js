import React from 'react';
import styles from './AboutModal.module.css';
import { FaGithub, FaFacebook, FaInfoCircle } from 'react-icons/fa';

const AboutModal = ({ onClose }) => {
  // Zatvori modal na Escape tipku
  React.useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  // Zatvori modal na klik izvan modala
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        
        <div className={styles.header}>
          <FaInfoCircle className={styles.icon} />
          <h2>O Aplikaciji</h2>
        </div>

        <div className={styles.section}>
          <h3>Kako koristiti aplikaciju?</h3>
          <ol className={styles.instructions}>
            <li>Postavite API ključeve u postavkama (Perplexity API ili Gemini API)</li>
            <li>Dodajte dionice u svoj portfelj koristeći formu za unos</li>
            <li>Odaberite tržište za svaku dionicu (ZSE, NYSE, NASDAQ, itd.)</li>
            <li>Pratite vrijednost svog portfelja i povijesne podatke na grafikonu</li>
            <li>Koristite gumb za osvježavanje da ažurirate cijene ručno</li>
          </ol>
        </div>

        <div className={styles.section}>
          <h3>Značajke</h3>
          <ul className={styles.instructions}>
            <li>Praćenje dionica s više tržišta (ZSE, NYSE, NASDAQ, LSE, FRA)</li>
            <li>Automatsko osvježavanje cijena svaka 2 sata</li>
            <li>Grafički prikaz povijesti cijena</li>
            <li>Podrška za više valuta (EUR, USD, GBP)</li>
            <li>Responzivan dizajn za sve uređaje</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h3>Autor</h3>
          <div className={styles.authorInfo}>
            <img 
              src="https://via.placeholder.com/100" 
              alt="Denis Sakač" 
              className={styles.avatar}
            />
            <div>
              <p><strong>Denis Sakač</strong></p>
              <div className={styles.socialLinks}>
                <a 
                  href="https://www.facebook.com/denis.sakac" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  <FaFacebook /> Facebook
                </a>
              </div>
            </div>
          </div>
        </div>

        <footer className={styles.footer}>
          <p>© {new Date().getFullYear()} Portfolio Tracker - Sva prava pridržana</p>
        </footer>
      </div>
    </div>
  );
};

export default AboutModal;
