
const socket= io('http://project-web-alon-and-yotam.onrender.com','http://localhost:5502','http://127.0.0.1:5502',{});
console.log(socket.id);
document.addEventListener('DOMContentLoaded', () => {
    const input = document.querySelector('.chat-input input');
    const button = document.querySelector('.chat-input button');
    const chatWindow = document.querySelector('.chat-window');

    // Event listener for the send button
    button.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent form submission
        sendMessage();
    });

    // Event listener for pressing the Enter key
    input.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission
            sendMessage();
        }
    });

    // Function to send a message
    function sendMessage() {
        const message = input.value.trim();
        if (message !== '') {
            // Emit the message to the server
            socket.emit('chat message', message);
            // Add the message to the chat window as a sent message
            appendMessage(message, 'sent');
            // Clear the input field
            input.value = '';
        }
    }

    // Function to append a message to the chat window
    function appendMessage(msg, type) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', type);
        messageElement.innerHTML = `<div class="message-content"><p>${msg}</p></div>`;
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight; // Scroll to the bottom
    }

    // Listen for messages from the server
    socket.on('chat message', (msg) => {
        // Add the message to the chat window as a received message
        appendMessage(msg, 'received');
    });

    // Log connection status
    socket.on('connect', () => {
        console.log('Connected to server');
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from server');
    });
});

