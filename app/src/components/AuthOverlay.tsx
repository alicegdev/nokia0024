import React, { useContext, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, PanResponder, Dimensions, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { color } from 'src/styles';
import { AuthContext } from '../contexts/AuthContext';

const AuthOverlay = () => {
  const { isLoggedIn, isTokenExpired, isAuthChecked } = useContext(AuthContext);
  const animationValue = useRef(new Animated.Value(0)).current;
  const navigation: any = useNavigation();
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const iconWidth = 60; // Largeur minimale de l'icône (outputRange[0] de animatedWidth)
  const iconHeight = 50; // Hauteur de l'icône (height dans styles.iconContainer)

  const position = useRef(new Animated.ValueXY({ x: 20, y: screenHeight - 180 })).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Commencer le PanResponder si le déplacement est supérieur à un seuil
        return Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2;
      },
      onPanResponderGrant: () => {
        position.extractOffset();
      },
      onPanResponderMove: (evt, gestureState) => {
        let newX = gestureState.dx;
        let newY = gestureState.dy;

        // Calculer les nouvelles positions potentielles
        const potentialX = position.x._offset + newX;
        const potentialY = position.y._offset + newY;

        // Limiter la position X
        const minX = 0;
        const maxX = screenWidth - iconWidth;
        if (potentialX < minX) {
          newX = minX - position.x._offset;
        } else if (potentialX > maxX) {
          newX = maxX - position.x._offset;
        }

        // Limiter la position Y
        const minY = 0;
        const maxY = screenHeight - iconHeight;
        if (potentialY < minY) {
          newY = minY - position.y._offset;
        } else if (potentialY > maxY) {
          newY = maxY - position.y._offset;
        }

        // Mettre à jour la position
        position.x.setValue(newX);
        position.y.setValue(newY);
      },
      onPanResponderRelease: (evt, gestureState) => {
        position.flattenOffset();

        if (Math.abs(gestureState.dx) < 2 && Math.abs(gestureState.dy) < 2) {
          // Considérer comme un tap si le déplacement est minime
          handleIconPress();
        }
        // Optionnel : Vous pouvez également vérifier que la position finale est dans les limites
      },
      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  useEffect(() => {
    if (isAuthChecked && isTokenExpired) {
      // Démarrer l'animation lorsque le token est expiré
      startAnimation();
    }
  }, [isAuthChecked, isTokenExpired]);

  const startAnimation = () => {
    Animated.timing(animationValue, {
      toValue: 1,
      duration: 300, // Durée de l'animation en millisecondes
      useNativeDriver: false,
    }).start();
  };

  const handleIconPress = () => {
    if (isLoggedIn) {
      if (isTokenExpired) {
        // Rediriger vers la page de connexion
        navigation.navigate('Signin');
      } else {
        // Optionnel : ouvrir un menu utilisateur
      }
    } else {
      // Rediriger vers la page de connexion
      navigation.navigate('Signin');
    }
  };

  // Définir les dimensions pour l'animation
  const animatedWidth = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [60, 300],
  });

  if (!isAuthChecked || !isLoggedIn) {
    return null; // Ne rien afficher tant que l'authentification n'est pas vérifiée ou si l'utilisateur n'est pas connecté
  }

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[styles.overlay, position.getLayout()]}
    >
      <Animated.View style={[styles.iconContainer, { width: animatedWidth }]}>
        <MaterialIcons name="person" size={30} color={color.relief} />
        {isTokenExpired && (
          <>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>!</Text>
            </View>
            <Text style={styles.expiredMessage}>You have been logged out.</Text>
          </>
        )}
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    zIndex: 1000,
  },
  iconContainer: {
    backgroundColor: color.menu,
    height: 50,
    borderRadius: 5,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: color.relief,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: 'red',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  expiredMessage: {
    color: color.relief,
    marginLeft: 10,
    fontFamily: 'Nokia',
    fontSize: 16,
  },
});

export default AuthOverlay;
