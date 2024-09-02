import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';

function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigation: any = useNavigation();

    const handleSignup = async () => {
        try {
            const response = await fetch('http://localhost:5050/users/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert("Success", "Your account has been created!");
                
                // Optionally, navigate to login or home screen after successful signup
                navigation.navigate('SignIn');
            } else {
                Alert.alert("Signup Failed", data.error || "Something went wrong.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "An error occurred during signup.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Username</Text>
            <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />
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
            <Button title="Signup" onPress={handleSignup} />
            {/* add button to signin */}
            <Button title="Sign In" onPress={() => navigation.navigate('Signin')} />
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

export default Signup;
