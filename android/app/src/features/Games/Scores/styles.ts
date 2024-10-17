import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 4,
    width:"100%",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    fontFamily: 'Nokia'
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: 'Nokia'
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
    fontSize: 24,
    fontWeight: "600",
    color: "#007bff",
    fontFamily: 'Nokia'
  },
});

export default styles;