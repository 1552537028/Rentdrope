const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/products');
require('dotenv').config();

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "https://rentdrope.onrender.com" }));
app.use(bodyParser.json());

// Serve static files (images) from the 'uploads' directory
const uploadsDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDir)); // This allows access to uploaded images

// MongoDB connection
mongoose.connect('mongodb+srv://jayanth:jayanth@cluster0.ubyck.mongodb.net/rentdrope', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Routes
app.use('/api/products', productRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



