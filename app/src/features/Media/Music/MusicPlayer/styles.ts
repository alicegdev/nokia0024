import { StyleSheet } from "react-native";
import { color, radius, spacing } from "src/styles";

export default StyleSheet.create({
  search: {
    padding: spacing.sm,
    backgroundColor: color.relief,
    borderRadius: radius.sm,
    margin: 2,
    color: color.white,
  },
  searchCore: {
    backgroundColor: color.footer,
    margin: 2,
    borderRadius: radius.md,
    color: color.relief,
    fontFamily: 'Nokia',
    fontSize: 10,
    padding: 4,
  },
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
