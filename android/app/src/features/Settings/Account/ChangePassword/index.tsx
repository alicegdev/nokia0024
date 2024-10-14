import React, { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "src/contexts/AuthContext";
import { TouchableOpacity, View, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { spacing } from "src/styles";
import styles from "../styles";

const ChangePassword = () => {
  const { state } = useContext(AuthContext);
  const token = state.token;
  const userId = state.userId;
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    setMessage("");
    console.log(userId);
    console.log(token);
    try {
      const response = await axios.patch(
        `https://n0kia-0024.com/users/${userId}`,
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage("An error occurred: " + error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Change Password</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Old Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={oldPassword}
            onChangeText={(text) => setOldPassword(text)}
            placeholder="Enter your old password"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>New Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={newPassword}
            onChangeText={(text) => setNewPassword(text)}
            placeholder="Enter your new password"
          />
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveButtonText}>Change Password</Text>
        </TouchableOpacity>
        {message ? (
          <Text style={styles.switchButtonText}>{message}</Text>
        ) : null}
      </View>
    </View>
  );
};

export default ChangePassword;
