import React from "react";
import { useNavigation } from '@react-navigation/native';
import { color } from "src/styles";
import { Screen } from "src/components";
import styles from "./styles";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { navMusics } from "src/constants";


const MusicFooter = () => {
    const navigation: any = useNavigation();

    return (
        <Screen style={{ backgroundColor: color.menu }}>
            <View style={styles.main}>
                {navMusics.map(navMusic => (
                    <View key={navMusic.id} style={styles.container}>
                        <TouchableOpacity
                            style={styles.box}
                            onPress={() => navigation.navigate(navMusic.navigateTo)}
                        >
                        <Image source={navMusic.id}/>
                        </TouchableOpacity>
                        <Text style={styles.labelStyle}>{navMusic.label}</Text>
                    </View>
                ))}
            </View>
        </Screen>
    )
}

export default MusicFooter;
