import React, { useEffect, useState } from 'react';
import { View, Text, SectionList, TouchableOpacity, Alert, Modal } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native'; 
import axios from 'axios';
import * as Contacts from 'expo-contacts';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { color } from "src/styles";
import * as Linking from 'expo-linking';
import styles from './styles';

interface Contact {
  isRegisteredUser: boolean;
  userId: number | null;
  email: string;
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isFavorite: boolean;
  source: 'db' | 'phone';
}

const groupContactsByLetter = (contacts: Contact[]) => {
  const groupedContacts: { [key: string]: Contact[] } = {};

  contacts.forEach((contact) => {
    const firstChar = contact.firstName.charAt(0).toUpperCase();

    if (/[0-9]/.test(firstChar)) {
      if (!groupedContacts["#"]) groupedContacts["#"] = [];
      groupedContacts["#"].push(contact);
    } else if (/[A-Z]/.test(firstChar)) {
      if (!groupedContacts[firstChar]) groupedContacts[firstChar] = [];
      groupedContacts[firstChar].push(contact);
    } else {
      if (!groupedContacts["*"]) groupedContacts["*"] = [];
      groupedContacts["*"].push(contact);
    }
  });

  const sortedSections = Object.keys(groupedContacts)
    .sort()
    .map((key) => ({
      title: key,
      data: groupedContacts[key].sort((a, b) =>
        a.firstName.localeCompare(b.firstName),
      ),
    }));

  return sortedSections;
};

