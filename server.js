const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for all incoming cross-origin fetch requests
app.use(cors());
app.use(express.json());

// Catch-all Logger Middleware: Logs EVERY incoming request regardless of path
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} request to ${req.originalUrl}`);
  if (Object.keys(req.query).length > 0) {
    console.log('Query Parameters:', req.query);
  }
  next();
});

// Root Route: https://rsuno-server.onrender.com/
app.get('/', (req, res) => {
  // Checks if a "c" query parameter was sent (e.g. /?c=test)
  if (req.query.c) {
    console.log('>>> Received "c" parameter:', req.query.c);
  }
  
  res.status(200).send('OK');
});

// Fallback Route: Catches any invalid URLs so you don't get 404s silently
app.use((req, res) => {
  console.log(`Unmatched route hit: ${req.originalUrl}`);
  res.status(200).send('OK (Caught by fallback)');
});

// Render dynamically provides process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Node.js server running on port ${PORT}`);
});
