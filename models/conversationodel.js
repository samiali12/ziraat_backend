const mongoose = require('mongoose')

const conversationSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    messageContent: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
})

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
