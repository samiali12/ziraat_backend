const express = require('express')
const router = express.Router()
const Product = require('../models/productModel')
const  QuoteRequest = require('../models/requestQuoteModel')

router.route('/quote-request').post(
    async (request, response) => {

        const { productId } = request.body;

        try {
            const product = await Product.findById(productId).populate('seller');

            if (!product) {
                return response.status(404).json({ success: false, message: 'Product not found' });
            }

            const sellerId = product.seller._id; // Access seller details here

            const newQuoteRequest = await QuoteRequest.create({
                product: productId,
                seller: sellerId
                // Other relevant details like user message, status, timestamps, etc.
              });

              console.log(newQuoteRequest)

            return response.status(200).json({ success: true, quoteRequest: newQuoteRequest});
        } catch (error) {
            response.status(500).json({ success: false, message: 'Error creating quote request' });
        }

    }
)


module.exports = router;