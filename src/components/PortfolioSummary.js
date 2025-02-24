import React from 'react';
import styles from './PortfolioSummary.module.css';

const PortfolioSummary = ({ portfolio, totalValue, onRemoveStock }) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        Ukupna vrijednost portfelja: <span className={totalValue >= 0 ? styles.positive : styles.negative}>
          {totalValue.toFixed(2)} €
        </span>
      </h2>
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
              <tr key={`${stock.symbol}-${index}`}>
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
                    onClick={() => onRemoveStock(index)}
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
  );
};

export default PortfolioSummary;
