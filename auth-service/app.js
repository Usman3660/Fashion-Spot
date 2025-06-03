const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const { sequelize } = require('./models'); // Not strictly needed here if sync is handled in models/index.js
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection (for users/auth)
mongoose.connect(process.env.MONGO_URI, {
  // Removed deprecated options
})
.then(() => console.log('✅ MongoDB Atlas connected'))
.catch(err => console.error('❌ MongoDB Atlas connection error:', err));

// Initialize PostgreSQL (for orders/products/etc.)
// The require('./models') call will run models/index.js, which includes sequelize.sync()
require('./models'); 
// The following sync call is redundant as models/index.js already does it.
// sequelize.sync()
//   .then(() => console.log('PostgreSQL Models Synced')) // This line can be removed
//   .catch(err => console.error('PostgreSQL Sync Error:', err)); // This line can be removed


// Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Mount routes under proper prefixes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/payment', paymentRoutes);

// Error Handler Middleware (Ensure it's correctly placed and configured if you have one globally)
// Example: app.use(require('./middleware/errorHandler'));


module.exports = app;

// Server start (only run when app.js is executed directly)
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}