import React, { useState } from 'react';
import StockSelector from './components/StockSelector';
import PortfolioSummary from './components/PortfolioSummary';
import AddNewStock from './components/AddNewStock';
import PortfolioChart from './components/PortfolioChart';
import axios from 'axios';
import styles from './App.module.css';

const App = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [availableStocks, setAvailableStocks] = useState({
    "ADPL": "AD PLASTIK d.d.",
    "ARNT": "Arena Hospitality Group d.d.",
    "ATGR": "ATLANTIC GRUPA d.d.",
    "HT": "HT d.d.",
    "PODR": "PODRAVKA d.d.",
    "RIVP": "Valamar Riviera d.d.",
  });

  const [mockPrices, setMockPrices] = useState({
    "ADPL": 185.50,
    "ARNT": 280.00,
    "ATGR": 760.00,
    "HT": 180.00,
    "PODR": 580.00,
    "RIVP": 485.00
  });

  const addNewStock = (newStock) => {
    setAvailableStocks(prev => ({
      ...prev,
      [newStock.symbol]: newStock.name
    }));
    setMockPrices(prev => ({
      ...prev,
      [newStock.symbol]: newStock.price
    }));
  };

  const addStockToPortfolio = async (stock) => {
    try {
      const price = await fetchStockPrice(stock.symbol);
      const stockName = getStockName(stock.symbol);
      const newStock = { ...stock, price, name: stockName };
      setPortfolio(prev => [...prev, newStock]);
      calculateTotalValue([...portfolio, newStock]);
    } catch (error) {
      console.error('Greška pri dohvaćanju cijene dionice:', error);
      alert('Došlo je do greške pri dohvaćanju cijene dionice. Molimo pokušajte ponovno.');
    }
  };

  const removeStockFromPortfolio = (index) => {
    const newPortfolio = portfolio.filter((_, i) => i !== index);
    setPortfolio(newPortfolio);
    calculateTotalValue(newPortfolio);
  };

  const getStockName = (symbol) => {
    return availableStocks[symbol] || symbol;
  };

  const fetchStockPrice = async (symbol) => {
    return mockPrices[symbol] || 100.00;
  };

  const calculateTotalValue = (portfolio) => {
    const total = portfolio.reduce((acc, stock) => acc + (stock.price * stock.quantity), 0);
    setTotalValue(total);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Praćenje portfelja dionica</h1>
        <p className={styles.subtitle}>Pratite svoje investicije na Zagrebačkoj burzi</p>
      </div>
      
      <div className={styles.controls}>
        <AddNewStock onAddNewStock={addNewStock} />
        <StockSelector onAddStock={addStockToPortfolio} availableStocks={availableStocks} />
      </div>

      <div className={styles.dashboard}>
        <div className={styles.summarySection}>
          <PortfolioSummary 
            portfolio={portfolio} 
            totalValue={totalValue} 
            onRemoveStock={removeStockFromPortfolio}
          />
        </div>
        <div className={styles.chartSection}>
          <PortfolioChart portfolio={portfolio} />
        </div>
      </div>
    </div>
  );
};

export default App;
