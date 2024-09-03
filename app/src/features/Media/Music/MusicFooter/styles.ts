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
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: color.relief,
    padding: spacing.sm
  },
  container: {
    alignItems: 'center',
    flex: 1
  },
  box: {
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelStyle: {
    marginTop: 4,
    color: color.white,
    fontSize: 8,
    fontFamily: 'Nokia',
    textAlign: 'center'
  },
});
