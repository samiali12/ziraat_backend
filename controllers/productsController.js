
// userController.js

const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const asyncErrorHandler = require('../middleware/asyncErrorHandler');
const Features = require('../utils/features');
const User = require('../models/userModel')

const cloudinary = require('cloudinary')

// Products Controller Functions for getting all products 
const getAllProducts = async (request, response) => {

    try {
      
        productsData = await Product.find().populate('seller', 'fullName email profilePicture location');

        response.status(200).json({
            success: true,
            productsData,
        });
    }
    catch (error) {
        response.status(500).json({
            success: false,
            error: error.message,
        });
    }
}

const getProductsByCategory = async (request, response) => {

    const category = request.params.categoryName

    if(category){
        try {
      
            productsData = await Product.find(
                { category: category }
            ).populate('seller', 'fullName email profilePicture location');
    
            response.status(200).json({
                success: true,
                productsData,
            });
        }
        catch (error) {
            response.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }
    
}

// Get Products By Seller Id

const getProductBySellerId = async (request, response) => {
   
    const products = await Product.find({ seller: request.params.id })

    response.status(200).json({
        success: true,
        products,
    })

}

// Product Controller Functions For Creating New Product
const createProduct = asyncErrorHandler(async (request, response) => {

    let images = []
    let imagesLinks = []

    if (typeof request.body.images === "string") {
        images.push(request.body.images)
    } else {
        images = request.body.images
    }

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], { folder: request.body.seller })

        imagesLinks.push(
            {
                public_id: result.public_id,
                image_url: result.secure_url
            }
        )
    }

    request.body.images = imagesLinks

    const product = await Product.create(request.body)

    response.status(200).json({
        success: true,
        product
    })

})

// Product Controller Function For Updating Existing Product
const updateProduct = asyncErrorHandler(async (request, response, next) => {
   
    let images = []
    let imagesLinks = []

    if (typeof request.body.images === "string") {
        images.push(request.body.images)
    } else {
        images = request.body.images
    }

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], { folder: request.body.seller })

        imagesLinks.push(
            {
                public_id: result.public_id,
                image_url: result.secure_url
            }
        )
    }

    request.body.images = imagesLinks

    let product = await Product.findById(request.params.id)

    if (!product) {
        return (next(new ErrorHandler('Product Not Found', 404)))
    }


    product = await Product.findByIdAndUpdate(request.params.id, request.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    response.status(200).json({
        success: true,
        product,
    })
})



// Product Controller Function to Delete  Product
const deleteProduct = asyncErrorHandler(async (request, response) => {

    let imagesPublicId = []
    let productFolderName = ""

    const product = await Product.findById(request.params.id)
    productFolderName = product.seller

    product.images.map((product) => (
        cloudinary.uploader.destroy(product.public_id, function (error, result) {
            if (error) {
                console.error(error);
            } else {
                console.log(result);
                console.log(`Image with public ID ${public_id} has been deleted.`);
            }
        })
    ))

    if (!product) {
        return (next(new ErrorHandler('Product Not Found', 404)))
    }


    await Product.findByIdAndRemove(request.params.id)

    response.status(200).json({
        success: true,
        message: "Product Deleted Successfully"
    })
})

// Product Controller Fucntion For Reading Specific Product
const getSpecificProduct = asyncErrorHandler(async (request, response, next) => {

    const product = await Product.findById(request.params.id)
  
    if (!product) {
        return (next(new ErrorHandler('Product Not Found', 404)))
    }

    response.status(200).json({
        success: true,
        product
    })
})



// User reviews on product 
const createProductReview = asyncErrorHandler(async (request, response, next) => {

    const { rating, comment, productId } = request.body

    console.log(request.user)


    newReview = {
        user: request.user._id,
        name: request.user.fullName,
        rating: Number(rating),
        comment
    }


    const product = await Product.findById(productId)


    const isReviewed = product.reviews.find((rev) => {
        console.log(rev)
        if (rev.user.toString() === request.user._id.toString()) {

            return true
        }
    })

    if (isReviewed) {
        product.reviews.forEach((review) => {
            if (review.user.toString() === request.user._id.toString()) {
                review.rating = rating
                review.comment = comment
            }
        })
    }
    else {
        product.reviews.push(newReview)
        product.numberReviews = product.reviews.length
    }

    let avg = 0
    product.rating = product.reviews.forEach(review => {
        avg = avg + review.rating
    })

    product.rating = avg / product.numberReviews

    await product.save({ validateBeforSave: false })

    response.status(200).json({
        success: true,
        message: "Reviews add successfully"
    })

})


const getProductReviews = asyncErrorHandler(async (request, response, next) => {

    const product = await Product.findById(request.query.productId)

    if (!product) {
        return next(new ErrorHandler("Product Not Found"))
    }

    productReviews = product.reviews
    response.status(200).json({
        sucess: true,
        productReviews
    })

})

const deleteProductReview = asyncErrorHandler(async (request, response, next) => {

    const product = await Product.findById(request.query.productId)

    if (!product) {
        return next(new ErrorHandler("Product Not Found"))
    }

    const notDeletedProductReviews = product.reviews.filter(
        (rev) => {
            return rev._id.toString() !== request.query.id.toString()
        }
    )


    let avg = 0
    notDeletedProductReviews.forEach(review => {
        avg = avg + review.rating
    })


    const numberReviews = notDeletedProductReviews.length
    const rating = avg / numberReviews

    const reviews = { ...notDeletedProductReviews }

    await Product.findByIdAndUpdate(request.query.productId, {
        reviews: reviews,
        rating: 4.9,
        numberReviews: numberReviews,
    }, {
        new: true,
        validateBeforSave: true,
        useFindAndModify: false
    }, (error, updatedReviews) => {
        if (error) {
            return response.status(200).json({
                success: true,
                message: "Reviews Not be deleted successfully"
            })
        }
        else {
            response.status(200).json({
                success: true,
                message: "Reviews deleted successfully",
                updatedReviews

            })
        }
    })


})

// Export the controller functions
module.exports = {
    getProductBySellerId,
    getProductsByCategory,
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getSpecificProduct,
    createProductReview,
    getProductReviews,
    deleteProductReview,
}