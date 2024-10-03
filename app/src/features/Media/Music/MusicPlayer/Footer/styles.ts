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
    justifyContent: 'space-around',
    padding: spacing.md,
    backgroundColor: color.relief,
    borderBottomWidth: 1,
    borderColor: 'white'
  },
    textList: {
      color: color.white,
      fontFamily: 'Nokia',
      fontSize: 10,
      lineHeight: 24
    }
});
