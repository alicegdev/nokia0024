import { StyleSheet } from "react-native";
import { color, spacing } from "src/styles";
export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: spacing.lg,
    backgroundColor: color.menu,
  },
  title: {
    alignSelf: "flex-start",
    color: color.relief,
    fontFamily: "Nokia",
    fontSize: spacing.lg,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  image: {
    width: 120,
    height: 120,
    margin: 5,
    borderWidth: 1,
    borderColor: "gray",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    backgroundColor: color.relief,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "Nokia",
    color: color.relief,
    opacity: 0.7,
  },
});
