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
  const userId = state.userId;

  const sendScore = async () => {
    if (token) {
      try {
        const response = await axios.post(
          "https://n0kia-0024.com/scores/add",
          { score, gameId: game, userId },
          {
            headers: {
              Authorization: token,
            },
          },
        );
        console.log(response);
      } catch (error) {
        console.error("Error sending score" + error);
      }
      fetchScores(token);
    } else {
      Alert.alert(
        "Warning",
        "Not logged in, your current score won't be sent.",
      );
    }
  };

  const fetchScores = async (token: string) => {
    console.log("Game id: " + game);
    try {
      const response = await axios.get(`https://n0kia-0024.com/scores/${game}`, {
        headers: {
          Authorization: token,
        }
      });
      setScores(response.data);
      console.log(response);
    } catch (error) {
      console.error("Error fetching scores" + error);
    }
  };

  useEffect(() => {
    sendScore();
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

export default HighScoresScreen;
