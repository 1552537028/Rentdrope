const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const router = express.Router();

// Ensure the 'uploads' directory exists on deployment (and is persistent in Render)
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir); // Create the uploads directory if it doesn't exist
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);  // Store files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Append timestamp to filenames to avoid conflicts
  },
});

const upload = multer({ storage: storage });

// Route to create a new product with images
router.post('/', upload.array('images', 8), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded.' });
    }

    // Map the uploaded files to an array of file paths (removing the 'uploads/' prefix)
    const images = req.files.map(file => file.path.replace('uploads/', ''));
    
    // Create and save the new product with the images
    const product = new Product({ ...req.body, images });
    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Failed to add product', error: error.message });
  }
});

// Route to get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
});

// Route to get a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
});

// Route to update a product by ID (with optional new images)
router.put('/:id', upload.array('images', 5), async (req, res) => {
  try {
    const { title, price, offer, disc, category } = req.body;

    // Get new images (if any)
    const newImages = req.files ? req.files.map(file => file.path.replace('uploads/', '')) : [];

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Combine existing and new images
    const updatedImages = newImages.length > 0 ? [...product.images, ...newImages] : product.images;

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
      title, price, offer, disc, category, images: updatedImages
    }, { new: true });

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
});

// Route to delete a product by ID
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.status(204).end();  // Successfully deleted
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
});

module.exports = router;

