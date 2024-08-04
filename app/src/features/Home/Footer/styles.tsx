import { StyleSheet, Dimensions } from "react-native";
import { color, radius, spacing } from "../../../styles";

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
  textStyle: {
    color: color.white,
    fontSize: 12,
    fontFamily: 'Nokia',
  },
  labelStyle: {
    marginTop: 4,
    color: color.black,
    fontSize: 8,
    fontFamily: 'Nokia',
    textAlign: 'center'
  },
});
