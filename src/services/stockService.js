import axios from 'axios';

const getStockPrice = async (symbol) => {
  try {
    const apiKey = localStorage.getItem('perplexityApiKey');
    if (!apiKey) {
      throw new Error('API ključ nije postavljen. Molimo postavite ga u Postavkama.');
    }

    console.log('Dohvaćanje cijene za:', symbol);
    const response = await axios.post('http://localhost:3001/api/stock-price', {
      symbol,
      apiKey
    });
    
    if (response.data.price) {
      console.log('Dohvaćena cijena:', response.data.price);
      return response.data.price;
    } else {
      throw new Error('Cijena nije dostupna');
    }
  } catch (error) {
    console.error('Greška pri dohvaćanju cijene dionice:', {
      symbol,
      message: error.message,
      status: error.response?.status,
      details: error.response?.data
    });
    throw error; // Propagiramo grešku dalje
  }
};

export const stockService = {
  getStockPrice
};

export default stockService;
