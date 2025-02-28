import React, { useState } from 'react';
import styles from './AddCashForm.module.css';

const AddCashForm = ({ onAdd, onClose }) => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('EUR');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) return;

    onAdd({
      amount: parseFloat(amount),
      currency
    });
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        
        <h2>Dodaj Gotovinu</h2>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="amount">Iznos:</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="currency">Valuta:</label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={styles.select}
            >
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
            </select>
          </div>

          <button type="submit" className={styles.submitButton}>
            Dodaj Gotovinu
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCashForm;
