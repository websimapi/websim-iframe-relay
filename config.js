export const config = {
    // User configuration
    userName: "User" + Math.floor(Math.random() * 1000), // Random username
    
    // Communication settings
    allowedOrigins: ['*'],  // In production, limit this to specific origins
    
    // Message format settings
    messageFormat: {
        type: 'CHAT_MESSAGE',
        message: '', // The actual message text
        sender: '',  // Who sent the message
        timestamp: '' // When the message was sent
    },
    
    // Debug mode to help troubleshoot postMessage communication
    debugMode: true
};