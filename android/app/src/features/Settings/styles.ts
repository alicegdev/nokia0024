import { StyleSheet } from "react-native";
import { color, radius, spacing } from "src/styles";

export default StyleSheet.create({
  settings: {
    color: color.relief,
    fontFamily: "Nokia",
    fontSize: spacing.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  list: {
    padding: spacing.md,
    backgroundColor: color.relief,
    borderRadius: radius.sm,
    margin: 2,
    color: color.white,
  },
  textList: {
    color: color.white,
    fontFamily: "Nokia",
    fontSize: 10,
  },
   warningText: {
    color: "red",
    fontSize: 16,
    marginTop: spacing.md,
  },
  successMessage: {
    color: "green",
    fontSize: 16,
    marginTop: spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 16,
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: spacing.sm,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    paddingVertical: spacing.md,
    borderRadius: 5,
    alignItems: 'center',
  },
  message: {
    marginTop: spacing.md,
    fontSize: 16,
    color: 'green',
  }
});
