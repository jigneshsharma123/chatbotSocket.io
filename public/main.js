document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const chatContainer = document.getElementById('chat-container');
    const messageInput = document.getElementById('message');
    const sendButton = document.getElementById('send');
    const chatHistoryTab = document.getElementById('chat-history-tab');
    const chatHistoryContainer = document.getElementById('chat-history-container');
    chatHistoryTab.addEventListener('click', () => {
        chatHistoryContainer.classList.toggle('active');

        // Fetch and display chat history when the tab is clicked
        if (chatHistoryContainer.classList.contains('active')) {
            fetch('/getChatHistory')
                .then((response) => response.json())
                .then((data) => {
                    const chatContainer = document.getElementById('chat-container');

                    // Clear previous chat messages
                    chatContainer.innerHTML = '';

                    // Display chat history in the chat container
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

    sendButton.addEventListener('click', () => {
        sendMessage();
    });

    messageInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = messageInput.value;
        if (message.trim() !== '') {
            // Append the outgoing message to the chat container
            appendMessage('outgoing-msg', message);
            // Send the message to the backend using socket.io
            socket.emit('new message', message);
            messageInput.value = '';
        }
    }

    // Function to append a message to the chat container
    function appendMessage(className, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${className}`;
        const msgContent = document.createElement('div');
        msgContent.className = 'msg-content';
        msgContent.textContent = content;
        messageDiv.appendChild(msgContent);
        chatContainer.appendChild(messageDiv);
        // Scroll to the bottom to show the latest message
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Listen for incoming messages from the server
    socket.on('chat message', (message) => {
        // Append the incoming message to the chat container
        appendMessage('incoming-msg', message);
    });
});
