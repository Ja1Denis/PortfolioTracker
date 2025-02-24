import axios from 'axios';

const getStockPrice = async (symbol) => {
  try {
    console.log('Dohvaćanje cijene za:', symbol);
    const response = await axios.post('http://localhost:3001/api/stock-price', {
      symbol
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
