import { StyleSheet } from "react-native";
import { color, radius, spacing } from "src/styles";


export default StyleSheet.create({
  title: {
        color: color.relief,
        fontFamily: 'Nokia',
        fontSize: spacing.lg,
        padding: spacing.sm,
        marginBottom: spacing.sm,
      },
  list: {
    padding: spacing.sm,
    backgroundColor: color.relief,
    borderRadius: radius.sm,
    margin: spacing.md,
    color: color.white,
  },
  textStyle: {
    color: color.white,
    fontSize: 12,
    fontFamily: 'Nokia',
  },
});
