// src/components/ConversationsList.tsx

import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  RefreshControl, 
  Alert 
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native'; 
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons'; 
import { color, spacing } from "src/styles";
import { jwtDecode } from 'jwt-decode';

interface Conversation {
  user: {
    id: number;
    username: string;
  };
  lastMessage: {
    senderId: number;
    receiverId: number;
    content: string;
    sendDate: string;
  };
}

const ConversationsList = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchConversations();
    }
  }, [isFocused]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Erreur', 'Token d\'authentification non trouvé.');
        setLoading(false);
        return;
      }

      const decoded: { id: number } = jwtDecode(token);
      const userId = decoded.id;
      console.log(userId);

      const response = await axios.get(`https://n0kia-0024.com/messages/conversations/${userId}`, {
        headers: {
          Authorization: token,
        },
      });

      setConversations(response.data);
      console.log('Conversations récupérées:', response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des conversations:', error);
      Alert.alert('Erreur', 'Impossible de récupérer les conversations.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchConversations();
    setRefreshing(false);
  };

  const renderConversationItem = ({ item }: { item: Conversation }) => {
    const { user, lastMessage } = item;
    const formattedDate = new Date(lastMessage.sendDate).toLocaleDateString();

    return (
      <TouchableOpacity 
        style={styles.conversationItem}
        onPress={() => navigation.navigate('ChatScreen', {
          receiverId: user.id,
          receiverName: user.username,
        })}
      >
        <View style={styles.conversationInfo}>
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>{lastMessage.content}</Text>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={color.relief} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>
      {conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No messages yet</Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.user.id.toString()}
          renderItem={renderConversationItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[color.relief]} />
          }
        />
      )}
    </View>
  );
};

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
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Nokia',
    color: color.relief,
  },
  conversationItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: color.relief,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  conversationInfo: {
    flex: 1,
    marginRight: 10,
  },
  username: {
    fontSize: 18,
    fontFamily: 'Nokia',
    color: color.relief,
    marginBottom: 5,
  },
  lastMessage: {
    fontSize: 14,
    fontFamily: 'Nokia',
    color: color.relief,
    opacity: 0.7,
  },
  dateContainer: {
    alignItems: 'flex-end',
  },
  date: {
    fontSize: 12,
    fontFamily: 'Nokia',
    color: color.relief,
    opacity: 0.7,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Nokia',
    color: color.relief,
    opacity: 0.7,
  },
});

export default ConversationsList;
