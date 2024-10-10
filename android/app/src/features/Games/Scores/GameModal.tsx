import * as React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Modal from "react-native-modal";
import HighScoresScreen from "./HighScoresScreen";
import { useNavigation } from "@react-navigation/native";
import { color } from "src/styles";

export interface GameModalProps {
  game: number;
  gameName: string;
  score: number;
  isGameOver: boolean;
  onEvent: () => void;
}

export default function GameModal({
  game,
  gameName,
  score,
  isGameOver,
  onEvent,
}: GameModalProps) {
  const navigation: any = useNavigation();

  return (
    <Modal isVisible={true} style={styles.modal}>
      {isGameOver ? (
        <HighScoresScreen game={game} gameName={gameName} score={score} />
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>{gameName}</Text>
          {/* <Text style={styles.gameDesign}>{gameDesign}</Text> */}
        </View>
      )}
      <TouchableOpacity style={styles.button} onPress={onEvent}>
        <Text style={styles.buttonText}>{isGameOver ? "RESTART" : "START"}</Text>
      </TouchableOpacity>
      {isGameOver ? (
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("HomePage")}>
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
    fontFamily: 'Nokia',
  },
  // gameDesign: {
  //   fontSize: 18,
  //   color: "#fff",
  //   marginBottom: 20,
  // },
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
    fontFamily: 'Nokia',

  },
});
