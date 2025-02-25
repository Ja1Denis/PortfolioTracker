import React from 'react';
import styles from './StockDetails.module.css';

const StockDetails = ({ stock, onClose, isOpen }) => {
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
        </div>
      </div>
    </div>
  );
};

export default StockDetails;
