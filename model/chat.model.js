const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    userMessage: String,    // User's message
    botResponse: String,    // Bot's response
    timestamp: { type: Date, default: Date.now },
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
