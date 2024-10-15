import React, { useContext, useEffect, useRef, useCallback } from 'react';
import { Animated, StyleSheet, Text, PanResponder, Dimensions, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { color } from 'src/styles';
import { AuthContext } from '../contexts/AuthContext'; // Adapté à ton nouveau contexte

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const AuthOverlay = () => {
  const { state, logout } = useContext(AuthContext); // Utilisation de state et logout à partir du contexte
  const { isLoggedIn, isTokenExpired, isAuthChecked } = state; // Récupération des valeurs d'état à partir de state
  console.log("State " + state);
  const animationValue = useRef(new Animated.Value(isTokenExpired ? 1 : 0)).current;
  const navigation: any = useNavigation();
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const iconWidth = 60;
  const iconHeight = 50;

  const position = useRef(new Animated.ValueXY({ x: 20, y: screenHeight - 180 })).current;
  const currentPosition = useRef({ x: 20, y: screenHeight - 180 });

  // Ajouter un listener pour suivre la position actuelle
  useEffect(() => {
    const listenerId = position.addListener(({ x, y }) => {
      currentPosition.current = { x, y };
    });

    return () => {
      position.removeListener(listenerId);
    };
  }, [position]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2;
      },
      onPanResponderGrant: () => {
        position.extractOffset();
      },
      onPanResponderMove: (_, gestureState) => {
        let newX = gestureState.dx;
        let newY = gestureState.dy;

        let potentialX = currentPosition.current.x + gestureState.dx;
        let potentialY = currentPosition.current.y + gestureState.dy;

        const minX = 0;
        const maxX = screenWidth - iconWidth;
        potentialX = clamp(potentialX, minX, maxX);
        newX = potentialX - currentPosition.current.x;

        const minY = 0;
        const maxY = screenHeight - iconHeight;
        potentialY = clamp(potentialY, minY, maxY);
        newY = potentialY - currentPosition.current.y;

        position.x.setValue(newX);
        position.y.setValue(newY);
      },
      onPanResponderRelease: (_, gestureState) => {
        position.flattenOffset();

        if (Math.abs(gestureState.dx) < 2 && Math.abs(gestureState.dy) < 2) {
          handleIconPress();
        }

        const { x, y } = currentPosition.current;
        const minX = 0;
        const maxX = screenWidth - iconWidth;
        const minY = 0;
        const maxY = screenHeight - iconHeight;

        const clampedX = clamp(x, minX, maxX);
        const clampedY = clamp(y, minY, maxY);

        Animated.spring(position, {
          toValue: { x: clampedX - position.x._offset, y: clampedY - position.y._offset },
          useNativeDriver: false,
        }).start();
      },
      onPanResponderTerminationRequest: () => false,
    })
  ).current;

useEffect(() => {
  console.log('AuthOverlay - isAuthChecked:', isAuthChecked);
  console.log('AuthOverlay - isLoggedIn:', isLoggedIn);
  console.log('AuthOverlay - isTokenExpired:', isTokenExpired);

  if (isAuthChecked && isTokenExpired) {
    startAnimation();
  } else {
    resetAnimation();
  }
}, [isAuthChecked, isTokenExpired, isLoggedIn]);

  const startAnimation = () => {
    console.log('AuthOverlay - starting animation');
    Animated.timing(animationValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const resetAnimation = () => {
    console.log('AuthOverlay - resetting animation');
    Animated.timing(animationValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleIconPress = useCallback(async () => {
    console.log('AuthOverlay - handleIconPress');
    console.log('isTokenExpired:', isTokenExpired);
    console.log('isLoggedIn:', isLoggedIn);
    if (isTokenExpired) {
      console.log('AuthOverlay - Token is expired or user not logged in, navigating to Signin');
      await logout();
      navigation.navigate('Signin');
    } else if (isLoggedIn) {
      console.log('AuthOverlay - User is logged in and token is valid');
      // Vous pouvez ouvrir un menu utilisateur ici si vous le souhaitez
    } else {
      console.log('AuthOverlay - User is not logged in');
      navigation.navigate('Signin');
    }
  }, [isLoggedIn, isTokenExpired, logout, navigation]);

  // Définir les dimensions pour l'animation
  const animatedWidth = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [60, 300],
  });

  const animatedPaddingHorizontal = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 15],
  });

  if (!isAuthChecked || !isTokenExpired) {
    console.log('AuthOverlay - not showing overlay');
    return null;
  }

  console.log('AuthOverlay - rendering');

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[styles.overlay, position.getLayout()]}
    >
      <Animated.View
        style={[
          styles.iconContainer,
          {
            width: animatedWidth,
            paddingHorizontal: animatedPaddingHorizontal,
            justifyContent: isTokenExpired ? 'flex-start' : 'center',
          },
        ]}
      >
        <View style={styles.iconWrapper}>
          <MaterialIcons name="person" size={30} color={color.relief} />
          {isTokenExpired && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>!</Text>
            </View>
          )}
        </View>
        {isTokenExpired && (
          <Text style={styles.expiredMessage}>You have been logged out.</Text>
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
    borderWidth: 2,
    borderColor: color.relief,
  },
  iconWrapper: {
    position: 'relative',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
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
    flexShrink: 1,
  },
});

export default AuthOverlay;
