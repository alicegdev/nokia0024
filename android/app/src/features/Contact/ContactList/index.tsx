import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Button,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import axios from "axios";
import * as Contacts from "expo-contacts"; // Expo Contacts pour gérer les contacts du téléphone
import { MaterialIcons } from "@expo/vector-icons"; // Pour utiliser des icônes
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Contact {
  email: string;
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isFavorite: boolean;
  source: "db" | "phone"; // Nouvelle propriété pour identifier la source du contact
}

// Fonction utilitaire pour trier et regrouper les contacts
const groupContactsByLetter = (contacts: Contact[]) => {
  const groupedContacts: { [key: string]: Contact[] } = {};

  contacts.forEach((contact) => {
    const firstChar = contact.firstName.charAt(0).toUpperCase();

    // Vérifier si c'est un chiffre, une lettre ou un caractère spécial
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

  // Convertir en tableau de sections, trié par ordre alphabétique et numérique
  const sortedSections = Object.keys(groupedContacts)
    .sort() // Trier les sections par clé (A-Z, 0-9, caractères spéciaux)
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
      const response = await axios.get("https://n0kia-0024.com/contacts");
      const dbContacts = response.data.map((contact: any) => ({
        ...contact,
        source: "db", // Ajouter le flag source pour les contacts de la base de données
      }));
      setContacts(dbContacts);
    } catch (error) {
      console.error(error);
    }
  };

  // Fonction pour vérifier les permissions et récupérer les contacts du téléphone
  const checkAndFetchPhoneContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync(); // Demander directement les permissions avec expo-contacts

    if (status === "granted") {
      fetchPhoneContacts();
    } else {
      Alert.alert(
        "Permission denied",
        "Cannot access contacts without permission.",
      );
    }
  };

  // Récupérer les contacts du téléphone
  const fetchPhoneContacts = async () => {
    try {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      if (data.length > 0) {
        const formattedContacts: any = data.map((contact) => {
          const phoneNumber =
            Array.isArray(contact.phoneNumbers) &&
            contact.phoneNumbers.length > 0
              ? contact.phoneNumbers[0].number
              : "";

          return {
            id: contact.id,
            firstName: contact.firstName || "",
            lastName: contact.lastName || "",
            phoneNumber: phoneNumber,
            isFavorite: false,
            source: "phone", // Ajouter le flag source pour les contacts du téléphone
          };
        });
        setPhoneContacts(formattedContacts); // Stocker les contacts du téléphone
      }
    } catch (error) {
      console.error("Could not fetch phone contacts, error: " + error);
    }
  };

  // Supprimer un contact
  const deleteContact = async (contact: Contact) => {
    if (contact.source === "db") {
      // Supprimer le contact de la base de données
      try {
        await axios.delete(`https://n0kia-0024.com/contacts/${contact.id}`);
        fetchContacts(); // Refresh the list after deletion
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Ouvrir les détails d'un contact
  const openContactDetails = async (contact: Contact) => {
    if (contact.source === "db") {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(
          `https://n0kia-0024.com/users/by-email/${contact.email}`,
          {
            headers: {
              Authorization: token,
            },
          },
        );

        const user = response.data;
        if (user && user.id) {
          // Naviguer vers l'écran de chat avec le userId du destinataire
          navigation.navigate("ChatScreen", {
            receiverId: user.id,
            receiverName: `${contact.firstName} ${contact.lastName}`,
          });
        } else {
          Alert.alert(
            "Utilisateur introuvable",
            "Ce contact n'est pas inscrit sur l'application.",
          );
        }
      } catch (error) {
        console.error("Error fetching user by email:", error);
      }
    } else if (contact.source === "phone") {
      Alert.alert(
        "Contact du téléphone",
        `Name: ${contact.firstName} ${contact.lastName}\nPhone: ${contact.phoneNumber}`,
      );
    }
  };

  // Uniquement contacts du téléphone
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
          <Text>
            {item.firstName} {item.lastName}
          </Text>
          {item.phoneNumber && <Text>{item.phoneNumber}</Text>}
        </View>
        {item.source === "db" && (
          <Button title="Delete" onPress={() => deleteContact(item)} /> // Afficher le bouton "Delete" seulement pour les contacts de la db
        )}
        {item.source === "phone" && (
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
      <Button
        title="Add Contact"
        onPress={() => navigation.navigate("AddEditContact")}
      />
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
    borderBottomColor: "#ccc",
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contactInfo: {
    flexDirection: "column",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: "#f4f4f4",
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});

export default ContactList;
