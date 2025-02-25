const API_BASE_URL = 'https://perplexity-stock-api.vercel.app/api';

// Mock podaci za testiranje
const MOCK_DATA = {
  'HT': [
    { date: '2024-01-25', price: 42.8 },
    { date: '2024-01-26', price: 43.2 },
    { date: '2024-01-29', price: 43.5 },
    { date: '2024-01-30', price: 43.8 },
    { date: '2024-02-01', price: 43.6 },
    { date: '2024-02-02', price: 43.9 },
    { date: '2024-02-05', price: 44.1 },
    { date: '2024-02-06', price: 44.0 },
    { date: '2024-02-07', price: 44.2 },
    { date: '2024-02-08', price: 44.3 },
    { date: '2024-02-09', price: 44.1 },
    { date: '2024-02-12', price: 44.2 },
    { date: '2024-02-13', price: 44.4 },
    { date: '2024-02-14', price: 44.3 },
    { date: '2024-02-15', price: 44.2 }
  ],
  'RIVP': [
    { date: '2024-01-25', price: 5.90 },
    { date: '2024-01-26', price: 5.95 },
    { date: '2024-01-29', price: 6.00 },
    { date: '2024-01-30', price: 6.05 },
    { date: '2024-02-01', price: 6.10 },
    { date: '2024-02-02', price: 6.15 },
    { date: '2024-02-05', price: 6.20 },
    { date: '2024-02-06', price: 6.18 },
    { date: '2024-02-07', price: 6.22 },
    { date: '2024-02-08', price: 6.25 },
    { date: '2024-02-09', price: 6.23 },
    { date: '2024-02-12', price: 6.24 },
    { date: '2024-02-13', price: 6.26 },
    { date: '2024-02-14', price: 6.25 },
    { date: '2024-02-15', price: 6.26 }
  ]
};

export const getStockPriceHistory = async (symbol) => {
  try {
    // Dohvaćamo povijest dionica iz localStorage
    const stocksHistory = localStorage.getItem('stocksHistory');
    
    if (!stocksHistory) {
      throw new Error('Nema dostupnih povijesnih podataka');
    }

    const history = JSON.parse(stocksHistory);
    
    // Dohvaćamo povijest za traženu dionicu
    const stockHistory = history[symbol] || [];

    if (stockHistory.length === 0) {
      // Ako nema povijesnih podataka, koristimo mock podatke kao fallback
      return MOCK_DATA[symbol] || [];
    }

    // Transformiramo podatke u format koji očekuje grafikon
    return stockHistory.map(entry => ({
      date: new Date(entry.x).toISOString().split('T')[0],
      price: entry.y
    }));
  } catch (error) {
    console.error('Greška:', error);
    // U slučaju greške, vraćamo mock podatke
    return MOCK_DATA[symbol] || [];
  }
};
