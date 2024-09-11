import React from "react";
import { useNavigation } from '@react-navigation/native';
import { color } from "src/styles";
import { Screen } from "src/components";
import MusicPlayerFooter from "./MusicPlayer/Footer";
import styles from "./styles";
import { View } from "react-native";
import MusicSearch from "./MusicSearch";
import MusicFavorite from "./MusicFavorite";
import MusicPlayer from "./MusicPlayer";




const Music = () => {
    const navigation: any = useNavigation();

    return (
        <Screen style={{ backgroundColor: color.menu }}>
            <MusicPlayer></MusicPlayer>
            <View style={styles.footer}>
                <MusicPlayerFooter></MusicPlayerFooter>
            </View>
        </Screen>
    )
}

export default Music;