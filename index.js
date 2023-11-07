const express = require('express');
const app = express();
require('dotenv').config();
const db = require('./config/mongoose');
const port = process.env.PORT || 3000;
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const OpenAI = require('openai');
const openaiApiKey = process.env.OPENAI_API_KEY;
const Chat = require('./model/chat.model')
// Initialize the OpenAI object with the API key
const openai = new OpenAI({ key: openaiApiKey });

app.use(express.static('public'));

  
app.get("/", (req,res)=> {
   res.sendFile(__dirname + '/public/index.html');
});

//socket.io connection  
io.on('connection', socket => {
    console.log("Connected to the user");

  // Inside the Socket.io connection event handler
  socket.on('new message', async (userMessage) => {
    // Emit a "typing" event to indicate that ChatGPT is typing
    socket.emit('typing');

    try {
        // Send the user's message to OpenAI for processing
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: userMessage },  // User's message is included here
            ],
            max_tokens: 50,
        });

        // Extract the bot's response from OpenAI's API response
        if (response.choices && response.choices[0]) {
            const botResponse = response.choices[0].message.content;

            // Create a new chat document and save it to MongoDB
            const chatMessage = new Chat({
                userMessage: userMessage,
                botResponse: botResponse,
            });
            await chatMessage.save();

            // Simulate typing indicator by waiting for a moment
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



    socket.on('disconnect',()=> {
        console.log('A user is disconnected');
    });
});

http.listen(port, (err)=> {
    if(err) {
        console.log("Error in connecting to the server");
    }
    console.log("Server is running on port:", port);
});
