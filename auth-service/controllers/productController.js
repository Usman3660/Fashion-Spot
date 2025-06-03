// auth-service/controllers/productController.js

const Product = require('../models/Product');

// Create Product
exports.createProduct = async (req, res) => {
  const { name, description, price, images, category, stock } = req.body;
  try {
    const newProduct = await Product.create({ name, description, price, images, category, stock });
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (err) {
    res.status(400).json({ error: 'Error adding product', details: err.message });
  }
};

// Get All Products
exports.getAllProducts = async (_req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching products', details: err.message });
  }
};

// Get Product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching product', details: err.message });
  }
};


// At the bottom of productController.js
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting product', details: err.message });
  }
};


// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated successfully', product });
  } catch (err) {
    res.status(500).json({ message: 'Error updating product', details: err.message });
  }
};
