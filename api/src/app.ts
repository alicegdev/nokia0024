import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import debugLib from 'debug';

dotenv.config();

import indexRouter from './routes/index';
import userRouter from './User/users.route';
import contactRoutes from './Contact/contacts.route';
import messageRoutes from './Message/messages.route';
import scoreRoutes from './Score/scores.route';
import prisma from './db';

const debug = debugLib('src:server');
const app = express();

// Configurer l'application Express (middlewares, routes, etc.)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public'))); // Si nécessaire, déplacez ceci après Socket.IO

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/contacts', contactRoutes);
app.use('/messages', messageRoutes);
app.use('/scores', scoreRoutes);

// Créer le serveur HTTP indépendamment
const httpServer = createServer();

// Attacher Express au serveur HTTP
httpServer.on('request', app);

// Créer le serveur Socket.IO en l'attachant au serveur HTTP
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const secretKey = process.env.TOKEN_SECRET_KEY;

// Stockage des utilisateurs connectés
const connectedUsers = new Map<string, string>();  // userId -> socketId

// Middleware d'authentification Socket.IO
io.use((socket, next) => {
  const token = socket.handshake.auth.token; // Expect the token in auth property
  if (!token) {
    return next(new Error('Authentication error'));
  }

  jwt.verify(token, secretKey as string, (err: any, decoded: any) => {
    if (err) {
      return next(new Error('Authentication error'));
    }
    socket.data.userId = decoded.id; // Store userId in socket data
    next();
  });
});

// Gestion des connexions Socket.IO
io.on('connection', (socket) => {
  const userId = socket.data.userId;
  console.log(`User connected: ${userId}`);

  // Map userId to socket.id
  connectedUsers.set(userId, socket.id);

  // Handle incoming messages
  socket.on('sendMessage', async ({ receiverId, content }) => {
    try {
      const senderId = socket.data.userId;

      // Save message to the database
      const message = await prisma.message.create({
        data: {
          content,
          senderId: parseInt(senderId),
          receiverId: parseInt(receiverId),
        },
      });

      // Find receiver's socket ID
      const receiverSocketId = connectedUsers.get(receiverId);

      // Emit the message to the receiver if connected
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receiveMessage', message);
        console.log(`Message sent from ${senderId} to ${receiverId}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    connectedUsers.delete(userId);
    console.log(`User disconnected: ${userId}`);
  });
});

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '5050');
// app.set('port', port); // Plus nécessaire

/**
 * Listen on provided port, on all network interfaces.
 */
httpServer.listen(port);
httpServer.on('error', onError);
httpServer.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val: string) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error: NodeJS.ErrnoException) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = httpServer.address();  // Utilisation de httpServer
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + (addr as any).port;
  debug('Listening on ' + bind);
}

export default app; // Vous pouvez supprimer cette ligne si vous n'avez pas besoin d'exporter app
