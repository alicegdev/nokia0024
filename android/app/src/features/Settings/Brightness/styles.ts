import { StyleSheet } from "react-native";
import { color, radius, spacing } from "src/styles";
export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: color.menu,
  },
  sliderContainer: {
    backgroundColor: color.relief,
    borderRadius: radius.lg,
    margin: spacing.md
  },
  slider: {
    width: 300,
    height: 40,
  },
  text: {
    fontFamily: "Nokia",
  },
});
