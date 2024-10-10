import React from "react";
import { useNavigation } from '@react-navigation/native';
import { Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { Screen } from "src/components";
import styles from "./styles";
import { color } from "src/styles";
import useFonts from "src/hooks/useFonts";
import { HomeFooter } from "./Footer";
import { navHomes } from "src/constants";

const HomePage = () => {
    const navigation: any = useNavigation();
    const fontsLoaded = useFonts();

    if (!fontsLoaded) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <Screen style={{ backgroundColor: color.menu }}>
            <View style={styles.main}>
                {navHomes.map(navHome => (
                    <View key={navHome.id} style={styles.container}>
                        <TouchableOpacity
                            style={styles.box}
                            onPress={() => navigation.navigate(navHome.navigateTo)}
                        >
                            <Text style={styles.textStyle}>{navHome.id}</Text>
                        </TouchableOpacity>
                        <Text style={styles.labelStyle}>{navHome.label}</Text>
                    </View>
                ))}
            </View>
            
            <View style={styles.footer}>
              <HomeFooter></HomeFooter>
            </View>
        </Screen>
    );
}

export default HomePage;
