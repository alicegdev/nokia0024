// src/socket.ts
import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

let socket: any;

export const initializeSocket = async () => {
  const token = await AsyncStorage.getItem('token');
  socket = io('http://51.158.69.60:5050', {
    path: '/socket.io',
    auth: {
      token,
    },
  });

  socket.on('connect', () => {
    console.log('Connected to Socket.IO server');
  });

  socket.on('connect_error', (err: any) => {
    console.error('Socket.IO connection error:', err.message);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not initialized');
  }
  return socket;
};
