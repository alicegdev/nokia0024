// App.js

import React, { useState, useEffect } from "react";
import { View } from 'react-native'; // Import de View pour englober les composants
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import routesConfig from "./src/config/routes.config";
import LoadingAnimation from "./src/components/LoadingAnimation";
import { AudioProvider } from "./src/contexts/AudioContext";
import { AuthProvider } from "./src/contexts/AuthContext"; // Import du AuthProvider
import AuthOverlay from "./src/components/AuthOverlay"; // Import du AuthOverlay

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem("hasLaunched");
        if (hasLaunched === null) {
          // Si l'application n'a jamais été lancée
          await AsyncStorage.setItem("hasLaunched", "true");
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
        }
      } catch (error) {
        console.error("Failed to load AsyncStorage", error);
      }
    };

    checkFirstLaunch();
  }, []);

  if (isFirstLaunch === null) {
    // Optionnel : Afficher un écran de chargement pendant que AsyncStorage est vérifié
    return null;
  }

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 5000); // Simule un chargement de 5 secondes
  }, []);

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <AuthProvider>
    <NavigationContainer>

        <AudioProvider>
          <View style={{ flex: 1 }}>
            {isFirstLaunch ? (
              <Stack.Navigator
                initialRouteName="Onboarding"
                screenOptions={{ headerShown: false }}
              >
                {routesConfig.map(({ name, component }) => (
                  <Stack.Screen key={name} name={name} component={component} />
                ))}
              </Stack.Navigator>
            ) : (
              <Stack.Navigator
                initialRouteName="HomePage"
                screenOptions={{ headerShown: false }}
              >
                {routesConfig.map(({ name, component }) => (
                  <Stack.Screen key={name} name={name} component={component} />
                ))}
              </Stack.Navigator>
            )}
            <AuthOverlay />
          </View>
        </AudioProvider>

    </NavigationContainer>
    </AuthProvider>
  );
}
