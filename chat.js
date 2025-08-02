const socket = io("http://localhost:3000");

const form = document.getElementById("send-container");
const messageInput = document.getElementById("user-input");
const messageContainer = document.querySelector(".chat-messages");

const name = prompt("Enter your name to join");
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

// Send message on button click
document.getElementById('send-btn-id').addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
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
            append({message: message}, 'right');
            socket.emit('send', message);
            messageInput.value = '';
        }
    }
});
