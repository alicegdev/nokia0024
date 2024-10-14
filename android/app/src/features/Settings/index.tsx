import React, { useContext } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { color, spacing } from "src/styles";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles";
import { AuthContext } from "src/contexts/AuthContext";

type SettingsRoutes = {
  Account: undefined;
  Brightness: undefined;
    Sound: undefined;
    Background: undefined;
    Signin: undefined;
    Logout: undefined; 
}

const allSettings = [
  { key: "Account", name: "Account", isPrivate: true},
  { key: "Brightness", name: "Brightness", isPrivate: false },
  { key: "Sound", name: "Sound", isPrivate: false },
  { key: "Background", name: "Background", isPrivate: true},
  { key: "Signin", name: "Signin", isPrivate: false},
  { key: "Logout", name: "Logout", isPrivate: true },
];


const Settings = () => {
    const navigation = useNavigation<StackNavigationProp<SettingsRoutes>>();
    const { state, logout } = useContext(AuthContext);
    const isLoggedIn = state.isLoggedIn;
    const filteredSettings = isLoggedIn ? allSettings : allSettings.filter((setting) => !setting.isPrivate);
    const handleNavigation = async (key: keyof SettingsRoutes) => {
        if (key !== "Logout") {
              navigation.navigate(key);
        } else {
            await logout();
      }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: color.menu, paddingTop: spacing.lg }}
    >
      <Text style={styles.settings}>Settings</Text>
      <View style={{ flex: 1, marginBottom: "15%" }}>
        <ScrollView>
          {filteredSettings.map((setting) => (
            <TouchableOpacity
              key={setting.key}
              onPress={() =>
                handleNavigation(setting.key as keyof SettingsRoutes)
              }
            >
              <View style={styles.list}>
            <Text style={styles.textList}>{setting.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
