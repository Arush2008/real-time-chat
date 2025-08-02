const express = require('express');
const app = express();
const http = require('http').createServer(app);

// Add CORS headers for all routes
app.use((req, res, next) => {
    const allowedOrigins = [
        'https://arush2008.github.io',
        'https://real-time-chat-1-fnin.onrender.com',
        'http://localhost:3000',
        'http://127.0.0.1:3000'
    ];
    
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin) || !origin) {
        res.header('Access-Control-Allow-Origin', origin || '*');
    }
    
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'false');
    
    console.log(`${req.method} ${req.path} - Origin: ${origin || 'none'}`);
    
    if (req.method === 'OPTIONS') {
        console.log('Handling OPTIONS preflight request');
        return res.status(200).end();
    }
    next();
});

// Enable JSON parsing
app.use(express.json());

const io = require('socket.io')(http, {
    cors: {
        origin: ["*", "https://arush2008.github.io", "https://real-time-chat-1-fnin.onrender.com"],
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: false
    }
});

// IMPORTANT: use the Render port!
const PORT = process.env.PORT || 3000;

// Basic route for health check
app.get('/', (req, res) => {
    res.send('Chat server is running with stats! 🚀 - Updated v2');
});

// Debug route
app.get('/debug', (req, res) => {
    res.json({
        message: 'Debug endpoint working',
        routes: ['/', '/stats', '/debug'],
        timestamp: new Date().toISOString(),
        usersLength: typeof users !== 'undefined' ? Object.keys(users).length : 'undefined',
        uniqueUsersSize: typeof uniqueUsersEverJoined !== 'undefined' ? uniqueUsersEverJoined.size : 'undefined'
    });
});

// Stats endpoint
app.get('/stats', (req, res) => {
    try {
        console.log('📊 Stats endpoint requested');
        console.log('📊 Current users object:', Object.keys(users));
        console.log('📊 Unique users set size:', uniqueUsersEverJoined.size);
        
        const statsResponse = {
            totalJoined: uniqueUsersEverJoined.size,
            currentlyOnline: Object.keys(users).length,
            timestamp: new Date().toISOString()
        };
        console.log('📤 Sending stats:', statsResponse);
        res.json(statsResponse);
    } catch (error) {
        console.error('❌ Error in stats endpoint:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

console.log('Starting server...');

// Initialize data structures BEFORE setting up routes
const users = {};
const chatHistory = [];
const adminPassword = "Arush@100";
const uniqueUsersEverJoined = new Set(); // Track unique usernames that have ever joined

io.on('connection', socket => {
    console.log('New socket connection established');
    
    // Send chat history to new user
    socket.emit('chat-history', chatHistory);

    socket.on('new-user-joined', name => {
        console.log("New user", name);
        users[socket.id] = name;
        
        // Only add to unique users if this username hasn't been seen before
        const isNewUser = !uniqueUsersEverJoined.has(name);
        uniqueUsersEverJoined.add(name);
        
        // Only add join message to history if it's a truly new user
        if (isNewUser) {
            const joinMessage = {
                type: 'join',
                message: `${name} joined the chat`,
                timestamp: new Date()
            };
            chatHistory.push(joinMessage);
            socket.broadcast.emit('user-joined', name);
        }
        
        // Send updated stats to ALL users (including the one who just joined)
        const updatedStats = {
            totalJoined: uniqueUsersEverJoined.size,
            currentlyOnline: Object.keys(users).length
        };
        console.log('Broadcasting updated stats to all users:', updatedStats);
        io.emit('stats-update', updatedStats);
    });

    socket.on('request-stats', () => {
        console.log('📊 Stats requested by client');
        const currentStats = {
            totalJoined: uniqueUsersEverJoined.size,
            currentlyOnline: Object.keys(users).length
        };
        console.log('📤 Sending requested stats:', currentStats);
        socket.emit('stats-update', currentStats);
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
        
        socket.broadcast.emit('receive', { message: message, name: users[socket.id], timestamp: chatMessage.timestamp });
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
            
            // Send updated stats to all remaining users
            const disconnectStats = {
                totalJoined: uniqueUsersEverJoined.size,
                currentlyOnline: Object.keys(users).length
            };
            console.log('Broadcasting stats after disconnect:', disconnectStats);
            io.emit('stats-update', disconnectStats);
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