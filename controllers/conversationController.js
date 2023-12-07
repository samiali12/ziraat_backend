const Conversation = require('../models/conversationodel')
const asyncErrorHandler = require('../middleware/asyncErrorHandler')

const sendMessage = asyncErrorHandler(async (request, response) => {

    const { senderId, receiverId, messageContent } = request.body

    

})