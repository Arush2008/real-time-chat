// nord servers
const io = require('socket.io')(3000);

const users = {};

io.on('connection', socket => {
    socket.on('user-joined', name => {

    })
})