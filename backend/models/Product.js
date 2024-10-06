const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  offer: { type: Number, required: true },
  disc: { type: String, required: true },
  category: { type: String, required: true },
  hashtags: [String],
  images: [String] // Array of image paths
});

module.exports = mongoose.model('Product', ProductSchema);
