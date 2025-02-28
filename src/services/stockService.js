import axios from 'axios';

const getStockPrice = async (symbol, market = 'ZSE') => {
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
      console.warn('Greška s Perplexity API-jem:', 
        perplexityError.response?.data?.error || perplexityError.message
      );
      // Ne bacamo grešku ovdje, pokušat ćemo s Gemini
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
      console.warn('Greška s Gemini API-jem:', 
        geminiError.response?.data?.error || geminiError.message
      );
      
      // Ako je i Gemini API neuspješan, bacamo grešku s detaljima
      throw new Error(
        geminiError.response?.data?.error || 
        'Nije moguće dohvatiti cijenu dionice. Provjerite API ključeve u postavkama.'
      );
    }
  }

  // Ako niti jedan API nije konfiguriran
  throw new Error('Niti jedan API ključ nije postavljen. Molimo postavite barem jedan API ključ u Postavkama.');
};

export const stockService = {
  getStockPrice
};

export default stockService;
