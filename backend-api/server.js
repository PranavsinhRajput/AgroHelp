const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
require('dotenv').config();
// import rootRouter from './routes/index.js'
const rootRouter = require('./routes/index')


const { connectDB } = require('./db');
const verifyToken = require('./middlewares/authMiddleware');
const { predictionLimiter } = require('./middlewares/rateLimiter');

// Initialize Firebase and Firestore
const db = connectDB();

const app = express();
const PORT = 4000;
const ML_SERVER_URL = 'http://localhost:5000';

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // your React app URL (Vite default)
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// Configure multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use("/api", rootRouter);
// Routes
app.get('/', (req, res) => {
  res.json({ message: 'AgroHelp Express Backend is running!' });
});



app.post('/api/predict/weather', predictionLimiter, verifyToken, async (req, res) => {
  try {
    const { city, weatherData } = req.body;
    console.log(`[Weather] Prediction request for city: ${city}`);

    // Forward city + today's observed features to Flask ML server
    const response = await axios.post(`${ML_SERVER_URL}/predict/weather`, {
      city,
      weatherData,
    });

    console.log('[ML Server] Prediction received:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('[Weather] Prediction error:', error.message);
    res.status(500).json({
      error: 'Weather prediction failed',
      message: error.message,
    });
  }
});

// Disease detection route
app.post('/api/predict/disease', predictionLimiter, verifyToken, upload.single('image'), async (req, res) => {
  try {
    console.log('Disease detection request received');
    
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    console.log('Image details:', {
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    // Create form data to send to Flask
    const FormData = require('form-data');
    const formData = new FormData();
    formData.append('image', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    // Forward request to Flask ML server
    const response = await axios.post(`${ML_SERVER_URL}/predict/disease`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    console.log('ML Server response:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Disease detection error:', error.message);
    res.status(500).json({ 
      error: 'Disease detection failed',
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    mlServerUrl: ML_SERVER_URL
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Express Backend running on http://localhost:${PORT}`);
  console.log(`📡 Connected to ML Server: ${ML_SERVER_URL}`);
  console.log('Available endpoints:');
  console.log('  GET  / - Welcome message');
  console.log('  POST /api/predict/weather - Weather prediction');
  console.log('  POST /api/predict/disease - Disease detection');
  console.log('  GET  /health - Health check');
});