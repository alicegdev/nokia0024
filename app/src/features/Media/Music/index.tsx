import React from "react";
import { useNavigation } from '@react-navigation/native';
import { color, spacing } from "src/styles";
import { Screen } from "src/components";
import MusicPlayerFooter from "./MusicPlayer/Footer";
import styles from "./styles";
import { View, Text } from "react-native";
import MusicSearch from "./MusicSearch";
import MusicFavorite from "./MusicFavorite";
import MusicPlayer from "./MusicPlayer";
import MusicFooter from "./MusicFooter";
import { SafeAreaView } from 'react-native-safe-area-context';




const Music = () => {
    const navigation: any = useNavigation();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: color.menu, paddingTop: spacing.lg }}>
            <Text style={styles.library}>Library</Text>
            <View style={{ flex: 1, marginBottom: "30%" }}>
                <MusicPlayer></MusicPlayer>
            </View>
            <View style={styles.footer}>
                <MusicPlayerFooter></MusicPlayerFooter>
                <MusicFooter></MusicFooter>
            </View>
            </SafeAreaView>
    )
}

export default Music;