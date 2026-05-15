const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const userRoutes = require('./routes/userRoutes');
const printRoutes = require('./routes/printRoutes');

const startCleanupService = require('./utils/cleanupService');

connectDB();
startCleanupService();

const app = express();
const server = http.createServer(app);

// Socket.io initialization
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ['GET', 'POST'],
    },
});

app.set('socketio', io);

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

const path = require('path');

app.use(express.json());
app.use(cors());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/print', printRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Socket.io connection logic
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join_room', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
