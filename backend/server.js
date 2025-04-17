const express = require('express');
const speech = require('@google-cloud/speech');
const app = express();
const cors = require('cors');

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json({ limit: '50mb' })); // Increase limit for audio data
require('dotenv').config(); // Load environment variables

// Initialize Google Speech client
let client;
try {
  const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
  client = new speech.SpeechClient({ credentials });
} catch (error) {
  console.error('Failed to initialize Speech client:', error);
  // Continue execution, we'll handle this in the route
}

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Speech to text endpoint
app.post('/speech-to-text', async (req, res) => {
  try {
    // Check if client was initialized properly
    if (!client) {
      throw new Error('Speech client not initialized. Check your credentials.');
    }

    // Validate request body
    if (!req.body.audioBytes) {
      return res.status(400).json({ error: 'Missing audio data' });
    }

    const audioBytes = req.body.audioBytes;
    const audio = { content: audioBytes };
    
    // Get configuration options from request or use defaults
    const config = {
      encoding: req.body.encoding || 'LINEAR16',
      sampleRateHertz: req.body.sampleRateHertz || 16000,
      languageCode: req.body.languageCode || 'en-US',
      // Add improved accuracy for short commands
      model: 'command_and_search',
      useEnhanced: true
    };

    console.log('Processing speech-to-text request...');
    const request = { audio, config };
    const [response] = await client.recognize(request);
    
    if (!response.results || response.results.length === 0) {
      return res.json({ transcription: '', message: 'No speech detected' });
    }

    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');

    console.log('Transcription:', transcription);
    res.json({ transcription, confidence: response.results[0].alternatives[0].confidence });
  } catch (error) {
    console.error('Speech-to-text error:', error);
    res.status(500).json({ 
      error: 'Speech-to-text failed', 
      message: error.message, 
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});