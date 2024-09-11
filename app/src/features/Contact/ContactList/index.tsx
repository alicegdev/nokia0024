import React, { useEffect, useState } from 'react';
import { View, Text, SectionList, TouchableOpacity, StyleSheet, Alert, Button } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native'; 
import axios from 'axios';
import * as Contacts from 'expo-contacts'; // Expo Contacts pour gérer les contacts du téléphone
import { MaterialIcons } from '@expo/vector-icons'; // Pour utiliser des icônes

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isFavorite: boolean;
  source: 'db' | 'phone'; // Nouvelle propriété pour identifier la source du contact
}

// Fonction utilitaire pour trier et regrouper les contacts
const groupContactsByLetter = (contacts: Contact[]) => {
  const groupedContacts: { [key: string]: Contact[] } = {};

  contacts.forEach((contact) => {
    const firstChar = contact.firstName.charAt(0).toUpperCase();

    // Vérifier si c'est un chiffre, une lettre ou un caractère spécial
    if (/[0-9]/.test(firstChar)) {
      if (!groupedContacts['#']) groupedContacts['#'] = [];
      groupedContacts['#'].push(contact);
    } else if (/[A-Z]/.test(firstChar)) {
      if (!groupedContacts[firstChar]) groupedContacts[firstChar] = [];
      groupedContacts[firstChar].push(contact);
    } else {
      if (!groupedContacts['*']) groupedContacts['*'] = [];
      groupedContacts['*'].push(contact);
    }
  });

  // Convertir en tableau de sections, trié par ordre alphabétique et numérique
  const sortedSections = Object.keys(groupedContacts)
    .sort() // Trier les sections par clé (A-Z, 0-9, caractères spéciaux)
    .map((key) => ({
      title: key,
      data: groupedContacts[key].sort((a, b) => a.firstName.localeCompare(b.firstName)),
    }));

  return sortedSections;
};

const ContactList = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [phoneContacts, setPhoneContacts] = useState<Contact[]>([]);
  const navigation: any = useNavigation();
  const isFocused = useIsFocused(); // Hook pour savoir si l'écran est en focus

  useEffect(() => {
    if (isFocused) {
      fetchContacts(); // Recharger les contacts de la base de données chaque fois que l'écran est en focus
      checkAndFetchPhoneContacts(); // Vérifier les permissions et récupérer les contacts du téléphone
    }
  }, [isFocused]);

  // Fonction pour récupérer les contacts de la base de données
  const fetchContacts = async () => {
    try {
      const response = await axios.get('http://51.158.69.60:5050/contacts');
      const dbContacts = response.data.map((contact: any) => ({
        ...contact,
        source: 'db', // Ajouter le flag source pour les contacts de la base de données
      }));
      setContacts(dbContacts);
    } catch (error) {
      console.error(error);
    }
  };

  // Fonction pour vérifier les permissions et récupérer les contacts du téléphone
  const checkAndFetchPhoneContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync(); // Demander directement les permissions avec expo-contacts

    if (status === 'granted') {
      fetchPhoneContacts();
    } else {
      Alert.alert('Permission denied', 'Cannot access contacts without permission.');
    }
  };

  // Récupérer les contacts du téléphone
  const fetchPhoneContacts = async () => {
    try {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      if (data.length > 0) {
        const formattedContacts: any = data.map((contact) => ({
          id: contact.id,
          firstName: contact.firstName,
          lastName: contact.lastName || '',
          phoneNumber: contact.phoneNumbers ? contact.phoneNumbers[0]?.number : '',
          isFavorite: false,
          source: 'phone', // Ajouter le flag source pour les contacts du téléphone
        }));
        setPhoneContacts(formattedContacts); // Stocker les contacts du téléphone
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Supprimer un contact
  const deleteContact = async (contact: Contact) => {
    if (contact.source === 'db') {
      // Supprimer le contact de la base de données
      try {
        await axios.delete(`http://51.158.69.60:5050/contacts/${contact.id}`);
        fetchContacts(); // Refresh the list after deletion
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Ouvrir les détails d'un contact
  const openContactDetails = (contact: Contact) => {
    if (contact.source === 'db') {
      // Naviguer vers l'écran de détails pour un contact de la base de données
      navigation.navigate('ContactDetails', { contactId: contact.id });
    } else if (contact.source === 'phone') {
      // Afficher les informations directement pour un contact du téléphone
      Alert.alert('Contact Details', `Name: ${contact.firstName} ${contact.lastName}\nPhone: ${contact.phoneNumber}`);
    }
  };

  // Combiner les contacts de la base de données et ceux du téléphone pour les afficher
  const combinedContacts = [...contacts, ...phoneContacts];

  // Trier les contacts par ordre alphabétique et les regrouper en sections
  const sections = groupContactsByLetter(combinedContacts);

  const renderItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => openContactDetails(item)}
    >
      <View style={styles.contactRow}>
        <View style={styles.contactInfo}>
          <Text>{item.firstName} {item.lastName}</Text>
          {item.phoneNumber && <Text>{item.phoneNumber}</Text>}
        </View>
        {item.source === 'db' && (
          <Button title="Delete" onPress={() => deleteContact(item)} /> // Afficher le bouton "Delete" seulement pour les contacts de la db
        )}
        {item.source === 'phone' && (
          <MaterialIcons name="phone-android" size={24} color="gray" /> // Afficher une icône pour les contacts du téléphone
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
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
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactInfo: {
    flexDirection: 'column',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#f4f4f4',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});

export default ContactList;