const ContactList = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [phoneContacts, setPhoneContacts] = useState<Contact[]>([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    if (isFocused) {
      
      fetchData();
    }
  }, [isFocused]);

  const fetchData = async () => {
      const [dbContacts, phoneContactsData] = await Promise.all([
        fetchContacts(),
        checkAndFetchPhoneContacts(),
      ]);

      const mailContacts = [...dbContacts, ...phoneContactsData];

      const updatedContacts = await checkMails(mailContacts);

      const updatedDbContacts = updatedContacts.filter(
        (contact) => contact.source === 'db'
      );
      const updatedPhoneContacts = updatedContacts.filter(
        (contact) => contact.source === 'phone'
      );

      setContacts(updatedDbContacts);
      setPhoneContacts(updatedPhoneContacts);
    };


  const fetchContacts = async (): Promise<Contact[]> => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.EXPO_PUBLIC_URL}/contacts`, {
        headers: {
          Authorization: token,
        },
      });
      const dbContacts = response.data.map((contact: any) => ({
        ...contact,
        source: 'db',
        isRegisteredUser: false,
        userId: null,
      }));

      return dbContacts;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const checkAndFetchPhoneContacts = async (): Promise<Contact[]> => {
    const { status } = await Contacts.requestPermissionsAsync();

    if (status === 'granted') {
      return await fetchPhoneContacts();
    } else {
      Alert.alert('Permission denied', 'Cannot access contacts without permission.');
      return [];
    }
  };

  const fetchPhoneContacts = async (): Promise<Contact[]> => {
    try {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
      });

      if (data.length > 0) {
        const formattedContacts: Contact[] = data.map((contact) => ({
          id: contact.id,
          firstName: contact.firstName || '',
          lastName: contact.lastName || '',
          phoneNumber: contact.phoneNumbers ? contact.phoneNumbers[0]?.number : '',
          email: contact.emails ? contact.emails[0]?.email : '',
          isFavorite: false,
          source: 'phone',
          isRegisteredUser: false,
          userId: null,
        }));
        return formattedContacts;
      } else {
        return [];
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const checkMails = async (mailContacts: Contact[]): Promise<Contact[]> => {
    const token = await AsyncStorage.getItem('token');

    const updatedContacts = await Promise.all(
      mailContacts.map(async (contact) => {
        if (!contact.email) {
          return contact;
        }

        try {
          const response = await axios.get(
            `${process.env.EXPO_PUBLIC_URL}/users/by-email/${contact.email}`,
            {
              headers: {
                Authorization: token,
              },
            }
          );
          const user = response.data;
          if (user && user.id) {
            return {
              ...contact,
              isRegisteredUser: true,
              userId: user.id,
            };
          } else {
            return contact;
          }
        } catch (error) {
          return contact;
        }
      })
    );

    return updatedContacts;
  };

const deleteContact = (contact: Contact) => {
  if (contact.source === 'db') {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this contact?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Deletion cancelled'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => handleDelete(contact),
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  }
};

const handleDelete = async (contact: Contact) => {
  const token = await AsyncStorage.getItem('token');
  try {
    await axios.delete(`${process.env.EXPO_PUBLIC_URL}/contacts/${contact.id}`, {
      headers: {
        Authorization: token,
      },
    });
    await fetchData();
  } catch (error) {
    console.error(error);
  }
};

  const openContactDetails = (contact: Contact) => {
      setSelectedContact(contact);
      setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedContact(null);
  };

  const startChatWithContact = (contact: Contact) => {
    closeModal();
    if (contact.userId) {
      navigation.navigate('ChatScreen', {
        receiverId: contact.userId,
        receiverName: `${contact.firstName} ${contact.lastName}`,
      });
    } else {
      Alert.alert(
        'Utilisateur introuvable',
        'Ce contact n\'est pas inscrit sur l\'application.'
      );
    }
  };

  const callContact = (contact: Contact) => {
    const phoneNumber = `tel:${contact.phoneNumber}`;
    Linking.canOpenURL(phoneNumber)
    .then((supported) => {
      if (supported) {
        console.log("Launching dialer...");
        Linking.openURL(phoneNumber);
      } else {
        console.log("Dialer not supported on this device.");
      }
    })
    .catch((err) => {
      console.error("Error testing URL scheme", err);
    });

  };

  const combinedContacts = [...contacts, ...phoneContacts];

  const sections = groupContactsByLetter(combinedContacts);

  const renderItem = ({ item }: { item: Contact }) => (
    <View style={styles.item}>
      <View style={styles.contactRow}>
        <TouchableOpacity
          style={styles.contactInfoContainer}
          onPress={() => openContactDetails(item)}
        >
          <Text style={styles.contactName}>{item.firstName} {item.lastName}</Text>
        </TouchableOpacity>
        <View style={styles.actionsContainer}>
        {item.source === 'db' && item.isRegisteredUser && (
            <TouchableOpacity onPress={() => callContact(item)} style={styles.iconButton}>
              <MaterialIcons name="phone" size={24} color={color.relief}/>
            </TouchableOpacity>
          )}
          {item.source === 'db' && item.isRegisteredUser && (
            <TouchableOpacity onPress={() => startChatWithContact(item)} style={styles.iconButton}>
              <MaterialIcons name="message" size={24} color={color.relief}/>
            </TouchableOpacity>
          )}
          {item.source === 'phone' && item.isRegisteredUser && (
            <>
            <TouchableOpacity onPress={() => startChatWithContact(item)} style={styles.iconButton}>
              <MaterialIcons name="message" size={24} color={color.relief} />
            </TouchableOpacity>
            <MaterialIcons name="phone-android" size={24} color={color.relief} style={styles.iconButton} />
            </>
          )}
          {item.source === 'phone' && !item.isRegisteredUser && (
            <MaterialIcons name="phone-android" size={24} color={color.relief} style={styles.iconButton} />
          )}
          {item.source === 'db' && (
            <TouchableOpacity onPress={() => deleteContact(item)} style={styles.iconButton}>
              <MaterialIcons name="delete" size={24} color={color.relief} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Contacts</Text>
      </View>
      <SectionList
        sections={sections}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
      />
            {/* Modal pour les détails du contact */}
            <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Contact</Text>
            {selectedContact && (
              <>
                <Text style={styles.modalText}>Name : {selectedContact.firstName} {selectedContact.lastName}</Text>
                {selectedContact.phoneNumber && (
                  <Text style={styles.modalText}>Phone number : {selectedContact.phoneNumber}</Text>
                )}
                {selectedContact.email && (
                  <Text style={styles.modalText}>Email : {selectedContact.email}</Text>
                )}
              </>
            )}
            {selectedContact && selectedContact.isRegisteredUser ? (
              <TouchableOpacity
                style={styles.button}
                onPress={() => startChatWithContact(selectedContact)}
              >
                <Text style={styles.buttonText}>Text</Text>
              </TouchableOpacity>
            ) : null
              }
            {selectedContact && selectedContact.source === 'db' && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  closeModal();
                  navigation.navigate('AddEditContact', { contactId: selectedContact.id });}
                }
              >

                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeModal}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('AddEditContact')} style={styles.button}>
          <Text style={styles.buttonText}>Add Contact</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ContactList;