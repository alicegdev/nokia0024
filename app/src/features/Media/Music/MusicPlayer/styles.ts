import { StyleSheet } from "react-native";
import { color, radius, spacing } from "src/styles";

export default StyleSheet.create({
  list: {
    padding: spacing.sm,
    backgroundColor: color.relief,
    borderRadius: radius.sm,
    margin: 2,
    color: color.white,
  },
  textList: {
    color: color.white,
    fontFamily: 'Nokia',
    fontSize: 10
  }
});
