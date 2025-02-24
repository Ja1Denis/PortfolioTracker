import React, { useState } from 'react';
import styles from './AddNewStock.module.css';

const AddNewStock = ({ onAddNewStock }) => {
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [initialPrice, setInitialPrice] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (symbol && name && initialPrice) {
      onAddNewStock({
        symbol: symbol.toUpperCase(),
        name,
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
            <input
              type="number"
              value={initialPrice}
              onChange={(e) => setInitialPrice(e.target.value)}
              placeholder="Početna cijena (EUR)"
              className={styles.input}
              required
              min="0"
              step="0.01"
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Spremi dionicu
          </button>
        </form>
      )}
    </div>
  );
};

export default AddNewStock;
