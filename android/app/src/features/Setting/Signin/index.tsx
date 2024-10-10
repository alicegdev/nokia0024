import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { initializeSocket } from '../../../socket';

function Signin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigation: any = useNavigation();

    const handleLogin = async () => {
        try {
            const response = await axios.post('https://n0kia-0024.com/users/login', {
                email,
                password,
            })

            const data = response.data;

            if (data.token) {
                await AsyncStorage.setItem('token', data.token);
                // Initialize the socket connection
                await initializeSocket();
                // Navigate to the home screen
                navigation.navigate('HomePage');
              }
            
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "An error occurred during login.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Login" onPress={handleLogin} />
            <Button title="Sign Up" onPress={() => navigation.navigate('Signup')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    label: {
        marginBottom: 8,
        fontSize: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
});

export default Signin;
