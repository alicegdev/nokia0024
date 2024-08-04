import React from "react";
import { useNavigation } from '@react-navigation/native';
import { Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { Screen } from "../../components";
import styles from "./styles";
import { color } from "../../styles";
import useFonts from "../../hooks/useFonts";
import { HomeFooter } from "./Footer";

const HomePage = () => {
    const navigation: any = useNavigation();
    const fontsLoaded = useFonts();

    if (!fontsLoaded) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <Screen style={{ backgroundColor: color.menu }}>
            <View style={styles.main}>
                <View style={styles.container}>
                    <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('Signin')}>
                        <Text style={styles.textStyle}>1</Text>
                    </TouchableOpacity>
                    <Text style={styles.labelStyle}>test signin</Text>
                </View>

                <View style={styles.container}>
                    <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('Game')}>
                        <Text style={styles.textStyle}>2</Text>
                    </TouchableOpacity>
                    <Text style={styles.labelStyle}>Games</Text>
                </View>

                <View style={styles.container}>
                    <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('Setting')}>
                        <Text style={styles.textStyle}>3</Text>
                    </TouchableOpacity>
                    <Text style={styles.labelStyle}>Settings</Text>
                </View>

                <View style={styles.container}>
                    <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('Placeholder')}>
                        <Text style={styles.textStyle}>4</Text>
                    </TouchableOpacity>
                    <Text style={styles.labelStyle}>Placeholder</Text>
                </View>

                <View style={styles.container}>
                    <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('Placeholder')}>
                        <Text style={styles.textStyle}>5</Text>
                    </TouchableOpacity>
                    <Text style={styles.labelStyle}>Placeholder</Text>
                </View>
            </View>
            <View style={styles.footer}>
              <HomeFooter></HomeFooter>
            </View>
        </Screen>
    );
}

export default HomePage;
