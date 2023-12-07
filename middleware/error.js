
const ErrorHandler = require('../utils/errorHandler')

module.exports = (error, request, response, next) => {

    error.statusCode = error.statusCode || 500
    error.message = error.message || 'Internal Server Error'


    // // Wrong mongoose id error
    // if (error.name === 'CastError') {
    //     // Invalid ID format or type
    //     message = 'Invalid ID'
    //     error = new ErrorHandler(message, 400)
    // }

    // duplicate key error. if user with same email is already exits
    if (error.statusCode === 'E11000') {
        // Duplicate key error
        const duplicateKey = Object.keys(error.keyValue)[0];
        message = 'User already exits on this email.'
        error = new ErrorHandler(message, 400)
    }

   
    response.status(error.statusCode).json({
        success: false,
        message: error.message
        //error: err.stack
    })

}
