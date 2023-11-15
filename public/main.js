// Wait for the HTML document to be fully loaded and then execute the following code.
document.addEventListener('DOMContentLoaded', () => {
	// Create a socket.io connection to the server.
	// const socket = io("https://chatbot-socket-io.vercel.app/");
	const socket = io("https://chatbot-socket-io.vercel.app/socket");

	// Get references to various HTML elements by their IDs.
	const chatContainer = document.getElementById('chat-container');
	const messageInput = document.getElementById('message');
	const sendButton = document.getElementById('send');
	const chatHistoryTab = document.getElementById('chat-history-tab');
	const chatHistoryContainer = document.getElementById('chat-history-container');

	// Add a click event listener to the "Chat History" tab button.
	chatHistoryTab.addEventListener('click', () => {
		// Toggle the visibility of the chat history container.
		chatHistoryContainer.classList.toggle('active');

		// Fetch and display chat history when the tab is clicked.
		if (chatHistoryContainer.classList.contains('active')) {
			// Fetch chat history data from the server when the tab is active.
			fetch('/getChatHistory')
				.then((response) => response.json())
				.then((data) => {
					// Clear the chat container to show the chat history.
					const chatContainer = document.getElementById('chat-container');
					chatContainer.innerHTML = '';

					// Display chat history in the chat container by appending messages.
					data.chatHistory.forEach((chat) => {
						appendMessage('outgoing-msg', chat.userMessage);
						appendMessage('incoming-msg', chat.botResponse);
					});
				})
				.catch((error) => {
					console.error('Error fetching chat history:', error);
				});
		}
	});

	// Add a click event listener to the send button.
	sendButton.addEventListener('click', () => {
		sendMessage();
	});

	// Add a keydown event listener to the message input for sending a message when the Enter key is pressed.
	messageInput.addEventListener('keydown', (event) => {
		if (event.key === 'Enter') {
			sendMessage();
		}
	});

	// Function to send a message to the server.
	function sendMessage() {
		const message = messageInput.value;
		if (message.trim() !== '') {
			// Append the outgoing message to the chat container.
			appendMessage('outgoing-msg', message);
			// Send the message to the server using socket.io.
			socket.emit('new message', message);
			messageInput.value = '';
		}
	}

	// Function to append a message to the chat container.
	function appendMessage(className, content) {
		const messageDiv = document.createElement('div');
		messageDiv.className = `message ${className}`;
		const msgContent = document.createElement('div');
		msgContent.className = 'msg-content';
		msgContent.textContent = content;
		messageDiv.appendChild(msgContent);
		chatContainer.appendChild(messageDiv);
		// Scroll to the bottom to show the latest message.
		chatContainer.scrollTop = chatContainer.scrollHeight;
	}

	// Listen for incoming messages from the server and append them to the chat container.
	socket.on('chat message', (message) => {
		appendMessage('incoming-msg', message);
	});
});