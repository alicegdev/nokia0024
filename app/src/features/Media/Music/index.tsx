import React from "react";
import { useNavigation } from '@react-navigation/native';
import { color } from "src/styles";
import { Screen } from "src/components";
import MusicHome from "./MusicHome";
import MusicFooter from "./MusicFooter";
import styles from "./styles";
import { View } from "react-native";
import MusicSearch from "./MusicSearch";
import MusicFavorite from "./MusicFavorite";




const Music = () => {
    const navigation: any = useNavigation();

    return (
        <Screen style={{ backgroundColor: color.menu }}>
            <MusicHome></MusicHome>
            <View style={styles.footer}>
                <MusicFooter></MusicFooter>
            </View>
        </Screen>
    )
}

export default Music;