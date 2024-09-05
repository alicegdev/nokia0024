import React from "react";
import { useNavigation } from '@react-navigation/native';
import { Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { Screen } from "src/components";
import styles from "../Home/styles";
import { color } from "src/styles";
import useFonts from "src/hooks/useFonts";
import { HomeFooter } from "../Home/Footer";
import { navGames } from "src/constants/games";

const Games = () => {
    const navigation: any = useNavigation();
    const fontsLoaded = useFonts();

    if (!fontsLoaded) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <Screen style={{ backgroundColor: color.menu }}>
            <View style={styles.main}>
                {navGames.map(navGame => (
                    <View key={navGame.id} style={styles.container}>
                        <TouchableOpacity
                            style={styles.box}
                            onPress={() => navigation.navigate(navGame.navigateTo)}
                        >
                            <Text style={styles.textStyle}>{navGame.id}</Text>
                        </TouchableOpacity>
                        <Text style={styles.labelStyle}>{navGame.label}</Text>
                    </View>
                ))}
            </View>
            
            <View style={styles.footer}>
              <HomeFooter></HomeFooter>
            </View>
        </Screen>
    );
}

export default Games;