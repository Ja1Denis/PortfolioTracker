import React, { useState, useEffect } from 'react';
import StockSelector from './components/StockSelector';
import AddNewStock from './components/AddNewStock';
import PortfolioSummary from './components/PortfolioSummary';
import PortfolioChart from './components/PortfolioChart';
import PortfolioHistory from './components/PortfolioHistory';
import ApiSettings from './components/ApiSettings';
import AboutPage from './components/AboutPage';
import AddCashForm from './components/AddCashForm';
import { stockService } from './services/stockService';
import styles from './App.module.css';

const App = () => {
  // Funkcija za spajanje dupliciranih dionica
  const mergeDuplicateStocks = (stocks) => {
    const stockMap = new Map();
    
    stocks.forEach(stock => {
      const key = `${stock.symbol}-${stock.market}`;
      if (stockMap.has(key)) {
        const existingStock = stockMap.get(key);
        existingStock.quantity += stock.quantity;
        existingStock.value = existingStock.price * existingStock.quantity;
      } else {
        stockMap.set(key, { ...stock });
      }
    });

    return Array.from(stockMap.values());
  };

  const [portfolio, setPortfolio] = useState(() => {
    const savedPortfolio = localStorage.getItem('portfolio');
    if (savedPortfolio) {
      // Očisti duplicirane dionice pri učitavanju
      const loadedPortfolio = JSON.parse(savedPortfolio);
      return mergeDuplicateStocks(loadedPortfolio);
    }
    return [];
  });
  
  // Nova struktura za povijest pojedinačnih dionica
  const [stocksHistory, setStocksHistory] = useState(() => {
    const savedHistory = localStorage.getItem('stocksHistory');
    return savedHistory ? JSON.parse(savedHistory) : {};
  });

  const [portfolioHistory, setPortfolioHistory] = useState(() => {
    const savedHistory = localStorage.getItem('portfolioHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const [cash, setCash] = useState(() => {
    const savedCash = localStorage.getItem('cash');
    return savedCash ? JSON.parse(savedCash) : [];
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
  const [activeView, setActiveView] = useState('portfolio'); // 'portfolio' ili 'settings'
  const [showAbout, setShowAbout] = useState(false);
  const [showAddCash, setShowAddCash] = useState(false);

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
                const priceData = await fetchStockPrice(stock.symbol, stock.market);
                // Dodajemo novu cijenu u povijest samo ako dolaze novi podaci
                if (priceData.price !== stock.price) {
                  setStocksHistory(prevHistory => {
                    const timestamp = new Date().toISOString();
                    const stockHistory = prevHistory[stock.symbol] || [];
                    return {
                      ...prevHistory,
                      [stock.symbol]: [
                        ...stockHistory,
                        { x: timestamp, y: priceData.price }
                      ]
                    };
                  });
                }
                return { 
                  ...stock, 
                  price: priceData.price,
                  currency: priceData.currency,
                  value: priceData.price * stock.quantity 
                };
              } catch (error) {
                console.error(`Greška pri ažuriranju cijene za ${stock.symbol}:`, error);
                return stock;
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

    updatePrices();
    const interval = setInterval(updatePrices, 7200000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  // Spremanje povijesti dionica u localStorage
  useEffect(() => {
    localStorage.setItem('stocksHistory', JSON.stringify(stocksHistory));
  }, [stocksHistory]);

  useEffect(() => {
    localStorage.setItem('portfolioHistory', JSON.stringify(portfolioHistory));
  }, [portfolioHistory]);

  useEffect(() => {
    localStorage.setItem('cash', JSON.stringify(cash));
  }, [cash]);

  const addNewStock = (newStock) => {
    setAvailableStocks(prev => ({
      ...prev,
      [newStock.symbol]: newStock.name
    }));
  };

  const fetchStockPrice = async (symbol, market) => {
    try {
      return await stockService.getStockPrice(symbol, market);
    } catch (error) {
      console.error(`Nije moguće dohvatiti cijenu za ${symbol} na tržištu ${market}:`, error);
      throw error;
    }
  };

  const addStockToPortfolio = async (stock) => {
    if (!stock.symbol || !stock.quantity) return;

    setIsLoading(true);
    try {
      const priceData = await fetchStockPrice(stock.symbol, stock.market);
      
      // Provjeri postoji li već dionica u portfelju
      const existingStockIndex = portfolio.findIndex(
        s => s.symbol === stock.symbol && s.market === stock.market
      );

      if (existingStockIndex !== -1) {
        // Ažuriraj postojeću dionicu
        const updatedPortfolio = [...portfolio];
        const existingStock = updatedPortfolio[existingStockIndex];
        updatedPortfolio[existingStockIndex] = {
          ...existingStock,
          quantity: existingStock.quantity + parseFloat(stock.quantity),
          price: priceData.price,
          currency: priceData.currency,
          value: priceData.price * (existingStock.quantity + parseFloat(stock.quantity))
        };
        setPortfolio(updatedPortfolio);
        calculateTotalValue(updatedPortfolio);
      } else {
        // Dodaj novu dionicu
        const newStock = {
          symbol: stock.symbol,
          quantity: parseFloat(stock.quantity),
          price: priceData.price,
          market: stock.market,
          currency: priceData.currency,
          value: priceData.price * parseFloat(stock.quantity)
        };
        const updatedPortfolio = [...portfolio, newStock];
        setPortfolio(updatedPortfolio);
        calculateTotalValue(updatedPortfolio);
      }

      // Inicijalizacija povijesti za novu dionicu
      setStocksHistory(prevHistory => ({
        ...prevHistory,
        [stock.symbol]: prevHistory[stock.symbol] || []
      }));
    } catch (error) {
      console.error('Greška pri dodavanju dionice:', error);
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

  const calculateTotalValue = (currentPortfolio) => {
    const stocksValue = currentPortfolio.reduce((total, stock) => {
      if (stock.currency === 'EUR') {
        return total + stock.value;
      }
      // TODO: Dodati konverziju drugih valuta u EUR
      return total + stock.value;
    }, 0);

    const cashValue = cash.reduce((total, item) => {
      if (item.currency === 'EUR') {
        return total + item.amount;
      }
      // TODO: Dodati konverziju drugih valuta u EUR
      return total + item.amount;
    }, 0);

    setTotalValue(stocksValue + cashValue);
    
    // Dodaj novu točku u povijest
    const newHistoryPoint = {
      x: new Date().toISOString(),
      y: stocksValue + cashValue
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
              const priceData = await fetchStockPrice(stock.symbol, stock.market);
              return { 
                ...stock, 
                price: priceData.price,
                currency: priceData.currency,
                value: priceData.price * stock.quantity 
              };
            } catch (error) {
              console.error(`Greška pri ažuriranju cijene za ${stock.symbol}:`, error);
              return stock;
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

  const clearPortfolio = () => {
    setPortfolio([]);
    setStocksHistory({});
    setCash([]);
    localStorage.removeItem('portfolio');
    localStorage.removeItem('stocksHistory');
    localStorage.removeItem('cash');
    calculateTotalValue([]);
  };

  const addCash = (cashItem) => {
    const newCash = [...cash, cashItem];
    setCash(newCash);
    calculateTotalValue(portfolio);
  };

  const removeCash = (index) => {
    const newCash = cash.filter((_, i) => i !== index);
    setCash(newCash);
    calculateTotalValue(portfolio);
  };

  const updateCash = (currency, amount) => {
    const newCash = [...cash];
    const existingIndex = newCash.findIndex(item => item.currency === currency);
    
    if (existingIndex !== -1) {
      newCash[existingIndex] = {
        ...newCash[existingIndex],
        amount: newCash[existingIndex].amount + amount
      };
    } else {
      newCash.push({
        currency,
        amount
      });
    }
    
    setCash(newCash);
    localStorage.setItem('cash', JSON.stringify(newCash));
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Praćenje portfelja dionica</h1>
        <p className={styles.subtitle}>Pratite svoje investicije na Zagrebačkoj burzi</p>
        <div className={styles.headerButtons}>
          <button 
            className={styles.viewButton}
            onClick={() => setShowAbout(!showAbout)}
          >
            {showAbout ? 'Natrag na Portfolio' : 'O Aplikaciji'}
          </button>
          {!showAbout && (
            <button
              className={styles.addButton}
              onClick={() => setShowAddCash(true)}
            >
              Dodaj Gotovinu
            </button>
          )}
        </div>
      </header>

      <main className={styles.main}>
        {showAbout ? (
          <AboutPage />
        ) : (
          <div className={styles.content}>
            <div className={styles.controls}>
              <AddNewStock onAddNewStock={addNewStock} />
              <StockSelector onAddStock={addStockToPortfolio} availableStocks={availableStocks} />
              <button 
                className={styles.viewButton} 
                onClick={refreshData}
                disabled={isLoading}
              >
                {isLoading ? 'Osvježavanje...' : 'Ručno osvježi podatke'}
              </button>
            </div>
            <div className={styles.portfolioSection}>
              <div className={styles.summarySection}>
                <PortfolioSummary 
                  portfolio={portfolio} 
                  cash={cash}
                  totalValue={totalValue} 
                  lastUpdate={lastUpdate}
                  nextUpdate={nextUpdate}
                  onRefresh={refreshData}
                  isLoading={isLoading}
                  stocksHistory={stocksHistory}
                  onRemoveStock={removeStockFromPortfolio}
                  onRemoveCash={removeCash}
                  onUpdateCash={updateCash}
                />
              </div>
              <div className={styles.chartSection}>
                <PortfolioChart 
                  portfolio={portfolio} 
                  cash={cash}
                  history={portfolioHistory}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {showAddCash && (
        <AddCashForm
          onAdd={addCash}
          onClose={() => setShowAddCash(false)}
        />
      )}
    </div>
  );
};

export default App;
