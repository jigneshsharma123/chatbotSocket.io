
document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const chatContainer = document.getElementById('chat-container');
    const messageInput = document.getElementById('message');
    const sendButton = document.getElementById('send');
    const chatHistoryTab = document.getElementById('chat-history-tab');
    const chatHistoryContainer = document.getElementById('chat-history-container');
  
    // Click event listener for the "Chat History" tab
    chatHistoryTab.addEventListener('click', () => {
      chatHistoryContainer.classList.toggle('active');
      // Implement logic to fetch and display chat history here
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
    // socket.on('typing', () => {
    //     // Display a "ChatGPT is typing" message in your chat interface
    //     addTypingIndicator(); // Implement this function to display the message
    // });
    // Listen for incoming messages from the server
    socket.on('chat message', (message) => {
      // Append the incoming message to the chat container
      appendMessage('incoming-msg', message);
    });
  
    // Rest of your code for handling chat history and other functionality...
  });
  