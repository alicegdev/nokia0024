import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';


interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  isFavorite: boolean;
}

const ContactDetails = () => {
  const [contact, setContact] = useState<Contact | null>(null);
  const route = useRoute();
  const navigation: any = useNavigation();
  const { contactId } = route.params as { contactId: number };

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    try {
      const response: any = await axios.get(`https://n0kia-0024.com/contacts/${contactId}`);
      setContact(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!contact) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text>First Name: {contact.firstName}</Text>
      <Text>Last Name: {contact.lastName}</Text>
      <Text>Phone Number: {contact.phoneNumber}</Text>
      <Text>Email: {contact.email}</Text>
      <Text>Favorite: {contact.isFavorite ? 'Yes' : 'No'}</Text>
      <Button title="Edit" onPress={() => navigation.navigate('AddEditContact', { contactId: contact.id })} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default ContactDetails;
