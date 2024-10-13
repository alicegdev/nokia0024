import { StyleSheet } from "react-native";
import { color } from "src/styles";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.relief,
  },
  gameArea: {
    flex: 1,
    borderColor: color.relief,
    borderWidth: 12,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: color.menu,
  },
});
