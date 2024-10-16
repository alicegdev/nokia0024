// ChatScreen.tsx
import React, { useEffect, useState, useRef, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { getSocket } from '../../socket';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { color, spacing } from 'src/styles'; // Import des styles
import { AuthContext } from 'src/contexts/AuthContext';
import { MessagesContext } from 'src/contexts/MessagesContext';

interface Message {
  id: number;
  content: string;
  senderId: number;
  receiverId: number;
  sendDate: string;
}

interface DecodedToken {
  id: number;
  // Ajoutez d'autres propriétés si nécessaires
}

const ChatScreen = ({ route }: any) => {
  const { receiverId: receiverIdParam, receiverName } = route.params;
  const receiverId = Number(receiverIdParam);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const { state } = useContext(AuthContext);
  const { markConversationAsRead } = useContext(MessagesContext);
  const token = state.token;
  const userId = state.userId;

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const initializeChat = async () => {
      // Récupérer l'ID de l'utilisateur à partir du token
      if (token) {
        await fetchMessages(userId);
      }
    };

    initializeChat();
  }, []);

  useEffect(() => {
    markConversationAsRead(receiverId.toString());
  }, [receiverId]);


  useEffect(() => {
    if (userId !== null) {
      const socket = getSocket();

      const handleReceiveMessage = (message: Message) => {
        console.log('Received message:', message);
        if (
          (message.senderId === receiverId && message.receiverId === userId) ||
          (message.senderId === userId && message.receiverId === receiverId)
        ) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      };

      socket.on('receiveMessage', handleReceiveMessage);

      return () => {
        socket.off('receiveMessage', handleReceiveMessage);
      };
    }
  }, [userId]);

  // Faire défiler la liste vers le bas lorsque les messages sont mis à jour
  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const fetchMessages = async (userId: number | null) => {
    console.log('Fetching messages between', userId, 'and', receiverId);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(
        `https://n0kia-0024.com/messages/${userId}/${receiverId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log('Fetched messages:', response.data);

      // Trier les messages du plus ancien au plus récent
      const sortedMessages = response.data.sort((a: Message, b: Message) =>
        new Date(a.sendDate).getTime() - new Date(b.sendDate).getTime()
      );

      setMessages(sortedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = () => {
    if (inputMessage.trim() === '') return;
    
    const newMessage: Message = {
      id: Date.now(), // Utiliser un ID temporaire basé sur le timestamp
      content: inputMessage,
      senderId: userId!,
      receiverId: receiverId,
      sendDate: new Date().toISOString(),
    };
  
    // Ajouter le message à l'état messages
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  
    const socket = getSocket();
    socket.emit('sendMessage', { receiverId, content: inputMessage });
  
    setInputMessage('');
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isMyMessage = item.senderId === userId;
    return (
      <View style={isMyMessage ? styles.myMessage : styles.theirMessage}>
        <Text style={isMyMessage ? styles.messageText : styles.messageTextOther}>{item.content}</Text>
        <Text style={styles.timestamp}>{new Date(item.sendDate).toLocaleTimeString()}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{receiverName}</Text>
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 10 }}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Type your message..."
          placeholderTextColor={color.relief}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles mis à jour
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.menu,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: color.menu,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Nokia',
    color: color.relief,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: color.relief,
    margin: 5,
    padding: 10,
    borderRadius: 5,
    maxWidth: '80%',
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: color.menu,
    borderColor: color.relief,
    borderWidth: 1,
    margin: 5,
    padding: 10,
    borderRadius: 5,
    maxWidth: '80%',
  },
  messageText: {
    fontFamily: 'Nokia',
    fontSize: 16,
    color: color.menu,
  },
  messageTextOther: {
    fontFamily: 'Nokia',
    fontSize: 16,
    color: color.relief,
  },
  timestamp: {
    fontSize: 10,
    fontFamily: 'Nokia',
    color: 'gray',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 5,
    borderTopColor: color.relief,
    borderTopWidth: 1,
    backgroundColor: color.menu,
  },
  input: {
    flex: 1,
    borderRadius: 25,
    borderColor: color.relief,
    borderWidth: 1,
    paddingHorizontal: 15,
    fontFamily: 'Nokia',
    color: color.relief,
  },
  sendButton: {
    backgroundColor: color.relief,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Nokia',
  },
});

export default ChatScreen;
