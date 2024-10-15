// Signup.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import { color } from 'src/styles';

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const navigation: any = useNavigation();

    const handleSignup = async () => {
        try {
            const response = await axios.post('https://n0kia-0024.com/users/', {
                username,
                email,
                password,
            });

      const data = await response.data;

      setModalVisible(true);

    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred during signup.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sign Up</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Username</Text>
          </View>
          <View style={styles.inputTopBorder} />
          <View style={styles.inputBottomBorder} />
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
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
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Password</Text>
          </View>
          <View style={styles.inputTopBorder} />
          <View style={styles.inputBottomBorder} />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSignup}>
          <Text style={styles.saveButtonText}>Signup</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => navigation.navigate('Signin')}
        >
          <Text style={styles.switchButtonText}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.label}>Account Created</Text>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => navigation.navigate('Signin')}
            >
              <Text style={styles.saveButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

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
    paddingHorizontal: 20,
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
    height: 25,
    borderColor: color.relief,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  inputBottomBorder: {
    position: "absolute",
    top: 25,
    left: 0,
    right: 0,
    bottom: 0,
    borderColor: color.relief,
    borderWidth: 1,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderTopWidth: 0,
  },
  saveButton: {
    backgroundColor: color.relief,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Nokia",
  },
  switchButton: {
    alignItems: "center",
    marginTop: 10,
  },
  switchButtonText: {
    color: color.relief,
    fontSize: 16,
    fontFamily: "Nokia",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: color.menu,
    borderRadius: 20,
    padding: 50,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "Nokia",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    margin: 10,
    elevation: 2,
    
  },
  buttonClose: {
    backgroundColor: color.relief,
  },
});

export default Signup;
