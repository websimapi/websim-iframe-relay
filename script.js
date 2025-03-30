import { config } from 'config';

// DOM elements
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const copyCodeButton = document.getElementById('copyCode');
const codeSnippet = document.getElementById('codeSnippet');

// Chat functionality
function sendMessage() {
    const message = messageInput.value.trim();
    
    if (message) {
        // Create a message element
        const messageEl = document.createElement('div');
        messageEl.className = 'message sent';
        
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        
        // Message data
        const messageData = {
            type: 'CHAT_MESSAGE',
            message: message,
            sender: config.userName,
            timestamp: now.toISOString()
        };
        
        // Display the message in our chat window
        messageEl.innerHTML = `
            ${message}
            <span class="message-info">Sent at ${timeString}</span>
        `;
        chatMessages.appendChild(messageEl);
        
        // Send the message to the parent window
        window.parent.postMessage(messageData, '*');
        
        // Clear the input field
        messageInput.value = '';
        
        // Scroll to the bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Event listeners
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Copy code functionality
copyCodeButton.addEventListener('click', () => {
    const codeText = codeSnippet.textContent;
    navigator.clipboard.writeText(codeText)
        .then(() => {
            copyCodeButton.textContent = 'Copied!';
            setTimeout(() => {
                copyCodeButton.textContent = 'Copy Code';
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
        });
});

// Listen for messages from parent window
window.addEventListener('message', (event) => {
    // You might want to add origin checking in production
    const data = event.data;
    
    if (data.type === 'CHAT_MESSAGE' && data.sender !== config.userName) {
        // Create a message element for received messages
        const messageEl = document.createElement('div');
        messageEl.className = 'message received';
        
        const timestamp = new Date(data.timestamp);
        const timeString = timestamp.toLocaleTimeString();
        
        messageEl.innerHTML = `
            ${data.message}
            <span class="message-info">${data.sender} at ${timeString}</span>
        `;
        chatMessages.appendChild(messageEl);
        
        // Scroll to the bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});

// Add a demo message
setTimeout(() => {
    const demoMessage = document.createElement('div');
    demoMessage.className = 'message received';
    demoMessage.innerHTML = `
        Welcome to the iframe chat! Try sending a message to communicate with the parent window.
        <span class="message-info">System at ${new Date().toLocaleTimeString()}</span>
    `;
    chatMessages.appendChild(demoMessage);
}, 1000);

