import { StyleSheet } from "react-native";
import { color } from "src/styles";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.menu,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: color.relief,
    marginBottom: 40,
  },
  button: {
    backgroundColor: color.relief,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: color.menu,
    fontSize: 16,
  },
});
