const mongoose = require('mongoose');

const quoteRequestSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Reference to the Product model
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model representing the seller
    required: true,
  },
  // Other fields like status, message, timestamps, etc.
});

module.exports = mongoose.model('QuoteRequest', quoteRequestSchema);
