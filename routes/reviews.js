const express = require('express');
const Review = require('../models/Reviews');
const Product = require('../models/Product');
const router = express.Router();

// Get all reviews for a specific product
router.get('/products/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate('product');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Post a review for a specific product
router.post('/products/:productId', async (req, res) => {
  try {
    const { rating, comment, customerName } = req.body;
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const newReview = new Review({
      rating,
      comment,
      customerName,
      product: product._id
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
