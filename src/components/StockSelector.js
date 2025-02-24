import React, { useState } from 'react';
import styles from './StockSelector.module.css';

const StockSelector = ({ onAddStock, availableStocks }) => {
  const [selectedStock, setSelectedStock] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedStock && quantity > 0) {
      onAddStock({ symbol: selectedStock, quantity: parseInt(quantity) });
      setSelectedStock("");
      setQuantity("");
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <select 
          className={styles.select}
          value={selectedStock} 
          onChange={(e) => setSelectedStock(e.target.value)}
          required
        >
          <option value="">Odaberite dionicu</option>
          {Object.entries(availableStocks).map(([symbol, name]) => (
            <option key={symbol} value={symbol}>
              {name} ({symbol})
            </option>
          ))}
        </select>
        <input
          className={styles.input}
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Broj dionica"
          min="1"
          required
        />
        <button className={styles.button} type="submit">
          Dodaj dionicu
        </button>
      </form>
    </div>
  );
};

export default StockSelector;
