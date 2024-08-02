import React from "react";
import { useNavigation } from '@react-navigation/native';
import { Text, TouchableOpacity } from "react-native";

function HomePage(props) {
    const navigation = useNavigation();
    return (
        <TouchableOpacity
            onPress={() => navigation.navigate('Signin')}
            >
            <Text>S'identifier</Text>
        </TouchableOpacity>
    );
}


export default HomePage;