import axios from 'axios';

const getStockPrice = async (symbol, market = 'ZSE') => {
  try {
    // Prvo pokušaj s Perplexity API-jem
    const perplexityKey = localStorage.getItem('perplexityApiKey');
    if (perplexityKey) {
      try {
        console.log('Pokušavam dohvatiti cijenu s Perplexity API-jem za:', symbol, 'na tržištu:', market);
        const response = await axios.post('http://localhost:3001/api/stock-price', {
          symbol,
          market,
          apiKey: perplexityKey,
          provider: 'perplexity'
        });
        
        if (response.data.price) {
          console.log('Dohvaćena cijena preko Perplexity:', response.data.price, response.data.currency);
          return {
            price: response.data.price,
            currency: response.data.currency,
            market: response.data.market
          };
        }
      } catch (perplexityError) {
        console.warn('Greška s Perplexity API-jem:', perplexityError.message);
      }
    }

    // Ako Perplexity ne uspije ili nije konfiguriran, pokušaj s Gemini
    const geminiKey = localStorage.getItem('geminiApiKey');
    if (geminiKey) {
      try {
        console.log('Pokušavam dohvatiti cijenu s Gemini API-jem za:', symbol, 'na tržištu:', market);
        const response = await axios.post('http://localhost:3001/api/stock-price', {
          symbol,
          market,
          apiKey: geminiKey,
          provider: 'gemini'
        });
        
        if (response.data.price) {
          console.log('Dohvaćena cijena preko Gemini:', response.data.price, response.data.currency);
          return {
            price: response.data.price,
            currency: response.data.currency,
            market: response.data.market
          };
        }
      } catch (geminiError) {
        console.warn('Greška s Gemini API-jem:', geminiError.message);
        throw geminiError; // Ako ni Gemini ne radi, propagiraj grešku
      }
    }

    // Ako niti jedan API nije konfiguriran
    throw new Error('Niti jedan API ključ nije postavljen. Molimo postavite barem jedan API ključ u Postavkama.');
  } catch (error) {
    console.error('Greška pri dohvaćanju cijene dionice:', {
      symbol,
      market,
      message: error.message,
      status: error.response?.status,
      details: error.response?.data
    });
    throw error;
  }
};

export const stockService = {
  getStockPrice
};

export default stockService;
