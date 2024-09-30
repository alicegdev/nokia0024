import { StyleSheet } from "react-native";
import { spacing, color, radius } from "src/styles";

export default StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color.menu,
    },
    closeButton: {
        padding: "10%",
        position: "absolute",
        right: 0,
        borderRadius: radius.xlg,
        borderColor: "gray",
        borderWidth: 1,

    },
    closeText: {
        color: 'white',
        fontSize: 16,
    },
    trackTitle: {
        color: color.white,
        fontFamily: 'Nokia',
        marginVertical: spacing.md,
    },
    trackTime: {
        color: color.white,
        fontFamily: 'Nokia',
        fontSize: 8,
    },
    track: {
        backgroundColor: color.relief,
        padding: "10%",
        borderRadius: radius.xlg,
        width: "80%",
    },
    playerControls: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginTop: spacing.md,
    }
});