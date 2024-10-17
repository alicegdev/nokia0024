import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./styles";

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
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddEditContact;
