import React, { useState } from 'react';
import styles from './PortfolioSummary.module.css';
import StockDetailsModal from './StockDetailsModal';
import CashDetailsModal from './CashDetailsModal';

const formatCurrency = (value, currency = 'EUR') => {
  return new Intl.NumberFormat('hr-HR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

const PortfolioSummary = ({ 
  portfolio, 
  cash, 
  totalValue, 
  lastUpdate, 
  nextUpdate, 
  onRefresh, 
  isLoading,
  stocksHistory,
  onRemoveStock,
  onRemoveCash,
  onUpdateCash
}) => {
  const [selectedStock, setSelectedStock] = useState(null);
  const [showCashDetails, setShowCashDetails] = useState(false);

  // Grupiranje dionica po tržištu
  const stocksByMarket = portfolio.reduce((acc, stock) => {
    const market = stock.market || 'ZSE';
    if (!acc[market]) {
      acc[market] = [];
    }
    acc[market].push(stock);
    return acc;
  }, {});

  // Izračun ukupne vrijednosti po tržištu
  const marketTotals = Object.entries(stocksByMarket).reduce((acc, [market, stocks]) => {
    acc[market] = stocks.reduce((total, stock) => {
      return {
        value: total.value + (stock.value || 0),
        currency: stock.currency || 'EUR'
      };
    }, { value: 0, currency: stocks[0]?.currency || 'EUR' });
    return acc;
  }, {});

  // Sortiranje tržišta po abecedi
  const sortedMarkets = Object.keys(stocksByMarket).sort();

  // Funkcija za otvaranje modala s detaljima
  const handleStockClick = (stock) => {
    setSelectedStock(stock);
  };

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

      {sortedMarkets.map((market) => (
        <div key={market} className={styles.marketSection}>
          <h3>{market}</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Simbol</th>
                <th>Količina</th>
                <th>Cijena</th>
                <th>Vrijednost</th>
                <th>Akcije</th>
              </tr>
            </thead>
            <tbody>
              {stocksByMarket[market].map(stock => (
                <tr 
                  key={`${market}-${stock.symbol}`}
                  onClick={() => handleStockClick(stock)}
                  className={styles.stockRow}
                >
                  <td>{stock.symbol}</td>
                  <td>{stock.quantity}</td>
                  <td>{formatCurrency(stock.price || 0, stock.currency || 'EUR')}</td>
                  <td>{formatCurrency(stock.value || 0, stock.currency || 'EUR')}</td>
                  <td>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveStock(stock);
                      }}
                      className={styles.removeButton}
                    >
                      Ukloni
                    </button>
                  </td>
                </tr>
              ))}
              <tr className={styles.marketTotal}>
                <td colSpan="3">Ukupno {market}</td>
                <td colSpan="2">{formatCurrency(marketTotals[market].value, marketTotals[market].currency)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}

      {cash && cash.length > 0 && (
        <div className={styles.marketSection}>
          <h3>Gotovina</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Valuta</th>
                <th>Iznos</th>
                <th>Akcije</th>
              </tr>
            </thead>
            <tbody>
              {cash.map((item, index) => (
                <tr 
                  key={index}
                  onClick={() => setShowCashDetails(true)}
                  className={styles.stockRow}
                >
                  <td>{item.currency}</td>
                  <td>{formatCurrency(item.amount, item.currency)}</td>
                  <td>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveCash(index);
                      }}
                      className={styles.removeButton}
                    >
                      Ukloni
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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

      {selectedStock && (
        <StockDetailsModal 
          stock={selectedStock}
          onClose={() => setSelectedStock(null)}
          history={stocksHistory[selectedStock.symbol]}
        />
      )}

      {showCashDetails && (
        <CashDetailsModal
          cash={cash}
          onClose={() => setShowCashDetails(false)}
          onUpdateCash={onUpdateCash}
        />
      )}
    </div>
  );
};

export default PortfolioSummary;
