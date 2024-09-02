import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#43523d',
    },
    hand: {
      position: 'absolute',
      top: '40%',
      width: 50,
      height: 50,
    },
    leftHand: {
      left: '30%',
    },
    rightHand: {
      right: '30%',
    },
    logoContainer: {
      position: 'absolute',
      top: '50%',
    },
    logoText: {
      fontSize: 40,
      color: '#c7f0d8',
      fontWeight: 'bold',
    },
  });
