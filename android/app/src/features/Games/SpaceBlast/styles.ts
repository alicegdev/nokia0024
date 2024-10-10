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
  ship: {
    position: "absolute",
    width: 30,
    fontSize: 30,
    fontFamily: "Nokia",
  },
  enemy: {
    position: "absolute",
    fontSize: 30,
    fontFamily: "Nokia",
  },
  missile: {
    position: "absolute",
    color: color.relief,
    fontSize: 20,
    fontFamily: "Nokia",
  },
});
