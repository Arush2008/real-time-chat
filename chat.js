const socket = io("http://localhost:8000");

const form = document.getElementById("send-container");
const messageInput = document.getElementById("user-input");
const messageContainer = document.querySelector(".chat-messages");

const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);
