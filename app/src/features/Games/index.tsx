import React from "react";
import { useNavigation } from '@react-navigation/native';
import { Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { Screen } from "src/components";
import styles from "./styles";
import { color, spacing } from "src/styles";
import useFonts from "src/hooks/useFonts";
import { navGames } from "src/constants/games";


const Games = () => {
    const navigation: any = useNavigation();
    const fontsLoaded = useFonts();

    if (!fontsLoaded) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <Screen style={{ flex: 1, backgroundColor: color.menu, paddingTop: spacing.xlg }}>
            <Text style={styles.title}>Games</Text>
            <View style={{ flex: 1, marginBottom: "15%" }}>
                {navGames.map(navGame => (
                    <View key={navGame.id}>
                        <TouchableOpacity
                            style={styles.list}
                            onPress={() => navigation.navigate(navGame.navigateTo)}
                        >
                            <Text style={styles.textStyle}>{navGame.label}</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </Screen>
    );
}

export default Games;