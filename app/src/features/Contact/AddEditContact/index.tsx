import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';

interface ContactForm {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isFavorite: boolean;
}

const AddEditContact = () => {
  const [form, setForm] = useState<ContactForm>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    isFavorite: false,
  });

  const route = useRoute();
  const navigation: any = useNavigation();

  // Vérification si les paramètres existent
  const contactId = route.params ? (route.params as { contactId?: number }).contactId : undefined;

  useEffect(() => {
    // Si contactId est défini, on veut modifier un contact existant, donc on le récupère
    if (contactId) {
      fetchContact();
    }
  }, [contactId]);

  // Fonction pour récupérer les détails du contact
  const fetchContact = async () => {
    try {
      const response = await axios.get(`http://51.158.69.60:5050/contacts/${contactId}`);
      setForm({
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        phoneNumber: response.data.phoneNumber,
        isFavorite: response.data.isFavorite,
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Fonction pour gérer l'enregistrement ou la mise à jour du contact
  const handleSave = async () => {
    try {
      if (contactId) {
        // Si contactId existe, on modifie le contact
        await axios.put(`http://51.158.69.60:5050/contacts/${contactId}`, form);
      } else {
        // Si contactId n'existe pas, on crée un nouveau contact
        await axios.post('http://51.158.69.60:5050/contacts', form);
      }
      navigation.navigate('ContactList'); // Redirection vers la liste des contacts après l'opération
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>First Name</Text>
      <TextInput
        style={styles.input}
        value={form.firstName}
        onChangeText={(text) => setForm({ ...form, firstName: text })}
      />
      <Text>Last Name</Text>
      <TextInput
        style={styles.input}
        value={form.lastName}
        onChangeText={(text) => setForm({ ...form, lastName: text })}
      />
      <Text>Phone Number</Text>
      <TextInput
        style={styles.input}
        value={form.phoneNumber}
        onChangeText={(text) => setForm({ ...form, phoneNumber: text })}
        keyboardType="phone-pad"
      />
      <Button
        title={form.isFavorite ? 'Unmark as Favorite' : 'Mark as Favorite'}
        onPress={() => setForm({ ...form, isFavorite: !form.isFavorite })}
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default AddEditContact;
