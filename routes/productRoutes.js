const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, getCategories, createProduct } = require('../controllers/productController');

router.get('/', getAllProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);
router.post('/', createProduct);

module.exports = router;
