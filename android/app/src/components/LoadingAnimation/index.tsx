import React, { useEffect, useRef } from 'react';
import { Animated, View, Text } from 'react-native';
import LeftHand from './LeftHand';
import RightHand from './RightHand';
import styles from './styles';

const LoadingAnimation = () => {
  const leftHandAnim = useRef(new Animated.Value(-50)).current;
  const rightHandAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(leftHandAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(rightHandAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [leftHandAnim, rightHandAnim, fadeAnim]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.hand, styles.leftHand, { transform: [{ translateX: leftHandAnim }] }]}>
        <LeftHand />
      </Animated.View>
      <Animated.View style={[styles.hand, styles.rightHand, { transform: [{ translateX: rightHandAnim }] }]}>
        <RightHand />
      </Animated.View>
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
        <Text style={styles.logoText}>NOKIA 0024</Text>
      </Animated.View>
    </View>
  );
};

export default LoadingAnimation;
