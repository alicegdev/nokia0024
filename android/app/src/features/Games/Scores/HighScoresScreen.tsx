import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, Alert } from "react-native";
import { AuthContext } from "src/contexts/AuthContext";
import styles from "./styles";

interface HighScoresProps {
  game: number;
  gameName: string;
  score: number;
}

const HighScoresScreen = ({ game, gameName, score }: HighScoresProps) => {
  const [scores, setScores] = useState([]);
  const { state } = useContext(AuthContext);
  const token = state.token;

  const sendScore = async () => {
    if (!token) {
      Alert.alert(
        "Warning",
        "Not logged in, your current score won't be sent.",
      );
      return;
    }
    try {
      const payload = { score, gameId: game, userId: state.userId };
      console.log("Sending payload:", payload);

      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_URL}/scores/add`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        },
      );
      console.log("Score sent successfully:", response.data);
    } catch (error) {
      console.error("Error sending score", error);
      Alert.alert(
        "Error",
        "Failed to send score: " + (error || "Unknown error"),
      );
    }
  };

  const fetchScores = async () => {
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_URL}/scores/${game}`,
      );
      setScores(response.data);
      console.log("Scores fetched successfully:", response.data);
    } catch (error) {
      console.error("Error fetching scores", error);
    }
  };

  useEffect(() => {
    sendScore();
    fetchScores();
  }, [token]);

  const renderItem = ({ item }: { item: { name: string; score: number } }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.score}>{item.score}</Text>
    </View>
  );

  return (
    <View>
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

export default HighScoresScreen;
