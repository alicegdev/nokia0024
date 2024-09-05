import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isFavorite: boolean;
}

const ContactList = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const navigation: any = useNavigation();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response: any = await axios.get('http://10.93.160.191:5050/contacts');
      setContacts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteContact = async (id: number) => {
    try {
        await axios.delete(`http://10.93.160.191:5050/contacts/${id}`);
      fetchContacts(); // Refresh the list after deletion
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('ContactDetails', { contactId: item.id })}
    >
      <Text>{item.firstName} {item.lastName}</Text>
      <Button title="Delete" onPress={() => deleteContact(item.id)} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <Button title="Add Contact" onPress={() => navigation.navigate('AddEditContact')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ContactList;
