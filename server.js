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
    const { symbol, apiKey } = req.body;
    
    if (!apiKey) {
      throw new Error('API ključ nije proslijeđen');
    }

    console.log('Dohvaćanje cijene za dionicu:', symbol);
    
    const prompt = `Koja je trenutna cijena dionice ${symbol} na Zagrebačkoj burzi (ZSE)? Molim samo broj bez dodatnog teksta.`;
    
    const response = await axios.post('https://api.perplexity.ai/chat/completions', {
      model: 'mistral-7b-instruct',
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

    if (response.data.choices && response.data.choices[0]) {
      const priceText = response.data.choices[0].message.content.trim();
      const price = parseFloat(priceText);
      
      if (!isNaN(price)) {
        console.log('Uspješno dohvaćena cijena:', price);
        res.json({ price });
      } else {
        throw new Error('Nije moguće parsirati cijenu iz odgovora');
      }
    } else {
      throw new Error('Neispravan format odgovora od API-ja');
    }
  } catch (error) {
    console.error('Greška:', error.message);
    res.status(500).json({ 
      error: error.message,
      details: error.response?.data 
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
