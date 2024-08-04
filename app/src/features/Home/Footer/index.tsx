import { useNavigation } from "@react-navigation/native";
import useFonts from "../../../hooks/useFonts";
import { Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { Screen } from "../../../components";
import styles from "./styles";
import { navFooters } from "../../../constants";

export const HomeFooter = () => {
    const navigation: any = useNavigation();
    const fontsLoaded = useFonts();

    if (!fontsLoaded) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <Screen>
            <View style={styles.main}>
                {navFooters.map(navFooter => (
                    <View key={navFooter.id} style={styles.container}>
                        <TouchableOpacity
                            style={styles.box}
                            onPress={() => navigation.navigate(navFooter.navigateTo)}
                        >
                            <Text style={styles.textStyle}>{navFooter.id}</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </Screen>
    )

}