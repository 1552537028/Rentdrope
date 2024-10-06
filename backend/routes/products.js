const express = require('express');
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to avoid filename conflicts
  },
});

const upload = multer({ storage: storage });

// Create a new product with images
router.post('/', upload.array('images', 8), async (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).json({ message: 'No files uploaded.' });
    }

    const images = req.files.map(file => file.path.replace('uploads/', ''));
    const product = new Product({ ...req.body, images });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Failed to add product', error: error.message });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error); // Log error details
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
});

// Get a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error); // Log error details
    res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
});

/** Update a product by ID
router.put('/:id', upload.array('images', 5), async (req, res) => {
  try {
    const images = req.files ? req.files.map(file => file.path.replace('uploads/', '')) : [];
    const product = await Product.findByIdAndUpdate(req.params.id, { ...req.body, images }, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error); // Log error details
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
});
*/
//gptcodetoprevent the oldimages
router.put('/:id', upload.array('images', 5), async (req, res) => {
  try {
    // Get new images from the request
    const newImages = req.files ? req.files.map(file => file.path.replace('uploads/', '')) : [];
    
    // Find the existing product
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Combine existing images with new images
    const updatedImages = [...product.images, ...newImages];

    // Update the product with the combined images
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { ...req.body, images: updatedImages }, { new: true });

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error); // Log error details
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
});

// Delete a product by ID
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting product:', error); // Log error details
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
});

module.exports = router;
