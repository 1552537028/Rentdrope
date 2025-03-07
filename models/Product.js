const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  offer: { type: Number, required: true },
  disc: { type: String, required: true },
  category: { type: String, required: true },
  email: {type: String, required: true},
  images: [String] 
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
