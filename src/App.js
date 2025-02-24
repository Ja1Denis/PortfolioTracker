import React, { useState, useEffect } from 'react';
import StockSelector from './components/StockSelector';
import PortfolioSummary from './components/PortfolioSummary';
import AddNewStock from './components/AddNewStock';
import PortfolioChart from './components/PortfolioChart';
import PortfolioHistory from './components/PortfolioHistory';
import { stockService } from './services/stockService';
import styles from './App.module.css';

const App = () => {
  const [portfolio, setPortfolio] = useState(() => {
    const savedPortfolio = localStorage.getItem('portfolio');
    return savedPortfolio ? JSON.parse(savedPortfolio) : [];
  });
  
  const [portfolioHistory, setPortfolioHistory] = useState(() => {
    const savedHistory = localStorage.getItem('portfolioHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const [totalValue, setTotalValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [availableStocks, setAvailableStocks] = useState({
    "ADPL": "AD PLASTIK d.d.",
    "ARNT": "Arena Hospitality Group d.d.",
    "ATGR": "ATLANTIC GRUPA d.d.",
    "HT": "HT d.d.",
    "PODR": "PODRAVKA d.d.",
    "RIVP": "Valamar Riviera d.d.",
  });
  const [lastUpdate, setLastUpdate] = useState(null);
  const [nextUpdate, setNextUpdate] = useState(null);

  // Backup mock cijene za slučaj da API ne radi
  const mockPrices = {
    "ADPL": 185.50,
    "ARNT": 280.00,
    "ATGR": 760.00,
    "HT": 180.00,
    "PODR": 580.00,
    "RIVP": 485.00
  };

  // Automatsko osvježavanje cijena svakih 2 sata
  useEffect(() => {
    let isMounted = true;
    
    const updatePrices = async () => {
      if (isMounted) {
        setIsLoading(true);
        setLastUpdate(new Date());
        setNextUpdate(new Date(Date.now() + 7200000));
      }

      if (portfolio.length > 0) {
        try {
          const updatedPortfolio = await Promise.all(
            portfolio.map(async (stock) => {
              try {
                const newPrice = await fetchStockPrice(stock.symbol);
                return { ...stock, price: newPrice };
              } catch (error) {
                console.error(`Greška pri ažuriranju cijene za ${stock.symbol}:`, error);
                return stock; // Zadržavamo staru cijenu ako dođe do greške
              }
            })
          );
          if (isMounted) {
            setPortfolio(updatedPortfolio);
            calculateTotalValue(updatedPortfolio);
          }
        } catch (error) {
          console.error('Greška pri ažuriranju cijena:', error);
        }
      }
      
      if (isMounted) setIsLoading(false);
    };

    // Prvo ažuriranje
    updatePrices();

    // Postavljanje intervala za ažuriranje
    const interval = setInterval(updatePrices, 7200000); // 2 sata
    
    // Čišćenje
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []); // Prazan dependency array - interval se postavlja samo jednom

  useEffect(() => {
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  useEffect(() => {
    localStorage.setItem('portfolioHistory', JSON.stringify(portfolioHistory));
  }, [portfolioHistory]);

  const addNewStock = (newStock) => {
    setAvailableStocks(prev => ({
      ...prev,
      [newStock.symbol]: newStock.name
    }));
  };

  const fetchStockPrice = async (symbol) => {
    try {
      return await stockService.getStockPrice(symbol);
    } catch (error) {
      console.error(`Nije moguće dohvatiti cijenu za ${symbol}:`, error);
      throw error;
    }
  };

  const addStockToPortfolio = async (stock) => {
    if (!stock.symbol || !stock.quantity) return;

    setIsLoading(true);
    try {
      const price = await fetchStockPrice(stock.symbol);
      const newStock = {
        symbol: stock.symbol,
        quantity: parseFloat(stock.quantity),
        price,
        value: price * parseFloat(stock.quantity)
      };

      setPortfolio(prevPortfolio => {
        const existingStockIndex = prevPortfolio.findIndex(s => s.symbol === stock.symbol);
        if (existingStockIndex >= 0) {
          // Ažuriramo postojeću dionicu
          const updatedPortfolio = [...prevPortfolio];
          const existingStock = updatedPortfolio[existingStockIndex];
          updatedPortfolio[existingStockIndex] = {
            ...existingStock,
            quantity: existingStock.quantity + parseFloat(stock.quantity),
            value: (existingStock.quantity + parseFloat(stock.quantity)) * price
          };
          return updatedPortfolio;
        } else {
          // Dodajemo novu dionicu
          return [...prevPortfolio, newStock];
        }
      });

      // Ažuriramo ukupnu vrijednost
      setPortfolio(prevPortfolio => {
        calculateTotalValue(prevPortfolio);
        return prevPortfolio;
      });
    } catch (error) {
      alert(`Greška pri dodavanju dionice ${stock.symbol}: ${error.message}`);
    } finally {
      setIsLoading(false);
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

  const calculateTotalValue = (portfolioData) => {
    const total = portfolioData.reduce((acc, stock) => acc + (stock.price * stock.quantity), 0);
    setTotalValue(total);
    
    // Dodaj novu točku u povijest
    const newHistoryPoint = {
      x: new Date().toISOString(),
      y: total
    };
    setPortfolioHistory(prev => [...prev, newHistoryPoint]);
  };

  const refreshData = async () => {
    setIsLoading(true);
    setLastUpdate(new Date());
    setNextUpdate(new Date(Date.now() + 7200000));

    if (portfolio.length > 0) {
      try {
        const updatedPortfolio = await Promise.all(
          portfolio.map(async (stock) => {
            try {
              const newPrice = await fetchStockPrice(stock.symbol);
              return { ...stock, price: newPrice };
            } catch (error) {
              console.error(`Greška pri ažuriranju cijene za ${stock.symbol}:`, error);
              return stock; // Zadržavamo staru cijenu ako dođe do greške
            }
          })
        );
        setPortfolio(updatedPortfolio);
        calculateTotalValue(updatedPortfolio);
      } catch (error) {
        console.error('Greška pri ažuriranju cijena:', error);
      }
    }
    
    setIsLoading(false);
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
        <button onClick={refreshData}>Ručno osvježi podatke</button>
      </div>

      <div className={styles.dashboard}>
        <div className={styles.summarySection}>
          <PortfolioSummary 
            portfolio={portfolio} 
            totalValue={totalValue} 
            onRemoveStock={removeStockFromPortfolio}
            isLoading={isLoading}
            lastUpdate={lastUpdate}
            nextUpdate={nextUpdate}
          />
        </div>
        <div className={styles.chartSection}>
          <PortfolioChart portfolio={portfolio} isLoading={isLoading} />
        </div>
      </div>
      <div className={styles.historySection}>
        <PortfolioHistory historyData={portfolioHistory} />
      </div>
    </div>
  );
};

export default App;
