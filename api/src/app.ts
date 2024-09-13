import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import debugLib from 'debug';
import { createServer } from 'http';
import prisma from './db/index';
import { Server } from 'socket.io';

import indexRouter from './routes/index';
import userRouter from './User/users.route';
import contactRoutes from './Contact/contacts.route';
import messageRoutes from './Message/messages.route';

const debug = debugLib('src:server');
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/contacts', contactRoutes);
app.use('/messages', messageRoutes);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Stockage des utilisateurs connectés
const connectedUsers = new Map<string, string>();  // socketId -> userId

// Gérer les connexions Socket.IO
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Stocker l'utilisateur connecté via son socketId
  socket.on('register', (userId: string) => {
    connectedUsers.set(socket.id, userId);
    console.log(`User with ID ${userId} connected via socket ${socket.id}`);
  });

  // Gestion de l'envoi de message
  socket.on('sendMessage', async ({ senderId, receiverId, content }) => {
    try {
      // Créer le message dans la base de données
      const message = await prisma.message.create({
        data: {
          content,
          senderId: parseInt(senderId),
          receiverId: parseInt(receiverId),
        },
      });

      // Rechercher le socket de l'utilisateur récepteur
      const receiverSocketId = [...connectedUsers.entries()]
        .find(([_, id]) => id === receiverId)?.[0];

      // Envoyer le message au récepteur s'il est connecté
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receiveMessage', message);
        console.log(`Message sent from ${senderId} to ${receiverId}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  // Déconnexion
  socket.on('disconnect', () => {
    const userId = connectedUsers.get(socket.id);
    if (userId) {
      console.log(`User with ID ${userId} disconnected.`);
      connectedUsers.delete(socket.id);
    }
  });
});

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '5050');
app.set('port', port);

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

export default app;
