import React from "react";
import { color, spacing } from "src/styles";
import MusicPlayerFooter from "./MusicPlayer/Footer";
import styles from "./styles";
import { View, Text } from "react-native";
import MusicPlayer from "./MusicPlayer";
import { SafeAreaView } from 'react-native-safe-area-context';




const Music = () => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: color.menu, paddingTop: spacing.lg }}>
            <Text style={styles.library}>Library</Text>
            <View style={{ flex: 1, marginBottom: "15%" }}>
                <MusicPlayer></MusicPlayer>
            </View>
            <View style={styles.footer}>
                <MusicPlayerFooter></MusicPlayerFooter>
            </View>
            </SafeAreaView>
    )
}

export default Music;