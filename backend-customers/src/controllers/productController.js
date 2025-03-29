const ProductService = require('../services/productService');

// Fetch Product details for ProductCards
exports.getProductCards = async (req, res) => {
  try {
    const products = await ProductService.getProductCards();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching product cards:', error);
    res.status(500).json({ message: 'Failed to fetch product cards' });
  }
};