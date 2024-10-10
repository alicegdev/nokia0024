// ChatScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { getSocket } from '../../socket';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface Message {
  id: number;
  content: string;
  senderId: number;
  receiverId: number;
  sendDate: string;
}

const ChatScreen = ({ route }: any) => {
  const { receiverId, receiverName } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const initializeChat = async () => {
      // Retrieve user ID from token
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const decoded: { id: number } = jwtDecode(token);
        console.log('Decoded token:', decoded);
        const currentUserId = decoded.id;
        setUserId(currentUserId);

        // Attendre que userId soit défini avant de récupérer les messages
        await fetchMessages(currentUserId);
      }

      // Listen for incoming messages
      const socket = getSocket();
      socket.on('receiveMessage', (message: Message) => {
        if (
          (message.senderId === receiverId && message.receiverId === userId) ||
          (message.senderId === userId && message.receiverId === receiverId)
        ) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      });
    };

    initializeChat();

    return () => {
      const socket = getSocket();
      socket.off('receiveMessage');
    };
  }, []);

  const fetchMessages = async (currentUserId: number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(
        `https://n0kia-0024.com/messages/${currentUserId}/${receiverId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = () => {
    if (inputMessage.trim() === '') return;
    const socket = getSocket();
    socket.emit('sendMessage', { receiverId: receiverId.toString(), content: inputMessage });
    setInputMessage('');
  };
  const renderItem = ({ item }: { item: Message }) => (
    <View style={item.senderId === userId ? styles.myMessage : styles.theirMessage}>
      <Text>{item.content}</Text>
      <Text style={styles.timestamp}>{new Date(item.sendDate).toLocaleTimeString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        inverted // To show the latest messages at the bottom
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Type your message..."
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
};

// Add your styles here
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6',
    margin: 5,
    padding: 10,
    borderRadius: 5,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    margin: 5,
    padding: 10,
    borderRadius: 5,
  },
  timestamp: {
    fontSize: 10,
    color: 'gray',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 5,
    borderTopColor: '#ccc',
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 15,
  },
});

export default ChatScreen;
