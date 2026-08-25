const express = require('express');
const cors = require('cors');
const app = express();

// Middleware: CORS & Body Parser
app.use(cors());
app.use(express.json());

// Main Root Route (Consolidated)
app.get('/', (req, res) => {
  // Logs the full query object (e.g. { c: 'cookie_value' })
  console.log('Incoming Query Parameters:', req.query);

  // Safely check if 'c' exists specifically
  if (req.query.c) {
    console.log('Captured "c" parameter:', req.query.c);
  }

  // Always return a response so the browser doesn't hang
  res.send('OK');
});

// Extra Endpoint
app.get('/data', (req, res) => {
  res.json({ status: "success", items: [1, 2, 3] });
});

// Start the Server (Keep at the bottom)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
