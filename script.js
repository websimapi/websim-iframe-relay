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
        
        // Send the message to the parent window with proper targeting
        try {
            // Send to parent with proper origin targeting
            window.parent.postMessage(messageData, '*');
            
            if (config.debugMode) {
                console.log('Message sent to parent:', messageData);
            }
        } catch (err) {
            console.error('Failed to send message:', err);
            // Add fallback notification in the chat
            const errorMsg = document.createElement('div');
            errorMsg.className = 'message system';
            errorMsg.innerHTML = `
                <span style="color:red">Failed to send message: ${err.message}</span>
                <span class="message-info">System at ${timeString}</span>
            `;
            chatMessages.appendChild(errorMsg);
        }
        
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
    // Proper origin validation
    if (config.allowedOrigins[0] !== '*' && 
        !config.allowedOrigins.includes(event.origin)) {
        if (config.debugMode) {
            console.warn(`Rejected message from unauthorized origin: ${event.origin}`);
        }
        return;
    }
    
    const data = event.data;
    
    if (config.debugMode) {
        console.log('Received message:', data);
    }
    
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

// Add a demo message and communication status check
setTimeout(() => {
    const demoMessage = document.createElement('div');
    demoMessage.className = 'message received';
    demoMessage.innerHTML = `
        Welcome to the chat! This page will communicate with its parent window when placed in an iframe.
        <span class="message-info">System at ${new Date().toLocaleTimeString()}</span>
    `;
    chatMessages.appendChild(demoMessage);
    
    // Check if we're in an iframe
    const isInIframe = window !== window.parent;
    
    const statusMessage = document.createElement('div');
    statusMessage.className = 'message system';
    statusMessage.innerHTML = `
        <span style="color: ${isInIframe ? 'green' : 'orange'}">
            ${isInIframe ? 'Running in iframe - communications enabled!' : 'Not yet embedded in an iframe - parent window messaging will work when embedded.'}
        </span>
        <span class="message-info">System at ${new Date().toLocaleTimeString()}</span>
    `;
    chatMessages.appendChild(statusMessage);
}, 1000);