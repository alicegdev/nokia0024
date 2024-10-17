import * as React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/native";
import { color } from "src/styles";

export interface GameModalProps {
  game: number;
  gameName: string;
  score: number;
  isGameOver: boolean;
  onEvent: () => void;
  reloadGame: () => void;
}

export default function GameModal({
  game,
  gameName,
  score,
  isGameOver,
  onEvent,
  reloadGame,
}: GameModalProps) {
  const navigation: any = useNavigation();
  const handlePress = () => {
    onEvent();
    if (isGameOver) {
      reloadGame();
    }
  };

  return (
    <Modal isVisible={true} style={styles.modal}>
      {isGameOver ? (
        <View style={styles.container}>
          <Text style={styles.title}>{gameName}</Text>
          <Text style={styles.scoreText}>{"YOUR SCORE : " + score.toString()}</Text>
        </View>
      ) : <View style={styles.container}>
          <Text style={styles.title}>{gameName}</Text>
        </View> }
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>
          {isGameOver ? "RESTART" : "START"}
        </Text>
      </TouchableOpacity>
      {isGameOver ? (
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Games")}
        >
          <Text style={styles.buttonText}>QUIT</Text>
        </TouchableOpacity>
      ) : null}
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: color.menu,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
  },
  title: {
    fontSize: 24,
    color: color.relief,
    marginBottom: 10,
    fontFamily: "Nokia",
  },
  scoreText: {
    fontSize: 18,
    color: color.relief,
    marginTop: 10,
    fontFamily: "Nokia",
  },
  button: {
    backgroundColor: color.relief,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "#ffffff",
    textAlign: "center",
    fontFamily: "Nokia",
  },
});
