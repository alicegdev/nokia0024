import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
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

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/contacts', contactRoutes);
app.use('/messages', messageRoutes);
app.use('/scores', scoreRoutes);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  path: '/socket.io',
  cors: {
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PATCH"]
  }
});

const secretKey = process.env.TOKEN_SECRET_KEY;

const connectedUsers = new Map<string, string>();

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

io.on('connection', (socket) => {
  const userId = socket.data.userId;

  connectedUsers.set(userId.toString(), socket.id);

  socket.on('sendMessage', async ({ receiverId, content }) => {
    try {
      const senderId = socket.data.userId;

      const message = await prisma.message.create({
        data: {
          content,
          senderId: parseInt(senderId),
          receiverId: parseInt(receiverId),
          sendDate: new Date(),
        },
      });

      const receiverSocketId = connectedUsers.get(receiverId.toString());

      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receiveMessage', message);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  socket.on('disconnect', () => {
    connectedUsers.delete(userId);
  });
});

type QueryEvent = {
  timestamp: Date
  query: string
  params: string
  duration: number
  target: string
}

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
}

function onListening() {
  const addr = httpServer.address();
  const bind = addr ? (typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port) : '';
  debug('Listening on ' + bind);
}
