import React, { useState, useEffect } from 'react';
import styles from './ApiSettings.module.css';

const ApiSettings = () => {
  const [apiKeys, setApiKeys] = useState({
    perplexity: '',
    gemini: ''
  });
  const [showKeys, setShowKeys] = useState({
    perplexity: false,
    gemini: false
  });
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    const savedPerplexityKey = localStorage.getItem('perplexityApiKey');
    const savedGeminiKey = localStorage.getItem('geminiApiKey');
    
    setApiKeys({
      perplexity: savedPerplexityKey || '',
      gemini: savedGeminiKey || ''
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('perplexityApiKey', apiKeys.perplexity);
    localStorage.setItem('geminiApiKey', apiKeys.gemini);
    setSaveStatus('API ključevi su uspješno spremljeni!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const toggleShowKey = (provider) => {
    setShowKeys(prev => ({
      ...prev,
      [provider]: !prev[provider]
    }));
  };

  const handleKeyChange = (provider, value) => {
    setApiKeys(prev => ({
      ...prev,
      [provider]: value
    }));
  };

  const renderApiKeyInput = (provider, label) => (
    <div className={styles.inputGroup}>
      <label htmlFor={`${provider}Key`}>{label}:</label>
      <div className={styles.inputWrapper}>
        <input
          type={showKeys[provider] ? 'text' : 'password'}
          id={`${provider}Key`}
          value={apiKeys[provider]}
          onChange={(e) => handleKeyChange(provider, e.target.value)}
          placeholder={`Unesite vaš ${label}`}
          className={styles.input}
        />
        <button
          type="button"
          onClick={() => toggleShowKey(provider)}
          className={styles.toggleButton}
        >
          {showKeys[provider] ? '🙈' : '👁️'}
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <h2>Postavke API-ja</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        {renderApiKeyInput('perplexity', 'Perplexity API Ključ')}
        {renderApiKeyInput('gemini', 'Gemini API Ključ')}
        <button type="submit" className={styles.submitButton}>
          Spremi API Ključeve
        </button>
      </form>
      {saveStatus && <div className={styles.status}>{saveStatus}</div>}
    </div>
  );
};

export default ApiSettings;
