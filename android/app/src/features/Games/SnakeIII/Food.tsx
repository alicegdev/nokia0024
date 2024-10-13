import { StyleSheet, Text } from 'react-native';
import React from 'react';

function Food({ x, y, emoji }: { x: number; y: number; emoji: string }): JSX.Element {
  return <Text style={[{ top: y * 10, left: x * 10 }, styles.food]}>{emoji}</Text>;
}

const styles = StyleSheet.create({
  food: {
    width: 20,
    height: 20,
    borderRadius: 7,
    position: "absolute",
    fontSize: 15,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Food;
