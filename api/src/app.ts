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

// **Assurez-vous que le middleware static est placé APRÈS la configuration de Socket.IO**
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/contacts', contactRoutes);
app.use('/messages', messageRoutes);
app.use('/scores', scoreRoutes);

// Créer le serveur HTTP
const httpServer = createServer(app);

// Créer le serveur Socket.IO et l'attacher au serveur HTTP
const io = new Server(httpServer, {
  path: '/socket.io', // Assurez-vous que le chemin est correct
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const secretKey = process.env.TOKEN_SECRET_KEY;

// Stockage des utilisateurs connectés : userId -> socketId
const connectedUsers = new Map<string, string>();

// Middleware d'authentification pour Socket.IO
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }

  jwt.verify(token, secretKey as string, (err: any, decoded: any) => {
    if (err) {
      return next(new Error('Authentication error'));
    }
    socket.data.userId = decoded.id;
    connectedUsers.set(socket.data.userId.toString(), socket.id);
    next();
  });
});

// Gestion des connexions Socket.IO
io.on('connection', (socket) => {
  const userId = socket.data.userId;
  console.log(`User connected: ${userId}`);

  connectedUsers.set(userId.toString(), socket.id);
  console.log('Connected users:', connectedUsers);

  // Gérer l'envoi de messages
  socket.on('sendMessage', async ({ receiverId, content }) => {
    console.log(`Sending message to ${receiverId}: ${content}`);
    try {
      const senderId = socket.data.userId;
      console.log(`Sender ID: ${senderId}`);

      const message = await prisma.message.create({
        data: {
          content,
          senderId: parseInt(senderId),
          receiverId: parseInt(receiverId),
          sendDate: new Date(),
        },
      });
      console.log('Message created:', message);

      const receiverSocketId = connectedUsers.get(receiverId.toString());
      console.log(`Receiver socket ID: ${receiverSocketId}`); // undefined

      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receiveMessage', message);
        console.log(`Message sent from ${senderId} to ${receiverId}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  // Gérer la déconnexion
  socket.on('disconnect', () => {
    connectedUsers.delete(userId);
    console.log(`User disconnected: ${userId}`);
  });
});

// Démarrer le serveur HTTP
const port = normalizePort(process.env.PORT || '5050');
httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

function normalizePort(val: string) {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

function onError(error: NodeJS.ErrnoException) {
  // Gestion des erreurs du serveur HTTP
}

function onListening() {
  const addr = httpServer.address();
  const bind = addr ? (typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port) : '';
  debug('Listening on ' + bind);
}
