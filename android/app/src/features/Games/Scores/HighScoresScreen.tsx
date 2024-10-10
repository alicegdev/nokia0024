import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";

interface HighScoresProps {
  game: number;
  gameName: string;
  score: number;
}

const HighScoresScreen = ({ game, gameName, score }: HighScoresProps) => {
  const [scores, setScores] = useState([]);
  const [userId, setUserId] = useState<number | null>(null);

  const sendScore = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      const decoded: { id: number } = jwtDecode(token);
      const currentUserId = decoded.id;
      setUserId(currentUserId);
      console.log(currentUserId);
      try {
        const response = await axios.post("https://n0kia-0024.com/scores/add", {
          params: { score, game, userId },
        });
    console.log(response);
      } catch (error) {
        console.error("Error sending score" + error);
      }
    } else {
      Alert.alert(
        "Warning",
        "Not logged in, your current score won't be sent.",
      );
    }
  };

  const fetchScores = async () => {
    try {
      const response = await axios.get("https://n0kia-0024.com/scores", {
        params: { game },
      });
      setScores(response.data);
      console.log(response);
    } catch (error) {
      console.error("Error fetching scores" + error);
    }
  };

  useEffect(() => {
    sendScore();
    fetchScores();
  }, []);

  const renderItem = ({ item }: { item: { name: string; score: number } }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.score}>{item.score}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{gameName}</Text>
      <Text style={styles.title}>High Scores</Text>
      <FlatList
        data={scores}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
      />
    </View>
  );
};

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

export default HighScoresScreen;
