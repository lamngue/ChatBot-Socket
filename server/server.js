const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const http = require('http');
require('dotenv').config()
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const {getTime} = require('./utils/timeTeller');
const pathFile = path.join(__dirname, '../client');
const Messages = require('./models/Messages');
const port = process.env.PORT || 3000;
let onlineUser = [];
app.use(express.static(pathFile));
server.listen(port, () => {
    mongoose.connect(`${process.env.MONGODB_URL}`,{useNewUrlParser: true});
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open',() => {
    console.log(`Connected to database. Server started on port ${port}`);
    io.on('connection', (socket) => {
        console.log('A new client connected');
        const welcomeMessage = {
            user: "Admin",
            content: "Welcome to the chat bot!"
        }
        socket.emit('welcomeMessage',welcomeMessage)
        socket.on('createMessage', (message) => {
            console.log('createMessage', message);
            const newMessage = {
                user: message.user,
                content: message.content
            }
            io.emit('newMessage', newMessage);
        });
        socket.on('newUser', (user) => {
            socket.user = user;
            onlineUser.push(user);
            console.log(`There are currently ${onlineUser.length} active users`);
            io.emit('fetchUser', onlineUser);
            const newUserMessage = {
                user: "Admin",
                content: `New user joined, with username ${onlineUser[onlineUser.length-1]}`
            }
            socket.broadcast.emit('welcomeMessage',newUserMessage);
        });
        //display time every 13 mins
        setInterval(() => {
            socket.emit('displayTime',getTime());
        },780000);
        socket.on('disconnect', () => {
            onlineUser.splice(onlineUser.indexOf(socket.user), 1);
            io.emit('fetchUser', onlineUser);
            console.log(`There are currently ${onlineUser.length} active users`);
            console.log('Client disconnected');
        });
    });
});