import { color } from "src/styles";
import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
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
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputContainer: {
    marginBottom: 20,
    position: "relative",
  },
  labelContainer: {
    position: "absolute",
    top: -10,
    left: 15,
    backgroundColor: color.menu,
    paddingHorizontal: 5,
    zIndex: 1,
  },
  label: {
    fontFamily: "Nokia",
    color: color.relief,
    fontSize: 16,
  },
  input: {
    height: 50,
    borderColor: color.relief,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontFamily: "Nokia",
    color: color.relief,
  },
  inputTopBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 25,
    borderColor: color.relief,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  inputBottomBorder: {
    position: "absolute",
    top: 25,
    left: 0,
    right: 0,
    bottom: 0,
    borderColor: color.relief,
    borderWidth: 1,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderTopWidth: 0,
  },
  saveButton: {
    backgroundColor: color.relief,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Nokia",
  },
  switchButton: {
    alignItems: "center",
    marginTop: 10,
  },
  switchButtonText: {
    color: color.relief,
    fontSize: 16,
    fontFamily: "Nokia",
  },
});

export default styles;
