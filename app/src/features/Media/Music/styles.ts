import { StyleSheet } from "react-native";
import { color, spacing } from "src/styles";

export default StyleSheet.create({
  library: {
    color: color.relief,
    fontFamily: 'Nokia',
    fontSize: spacing.lg,
    padding: spacing.sm
  },
  footer: {
    position: "absolute",
    bottom: 0,
  }
});
