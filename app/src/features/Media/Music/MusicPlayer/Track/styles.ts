import { StyleSheet } from "react-native";
import { spacing, color, radius } from "src/styles";

export default StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color.menu,
        // padding: spacing.lg,
    },
    closeButton: {
        // alignSelf: 'flex-end',
        padding: spacing.md,
    },
    closeText: {
        color: 'white',
        fontSize: 16,
    },
    trackTitle: {
        color: color.white,
        fontFamily: 'Nokia',
        // fontSize: 24,
        // marginVertical: spacing.md,
    },
    track: {
        backgroundColor: color.relief,
        padding: "20%",
        fontFamily: 'Nokia',
        borderRadius: radius.xlg
    }
});