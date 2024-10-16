import { StyleSheet, Dimensions } from "react-native";
import { color, radius, spacing } from "src/styles";

const screenWidth = Dimensions.get('window').width;
const boxMargin = 16;
const totalHorizontalMargin = spacing.md * 2;
const totalBoxSpacing = boxMargin * 8;
const boxWidth = (screenWidth - totalHorizontalMargin - totalBoxSpacing) / 4;

export default StyleSheet.create({
  main: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    justifyContent: 'space-between',
    backgroundColor: color.footer,
    borderRadius: radius.xlg,
  },
  container: {
    width: boxWidth,
    margin: boxMargin,
    alignItems: 'center',
  },
  box: {
    width: boxWidth,
    height: spacing.xlg,
    backgroundColor: color.relief,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.lg,
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: 'red',
    borderRadius: 6,
    width: 12,
    height: 12,
  },
  badgeText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
