import React, { useState, useContext } from "react"; 
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { initializeSocket } from '../../../socket';
import { AuthContext, AuthContextType } from '../../../contexts/AuthContext';
import styles from "./styles";

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const navigation: any = useNavigation();
  const context = useContext<AuthContextType>(AuthContext);

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_URL}/users/login`, {
        email,
        password,
      });

      const data = response.data;

      if (data.token) {
        await AsyncStorage.setItem('token', data.token);
        await initializeSocket();
        await context.login(data.token);
        navigation.navigate('HomePage');
      }
    } catch (error) {
      console.error('Signin - handleLogin - error:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 'An error occurred during login.';
        setError(errorMessage);
      } else {
        setError('An error occurred during login.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sign In</Text>
      </View>
      <View style={styles.formContainer}>
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
        {error ? <Text style={styles.switchButtonText}>{error}</Text> : null}
        <TouchableOpacity style={styles.saveButton} onPress={handleLogin}>
          <Text style={styles.saveButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={styles.switchButtonText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Signin;
