import React, { useState, useEffect } from 'react';
import styles from './StockDetails.module.css';
import StockPriceChart from './StockPriceChart';
import { getStockPriceHistory } from '../services/stockHistoryService';

const StockDetails = ({ stock, onClose, isOpen }) => {
  const [priceHistory, setPriceHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPriceHistory = async () => {
      if (!stock?.symbol) return;
      
      setIsLoading(true);
      setError(null);
      try {
        const history = await getStockPriceHistory(stock.symbol);
        setPriceHistory(history);
      } catch (err) {
        setError('Greška pri dohvaćanju povijesti cijena');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchPriceHistory();
    }
  }, [stock?.symbol, isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{stock.symbol}</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.content}>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label>Broj dionica</label>
              <span>{stock.quantity}</span>
            </div>
            <div className={styles.infoItem}>
              <label>Trenutna cijena</label>
              <span>{stock.price.toFixed(2)}€</span>
            </div>
            <div className={styles.infoItem}>
              <label>Ukupna vrijednost</label>
              <span>{(stock.price * stock.quantity).toFixed(2)}€</span>
            </div>
          </div>

          {isLoading ? (
            <div className={styles.loadingContainer}>
              <span className={styles.loadingText}>Učitavanje povijesti cijena...</span>
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <span className={styles.errorText}>{error}</span>
            </div>
          ) : (
            <StockPriceChart 
              symbol={stock.symbol}
              priceHistory={priceHistory}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StockDetails;
