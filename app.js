const express = require('express');
const cors = require('cors');
const { getCollection } = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Example API route (replace or add routes as needed)
app.get('/api/welcome', (req, res) => {
    res.json({ message: 'Welcome to the Saymuse API!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});