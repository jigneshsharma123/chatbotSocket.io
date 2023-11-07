const mongoose = require('mongoose'); // Import the mongoose library, which is a MongoDB object modeling tool.

// Create a schema for the chat data using mongoose.
const chatSchema = new mongoose.Schema({
    // Define a field to store the user's message as a string.
    userMessage: String,    // User's message

    
    
    // Define a field to store the bot's response as a string.
    botResponse: String,    // Bot's response

    
    // Define a timestamp field that stores the creation date and time of the chat entry.
    timestamp: { type: Date, default: Date.now },
});

// Create a model for the chat data using the chat schema.

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;  // Export the Chat model, making it available for use in other parts of your application.
