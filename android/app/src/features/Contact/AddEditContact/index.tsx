import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { color } from "src/styles"; // Assurez-vous que le chemin est correct
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ContactForm {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  isFavorite: boolean;
}

const AddEditContact = () => {
  const [form, setForm] = useState<ContactForm>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    isFavorite: false,
  });

  const route = useRoute();
  const navigation: any = useNavigation();

  const contactId = route.params
    ? (route.params as { contactId?: number }).contactId
    : undefined;

  useEffect(() => {
    if (contactId) {
      fetchContact();
    }
  }, [contactId]);

  const fetchContact = async () => {
    try {
      const response = await axios.get(`${process.env.EXPO_PUBLIC_URL}/contacts/${contactId}`);
      setForm({
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        phoneNumber: response.data.phoneNumber,
        email: response.data.email,
        isFavorite: response.data.isFavorite,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      if (contactId) {
        // route protégée et nécessite un token
        await axios.put(`${process.env.EXPO_PUBLIC_URL}/contacts/${contactId}`, form, {
          headers: {
            Authorization: token,
          },
        }

        );
      } else {
        console.log(token);
        await axios.post(`${process.env.EXPO_PUBLIC_URL}/contacts`, form, {
          headers: {
            Authorization: token,
          },
        });
      }
      navigation.navigate("ContactList");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {contactId ? "Edit Contact" : "Add Contact"}
        </Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>First Name</Text>
          </View>
          <View style={styles.inputTopBorder} />
          <View style={styles.inputBottomBorder} />
          <TextInput
            style={styles.input}
            value={form.firstName}
            onChangeText={(text) => setForm({ ...form, firstName: text })}
          />
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Last Name</Text>
          </View>
          <View style={styles.inputTopBorder} />
          <View style={styles.inputBottomBorder} />
          <TextInput
            style={styles.input}
            value={form.lastName}
            onChangeText={(text) => setForm({ ...form, lastName: text })}
          />
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Phone Number</Text>
          </View>
          <View style={styles.inputTopBorder} />
          <View style={styles.inputBottomBorder} />
          <TextInput
            style={styles.input}
            value={form.phoneNumber}
            onChangeText={(text) => setForm({ ...form, phoneNumber: text })}
            keyboardType="phone-pad"
          />
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Email</Text>
          </View>
          <View style={styles.inputTopBorder} />
          <View style={styles.inputBottomBorder} />
          <TextInput
            style={styles.input}
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {/* <TouchableOpacity
          style={[styles.favoriteButton, form.isFavorite ? styles.favoriteActive : null]}
          onPress={() => setForm({ ...form, isFavorite: !form.isFavorite })}
        >
          <Text style={styles.favoriteButtonText}>
            {form.isFavorite ? 'Unmark as Favorite' : 'Mark as Favorite'}
          </Text>
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
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
    fontFamily: "Nokia",
    color: color.relief,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20, // Ajustez pour réduire la largeur des champs
    paddingTop: 20,
  },
  inputContainer: {
    marginBottom: 20,
    position: "relative",
  },
  labelContainer: {
    position: "absolute",
    top: -10,
    left: 15,
    backgroundColor: color.menu,
    paddingHorizontal: 5,
    zIndex: 1,
  },
  label: {
    fontFamily: "Nokia",
    color: color.relief,
    fontSize: 16,
  },
  input: {
    height: 50,
    borderColor: color.relief,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontFamily: "Nokia",
    color: color.relief,
  },
  inputTopBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 25, // Ajustez selon vos besoins
    borderColor: color.relief,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  inputBottomBorder: {
    position: "absolute",
    top: 25, // Doit correspondre à la hauteur de inputTopBorder
    left: 0,
    right: 0,
    bottom: 0,
    borderColor: color.relief,
    borderWidth: 1,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderTopWidth: 0,
  },
  favoriteButton: {
    backgroundColor: color.relief,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
  },
  favoriteActive: {
    backgroundColor: "green", // Changez la couleur si vous le souhaitez
  },
  favoriteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Nokia",
  },
  saveButton: {
    backgroundColor: color.relief,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Nokia",
  },
});

export default AddEditContact;
