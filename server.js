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

const API_KEY = process.env.REACT_APP_PERPLEXITY_API_KEY;

// Test ruta
app.get('/api/test', async (req, res) => {
  try {
    console.log('\nTest API poziv...');
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
    const { symbol } = req.body;
    console.log('\nZahtjev za cijenu dionice:', symbol);
    
    if (!symbol) {
      throw new Error('Symbol nije specificiran');
    }

    if (!API_KEY) {
      throw new Error('API ključ nije postavljen');
    }

    console.log('Slanje zahtjeva na Perplexity API...');
    const requestData = {
      model: "sonar",
      messages: [{
        role: "system",
        content: "You are a stock price API for the Zagreb Stock Exchange (ZSE). ONLY return the current price as a number, without any text, currency symbol or explanation. For example: 185.50"
      }, {
        role: "user",
        content: `Return ONLY the current price number for ${symbol} stock on ZSE. Just the number, nothing else.`
      }],
      max_tokens: 10
    };

    console.log('Request data:', JSON.stringify(requestData, null, 2));

    const response = await axios.post('https://api.perplexity.ai/chat/completions', 
      requestData,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('API odgovor:', JSON.stringify(response.data, null, 2));
    
    if (!response.data.choices || !response.data.choices[0]) {
      throw new Error('Neispravan format odgovora');
    }

    const priceText = response.data.choices[0].message.content.trim();
    console.log('Dobiveni tekst:', priceText);
    
    const priceMatch = priceText.match(/\d+([,.]\d{1,2})?/);
    if (!priceMatch) {
      throw new Error('Nije moguće pronaći broj u odgovoru: ' + priceText);
    }

    const price = parseFloat(priceMatch[0].replace(',', '.'));
    console.log('Parsirana cijena:', price);

    if (isNaN(price)) {
      throw new Error('Parsirana vrijednost nije broj');
    }

    console.log('Vraćanje cijene:', price);
    res.json({ price });
  } catch (error) {
    console.error('\nDetaljna greška:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      stack: error.stack?.split('\n')
    });

    if (error.response?.data) {
      console.error('API Error Response:', JSON.stringify(error.response.data, null, 2));
    }
    
    res.status(500).json({ 
      error: 'Failed to fetch stock price',
      message: error.message,
      details: error.response?.data || error.message
    });
  }
});

// Pokretanje servera
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n=== Server je pokrenut na portu ${PORT} ===`);
  console.log('Dostupne rute:');
  console.log('- GET  /');
  console.log('- GET  /api/test');
  console.log('- POST /api/stock-price');
});
