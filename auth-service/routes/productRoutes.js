// auth-service/routes/productRoutes.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Add new product
router.post('/add', productController.createProduct);

// Get all products
router.get('/', productController.getAllProducts);

// Get product by ID
router.get('/:id', productController.getProductById);


// Delete product
router.delete('/:id', productController.deleteProduct);

// Update a product
router.put('/:id', productController.updateProduct);

module.exports = router;
