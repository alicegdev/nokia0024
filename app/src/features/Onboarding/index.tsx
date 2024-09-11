import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Onboarding = () => {
  const navigation: any = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur Nokia 0024</Text>
      {/* <Text style={styles.subtitle}></Text> */}
      <Button
        title="S'inscrire"
        onPress={() => navigation.navigate('Signup')} // Naviguer vers l'écran d'inscription
      />
      {/* bouton pour accéder à la homepage */}
        <Button
            title="Continuer sans compte"
            onPress={() => navigation.navigate('HomePage')} // Naviguer vers l'écran d'accueil
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
});

export default Onboarding;
