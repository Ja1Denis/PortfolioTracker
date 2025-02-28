import React from 'react';
import styles from './CashDetailsModal.module.css';

const CashDetailsModal = ({ cash, onClose }) => {
  const formatCurrency = (value, currency) => {
    return new Intl.NumberFormat('hr-HR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Grupiraj gotovinu po valuti
  const cashByCurrency = cash.reduce((acc, item) => {
    if (!acc[item.currency]) {
      acc[item.currency] = 0;
    }
    acc[item.currency] += item.amount;
    return acc;
  }, {});

  // Izračunaj ukupnu vrijednost (zasad samo zbrajamo, kasnije dodati konverziju)
  const totalValue = Object.values(cashByCurrency).reduce((a, b) => a + b, 0);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        
        <h2 className={styles.title}>Detalji Gotovine</h2>
        
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>Ukupna Vrijednost</h3>
            <p>{formatCurrency(totalValue, 'EUR')}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Broj Valuta</h3>
            <p>{Object.keys(cashByCurrency).length}</p>
          </div>
        </div>

        <div className={styles.section}>
          <h3>Raspodjela po Valutama</h3>
          <div className={styles.currencyList}>
            {Object.entries(cashByCurrency).map(([currency, amount]) => (
              <div key={currency} className={styles.currencyItem}>
                <div className={styles.currencyInfo}>
                  <span className={styles.currencyName}>{currency}</span>
                  <span className={styles.currencyAmount}>
                    {formatCurrency(amount, currency)}
                  </span>
                </div>
                <div className={styles.percentageBar}>
                  <div 
                    className={styles.percentageFill}
                    style={{ width: `${(amount / totalValue) * 100}%` }}
                  />
                </div>
                <span className={styles.percentage}>
                  {((amount / totalValue) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashDetailsModal;
