module.exports = asyncErrorHandler => (request, response, next) => (

    Promise.resolve(asyncErrorHandler(request, response, next)).catch(next)
)