const express = require('express');
const cors = require('cors');
const app = express();

// CORS is required so browsers don't block your fetch requests
app.use(cors());
app.use(express.json());

// This handles requests to https://your-server.com/
app.get('/', (req, res) => {
  res.json({ message: "Hello! Your server is working." });
});

// Example of an extra endpoint: https://your-server.com/data
app.get('/data', (req, res) => {
  res.json({ status: "success", items: [1, 2, 3] });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
