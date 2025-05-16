const express = require("express");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const Product = require("../models/Product");
const router = express.Router();
require("dotenv").config();

// Multer + GridFS setup
const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => ({
    bucketName: "uploads",
    filename: `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`,
  }),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Delete files from GridFS
const deleteFiles = async (filenames) => {
  try {
    for (const filename of filenames) {
      const files = await global.gfsBucket.find({ filename }).toArray();
      if (files.length > 0) {
        await global.gfsBucket.delete(files[0]._id);
      }
    }
  } catch (err) {
    console.error("GridFS delete error:", err.message);
  }
};

// Create product
router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      console.log("⚠️ No images received");
      return res.status(400).json({ message: "At least one image is required" });
    }

    console.log("✅ Files uploaded:", req.files.map(f => f.filename));
    console.log("📝 Form data:", req.body);

    const product = new Product({
      title: req.body.title,
      price: req.body.price,
      offer: req.body.offer,
      disc: req.body.disc,
      category: req.body.category,
      email: req.body.email,
      images: req.files.map(f => f.filename),
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("❌ Product upload failed:", error.message);
    res.status(500).json({ message: "Failed to add product", error: error.message });
  }
});


// Read all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const result = products.map((p) => ({
      ...p.toObject(),
      imageUrls: p.images.map((img) => `${baseUrl}/file/${img}`),
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed", error: err.message });
  }
});

// Read one product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    res.json({
      ...product.toObject(),
      imageUrls: product.images.map((img) => `${baseUrl}/file/${img}`),
    });
  } catch (err) {
    res.status(500).json({ message: "Fetch error", error: err.message });
  }
});

// Delete product
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });

    await deleteFiles(product.images);
    await Product.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: "Delete error", error: err.message });
  }
});

module.exports = router;
