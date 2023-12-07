const express = require('express');
const router = express.Router();

// Import product controller functions
const {
  getAllProducts,
  getProductBySellerId,
  createProduct,
  updateProduct,
  deleteProduct,
  getSpecificProduct,
  createProductReview,
  getProductReviews,
  deleteProductReview,
  getProductsByCategory

} = require('../controllers/productsController');

// Import authentication and authorization middleware
const { isAuthenticated } = require('../middleware/authentication');


// Routes for Products

// Base route for managing products
const productsBaseRoute = '/products';


// Get all products by category
router.route(`${productsBaseRoute}`)
  .get(getAllProducts);


// Create a new product
router.route(`${productsBaseRoute}/create`)
  .post(createProduct);

  // Update, delete, or get a specific product by its ID
router.route(`${productsBaseRoute}/:id`)
.put(updateProduct)   // Update a product (requires authentication)
.delete(deleteProduct) // Delete a product (requires authentication)
.get(getSpecificProduct); // Get a specific product

// Get all products by category
router.route(`${productsBaseRoute}/category/:categoryName`)
  .get(getProductsByCategory);

router.route(`${productsBaseRoute}/seller/:id`).get(getProductBySellerId)

// Routes for Product Reviews

// Base route for managing product reviews
const reviewsBaseRoute = '/reviews';

// Create a product review
router.route(`${reviewsBaseRoute}/create`)
  .put(createProductReview);

// Get or delete a specific product review by its ID
router.route(`${reviewsBaseRoute}/:id`)
  .get(getProductReviews)      // Get product reviews
  .delete(deleteProductReview); // Delete a product review

// Export the router for use in other parts of the application
module.exports = router;
