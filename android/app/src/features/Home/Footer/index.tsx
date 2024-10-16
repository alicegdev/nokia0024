import { useNavigation } from "@react-navigation/native";
import useFonts from "src/hooks/useFonts";
import { Image, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { Screen } from "src/components";
import styles from "./styles";
import { navFooters } from "src/constants";
import { internet } from "src/utils/Internet";
import { MessagesContext } from 'src/contexts/MessagesContext';
import React, { useContext } from 'react';

export const HomeFooter = () => {
    const navigation: any = useNavigation();
    const fontsLoaded = useFonts();
    const { unreadMessages, clearUnreadMessages } = useContext(MessagesContext);

    if (!fontsLoaded) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    const handlePress = (navigateTo: any) => {
        if (navigateTo === 'Internet') {
            internet('https://oldgoogle.neocities.org/1998/');
        } else {
            navigation.navigate(navigateTo);
        }
    };

    return (
        <Screen>
            <View style={styles.main}>
                {navFooters.map(navFooter => (
                    <View key={navFooter.id} style={styles.container}>
                        <TouchableOpacity
                            style={styles.box}
                            onPress={() => handlePress(navFooter.navigateTo)}
                        >
                            <Image source={navFooter.id}/>
                            {navFooter.navigateTo === 'ConversationsList' && Object.keys(unreadMessages).length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}></Text>
                </View>
              )}
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </Screen>
    );
};
