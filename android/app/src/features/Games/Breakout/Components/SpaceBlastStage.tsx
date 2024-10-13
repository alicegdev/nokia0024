import * as React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/native";
import { color } from "src/styles";

export interface StageModalProps {
  onEvent: () => void;
  secondStage: () => void;
  thirdStage: () => void;
  activeStage: "" | "second" | "third" | "win";
}

const SpaceBlastStage = ({
  onEvent,
  secondStage,
  thirdStage,
  activeStage,
}: StageModalProps) => {
  const navigation: any = useNavigation();
  const handlePress = () => {
    if (activeStage === "win") {
      navigation.navigate('Games');
    } else {
      onEvent();
      if (activeStage === "second") {
        secondStage();
      } else if (activeStage === "third") {
        thirdStage();
      }
    }
  };

  let title = "";
  let buttonText = "START";
  if (activeStage === 'second') {
    title = 'Stage 2';
  } else if (activeStage === 'third') {
    title = 'Stage 3';
  } else if (activeStage === 'win') {
    title = 'You won!';
    buttonText = 'QUIT';
  }

  return (
    <Modal isVisible={true} style={styles.modal}>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </Modal>
  );
};

export default SpaceBlastStage;

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
