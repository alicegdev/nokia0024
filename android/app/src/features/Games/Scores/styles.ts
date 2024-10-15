import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
  },
  score: {
    fontSize: 18,
    fontWeight: "600",
    color: "#007bff",
  },
});

export default styles;