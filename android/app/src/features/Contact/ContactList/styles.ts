import { StyleSheet } from "react-native";
import { color } from "src/styles";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.menu,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: color.menu,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Nokia",
    color: color.relief,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: color.relief,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  contactInfoContainer: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontFamily: "Nokia",
    color: color.relief,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 15,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: color.relief,
    paddingVertical: 5,
    paddingHorizontal: 10,
    color: color.menu,
  },
  buttonContainer: {
    padding: 20,
    alignItems: "center",
  },
  button: {
    backgroundColor: color.relief,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Nokia",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: color.relief,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontFamily: "Nokia",
    color: color.menu,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: "Nokia",
    color: color.menu,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: color.menu,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  closeButtonText: {
    color: color.relief,
    fontSize: 16,
    fontFamily: "Nokia",
  },
});
