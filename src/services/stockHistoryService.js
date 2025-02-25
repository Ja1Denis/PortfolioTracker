const API_BASE_URL = 'https://perplexity-stock-api.vercel.app/api';

export const getStockPriceHistory = async (symbol) => {
  try {
    const response = await fetch(`${API_BASE_URL}/history/${symbol}`);
    if (!response.ok) {
      throw new Error('Greška pri dohvaćanju povijesti cijena');
    }
    const data = await response.json();
    
    // Transformiramo podatke u format koji očekuje naš grafikon
    return data.history.map(item => ({
      date: item.date,
      price: parseFloat(item.close)
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
  } catch (error) {
    console.error('Greška:', error);
    return [];
  }
};
