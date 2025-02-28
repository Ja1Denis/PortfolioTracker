import React, { useState } from 'react';
import styles from './CashDetailsModal.module.css';

const CashDetailsModal = ({ cash, onClose, onUpdateCash }) => {
  const [editAmount, setEditAmount] = useState(null);
  const [tempAmount, setTempAmount] = useState('');

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
      acc[item.currency] = {
        amount: 0,
        items: []
      };
    }
    acc[item.currency].amount += item.amount;
    acc[item.currency].items.push(item);
    return acc;
  }, {});

  // Izračunaj ukupnu vrijednost (zasad samo zbrajamo, kasnije dodati konverziju)
  const totalValue = Object.values(cashByCurrency).reduce((a, b) => a + b.amount, 0);

  const handleStartEdit = (currency, amount) => {
    setEditAmount(currency);
    setTempAmount(amount.toString());
  };

  const handleSaveEdit = (currency) => {
    const newAmount = parseFloat(tempAmount);
    if (!isNaN(newAmount) && newAmount >= 0) {
      const items = cashByCurrency[currency].items;
      const oldTotal = items.reduce((sum, item) => sum + item.amount, 0);
      const difference = newAmount - oldTotal;
      
      if (difference !== 0) {
        onUpdateCash(currency, difference);
      }
    }
    setEditAmount(null);
    setTempAmount('');
  };

  const handleQuickUpdate = (currency, amount) => {
    onUpdateCash(currency, amount);
  };

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
            {Object.entries(cashByCurrency).map(([currency, data]) => (
              <div key={currency} className={styles.currencyItem}>
                <div className={styles.currencyInfo}>
                  <span className={styles.currencyName}>{currency}</span>
                  {editAmount === currency ? (
                    <div className={styles.editControls}>
                      <input
                        type="number"
                        value={tempAmount}
                        onChange={(e) => setTempAmount(e.target.value)}
                        className={styles.amountInput}
                        autoFocus
                        step="0.01"
                      />
                      <button 
                        className={styles.saveButton}
                        onClick={() => handleSaveEdit(currency)}
                      >
                        ✓
                      </button>
                      <button 
                        className={styles.cancelButton}
                        onClick={() => setEditAmount(null)}
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className={styles.amountControls}>
                      <span 
                        className={styles.currencyAmount}
                        onClick={() => handleStartEdit(currency, data.amount)}
                      >
                        {formatCurrency(data.amount, currency)}
                      </span>
                      <div className={styles.quickButtons}>
                        <button 
                          className={styles.quickButton}
                          onClick={() => handleQuickUpdate(currency, -100)}
                        >
                          -100
                        </button>
                        <button 
                          className={styles.quickButton}
                          onClick={() => handleQuickUpdate(currency, 100)}
                        >
                          +100
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className={styles.percentageBar}>
                  <div 
                    className={styles.percentageFill}
                    style={{ width: `${(data.amount / totalValue) * 100}%` }}
                  />
                </div>
                <span className={styles.percentage}>
                  {((data.amount / totalValue) * 100).toFixed(1)}%
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
