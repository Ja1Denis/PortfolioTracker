import React, { useState } from 'react';
import styles from './AddNewStock.module.css';

const AVAILABLE_MARKETS = {
  "ZSE": "Zagrebačka burza",
  "NYSE": "New York Stock Exchange",
  "NASDAQ": "NASDAQ",
  "FRA": "Frankfurt Stock Exchange",
  "LSE": "London Stock Exchange"
};

const AddNewStock = ({ onAddNewStock }) => {
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [market, setMarket] = useState('ZSE');
  const [initialPrice, setInitialPrice] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (symbol && name && initialPrice && market) {
      onAddNewStock({
        symbol: symbol.toUpperCase(),
        name,
        market,
        price: parseFloat(initialPrice)
      });
      setSymbol('');
      setName('');
      setInitialPrice('');
      setShowForm(false);
    }
  };

  return (
    <div className={styles.container}>
      <button 
        className={styles.toggleButton}
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Zatvori' : 'Dodaj novu dionicu'}
      </button>
      
      {showForm && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="Simbol dionice (npr. ADPL)"
              className={styles.input}
              required
              maxLength="10"
            />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ime dionice"
              className={styles.input}
              required
            />
            <select
              value={market}
              onChange={(e) => setMarket(e.target.value)}
              className={styles.input}
              required
            >
              {Object.entries(AVAILABLE_MARKETS).map(([code, name]) => (
                <option key={code} value={code}>
                  {name} ({code})
                </option>
              ))}
            </select>
            <input
              type="number"
              value={initialPrice}
              onChange={(e) => setInitialPrice(e.target.value)}
              placeholder="Početna cijena"
              className={styles.input}
              required
              step="0.01"
              min="0"
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Dodaj dionicu
          </button>
        </form>
      )}
    </div>
  );
};

export default AddNewStock;
