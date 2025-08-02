const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// IMPORTANT: use the Railway port!
const PORT = process.env.PORT || 3000;

// Basic route for health check
app.get('/', (req, res) => {
    res.send('Chat server is running! 🚀');
});

console.log('Starting server...');

const users = {};
const chatHistory = [];
const adminPassword = "Arush@100";

io.on('connection', socket => {
    // Send chat history to new user
    socket.emit('chat-history', chatHistory);

    socket.on('new-user-joined', name => {
        console.log("New user", name);
        users[socket.id] = name;
        
        // Add join message to history
        const joinMessage = {
            type: 'join',
            message: `${name} joined the chat`,
            timestamp: new Date()
        };
        chatHistory.push(joinMessage);
        
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message => {
        const chatMessage = {
            type: 'message',
            message: message,
            name: users[socket.id],
            timestamp: new Date()
        };
        
        // Add to chat history
        chatHistory.push(chatMessage);
        
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        if (users[socket.id]) {
            const userName = users[socket.id];
            console.log(`${userName} left the chat`);
            
            // Add leave message to history
            const leaveMessage = {
                type: 'leave',
                message: `${userName} left the chat`,
                timestamp: new Date()
            };
            chatHistory.push(leaveMessage);
            
            socket.broadcast.emit('user-left', userName);
            delete users[socket.id];
        }
    });

    // Admin function to clear chat
    socket.on('admin-clear-chat', (password) => {
        if (password === adminPassword) {
            chatHistory.length = 0; // Clear the array
            io.emit('chat-cleared'); // Notify all users
            console.log('Chat cleared by admin');
        } else {
            socket.emit('admin-error', 'Invalid admin password');
        }
    });
});

// IMPORTANT: use http.listen(...) not server.listen(...)
http.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Chat server is running on port ${PORT}`);
}).on('error', (err) => {
    console.error('Server failed to start:', err);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});