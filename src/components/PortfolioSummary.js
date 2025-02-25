import React, { useState } from 'react';
import styles from './PortfolioSummary.module.css';
import StockDetails from './StockDetails';

const PortfolioSummary = ({ portfolio, totalValue, onRemoveStock, isLoading, lastUpdate, nextUpdate }) => {
  const [selectedStock, setSelectedStock] = useState(null);

  const handleStockClick = (stock) => {
    setSelectedStock(stock);
  };

  const formatDateTime = (date) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('hr-HR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <>
      <div className={styles.container}>
        <h2 className={styles.title}>
          Ukupna vrijednost portfelja: <span className={totalValue >= 0 ? styles.positive : styles.negative}>
            {totalValue.toFixed(2)} €
          </span>
          {isLoading && <span className={styles.loadingIndicator}>Osvježavanje...</span>}
        </h2>
        
        <div className={styles.updateInfo}>
          <p>Zadnje osvježavanje: {formatDateTime(lastUpdate)}</p>
          <p>Sljedeće osvježavanje: {formatDateTime(nextUpdate)}</p>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Simbol</th>
              <th>Ime</th>
              <th>Cijena (EUR)</th>
              <th>Broj dionica</th>
              <th>Ukupna vrijednost (EUR)</th>
              <th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.map((stock, index) => {
              const stockValue = stock.price * stock.quantity;
              return (
                <tr 
                  key={`${stock.symbol}-${index}`}
                  onClick={() => handleStockClick(stock)}
                  className={styles.stockRow}
                >
                  <td>{stock.symbol}</td>
                  <td>{stock.name}</td>
                  <td>{stock.price.toFixed(2)}</td>
                  <td>{stock.quantity}</td>
                  <td className={stockValue >= 0 ? styles.positive : styles.negative}>
                    {stockValue.toFixed(2)}
                  </td>
                  <td>
                    <button 
                      className={styles.removeButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveStock(index);
                      }}
                      title="Ukloni dionicu"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {portfolio.length === 0 && (
          <p className={styles.emptyMessage}>
            Vaš portfelj je prazan. Dodajte dionice koristeći formu iznad.
          </p>
        )}
      </div>

      <StockDetails
        stock={selectedStock}
        isOpen={!!selectedStock}
        onClose={() => setSelectedStock(null)}
      />
    </>
  );
};

export default PortfolioSummary;
