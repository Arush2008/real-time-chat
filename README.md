# Real-Time Chat Application

A simple real-time chat application built with Node.js, Socket.io, and vanilla JavaScript.

## Features

- 🚀 Real-time messaging
- 👤 Persistent usernames (saved in browser)
- 📝 Join/leave notifications
- 💬 Chat history for new users
- 🔧 Admin controls to clear chat
- 📱 Responsive design

## Setup Instructions

### Prerequisites
- Node.js installed on your system

### Installation

1. **Clone or download this repository**

2. **Navigate to the server directory:**
   ```bash
   cd nordServer
   ```

3. **Install dependencies:**
   ```bash
   npm install socket.io
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:3000`

5. **Open the chat application:**
   - Open `index.html` in your web browser
   - Enter your name when prompted
   - Start chatting!

## Usage

### For Users
- **First time:** Enter your name - it will be saved for future visits
- **Messaging:** Type your message and press Enter or click Send
- **Change name:** Type `/changename` to change your username

### For Admins
- **Clear chat:** Type `/admin-clear` and enter the admin password
- **Admin password:** `Arush@100` (can be changed in server code)

## File Structure

```
├── index.html          # Main chat interface
├── chat.js            # Client-side JavaScript
├── style.css          # Styling
├── nordServer/        # Server directory
│   ├── index.js       # Server code
│   ├── package.json   # Dependencies
│   └── node_modules/  # Installed packages
├── .gitignore         # Git ignore file
├── .nojekyll          # Disable Jekyll on GitHub Pages
└── README.md          # This file
```

## Technologies Used

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js, Socket.io
- **Real-time Communication:** WebSockets via Socket.io

## Contributing

Feel free to fork this project and submit pull requests for any improvements.

## License

This project is open source and available under the MIT License.
