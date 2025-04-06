require('module-alias/register')

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
mongoose.set("strictQuery", false);
mongoose.promise = global.Promise
const dotenv = require('dotenv');
dotenv.config()
const dbConnect = require('@config/database')
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Import models
require('@models/models')

// Import routes
app.use(require('./src/routes'));

// WebSocket setup with socket.io
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['my-custom-header'],
        credentials: true
    }
});


// Make `io` available globally across your app
app.set('io', io); // 💡 This line is important

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('message', (message) => {
        console.log('Message received:', message);
        io.emit('message', message); // broadcast to all clients
    });
});


// Start the server after the database connection
dbConnect().then(() => {
    console.log('Database connected successfully');
    const PORT = process.env.PORT || 8000;
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.log('Database connection failed', err);
});
