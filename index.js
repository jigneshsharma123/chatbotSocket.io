// Import the Express.js library for creating a web server.
const express = require('express');
// Create an Express application.
const app = express();
// Load environment variables from a .env file.
require('dotenv').config();
// Connect to the MongoDB database using the configuration in './config/mongoose.js'.
const db = require('./config/mongoose');
// Define the server's port, either from the environment variable or default to 3000.
const port = process.env.PORT || 3000;
// Create an HTTP server using the Express app.
const http = require('http').createServer(app);
// Create a Socket.io server on top of the HTTP server.
const io = require('socket.io')(http);
// Import the OpenAI library for language processing.
const OpenAI = require('openai');
// Get the OpenAI API key from environment variables.
const openaiApiKey = process.env.OPENAI_API_KEY; 
// Import the 'Chat' model for storing chat history.
const Chat = require('./model/chat.model');

// Initialize the OpenAI object with the API key.
const openai = new OpenAI({
	key: openaiApiKey
});

// Serve static files from the 'public' directory.
app.use(express.static('public'));

// Add a new route to get chat history.
app.get('/getChatHistory', async (req, res) => {
	try {
		// Fetch chat history from your MongoDB database.
		const chatHistory = await Chat.find().exec();

		// Send the chat history as a JSON response.
		res.json({
			chatHistory
		});
	} catch (error) {
		console.error('Error fetching chat history:', error);
		res.status(500).json({
			error: 'An error occurred while fetching chat history'
		});
	}
});

// Define a route to serve the main HTML page.
app.get("/", (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

// Socket.io connection event handler.
io.on('connection', socket => {
	console.log("Connected to the user");

	// Inside the Socket.io connection event handler
	socket.on('new message', async (userMessage) => {
		// Emit a "typing" event to indicate that ChatGPT is typing.
		socket.emit('typing');

		try {
			// Send the user's message to OpenAI for processing.
			const response = await openai.chat.completions.create({
				model: 'gpt-3.5-turbo',
				messages: [{
						role: 'system',
						content: 'You are a helpful assistant.'
					},
					{
						role: 'user',
						content: userMessage
					}, // User's message is included here
				],
				max_tokens: 4000,
			});

			// Extract the bot's response from OpenAI's API response.
			if (response.choices && response.choices[0]) {
				const botResponse = response.choices[0].message.content;

				// Create a new chat document and save it to MongoDB.
				const chatMessage = new Chat({
					userMessage: userMessage,
					botResponse: botResponse,
				});
				await chatMessage.save();

				// Simulate typing indicator by waiting for a moment.
				setTimeout(() => {
					socket.emit('chat message', botResponse);
				}, 1000); // You can adjust the duration
			} else {
				console.error('Unexpected response from OpenAI:', response);
			}
		} catch (error) {
			console.error('OpenAI API error:', error);
		}
	});

	// Handle user disconnection.
	socket.on('disconnect', () => {
		console.log('A user is disconnected');
	});
});

// Start the server and listen on the defined port.
http.listen(port, (err) => {
	if (err) {
		console.log("Error in connecting to the server");
	}
	console.log("Server is running on port:", port);
});