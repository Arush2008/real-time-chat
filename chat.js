const socket = io(config.getServerUrl());

const form = document.getElementById("send-container");
const messageInput = document.getElementById("user-input");
const messageContainer = document.querySelector(".chat-messages");

// Check if user already has a saved name
let name = localStorage.getItem('chatUserName');
if (!name) {
    name = prompt("Enter your name to join");
    if (name) {
        localStorage.setItem('chatUserName', name);
    }
}

// Display welcome message
console.log(`Welcome back, ${name}!`);
socket.emit('new-user-joined', name);

const append = (message, position) => {
    const messageElement = document.createElement("div");
    
    if (position === 'center') {
        // For join/leave messages - center aligned
        messageElement.classList.add("message-container", "center");
        messageElement.innerHTML = `<div class="message center-message">${message}</div>`;
    } else {
        // For regular chat messages
        messageElement.classList.add("message-container", position);
        messageElement.innerHTML = `
            <div class="user-name">${position === 'right' ? 'You' : (message.name || 'User')}</div>
            <div class="message">${message.message || message}</div>
        `;
    }
    
    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message) {
        append({message: message}, 'right');
        socket.emit('send', message);
        messageInput.value = '';
    }
});

socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'center');
});

socket.on('receive', data => {
    append(data, 'left');
});

// Handle user leaving
socket.on('user-left', name => {
    append(`${name} left the chat`, 'center');
});

// Load chat history when connecting
socket.on('chat-history', (history) => {
    // Clear existing messages (except the demo ones)
    const demoMessages = messageContainer.querySelectorAll('.message-container');
    demoMessages.forEach(msg => msg.remove());
    
    // Add all historical messages
    history.forEach(item => {
        if (item.type === 'join' || item.type === 'leave') {
            append(item.message, 'center');
        } else if (item.type === 'message') {
            append({message: item.message, name: item.name}, 'left');
        }
    });
});

// Handle chat being cleared by admin
socket.on('chat-cleared', () => {
    messageContainer.innerHTML = '';
    append('Chat has been cleared by admin', 'center');
});

// Admin error handling
socket.on('admin-error', (error) => {
    alert(error);
});

// Send message on button click
document.getElementById('send-btn-id').addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
        // Check for admin commands
        if (message.startsWith('/admin-clear')) {
            const password = prompt('Enter admin password:');
            if (password) {
                socket.emit('admin-clear-chat', password);
            }
            messageInput.value = '';
            return;
        }
        
        // Check for name change command
        if (message.startsWith('/changename')) {
            const newName = prompt('Enter your new name:');
            if (newName && newName.trim()) {
                localStorage.setItem('chatUserName', newName.trim());
                alert('Name changed! Please refresh the page to apply changes.');
            }
            messageInput.value = '';
            return;
        }
        
        append({message: message}, 'right');
        socket.emit('send', message);
        messageInput.value = '';
    }
});

// Send message on Enter key
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const message = messageInput.value.trim();
        if (message) {
            // Check for admin commands
            if (message.startsWith('/admin-clear')) {
                const password = prompt('Enter admin password:');
                if (password) {
                    socket.emit('admin-clear-chat', password);
                }
                messageInput.value = '';
                return;
            }
            
            // Check for name change command
            if (message.startsWith('/changename')) {
                const newName = prompt('Enter your new name:');
                if (newName && newName.trim()) {
                    localStorage.setItem('chatUserName', newName.trim());
                    alert('Name changed! Please refresh the page to apply changes.');
                }
                messageInput.value = '';
                return;
            }
            
            append({message: message}, 'right');
            socket.emit('send', message);
            messageInput.value = '';
        }
    }
});
