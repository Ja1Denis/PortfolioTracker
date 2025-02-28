import React from 'react';
import styles from './PortfolioSummary.module.css';

const formatCurrency = (value, currency = 'EUR') => {
  return new Intl.NumberFormat('hr-HR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

const PortfolioSummary = ({ portfolio, totalValue, lastUpdate, nextUpdate, onRefresh, isLoading }) => {
  // Grupiranje dionica po tržištu
  const stocksByMarket = portfolio.reduce((acc, stock) => {
    if (!acc[stock.market]) {
      acc[stock.market] = [];
    }
    acc[stock.market].push(stock);
    return acc;
  }, {});

  // Izračun ukupne vrijednosti po tržištu
  const marketTotals = Object.entries(stocksByMarket).reduce((acc, [market, stocks]) => {
    acc[market] = stocks.reduce((total, stock) => {
      return {
        value: total.value + stock.value,
        currency: stock.currency
      };
    }, { value: 0, currency: stocks[0].currency });
    return acc;
  }, {});

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Pregled Portfelja</h2>
        <button 
          onClick={onRefresh} 
          disabled={isLoading}
          className={styles.refreshButton}
        >
          {isLoading ? 'Osvježavanje...' : 'Osvježi cijene'}
        </button>
      </div>

      {Object.entries(stocksByMarket).map(([market, stocks]) => (
        <div key={market} className={styles.marketSection}>
          <h3>{market}</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Simbol</th>
                <th>Količina</th>
                <th>Cijena</th>
                <th>Vrijednost</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map(stock => (
                <tr key={stock.symbol}>
                  <td>{stock.symbol}</td>
                  <td>{stock.quantity}</td>
                  <td>{formatCurrency(stock.price, stock.currency)}</td>
                  <td>{formatCurrency(stock.value, stock.currency)}</td>
                </tr>
              ))}
              <tr className={styles.marketTotal}>
                <td colSpan="3">Ukupno {market}</td>
                <td>{formatCurrency(marketTotals[market].value, marketTotals[market].currency)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}

      <div className={styles.totalValue}>
        <h3>Ukupna Vrijednost Portfelja</h3>
        <p>{formatCurrency(totalValue, 'EUR')}</p>
      </div>

      <div className={styles.updateInfo}>
        {lastUpdate && (
          <p>Zadnje osvježavanje: {new Date(lastUpdate).toLocaleString('hr-HR')}</p>
        )}
        {nextUpdate && (
          <p>Sljedeće osvježavanje: {new Date(nextUpdate).toLocaleString('hr-HR')}</p>
        )}
      </div>
    </div>
  );
};

export default PortfolioSummary;
