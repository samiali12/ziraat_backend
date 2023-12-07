const express = require('express')
const router = express.Router()
const Product = require('../models/productModel')

router.get('/search', async (request, response) => {

    const { query } = request.query;
    //const query = "Apple"

    try {
        const results = await Product.find({
            $or: [
                { title: { $regex: query, $options: 'i' } }, // Case-insensitive title search
                { description: { $regex: query, $options: 'i' } }, // Case-insensitive description search
                { category: { $regex: query, $options: 'i' } }, // Case-insensitive category search
            ],
        }).populate('seller', 'fullName email profilePicture location');
        
        response.status(200).json({
            success: true,
            message: 'search successfully',
            results
        })
    }
    catch(error){
        response.status(500).json({ message: 'Internal server error' });
    }
})


module.exports =  router;