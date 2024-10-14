import React, { useState } from "react";
import { SafeAreaView, View, Text, Button, Alert, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "src/contexts/AuthContext";
import { color, spacing } from "src/styles";
import styles from "../styles";

const DeleteAccount = () => {
  const { state, dispatch } = useContext(AuthContext);
  const token = state.token;
  const userId = state.userId;
  const navigation:any = useNavigation();
  const [successMessage, setSuccessMessage] = useState("");

  const deleteUser = async () => {
    if (token && userId) {
      try {
        const response = await axios.delete(
          `https://n0kia-0024.com/users/${userId}`,
          {
            headers: { 'Authorization': `Bearer ${token}` },
          }
        );

        if (response.status === 200) {
          setSuccessMessage("Your account has been deleted successfully.");
          dispatch({ type: "LOGOUT" }); // Logout after account deletion
          setTimeout(() => {
            navigation.navigate("HomePage"); // Redirect to home after deletion
          }, 2000);
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: deleteUser,
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Delete Account</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
        <Text style={styles.switchButtonText}>
          Warning: Deleting your account is permanent and cannot be undone.
          </Text>
          </View>

        <TouchableOpacity onPress={confirmDelete} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Delete Account</Text>
        </TouchableOpacity>

</View>

        {successMessage ? (
          <Text>{successMessage}</Text>
        ) : null}
      </View>
  );
};

export default DeleteAccount;
