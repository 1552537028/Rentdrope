const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  offer: { type: Number, default: 0 },
  disc: { type: String, required: true },
  category: { type: String, required: true },
  email: { type: String, required: true },
  images: { type: [String], default: [], required: false } // Array of filenames
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);