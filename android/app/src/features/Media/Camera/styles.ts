import { StyleSheet } from "react-native";
import { radius, spacing } from "src/styles";

export default StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    message: {
      textAlign: 'center',
      paddingBottom: 10,
    },
    camera: {
      flex: 1,
    },
    buttonContainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: 'transparent',
      margin: 45,
    },
    button: {
      flex: 1,
      alignSelf: 'flex-end',
      alignItems: 'center',
    },
    text: {
        color: 'white',
        fontSize: 50,
        fontFamily: 'Nokia',
    },
    closeButton: {
        padding: spacing.sm,
        position: "absolute",
        right: 10,
        top: 25,
        borderRadius: radius.lg,
        borderColor: "gray",
        borderWidth: 1,
    },
    closeText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Nokia',
    },
    previewImage: {
      width: 50,
      height: 50,
      borderRadius: radius.sm,
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'black',
      zIndex: 1,
      opacity: 0,
    },
  });