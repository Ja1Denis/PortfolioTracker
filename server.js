require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

// Početno logiranje
console.log('\n=== Pokretanje servera ===');
console.log('Trenutni direktorij:', process.cwd());
console.log('Putanja do .env:', path.resolve(process.cwd(), '.env'));
console.log('Environment varijable:', {
  NODE_ENV: process.env.NODE_ENV,
  API_KEY_SET: !!process.env.REACT_APP_PERPLEXITY_API_KEY,
  API_KEY_LENGTH: process.env.REACT_APP_PERPLEXITY_API_KEY?.length
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Middleware za logiranje
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`\n=== ${timestamp} ===`);
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Osnovna ruta
app.get('/', (req, res) => {
  res.json({ 
    status: 'Server is running',
    endpoints: {
      test: '/api/test',
      stockPrice: '/api/stock-price'
    }
  });
});

// Test ruta
app.get('/api/test', async (req, res) => {
  try {
    console.log('\nTest API poziv...');
    const API_KEY = process.env.REACT_APP_PERPLEXITY_API_KEY;
    if (!API_KEY) {
      throw new Error('API ključ nije postavljen');
    }

    console.log('Slanje test zahtjeva na Perplexity API...');
    const testResponse = await axios.post('https://api.perplexity.ai/chat/completions', {
      model: "sonar",
      messages: [{
        role: "user",
        content: "Hello"
      }]
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Test uspješan!');
    res.json({ 
      success: true, 
      message: 'API test uspješan',
      data: testResponse.data 
    });
  } catch (error) {
    console.error('\nTest API greška:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      stack: error.stack?.split('\n')
    });

    res.status(500).json({
      success: false,
      error: 'API Test Failed',
      message: error.message,
      details: error.response?.data
    });
  }
});

// Ruta za dohvaćanje cijena dionica
app.post('/api/stock-price', async (req, res) => {
  try {
    const { symbol, apiKey, provider = 'perplexity', market = 'ZSE' } = req.body;
    
    if (!apiKey) {
      return res.status(400).json({
        error: 'API ključ nije proslijeđen',
        details: { provider }
      });
    }

    console.log('Dohvaćanje cijene za dionicu:', symbol, 'na tržištu:', market, 'koristeći:', provider);
    
    // Priprema prompta ovisno o tržištu
    const getPromptForMarket = (symbol, market) => {
      switch (market) {
        case 'ZSE':
          return `Koja je trenutna cijena dionice ${symbol} na Zagrebačkoj burzi (ZSE)? Molim samo broj u HRK/EUR bez dodatnog teksta.`;
        case 'NYSE':
          return `What is the current stock price of ${symbol} on the New York Stock Exchange (NYSE)? Please respond with just the number in USD.`;
        case 'NASDAQ':
          return `What is the current stock price of ${symbol} on NASDAQ? Please respond with just the number in USD.`;
        case 'FRA':
          return `What is the current stock price of ${symbol} on Frankfurt Stock Exchange (FRA)? Please respond with just the number in EUR.`;
        case 'LSE':
          return `What is the current stock price of ${symbol} on London Stock Exchange (LSE)? Please respond with just the number in GBP.`;
        default:
          return `What is the current stock price of ${symbol} on ${market}? Please respond with just the number.`;
      }
    };

    const prompt = getPromptForMarket(symbol, market);
    let response;

    try {
      if (provider === 'perplexity') {
        response = await axios.post('https://api.perplexity.ai/chat/completions', {
          model: 'sonar',
          messages: [{
            role: 'user',
            content: prompt
          }]
        }, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.data.choices?.[0]?.message?.content) {
          throw new Error('Neispravan format odgovora od Perplexity API-ja');
        }

        const priceText = response.data.choices[0].message.content.trim();
        const price = parseFloat(priceText);
        
        if (isNaN(price)) {
          throw new Error('Nije moguće parsirati cijenu iz Perplexity odgovora');
        }

        return res.json({ 
          price,
          market,
          currency: getCurrencyForMarket(market)
        });

      } else if (provider === 'gemini') {
        response = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        }, {
          headers: {
            'Content-Type': 'application/json'
          },
          params: {
            key: apiKey
          }
        });

        if (!response.data.candidates?.[0]?.content?.parts?.[0]?.text) {
          throw new Error('Neispravan format odgovora od Gemini API-ja');
        }

        const priceText = response.data.candidates[0].content.parts[0].text.trim();
        const price = parseFloat(priceText);
        
        if (isNaN(price)) {
          throw new Error('Nije moguće parsirati cijenu iz Gemini odgovora');
        }

        return res.json({ 
          price,
          market,
          currency: getCurrencyForMarket(market)
        });

      } else {
        throw new Error('Nepodržani API provider');
      }
    } catch (apiError) {
      console.error('API greška:', {
        provider,
        error: apiError.message,
        response: apiError.response?.data
      });

      return res.status(400).json({
        error: `Greška pri dohvaćanju cijene s ${provider} API-jem`,
        details: {
          message: apiError.message,
          provider,
          symbol,
          market
        }
      });
    }
  } catch (error) {
    console.error('Serverska greška:', error);
    return res.status(500).json({
      error: 'Interna greška servera',
      details: {
        message: error.message
      }
    });
  }
});

// Helper funkcija za određivanje valute prema tržištu
const getCurrencyForMarket = (market) => {
  switch (market) {
    case 'ZSE':
      return 'EUR';
    case 'NYSE':
    case 'NASDAQ':
      return 'USD';
    case 'LSE':
      return 'GBP';
    case 'FRA':
      return 'EUR';
    default:
      return 'EUR';
  }
};

// Pokretanje servera
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n=== Server je pokrenut na portu ${PORT} ===`);
  console.log('Dostupne rute:');
  console.log('- GET  /');
  console.log('- GET  /api/test');
  console.log('- POST /api/stock-price');
});
