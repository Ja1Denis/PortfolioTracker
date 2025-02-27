import React, { useState, useEffect } from 'react';
import styles from './ApiSettings.module.css';

const ApiSettings = () => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    const savedKey = localStorage.getItem('perplexityApiKey');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('perplexityApiKey', apiKey);
    setSaveStatus('API ključ je uspješno spremljen!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const toggleShowKey = () => {
    setShowKey(!showKey);
  };

  return (
    <div className={styles.container}>
      <h2>Postavke API-ja</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="apiKey">Perplexity API Ključ:</label>
          <div className={styles.inputWrapper}>
            <input
              type={showKey ? 'text' : 'password'}
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Unesite vaš API ključ"
              className={styles.input}
            />
            <button
              type="button"
              onClick={toggleShowKey}
              className={styles.toggleButton}
            >
              {showKey ? '🙈' : '👁️'}
            </button>
          </div>
        </div>
        <button type="submit" className={styles.submitButton}>
          Spremi API Ključ
        </button>
      </form>
      {saveStatus && <div className={styles.status}>{saveStatus}</div>}
    </div>
  );
};

export default ApiSettings;
