const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const pathFile = path.join(__dirname, '../client');
const port = process.env.PORT || 3000;
let onlineUser = [];
io.on('connection',(socket) => {
    console.log('A new client connected');
    socket.on('createMessage', (message) => {
        console.log('createMessage',message);
        const newMessage = {
            user: message.user,
            content: message.content
        }
        io.emit('newMessage',newMessage);
    });
    socket.on('newUser',(user) => {
        socket.user = user;
        onlineUser.push(user);
        console.log(`There are currently ${onlineUser.length} active users`);
        io.emit('fetchUser',onlineUser);
    });
    socket.on('disconnect', () => {
        onlineUser.splice(onlineUser.indexOf(socket.user),1);
        io.emit('fetchUser',onlineUser);
        console.log(`There are currently ${onlineUser.length} active users`);
        console.log('Client disconnected');
    });
});
app.use(express.static(pathFile));
server.listen(port,() => {
    console.log(`Server started on port ${port}`);
});
