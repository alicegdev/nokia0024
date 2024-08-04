import { useNavigation } from "@react-navigation/native";
import useFonts from "../../../hooks/useFonts";
import { Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { Screen } from "../../../components";
import styles from "./styles";

export const HomeFooter = () => {
    const navigation: any = useNavigation();
    const fontsLoaded = useFonts();

    if (!fontsLoaded) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <Screen>
            <View style={styles.main}>
                <View style={styles.container}>
                    <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('Contacts')}>
                        <Text style={styles.textStyle}>A</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.container}>
                    <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('Internet')}>
                        <Text style={styles.textStyle}>B</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.container}>
                    <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('Text')}>
                        <Text style={styles.textStyle}>C</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.container}>
                    <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('Music')}>
                        <Text style={styles.textStyle}>D</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Screen>
    )

}