import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Signin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigation: any = useNavigation();

    useEffect(() => {
        try {
            const response = fetch('http://localhost:5050/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    });

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:5050/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Save the token in AsyncStorage
                await AsyncStorage.setItem('token', data.token);
                Alert.alert("Success", "You are now logged in!");

                // Navigate to another screen after successful login
                navigation.navigate('HomePage');
            } else {
                Alert.alert("Login Failed", data.error || "Something went wrong.");
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
