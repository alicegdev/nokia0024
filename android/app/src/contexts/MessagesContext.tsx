// src/contexts/MessagesContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './AuthContext';
import { getSocket } from '../socket';

interface MessagesContextType {
  unreadMessages: { [conversationId: string]: number };
  clearUnreadMessages: () => void;
  markConversationAsRead: (conversationId: string) => void;
}

interface Message {
  id: number;
  content: string;
  senderId: number;
  receiverId: number;
  sendDate: string;
}

export const MessagesContext = createContext<MessagesContextType>({
  unreadMessages: {},
  clearUnreadMessages: () => {},
  markConversationAsRead: () => {},
});

export const MessagesProvider: React.FC = ({ children }) => {
  const [unreadMessages, setUnreadMessages] = useState<{ [conversationId: string]: number }>({});
  const { state } = useContext(AuthContext);
  const userId = state.userId;

  useEffect(() => {
    console.log('MessagesProvider mounted');
    console.log('userId:', userId);
    if (userId !== null) {
      const socket = getSocket();

      const handleReceiveMessage = (message: Message) => {
        console.log('New message received via socket:', message);

        // Update unread messages state
        setUnreadMessages(prevState => {
          const conversationId = message.senderId.toString();
          const count = prevState[conversationId] || 0;
          return {
            ...prevState,
            [conversationId]: count + 1,
          };
        });
      };

      socket.on('receiveMessage', handleReceiveMessage);

      return () => {
        socket.off('receiveMessage', handleReceiveMessage);
      };

    };
  }, [userId]);

  const clearUnreadMessages = () => {
    setUnreadMessages({});
  };

  const markConversationAsRead = (conversationId: string) => {
    setUnreadMessages(prevState => {
      const updatedState = { ...prevState };
      delete updatedState[conversationId];
      return updatedState;
    });
  };

  return (
    <MessagesContext.Provider
      value={{ unreadMessages, clearUnreadMessages, markConversationAsRead }}
    >
      {children}
    </MessagesContext.Provider>
  );
};
