import * as React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";
import HighScoresScreen from "./HighScoresScreen";
import { useNavigation } from "@react-navigation/native";

export interface GameModalProps {
  game: string;
  gameDesign: string;
  isGameOver: boolean;
  onEvent: () => void;
}

export default function GameModal({
  game,
  gameDesign,
  isGameOver,
  onEvent,
}: GameModalProps) {
  const navigation: any = useNavigation();

  return (
    <Modal isVisible={true} style={styles.modal}>
      {isGameOver ? (
        <HighScoresScreen game={game} />
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>{game}</Text>
          <Text style={styles.gameDesign}>{gameDesign}</Text>
        </View>
      )}
      <Button title={isGameOver ? "RESTART" : "START"} onPress={onEvent} />
      {isGameOver ? (
        <Button title={"QUIT"} onPress={() => navigation.navigate("HomePage")} />
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
    backgroundColor: "#000",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
  },
  title: {
    fontSize: 24,
    color: "#0f0",
    marginBottom: 10,
  },
  gameDesign: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 20,
  },
});
